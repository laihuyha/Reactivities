using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class NonDependBaseHelper : DirectoryTreeBase
    {
        /// <summary>
        /// Using DFS
        /// </summary>
        /// <param name="path"></param>
        /// <param name="configPath"></param>
        /// <returns></returns>
        public override async Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootDir = new DirectoryInfo(path);

            var result = new List<TreeNode>();
            var stack = new Stack<(DirectoryInfo, TreeNode)>();
            stack.Push((rootDir, null));

            while (stack.Count > 0)
            {
                var (currentDir, parentNode) = stack.Pop();
                var childItems = currentDir.GetFileSystemInfos();

                var childNodes = new List<TreeNode>();

                foreach (var item in childItems)
                {
                    if (item is FileInfo file && ArchiveRegex.IsMatch(file.Extension))
                    {
                        childNodes.Add(new TreeNode
                        {
                            Key = file.FullName[configPath.Length..],
                            Title = file.Name,
                            IsDirectory = false
                        });
                    }
                    else if (item is DirectoryInfo directory)
                    {
                        var node = new TreeNode
                        {
                            Key = directory.FullName[configPath.Length..],
                            Title = directory.Name,
                            IsDirectory = true,
                            Children = new List<TreeNode>()
                        };

                        childNodes.Add(node);
                        stack.Push((directory, node));
                    }
                }

                if (parentNode != null)
                {
                    parentNode.Children.AddRange(childNodes);
                }
                else
                {
                    result.AddRange(childNodes);
                }
            }
            return await Task.FromResult(result);
        }
    }
}