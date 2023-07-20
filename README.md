# Reactivities
React NETCore ...

This code for fetching the Directory tree from local :

using System.Runtime.InteropServices;
using System.Text;
using Business.Data.DTOs;
using Business.DTOs;
using Core.Business;
using static Business.Data.DTOs.AdditionalInfo;

/// <summary>
/// NOTE : This is a helper class just only for Windows System, doesn't work on Linux
/// Using OS Apis
/// </summary>

public class WindowsDirectoryTreeTraversal
{
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr FindFirstFile(string lpFileName, out WIN32_FIND_DATA lpFindFileData);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool FindNextFile(IntPtr hFindFile, out WIN32_FIND_DATA lpFindFileData);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool FindClose(IntPtr hFindFile);

    private static bool IsDirectory(WIN32_FIND_DATA findFileData)
    {
        /// FileAttributes.Directory = 0x10 = 0x00000010 => 16 in hex
        /// Read more at : https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants
        return (findFileData.dwFileAttributes & FileAttributes.Directory) != 0;
    }

    private static bool IsArchive(WIN32_FIND_DATA findFileData)
    {
        return (findFileData.dwFileAttributes & FileAttributes.Archive) != 0;
    }

    private static string PtrToString(IntPtr ptr)
    {
        var buffer = new StringBuilder(260); // MAX_PATH
        int length = 0;
        while (Marshal.ReadByte(ptr, length) != 0 && length < 260)
        {
            buffer.Append((char)Marshal.ReadByte(ptr, length));
            length++;
        }
        return buffer.ToString();
    }

    public static DirectoryNode

