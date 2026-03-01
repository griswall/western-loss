import Link from "next/link";

import { FeatureIcon } from "@/components/feature-icon";
import { DEFAULT_HOME_PAGE_CONTENT, getSanityHomePageContent } from "@/lib/sanity-site-content";

export default async function HomePage() {
  const content = (await getSanityHomePageContent()) ?? DEFAULT_HOME_PAGE_CONTENT;
  const cards = content.cards;

  return (
    <main className="page-main" id="top">
      <section className="landing-hero">
        <div className="container landing-grid">
          <div className="landing-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.heading}</h1>
            <p>{content.intro}</p>
            <div className="hero-actions">
              <Link href={content.primaryCtaHref} className="button-primary">
                {content.primaryCtaLabel}
              </Link>
              <Link href={content.secondaryCtaHref} className="button-secondary">
                {content.secondaryCtaLabel}
              </Link>
            </div>
          </div>
          <div className="landing-panel" aria-label="Quick links">
            <p className="eyebrow">{content.quickAccessEyebrow}</p>
            <h2>{content.quickAccessHeading}</h2>
            <div className="quick-link-grid">
              {cards.map((card) => (
                <Link
                  key={`quick-${card.title}`}
                  href={card.href}
                  className={`quick-link tone-${card.tone}`}
                >
                  <span className="quick-link-icon">
                    <FeatureIcon kind={card.icon} />
                  </span>
                  <span>
                    <strong>{card.title}</strong>
                    <small>{card.cta}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container cards-grid" aria-label="Highlights">
        {cards.map((card) => (
          <article key={card.title} className={`home-card tone-${card.tone}`}>
            <div>
              <span className="feature-icon">
                <FeatureIcon kind={card.icon} />
              </span>
              <p className="eyebrow">{card.eyebrow}</p>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
              <Link href={card.href} className="card-link">
                {card.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
