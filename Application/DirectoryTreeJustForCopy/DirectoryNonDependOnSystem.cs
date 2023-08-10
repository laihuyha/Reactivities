using Business.DTOs;

namespace Business.Helpers.DirectoryTree
{
    public class DirectoryNonDependOnSystem : DirectoryHelper
    {
        public override async Task<List<JSTreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootDir = new DirectoryInfo(path);

            var result = new List<JSTreeNode>();
            var stack = new Stack<(DirectoryInfo, JSTreeNode)>();
            stack.Push((rootDir, null));

            while (stack.Count > 0)
            {
                var (currentDir, parentNode) = stack.Pop();
                var childItems = currentDir.GetFileSystemInfos();

                var childNodes = new List<JSTreeNode>();

                foreach (var item in childItems)
                {
                    if (item is FileInfo file && ArchiveRegex.IsMatch(file.Extension))
                    {
                        childNodes.Add(new JSTreeNode
                        {
                            Key = file.FullName[configPath.Length..],
                            Title = file.Name,
                            IsDirectory = false
                        });
                    }
                    else if (item is DirectoryInfo directory && Path.GetDirectoryName(directory.FullName) != "@eaDir")
                    {
                        var node = new JSTreeNode
                        {
                            Key = directory.FullName[configPath.Length..],
                            Title = directory.Name,
                            IsDirectory = true,
                            Children = new List<JSTreeNode>()
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
