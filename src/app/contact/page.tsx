import {
  DEFAULT_CONTACT_PAGE_CONTENT,
  getSanityContactPageContent,
} from "@/lib/sanity-site-content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (basePath ? "https://griswall.github.io" : "https://westernloss.org");

function withBasePath(pathname: string): string {
  if (!basePath) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${basePath}${normalizedPath}`;
}

export default async function ContactPage() {
  const content = (await getSanityContactPageContent()) ?? DEFAULT_CONTACT_PAGE_CONTENT;
  const endpointEmail = content.recipientEmail;
  const formSubmitEndpoint = `https://formsubmit.co/${endpointEmail}`;
  const successRedirect = new URL(withBasePath("/contact/#contact-success"), siteUrl).toString();

  return (
    <main className="page-main">
      <section className="hero-band">
        <div className="container hero-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.heading}</h1>
          <p className="hero-description">{content.description}</p>
        </div>
      </section>

      <section className="container">
        <article className="content-card contact-card">
          <h2>{content.formHeading}</h2>
          <p id="contact-success" className="form-success" role="status" aria-live="polite">
            Thank you. Your message has been sent successfully.
          </p>

          <form action={formSubmitEndpoint} method="POST" className="contact-form">
            <input type="hidden" name="_subject" value={content.subject} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value={successRedirect} />
            <input type="text" name="_honey" className="visually-hidden" tabIndex={-1} autoComplete="off" />

            <label htmlFor="name" className="visually-hidden">
              Your Name
            </label>
            <input id="name" name="name" type="text" placeholder="Your name" required />

            <label htmlFor="email" className="visually-hidden">
              Email
            </label>
            <input id="email" name="email" type="email" placeholder="Email address" required />

            <label htmlFor="organization" className="visually-hidden">
              Organization
            </label>
            <input id="organization" name="organization" type="text" placeholder="Organization (optional)" />

            <label htmlFor="message" className="visually-hidden">
              Message
            </label>
            <textarea id="message" name="message" rows={8} placeholder="Message" required />

            <button type="submit" className="button-primary">
              {content.submitLabel}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
