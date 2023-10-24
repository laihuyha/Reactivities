using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree.Interface
{
    public interface IRecursiveOperations : IDirectoryOperations
    {
        /// <summary>
        /// Note : This is using Recursively with OS Low-level api not using DFS or something else
        /// </summary>
        /// <param name="path">pat from UI (short path that is hidden full path)</param>
        /// <param name="configPath">the hidden of full path mean configPath + path = fullPath</param>
        /// <returns>nothing, cause recursively will add to result</returns>
        Task GetDirectoryStructureRecursivelyAsync(string path, string configPath, List<TreeNode> result);
    }
}