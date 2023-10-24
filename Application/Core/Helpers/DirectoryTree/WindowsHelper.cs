using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree;
using Domain.ViewModels;

namespace Business.Helpers.DirectoryTree
{
    /// <summary>
    /// NOTE : This is a helper class just only for Windows System, doesn't work on Linux
    /// Using OS Apis
    /// </summary>
    public class WindowsHelper : DirectoryHelper, IDisposable
    {
        // private IntPtr hFindFile;
        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern nint FindFirstFile(string lpFileName, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool FindNextFile(nint hFindFile, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool FindClose(nint hFindFile);

        private bool disposed;

        ~WindowsHelper()
        {
            Dispose(false);
        }

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
                    // Dispose managed resources here, if any
                    // hFindFile = IntPtr.Zero;
                }

                // Release unmanaged resources (close opened directories, etc.)
                // Note: Ensure you call closedir here for any remaining open directories

                disposed = true;
            }
        }

        public override async Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootNode = new List<TreeNode>();
            var tasks = new List<Task>();
            var traversedPaths = new HashSet<string>();
            try
            {
                // tasks.Add(ProcessDirectoryAsync(path, configPath, rootNode));
                var watch = new Stopwatch();
                watch.Start();
                tasks.Add(GetDirectoryDFSAsync(path, configPath, rootNode, traversedPaths));
                await Task.WhenAll(tasks);
                watch.Stop();
                Console.BackgroundColor = ConsoleColor.DarkGreen;
                Console.WriteLine($"Time taken: {watch.ElapsedMilliseconds} ms");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }
            return rootNode.SelectMany(e => e.Children).ToList();
        }

        /// <summary>
        /// Note : This is using Recursively with OS Low-level api not using DFS or something else
        /// </summary>
        /// <param name="currentNode"></param>
        /// <param name="currentPath"></param>
        /// <returns></returns>
        private async Task GetRecursivelyAsync(string currentPath, string configPath, List<TreeNode> result)
        {
            var hFindFile = FindFirstFile(Path.Combine(currentPath, "*"), out WIN32_FIND_DATA findFileData);
            if (hFindFile == IntPtr.Zero)
            {
                Console.WriteLine($"Error finding files in directory {currentPath}");
                return;
            }

            try
            {
                do
                {
                    string entryName = findFileData.cFileName;

                    if (entryName is "." or ".." or "@eaDir")
                    {
                        continue;
                    }

                    string entryPath = Path.Combine(currentPath, entryName);

                    if ((findFileData.dwFileAttributes & FileAttributes.Directory) != 0)
                    {
                        var subNode = new TreeNode
                        {
                            Key = entryPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = true,
                            Children = new List<TreeNode>()
                        };
                        result.Add(subNode);
                        await GetRecursivelyAsync(entryPath, configPath, subNode.Children);
                    }
                    else if (findFileData.dwFileAttributes == FileAttributes.Archive && ArchiveRegex.IsMatch(entryName))
                    {
                        result.Add(new TreeNode
                        {
                            Key = entryPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = false,
                            IsLeaf = true
                        });
                    }
                } while (FindNextFile(hFindFile, out findFileData));
                result = result.OrderBy(e => e.Title).ToList();
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading dir {currentPath}: {e.Message}");
            }
            finally
            {
                _ = FindClose(hFindFile);
            }
        }

        private async Task GetDirectoryPurelyDFSAsyncMethod(string rootPath, string configPath, List<TreeNode> result)
        {
            var stack = new Stack<(string path, TreeNode parentNode)>();
            stack.Push((rootPath, null));

            var tasks = new List<Task>();

            while (stack.Count > 0)
            {
                var (currentPath, parentNode) = stack.Pop();

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
                        stack.Push((directoryEntry.Path, node));
                    }
                    else if (item is FileEntry fileEntry)
                    {
                        if (ArchiveRegex.IsMatch(fileEntry.Name))
                        {
                            node.Children.Add(new TreeNode
                            {
                                Key = fileEntry.Path[configPath.Length..],
                                Title = fileEntry.Name,
                                IsDirectory = false,
                                IsLeaf = true
                            });
                        }
                    }
                }

                if (parentNode != null)
                {
                    lock (parentNode.Children)
                    {
                        parentNode.Children.Add(node);
                    }
                }
                else
                {
                    lock (result)
                    {
                        result.Add(node);
                    }
                }
            }

            await Task.WhenAll(tasks);
        }

        /// <summary>
        /// Note : This is using Recursively, DFS, and OS Low-level api not a purely DFS
        /// </summary>
        private async Task GetDirectoryDFSAsync(string rootPath, string configPath, List<TreeNode> result, HashSet<string> traversedPaths)
        {
            var stack = new Stack<string>();
            stack.Push(rootPath);

            while (stack.Count > 0)
            {
                var currentPath = stack.Pop();

                if (traversedPaths.Contains(currentPath))
                {
                    continue;
                }

                traversedPaths.Add(currentPath);

                var directoryContents = GetDirectoryContents(currentPath);
                var tasks = new List<Task>();

                var currentNode = new TreeNode
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
                        tasks.Add(GetDirectoryDFSAsync(directoryEntry.Path, configPath, currentNode.Children, traversedPaths));
                    }
                    else if (item is FileEntry fileEntry)
                    {
                        if (ArchiveRegex.IsMatch(fileEntry.Name))
                        {
                            currentNode.Children.Add(new TreeNode
                            {
                                Key = fileEntry.Path[configPath.Length..],
                                Title = fileEntry.Name,
                                IsDirectory = false,
                                IsLeaf = true
                            });
                        }
                    }
                }

                await Task.WhenAll(tasks);
                result.Add(currentNode);
            }
        }

        private IEnumerable<Entry> GetDirectoryContents(string path)
        {
            var hFindFile = FindFirstFile(Path.Combine(path, "*"), out WIN32_FIND_DATA findData);

            if (hFindFile.ToInt64() == -1)
            {
                yield break; // No files found
            }

            do
            {
                if (findData.cFileName != "." && findData.cFileName != "..")
                {
                    var entryPath = Path.Combine(path, findData.cFileName);

                    if (findData.dwFileAttributes == FileAttributes.Directory) // Directory
                    {
                        yield return new DirectoryEntry { Path = entryPath, Name = findData.cFileName };
                    }
                    else if (ArchiveRegex.IsMatch(findData.cFileName)) // Regular file
                    {
                        yield return new FileEntry { Path = entryPath, Name = findData.cFileName };
                    }
                }
            } while (FindNextFile(hFindFile, out findData));

            FindClose(hFindFile);
        }
    }
}