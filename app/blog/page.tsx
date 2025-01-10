// app/blog/page.tsx
// async function getPosts() {
//   const res = await fetch('https://api.example.com/posts', {
//     cache: 'no-store' // SSRで毎回データを取得
//   });
//   return res.json();
// }

export default async function BlogPage() {
  // const posts = await getPosts();
  const posts = [
    { id: 1, title: '記事1' },
    { id: 2, title: '記事2' },
    { id: 3, title: '記事3' },
  ];

  return (
    <div>
      <h1>ブログ記事一覧</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}