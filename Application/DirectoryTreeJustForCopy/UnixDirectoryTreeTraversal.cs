using System.Runtime.InteropServices;
using Business.Data.DTOs;
using Business.DTOs;
using static Business.Data.DTOs.AdditionalInfo;

namespace Business.Helpers.DirectoryTree
{
    /// <summary>
    /// Using OS Apis
    /// </summary>
    public partial class UnixDirectoryTreeTraversal : DirectoryHelper, IDisposable
    {
        // private nint dirPtr;

        [DllImport("libc", EntryPoint = "opendir", CharSet = CharSet.Auto)]
        private static extern nint Opendir(string name);

        [DllImport("libc", EntryPoint = "readdir", CharSet = CharSet.Auto)]
        private static extern nint Readdir(nint dirp);

        [DllImport("libc", EntryPoint = "closedir")]
        private static extern int Closedir(nint dirp);

        private bool disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Special method that gets automatically invoked by the garbage collector when an object is being reclaimed (garbage collected).
        /// <br/>
        /// The finalizer is your last chance to clean up any unmanaged resources held by your object before it is removed from memory
        /// </summary>
        ~UnixDirectoryTreeTraversal()
        {
            Dispose(false);
        }

        /// <summary>
        /// Be honestly, IDK what to do with this
        /// <br/>
        /// Causing we always using closedir which is called at finnally block of ProcessDirectoryAsync method so this Dispose just for the purpose of resource management of this class.
        /// </summary>
        /// <param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    // dirPtr = nint.Zero; // now i know what to do
                    // Dispose managed resources here, if any
                }

                // Release unmanaged resources (close opened directories, etc.)
                // Note: Ensure you call closedir here for any remaining open directories

                disposed = true;
            }
        }

        public override async Task<List<JSTreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var result = new List<JSTreeNode>();

            await ProcessDirectoryAsync(path, configPath, result);

            return result;
        }

        private async Task ProcessDirectoryAsync(string path, string configPath, List<JSTreeNode> result)
        {
            await RecursiveProcessDirectory(path, configPath, result);
        }

        private async Task RecursiveProcessDirectory(string currentPath, string configPath, List<JSTreeNode> result)
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

                    if (entryName is "." or ".." or "@eaDir")
                    {
                        continue; // Skip current and parent directories
                    }

                    var entryFullPath = Path.Combine(currentPath, entryName);

                    if (entry.d_type == DT_DIR) // Directory
                    {
                        var node = new JSTreeNode
                        {
                            Key = entryFullPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = true,
                            Children = new List<JSTreeNode>()
                        };

                        result.Add(node);
                        await ProcessDirectoryAsync(entryFullPath, configPath, node.Children);
                    }
                    else if (ArchiveRegex.IsMatch(entryName))
                    {
                        result.Add(new JSTreeNode
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

        #region BFS
        private async Task BFSProcessDirectory(string rootPath, string configPath, List<JSTreeNode> result)
        {
            var queue = new Queue<string>();
            queue.Enqueue(rootPath);

            var tasks = new List<Task>();

            while (queue.Count > 0)
            {
                var currentPath = queue.Dequeue();

                tasks.Add(Task.Run(() =>
                {
                    var directoryContents = GetDirectoryContents(currentPath);

                    var node = new JSTreeNode
                    {
                        Key = currentPath[configPath.Length..],
                        Title = Path.GetFileName(currentPath),
                        IsDirectory = true,
                        Children = new List<JSTreeNode>()
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
                                node.Children.Add(new JSTreeNode
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
        #endregion

        #region DFS
        private async Task DFSProcessDirectory(string rootPath, string configPath, List<JSTreeNode> result)
        {
            var stack = new Stack<string>();
            stack.Push(rootPath);

            var tasks = new List<Task>();

            while (stack.Count > 0)
            {
                var currentPath = stack.Pop();

                tasks.Add(Task.Run(() =>
                {
                    var directoryContents = GetDirectoryContents(currentPath);

                    var node = new JSTreeNode
                    {
                        Key = currentPath[configPath.Length..],
                        Title = Path.GetFileName(currentPath),
                        IsDirectory = true,
                        Children = new List<JSTreeNode>()
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
                                node.Children.Add(new JSTreeNode
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
        #endregion

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