using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Business.Data.DTOs;
using static Business.Data.DTOs.AdditionalInfo;

namespace Business.Helpers.DirectoryTree
{
    /// <summary>
    /// NOTE : This is a helper class just only for Windows System, doesn't work on Linux
    /// Using OS Apis
    /// </summary>
    public partial class WindowsDirectoryTreeTraversal : IDisposable
    {
        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern nint FindFirstFile(string lpFileName, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool FindNextFile(nint hFindFile, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool FindClose(nint hFindFile);

        private bool disposed = false;

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
                }

                // Release unmanaged resources (close opened directories, etc.)
                // Note: Ensure you call closedir here for any remaining open directories

                disposed = true;
            }
        }

        private static bool IsArchive(WIN32_FIND_DATA findFileData)
        {
            return (findFileData.dwFileAttributes & FileAttributes.Archive) != 0;
        }

        public async Task<DirectoryNode> GetDirectoryTreeAsync(string path)
        {
            var directoryNode = new DirectoryNode(path, true);
            var tasks = new List<Task>();

            try
            {
                tasks.Add(ProcessDirectoryAsync(directoryNode, path));
                await Task.WhenAll(tasks);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }

            return directoryNode;
        }

        /// <summary>
        /// Note : This is using Recursively with OS Low-level api not using DFS or something else
        /// </summary>
        /// <param name="currentNode"></param>
        /// <param name="currentPath"></param>
        /// <returns></returns>
        private async Task ProcessDirectoryAsync(DirectoryNode currentNode, string currentPath)
        {
            IntPtr hFindFile = FindFirstFile(Path.Combine(currentPath, "*"), out WIN32_FIND_DATA findFileData);
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

                    if (entryName == "." || entryName == ".." || entryName == "@eaDir")
                        continue;

                    string entryPath = Path.Combine(currentPath, entryName);

                    if ((findFileData.dwFileAttributes & FileAttributes.Directory) != 0)
                    {
                        var subNode = new DirectoryNode(entryPath, true);
                        currentNode.Subitems.Add(subNode);
                        await ProcessDirectoryAsync(subNode, entryPath);
                    }
                    else if (findFileData.dwFileAttributes == FileAttributes.Archive && ArchiveRegex().IsMatch(entryName[entryName.LastIndexOf(".")..]))
                    {
                        currentNode.Subitems.Add(new DirectoryNode(entryPath, false));
                    }
                } while (FindNextFile(hFindFile, out findFileData));
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error reading dir {currentPath}: {e.Message}");
            }
            finally
            {
                FindClose(hFindFile);
            }
        }

        [GeneratedRegex("\\.(zip|tar|7z|rar|zipx)$")]
        private static partial Regex ArchiveRegex();
    }
}