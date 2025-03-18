export default function BlogPostsLayout({
  children,
  blog,
}: {
  children: React.ReactNode;
  blog: React.ReactNode;
}) {
  return (
    <>
      {children}
      {blog}
    </>
  );
} 