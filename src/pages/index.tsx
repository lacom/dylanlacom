import { getPostSummaries } from '../../core/posts';
import { siteConfig } from '../../core/routes';
import { PostCard } from '../components/post-card';

export default async function HomePage() {
  const posts = await getPostSummaries();

  return (
    <>
      <title>{siteConfig.title}</title>
      <section className="post-wall">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
