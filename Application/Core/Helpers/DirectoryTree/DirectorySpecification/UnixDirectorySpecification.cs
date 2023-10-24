using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree.Interface;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree.DirectorySpecification
{
    public partial class UnixDirectorySpecification : IDFSOperations, IRecursiveOperations
    {
        private const byte DT_DIR = 4;

        [GeneratedRegex("\\.(zip|tar|7z|rar|zipx)$")]
        private static partial Regex ArchiveExtensionRegex();

        [DllImport("libc", EntryPoint = "opendir", CharSet = CharSet.Auto)]
        private static extern nint Opendir(string name);

        [DllImport("libc", EntryPoint = "readdir", CharSet = CharSet.Auto)]
        private static extern nint Readdir(nint dirp);

        [DllImport("libc", EntryPoint = "closedir")]
        private static extern int Closedir(nint dirp);

        public IEnumerable<Entry> GetDirectoryContents(string path)
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
                else if (ArchiveExtensionRegex().IsMatch(entryName)) // Regular file
                {
                    yield return new FileEntry { Path = entryPath, Name = entryName };
                }
            }
            _ = Closedir(directory);
        }

        public async Task GetDirectoryStructureRecursivelyAsync(string path, string configPath, List<TreeNode> result)
        {
            nint dirPtr = Opendir(path);

            if (dirPtr == nint.Zero)
            {
                Console.WriteLine($"Error opening directory {path}");
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

                    var entryFullPath = Path.Combine(path, entryName);

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
                        await GetDirectoryStructureRecursivelyAsync(entryFullPath, configPath, node.Children);
                    }
                    else if (ArchiveExtensionRegex().IsMatch(entryName))
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
                Console.WriteLine($"Error reading dir {path}: {e.Message}");
            }
            finally
            {
                _ = Closedir(dirPtr);
            }
        }
    }
}