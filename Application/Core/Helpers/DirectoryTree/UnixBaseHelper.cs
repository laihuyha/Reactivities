using System.Collections.Generic;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class UnixBaseHelper : DirectoryTreeBase
    {
        public override List<TreeNode> GetDirectoryTreeStructure(string path, string configPath)
        {
            throw new System.NotImplementedException();
        }
    }
}