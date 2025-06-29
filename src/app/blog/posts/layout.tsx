export default function BlogPostsLayout({
  children,
  blog,
}: {
  children: React.ReactNode;
  blog: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {children}
      {blog}
    </div>
  );
} 