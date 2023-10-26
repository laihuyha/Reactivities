using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree.Interface;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree.DirectorySpecification
{
    /// <summary>
    /// Has better about performance
    /// <para>
    /// Here are some of the key benefits of using the GeneratedRegexAttribute in C#: <br/>
    /// <br/>
    /// - Improved performance - The regex is compiled only once at compile time rather than on every execution. This avoids regex initialization costs.<br/>
    /// - Better compile-time validation - Any errors in the regex pattern will show up at compile time rather than runtime.<br/>
    /// - Readability - The regex pattern is specified right in the attribute which is clearer than manually initializing a static regex field.<br/>
    /// - Reusability - The generated regex can be used from multiple places in the code.<br/>
    /// - Caching - The compiled regex is cached and reused across instances which saves memory.<br/>
    /// - Easy application - Just decorate a static field with the attribute and provide the pattern.<br/>
    /// - Flexibility - Can be used with static, instance, or local fields.<br/>
    /// - Thread-safety - The generated regex does not need locks for thread-safety.<br/>
    /// </para>
    /// <see cref="ArchiveExtensionRegex">https://github.com/dotnet/runtime/issues/44676</see>
    /// </summary>
    public partial class WindowsDirectorySpecification : IDFSOperations, IRecursiveOperations
    {
        private const byte DT_DIR = 4;

        [GeneratedRegex("\\.(zip|tar|7z|rar|zipx)$", RegexOptions.IgnoreCase)]
        private static partial Regex ArchiveExtensionRegex();

        // private IntPtr hFindFile;
        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern nint FindFirstFile(string lpFileName, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool FindNextFile(nint hFindFile, out WIN32_FIND_DATA lpFindFileData);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool FindClose(nint hFindFile);

        public IEnumerable<Entry> GetDirectoryContents(string path)
        {
            var searchPattern = Path.Combine(path, "*");
            var hFindFile = FindFirstFile(searchPattern, out WIN32_FIND_DATA findData);

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
                    else if (ArchiveExtensionRegex().IsMatch(findData.cFileName)) // Regular file
                    {
                        yield return new FileEntry { Path = entryPath, Name = findData.cFileName };
                    }
                }
            } while (FindNextFile(hFindFile, out findData));

            FindClose(hFindFile);
        }

        public async Task GetDirectoryStructureRecursivelyAsync(string path, string configPath, List<TreeNode> result)
        {
            var hFindFile = FindFirstFile(Path.Combine(path, "*"), out WIN32_FIND_DATA findFileData);
            if (hFindFile == IntPtr.Zero)
            {
                Console.WriteLine($"Error finding files in directory {path}");
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

                    string entryPath = Path.Combine(path, entryName);

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
                        await GetDirectoryStructureRecursivelyAsync(path, configPath, subNode.Children);
                    }
                    else if (findFileData.dwFileAttributes == FileAttributes.Archive && ArchiveExtensionRegex().IsMatch(entryName))
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
                Console.WriteLine($"Error reading dir {path}: {e.Message}");
            }
            finally
            {
                _ = FindClose(hFindFile);
            }
        }
    }
}