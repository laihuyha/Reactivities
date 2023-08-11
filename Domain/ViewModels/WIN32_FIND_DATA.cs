using System.IO;
using System.Runtime.InteropServices;

namespace Domain.ViewModels
{
    /// <summary>
    /// This struct unmanaged code using for Windows system
    /// <br/>
    /// <see cref="member">https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-win32_find_dataa</see>
    /// </summary>
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    public struct WIN32_FIND_DATA
    {
        public FileAttributes dwFileAttributes;
        public uint ftCreationTime_dwLowDateTime;
        public uint ftCreationTime_dwHighDateTime;
        public uint ftLastAccessTime_dwLowDateTime;
        public uint ftLastAccessTime_dwHighDateTime;
        public uint ftLastWriteTime_dwLowDateTime;
        public uint ftLastWriteTime_dwHighDateTime;
        public uint nFileSizeHigh;
        public uint nFileSizeLow;
        public uint dwReserved0;
        public uint dwReserved1;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 260)]
        public string cFileName;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 14)]
        public string cAlternateFileName;
    }
}