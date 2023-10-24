using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree.Base;
using Application.Core.Helpers.DirectoryTree.Interface;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree
{
    public class UnixBaseHelper : DirectoryBaseHelper, IDisposable
    {
        private bool disposed;

        public UnixBaseHelper(IDFSOperations dfsOperations) : base(dfsOperations)
        {
        }

        public UnixBaseHelper(IRecursiveOperations recursiveOperations) : base(recursiveOperations)
        {
        }

        ~UnixBaseHelper() => Dispose(false);

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
                disposed = true;
            }
        }

        public async Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootNode = new List<TreeNode>();
            var traversedPaths = new HashSet<string>();
            try
            {
                await UseGetDFSAsync(path, configPath, rootNode, traversedPaths);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }
            return rootNode.SelectMany(e => e.Children).ToList();
        }
    }
}