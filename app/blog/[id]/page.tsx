// // app/blog/[id]/page.tsx
// async function getPost(id: string) {
//   const res = await fetch(`https://api.example.com/posts/${id}`, {
//     cache: 'no-store'
//   });
//   return res.json();
// }

export default async function BlogPost({
  params
}: {
  params: { id: string }
}) {
  // const post = await getPost(params.id);

  const post = {
    id: 1,
    title: '記事1',
    content: '記事1の内容'
  };

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}