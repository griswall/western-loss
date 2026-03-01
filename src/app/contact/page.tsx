const CONTACT_EMAIL = "info@westernloss.org";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/${CONTACT_EMAIL}`;

export default function ContactPage() {
  return (
    <main className="page-main">
      <section className="hero-band">
        <div className="container hero-copy">
          <p className="eyebrow">Contact</p>
          <h1>Get in Touch</h1>
          <p className="hero-description">
            Use the form below or email the association directly.
          </p>
        </div>
      </section>

      <section className="container">
        <article className="content-card contact-card">
          <h2>Contact Form</h2>
          <form action={FORMSUBMIT_ENDPOINT} method="POST" className="contact-form">
            <input type="hidden" name="_subject" value="Western Loss Association Contact Form" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
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
              Send Message
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
