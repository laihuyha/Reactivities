using System.Collections.Generic;
using Domain.ViewModels;

namespace Application.Core.Helpers.DirectoryTree.Interface
{
    public interface IDFSOperations : IDirectoryOperations
    {
        IEnumerable<Entry> GetDirectoryContents(string path);
    }
}