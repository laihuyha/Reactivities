namespace Domain.ViewModels
{
    public class Entry { }

    public class DirectoryEntry : Entry
    {
        public string Path { get; set; }
        public string Name { get; set; }
    }

    public class FileEntry : Entry
    {
        public string Path { get; set; }
        public string Name { get; set; }
    }
}