    GetDirectoryTree(string path)
    {
        var directoryNode = new DirectoryNode(path);
        var stack = new Stack<(DirectoryNode node, string path)>();
        stack.Push((directoryNode, path));

        try
        {
            while (stack.Count > 0)
            {
                var (currentNode, currentPath) = stack.Pop();
                WIN32_FIND_DATA findFileData;

                // Find the first file or directory in the current directory
                IntPtr hFindFile = FindFirstFile(Path.Combine(currentPath, "*"), out findFileData);

                if (hFindFile != IntPtr.Zero)
                {
                    try
                    {
                        do
                        {
                            string entryName = findFileData.cFileName;

                            // Skip "." and ".." entries
                            // "." refers to the current directory
                            // ".." refers to the parent directory
                            if (entryName != "." && entryName != "..")
                            {
                                string entryPath = Path.Combine(currentPath, entryName);

                                if (IsDirectory(findFileData))
                                {
                                    var subNode = new DirectoryNode(Path.Combine(currentPath, entryName));
                                    currentNode.Subitems.Add(subNode);
                                    stack.Push((subNode, entryPath)); // Add the subdirectory to the stack for processing
                                }
                                else if (IsArchive(findFileData) && Constants.ACEPTFILEEXTENSIONS.Contains(entryName.Substring(entryName.LastIndexOf("."))))
                                {
                                    currentNode.Subitems.Add(new DirectoryNode(Path.Combine(currentPath, entryName)));
                                }
                            }
                        } while (FindNextFile(hFindFile, out findFileData));
                    }
                    finally
                    {
                        FindClose(hFindFile);
                    }
                }
                else
                {
                    Console.WriteLine($"Error finding files in directory {currentPath}");
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error accessing {path}: {e.Message}");
        }

        return directoryNode;
    }
}

/// <summary>
/// Using OS Apis
/// </summary>
public class UnixDirectoryTreeTraversal
{
    [DllImport("libc", SetLastError = true)]
    private static extern IntPtr opendir(string name);

    [DllImport("libc", SetLastError = true)]
    private static extern IntPtr readdir(IntPtr dirp);

    [DllImport("libc", SetLastError = true)]
    private static extern int closedir(IntPtr dirp);

    private const int NAME_MAX = 255; // Maximum filename length on most UNIX systems

    private static bool IsDirectory(dirent entry)
    {
        // Check if the entry is a directory based on file type
        return (entry.d_type & 0x4) != 0;
    }

    /// <summary>
    /// https://linux.die.net/man/3/readdir.
    /// <br/>
    /// At Notes:
    /// d_type has none specify about Archive type so just don't use this
    /// </summary>
    /// <param name="entry"></param>
    /// <returns></returns>
    private static bool IsArchive(dirent entry)
    {
        // Replace this with your logic for identifying archive files on UNIX
        return false;
    }

    public static DirectoryNode GetDirectoryTree(string path)
    {
        var directoryNode = new DirectoryNode(path);
        var stack = new Stack<(DirectoryNode node, string path)>();
        stack.Push((directoryNode, path));

        try
        {
            while (stack.Count > 0)
            {
                var (currentNode, currentPath) = stack.Pop();
                IntPtr dirp = opendir(currentPath);

                if (dirp != IntPtr.Zero)
                {
                    try
                    {
                        dirent entry;
                        while (true)
                        {
                            IntPtr result = readdir(dirp);
                            if (result == IntPtr.Zero)
                                break;

                            entry = Marshal.PtrToStructure<dirent>(result);
                            string entryName = entry.d_name;

                            // Skip "." and ".." entries
                            if (entryName != "." && entryName != "..")
                            {
                                string entryPath = Path.Combine(currentPath, entryName);

                                if (IsDirectory(entry))
                                {
                                    var subNode = new DirectoryNode(Path.Combine(currentPath, entryName));
                                    currentNode.Subitems.Add(subNode);
                                    stack.Push((subNode, entryPath)); // Add the subdirectory to the stack for processing
                                }
                                else if (Constants.ACEPTFILEEXTENSIONS.Contains(entryName.Substring(entryName.LastIndexOf("."))))
                                {
                                    currentNode.Subitems.Add(new DirectoryNode(Path.Combine(currentPath, entryName)));
                                }
                            }
                        }
                    }
                    finally
                    {
                        closedir(dirp);
                    }
                }
                else
                {
                    Console.WriteLine($"Error opening directory {currentPath}");
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error accessing {path}: {e.Message}");
        }

        return directoryNode;
    }
}

/// <summary>
/// Using DFS instead of using recursive cause of it better performance when fetch large and complex Directory then recursive
/// </summary>
public class DirectoryNonDependOnSystem
{
    public static async Task<List<JSTreeNode>> GetDirectoryTreeAsync(string path, string configPath)
    {
        var rootDir = new DirectoryInfo(path);

        var result = new List<JSTreeNode>();

        var stack = new Stack<(DirectoryInfo, JSTreeNode)>();
        stack.Push((rootDir, null));

        while (stack.Count > 0)
        {
            var (currentDir, parentNode) = stack.Pop();

            // Get child items asynchronously using Task.WhenAll
            var childItems = await Task.Run(() => currentDir.GetFileSystemInfos());

            foreach (var item in childItems)
            {
                if (item is FileInfo file && Constants.ACEPTFILEEXTENSIONS.Contains(file.Extension))
                {
                    var node = new JSTreeNode
                    {
                        Key = file.FullName.Replace(configPath, ""),
                        Title = file.Name,
                        IsDirectory = false,
                        Children = null
                    };

                    if (parentNode != null)
                        parentNode.Children.Add(node);
                    else
                        result.Add(node);
                }
                else if (item is DirectoryInfo directory)
                {
                    var node = new JSTreeNode
                    {
                        Key = directory.FullName.Replace(configPath, ""),
                        Title = directory.Name,
                        IsDirectory = true,
                        Children = new List<JSTreeNode>()
                    };

                    if (parentNode != null)
                        parentNode.Children.Add(node);
                    else
                        result.Add(node);

                    stack.Push((directory, node));
                }
            }
        }
        return result;
    }
}
