using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class UnixBaseHelper : DirectoryTreeBase, IDisposable
    {
        [DllImport("libc", EntryPoint = "opendir", CharSet = CharSet.Auto)]
        private static extern nint Opendir(string name);

        [DllImport("libc", EntryPoint = "readdir", CharSet = CharSet.Auto)]
        private static extern nint Readdir(nint dirp);

        [DllImport("libc", EntryPoint = "closedir")]
        private static extern int Closedir(nint dirp);

        private bool disposed;

        ~UnixBaseHelper() => Dispose(false);

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
                disposed = true;
            }
        }
        public override async Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var result = new List<TreeNode>();

            await GetRecursively(path, configPath, result);

            return result;
        }

        private async Task UseGetBFS(string path, string configPath, List<TreeNode> result)
        {
            var queue = new Queue<string>();
            queue.Enqueue(path);

            var tasks = new List<Task>();

            while (queue.Count > 0)
            {
                var currentPath = queue.Dequeue();

                tasks.Add(Task.Run(() =>
                {
                    var directoryContents = GetDirectoryContents(currentPath);

                    var node = new TreeNode
                    {
                        Key = currentPath[configPath.Length..],
                        Title = Path.GetFileName(currentPath),
                        IsDirectory = true,
                        Children = new List<TreeNode>()
                    };

                    foreach (var item in directoryContents)
                    {
                        if (item is DirectoryEntry directoryEntry)
                        {
                            queue.Enqueue(directoryEntry.Path);
                        }
                        else if (item is FileEntry fileEntry)
                        {
                            if (ArchiveRegex.IsMatch(fileEntry.Name))
                            {
                                node.Children.Add(new TreeNode
                                {
                                    Key = fileEntry.Path[configPath.Length..],
                                    Title = fileEntry.Name,
                                    IsDirectory = false
                                });
                            }
                        }
                    }

                    //Thread safe
                    lock (result)
                    {
                        result.Add(node);
                    }
                }));
            }

            await Task.WhenAll(tasks);
        }

        private async Task UseGetDFS(string path, string configPath, List<TreeNode> result)
        {
            var stack = new Stack<string>();
            stack.Push(path);

            var tasks = new List<Task>();

            while (stack.Count > 0)
            {
                var currentPath = stack.Pop();

                tasks.Add(Task.Run(() =>
                {
                    var directoryContents = GetDirectoryContents(currentPath);

                    var node = new TreeNode
                    {
                        Key = currentPath[configPath.Length..],
                        Title = Path.GetFileName(currentPath),
                        IsDirectory = true,
                        Children = new List<TreeNode>()
                    };

                    foreach (var item in directoryContents)
                    {
                        if (item is DirectoryEntry directoryEntry)
                        {
                            stack.Push(directoryEntry.Path);
                        }
                        else if (item is FileEntry fileEntry)
                        {
                            if (ArchiveRegex.IsMatch(fileEntry.Name))
                            {
                                node.Children.Add(new TreeNode
                                {
                                    Key = fileEntry.Path[configPath.Length..],
                                    Title = fileEntry.Name,
                                    IsDirectory = false
                                });
                            }
                        }
                    }

                    lock (result)
                    {
                        result.Add(node);
                    }
                }));
            }

            await Task.WhenAll(tasks);
        }

        private async Task GetRecursively(string currentPath, string configPath, List<TreeNode> result)
        {
            nint dirPtr = Opendir(currentPath);

            if (dirPtr == nint.Zero)
            {
                Console.WriteLine($"Error opening directory {currentPath}");
                return;
            }

            try
            {
                IntPtr entryPtr;
                while ((entryPtr = Readdir(dirPtr)) != IntPtr.Zero)
                {
                    var entry = Marshal.PtrToStructure<Dirent>(entryPtr);
                    var entryName = entry.d_name;

                    if (entryName is "." or "..")
                    {
                        continue; // Skip current and parent directories
                    }

                    var entryFullPath = Path.Combine(currentPath, entryName);

                    if (entry.d_type == DT_DIR) // Directory
                    {
                        var node = new TreeNode
                        {
                            Key = entryFullPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = true,
                            Children = new List<TreeNode>()
                        };

                        result.Add(node);
                        await GetRecursively(entryFullPath, configPath, node.Children);
                    }
                    else if (ArchiveRegex.IsMatch(entryName))
                    {
                        result.Add(new TreeNode
                        {
                            Key = entryFullPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = false
                        });
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading dir {currentPath}: {e.Message}");
            }
            finally
            {
                _ = Closedir(dirPtr);
            }
        }

        private IEnumerable<Entry> GetDirectoryContents(string path)
        {
            var directory = Opendir(path);
            if (directory == IntPtr.Zero)
            {
                throw new Exception("Failed to open directory.");
            }

            IntPtr entryPtr;
            while ((entryPtr = Readdir(directory)) != IntPtr.Zero)
            {
                var entry = Marshal.PtrToStructure<Dirent>(entryPtr);
                var entryName = entry.d_name;

                if (entryName is "." or "..")
                {
                    continue;
                }

                var entryPath = Path.Combine(path, entryName);

                if (entry.d_type == DT_DIR) // Directory
                {
                    yield return new DirectoryEntry { Path = entryPath };
                }
                else if (ArchiveRegex.IsMatch(entryName)) // Regular file
                {
                    yield return new FileEntry { Path = entryPath, Name = entryName };
                }
            }
            _ = Closedir(directory);
        }
    }
}