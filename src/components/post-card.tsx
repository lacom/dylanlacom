import { Link } from 'waku';
import type { PostSummary } from '../../core/posts';
import { formatCardDate } from '../utils/date';

type PostCardProps = {
  post: PostSummary;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="post-card">
      <Link to={`/${post.slug}`} className="post-card-link">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} className="post-card-image" loading="eager" />
        ) : null}
        <span className="post-card-content">
          <h2 className="post-card-title">{post.title}</h2>
          <span className="post-card-meta">{formatCardDate(post.date)}</span>
        </span>
      </Link>
    </article>
  );
};
