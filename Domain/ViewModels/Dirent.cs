using System;
using System.Runtime.InteropServices;

namespace Domain.ViewModels
{
    public struct Dirent
    {
        public IntPtr d_ino;
        public IntPtr d_off;
        public ushort d_reclen;
        public byte d_type;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        public string d_name;
    }
}