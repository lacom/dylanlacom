type PostCoverAboutProps = {
  text?: string;
  image?: string;
};

export const PostCoverAbout = ({ text, image }: PostCoverAboutProps) => {
  if (!text && !image) {
    return null;
  }

  return (
    <section className="cover-about">
      <h3>About the Cover</h3>
      <div className="cover-about-content">
        {image ? <img src={image} alt="Cover art" className="cover-about-image" /> : null}
        <div>{text ? <p>{text}</p> : null}</div>
      </div>
    </section>
  );
};
