using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree.Interface;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree.Base
{
    public partial class DirectoryBaseHelper
    {
        [GeneratedRegex("\\.(zip|tar|7z|rar|zipx)$")]
        public static partial Regex ArchiveExtensionRegex();

        private readonly IDFSOperations _dfsOperations;
        private readonly IRecursiveOperations _recursiveOperations;

        public DirectoryBaseHelper(IDFSOperations dfsOperations)
        {
            _dfsOperations = dfsOperations;
        }

        public DirectoryBaseHelper(IRecursiveOperations recursiveOperations)
        {
            _recursiveOperations = recursiveOperations;
        }

        public DirectoryBaseHelper()
        {
        }

        protected async Task UseGetRecursive(string rootPath, string configPath, List<TreeNode> result)
        {
            await _recursiveOperations.GetDirectoryStructureRecursivelyAsync(rootPath, configPath, result);
        }

        // 12/12/2023: Every List<TreeNode> should be replace with LinkedList<TreeNode> for better performance, the disadvantage is highly memory usage
        protected async Task UseGetDFSAsync(string rootPath, string configPath, List<TreeNode> result, HashSet<string> traversedPaths)
        {
            try
            {
                if (_dfsOperations == null) return;
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

                    var directoryContents = _dfsOperations.GetDirectoryContents(currentPath);
                    var tasks = new List<Task>();

                    var currentNode = new TreeNode
                    {
                        Key = currentPath[configPath.Length..], // Use for >.NET 6 this mean subString here
                        Title = Path.GetFileName(currentPath),
                        IsDirectory = true,
                        Children = new List<TreeNode>()
                    };

                    foreach (var item in directoryContents)
                    {
                        if (item is DirectoryEntry directoryEntry)
                        {
                            stack.Push(directoryEntry.Path);
                            tasks.Add(UseGetDFSAsync(directoryEntry.Path, configPath, currentNode.Children, traversedPaths));
                        }
                        else if (item is FileEntry fileEntry)
                        {
                            if (ArchiveExtensionRegex().IsMatch(fileEntry.Name))
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
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        protected async Task UsePurelyDFSAsync(string path, string configPath, List<TreeNode> result)
        {
            try
            {
                if (_dfsOperations == null) return;
                var stack = new Stack<(string path, TreeNode parentNode)>();
                stack.Push((path, null));

                var tasks = new List<Task>();

                while (stack.Count > 0)
                {
                    var (currentPath, parentNode) = stack.Pop();

                    var directoryContents = _dfsOperations.GetDirectoryContents(currentPath);

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
                            if (ArchiveExtensionRegex().IsMatch(fileEntry.Name))
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
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
