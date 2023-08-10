using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class WindowsHelper : DirectoryTreeBase
    {
        public override Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            throw new NotImplementedException();
        }
    }
}