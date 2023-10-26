using System.Collections.Generic;

namespace Domain.ViewModels
{
    public class TreeNode
    {
        public string Key { get; set; }
        public string Title { get; set; }
        public bool IsDirectory { get; set; }
        public bool IsLeaf { get; set; }
        public List<TreeNode> Children { get; set; }
    }
}