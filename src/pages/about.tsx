import { siteConfig } from '../../core/routes';

export default async function AboutPage() {
  return (
    <article className="content-page">
      <title>{`About | ${siteConfig.title}`}</title>
      <h1>About</h1>
      <section>
        <p>
          Dylan La Com is a software engineer, entrepreneur, inventor and tinkerer based in Los
          Angeles, California.
        </p>
        <p>
          Currently, Dylan is the tech lead at a retail technology company called{' '}
          <a href="https://www.materialretail.com/" title="Material">
            Material
          </a>
          . Previously, Dylan founded the technology startup Lightning in a Bot Inc., which
          developed the{' '}
          <a
            href="/developing-the-natural-language-understanding-behind-shoppy-bot/"
            title="Developing the Natural Language Understanding Behind Shoppy Bot"
          >
            Shoppy Bot
          </a>{' '}
          product, a novel reporting software for ecommerce businesses.
        </p>
      </section>
      <section>
        <h3>Links</h3>
        <h5>Social</h5>
        <ul>
          <li>
            <a href="https://twitter.com/dylanlacom">Twitter</a>
          </li>
          <li>
            <a href="https://github.com/lacom">Github</a>
          </li>
        </ul>
        <h5>Other</h5>
        <ul>
          <li>
            <a href="https://www.youtube.com/watch?v=rBpaUICxEhk">Life is NOT a Journey - Alan Watts</a>
          </li>
        </ul>
      </section>
      <section>
        <h3>About this website</h3>
        <p>
          This is a static website built with <a href="https://react.dev/">React</a> and{' '}
          <a href="https://waku.gg/">Waku.js</a>. It&apos;s served to you super fast via{' '}
          <a href="https://aws.amazon.com/">AWS</a>. The code for this site is open source and
          available on <a href="https://github.com/lightninginabot/liab_website">Github</a>.
        </p>
      </section>
    </article>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
