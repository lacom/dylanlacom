import { Link } from 'waku';

type PostPageFooterProps = {
  authors: string[];
};

export const PostPageFooter = ({ authors }: PostPageFooterProps) => {
  return (
    <div>
      <div className="post-footer-meta">
        <span>{authors.length > 0 ? authors.join(', ') : 'Dylan La Com'}</span>
      </div>
      <div className="post-footer-contact">
        Have a comment?{' '}
        <Link to="/contact" title="Contact">
          Write me a message
        </Link>
        .
      </div>
    </div>
  );
};
