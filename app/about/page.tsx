export default function BlogPost({ params }: { params: { id: string } }) {
  const post = {
    id: 1,
    title: "記事1",
    content: "dd",
  };

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}