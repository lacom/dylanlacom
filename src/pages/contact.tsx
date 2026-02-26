import { siteConfig } from '../../core/routes';

export default async function ContactPage() {
  return (
    <article className="content-page">
      <title>{`Get in touch | ${siteConfig.title}`}</title>
      <h1>Get in touch</h1>
      <section>
        DM me on X/Twitter <a href="https://twitter.com/dylanlacom">@dylanlacom</a> or email
        fullname at gmail dot com.
      </section>
    </article>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
