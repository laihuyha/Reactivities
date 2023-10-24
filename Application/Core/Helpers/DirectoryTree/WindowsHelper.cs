using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core.Helpers.DirectoryTree.Base;
using Application.Core.Helpers.DirectoryTree.Interface;
using Domain.ViewModels;

namespace Business.Helpers.DirectoryTree
{
    /// <summary>
    /// NOTE : This is a helper class just only for Windows System, doesn't work on Linux
    /// Using OS Apis
    /// <br/>
    /// <br/>
    /// Usage Example: <br/>
    /// <code>
    ///     var folderFetcher = new WindowsHelper(dfsOperations: new WindowsDirectorySpecification());
    ///     var data = await folderFetcher.GetDirectoryTreeStructure("E:\\Games", "");
    /// </code>
    /// </summary>
    public class WindowsHelper : DirectoryBaseHelper, IDisposable
    {
        private bool disposed;

        public WindowsHelper(IDFSOperations dfsOperations) : base(dfsOperations)
        {
        }

        public WindowsHelper(IRecursiveOperations recursiveOperations) : base(recursiveOperations)
        {
        }

        ~WindowsHelper() => Dispose(false);

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
                    // Dispose managed resources here, if any
                    // hFindFile = IntPtr.Zero;
                }

                // Release unmanaged resources (close opened directories, etc.)
                // Note: Ensure you call closedir here for any remaining open directories

                disposed = true;
            }
        }

        public async Task<List<TreeNode>> GetDirectoryTreeStructure(string path, string configPath)
        {
            var rootNode = new List<TreeNode>();
            var traversedPaths = new HashSet<string>();
            try
            {
                // tasks.Add(ProcessDirectoryAsync(path, configPath, rootNode));
                // var watch = new Stopwatch();
                // watch.Start();
                await UseGetDFSAsync(path, configPath, rootNode, traversedPaths);
                // await Task.WhenAll(tasks);
                // watch.Stop();
                // Console.BackgroundColor = ConsoleColor.DarkGreen;
                // Console.WriteLine($"Time taken: {watch.ElapsedMilliseconds} ms");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error accessing {path}: {e.Message}");
            }
            return rootNode.SelectMany(e => e.Children).ToList();
        }
    }
}