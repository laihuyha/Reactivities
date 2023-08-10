using System.Runtime.InteropServices;
using Business.DTOs;
using static Business.Data.DTOs.AdditionalInfo;

namespace Business.Helpers.DirectoryTree
{
    /// <summary>
    /// NOTE : This is a helper class just only for Windows System, doesn't work on Linux
    /// Using OS Apis
    /// </summary>
    public partial class WindowsDirectoryTreeTraversal : DirectoryHelper, IDisposable
    {
        // private IntPtr hFindFile;
        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern nint FindFirstFile(string lpFileName, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool FindNextFile(nint hFindFile, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool FindClose(nint hFindFile);

        private bool disposed;

        ~WindowsDirectoryTreeTraversal()
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

        public override async Task<List<JSTreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootNode = new List<JSTreeNode>();
            var tasks = new List<Task>();
            try
            {
                tasks.Add(ProcessDirectoryAsync(path, configPath, rootNode));
                await Task.WhenAll(tasks);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }
            return rootNode;
        }

        /// <summary>
        /// Note : This is using Recursively with OS Low-level api not using DFS or something else
        /// </summary>
        /// <param name="currentNode"></param>
        /// <param name="currentPath"></param>
        /// <returns></returns>
        private async Task ProcessDirectoryAsync(string currentPath, string configPath, List<JSTreeNode> result)
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
                        var subNode = new JSTreeNode
                        {
                            Key = entryPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = true,
                            Children = new List<JSTreeNode>()
                        };
                        result.Add(subNode);
                        await ProcessDirectoryAsync(entryPath, configPath, subNode.Children);
                    }
                    else if (findFileData.dwFileAttributes == FileAttributes.Archive && ArchiveRegex.IsMatch(entryName))
                    {
                        result.Add(new JSTreeNode
                        {
                            Key = entryPath[configPath.Length..],
                            Title = entryName,
                            IsDirectory = false
                        });
                    }
                } while (FindNextFile(hFindFile, out findFileData));
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
    }
}