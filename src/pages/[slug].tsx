import type { PageProps } from 'waku/router';
import { getPostPath, getPostStaticPaths } from '../../core/build';
import { getPostBySlug } from '../../core/posts';
import { siteConfig } from '../../core/routes';
import { PostCoverAbout } from '../components/post-cover-about';
import { PostPageFooter } from '../components/post-page-footer';
import { formatPostDate } from '../utils/date';

export default async function PostPage({ slug }: PageProps<'/[slug]'>) {
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <article className="content-page">
        <title>{`Not found | ${siteConfig.title}`}</title>
        <h1>Post not found</h1>
      </article>
    );
  }

  const canonicalUrl = `${siteConfig.siteUrl}${getPostPath(post.slug)}/`;

  return (
    <>
      <title>{`${post.title} | ${siteConfig.title}`}</title>
      <meta name="description" content={post.description ?? siteConfig.description} />
      <meta property="og:title" content={post.title} />
      <meta property="og:url" content={canonicalUrl} />
      {post.featuredImage ? <meta property="og:image" content={post.featuredImage} /> : null}

      <article className="post-page-layout">
        <section className="post-primary-column">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-date">{formatPostDate(post.date)}</p>
          </header>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />

          <hr className="post-end-divider" />

          <PostPageFooter authors={post.authors} />
          <PostCoverAbout text={post.coverDesc} image={post.featuredImage} />
        </section>

        {post.featuredImage ? (
          <aside className="post-cover-column">
            <img src={post.featuredImage} alt={post.title} className="post-cover-image" />
          </aside>
        ) : null}
      </article>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
    staticPaths: await getPostStaticPaths(),
  } as const;
};
