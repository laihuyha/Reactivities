using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class WindowsHelper : DirectoryTreeBase, IDisposable
    {
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
            try
            {
                tasks.Add(GetRecursivelyAsync(path, configPath, rootNode));
                await Task.WhenAll(tasks);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }
            return rootNode;
        }

        private async Task GetRecursivelyAsync(string currentPath, string configPath, List<TreeNode> rootNode)
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
                        rootNode.Add(subNode);
                        await GetRecursivelyAsync(entryPath, configPath, subNode.Children);
                    }
                    else if (findFileData.dwFileAttributes == FileAttributes.Archive && ArchiveRegex.IsMatch(entryName))
                    {
                        rootNode.Add(new TreeNode
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