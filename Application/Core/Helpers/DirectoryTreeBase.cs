using System.Collections.Generic;
using System.Text.RegularExpressions;
using Domain.ViewModels;

namespace Application.Core.Helpers
{
    /// <summary>
    /// Has better about performance
    /// <para>
    /// Here are some of the key benefits of using the GeneratedRegexAttribute in C#: <br/>
    /// <br/>
    /// - Improved performance - The regex is compiled only once at compile time rather than on every execution. This avoids regex initialization costs.<br/>
    /// - Better compile-time validation - Any errors in the regex pattern will show up at compile time rather than runtime.<br/>
    /// - Readability - The regex pattern is specified right in the attribute which is clearer than manually initializing a static regex field.<br/>
    /// - Reusability - The generated regex can be used from multiple places in the code.<br/>
    /// - Caching - The compiled regex is cached and reused across instances which saves memory.<br/>
    /// - Easy application - Just decorate a static field with the attribute and provide the pattern.<br/>
    /// - Flexibility - Can be used with static, instance, or local fields.<br/>
    /// - Thread-safety - The generated regex does not need locks for thread-safety.<br/>
    /// </para>
    /// <see cref="ArchiveExtensionRegex">https://github.com/dotnet/runtime/issues/44676</see>
    /// </summary>
    public abstract partial class DirectoryTreeBase
    {
        public readonly byte DT_DIR = 4; // Unix Directory
        public abstract List<TreeNode> GetDirectoryTreeStructure(string path, string configPath);

        public readonly Regex ArchiveRegex = ArchiveExtensionRegex();

        public readonly Regex IMGRegex = ImageExtensionRegex();

        [GeneratedRegex("\\.(zip|tar|7z|rar|zipx)$")]
        private static partial Regex ArchiveExtensionRegex();

        [GeneratedRegex("\\.jpg$|\\.png$|\\.webp$|\\.jpeg$")]
        private static partial Regex ImageExtensionRegex();
    }
}