
import { Link } from "react-router-dom";

export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export type Section = {
  id: string;
  title: string;
  toc: string;
  blocks: Block[];
};

export type Related = {
  title: string;
  description: string;
  label: string;
  href: string;
};

type Props = {
  heroImage: string;
  title: string;
  subtitle: string;
  sections: Section[];
  related: Related[];
};

const css = `
.pl-root {
  --brown: #62422C;
  --tan: #8F6C54;
  --blush: #EEE6E2;
  --page: #F7F7F7;
  color: #000;
  font-family: inherit;
}

.pl-hero {
  position: relative;
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  padding: 32px 20px;
  background-size: cover;
  background-position: center;
}

.pl-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.50);
}

.pl-hero > * {
  position: relative;
}

.pl-hero h1 {
  margin: 0 0 16px;
  font-size: clamp(34px, 5vw, 48px);
  font-weight: 400;
  line-height: 1.15;
}

.pl-hero p {
  margin: 0;
  max-width: 760px;
  font-size: clamp(14px, 1.6vw, 18px);
  font-weight: 400;
  line-height: 1.5;
}

.pl-body {
  display: flex;
  align-items: stretch;
  background: var(--page);
  min-height: 500px;
}

.pl-side {
  flex: 0 0 220px;
  background: var(--blush);
}

.pl-toc {
  position: sticky;
  top: 100px;
  margin: 100px 18px 40px;
  padding-left: 16px;
  border-left: 3px solid var(--brown);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pl-toc-title {
  font-size: 17px;
  color: var(--brown);
  margin-bottom: 5px;
  font-weight: 400;
}

.pl-toc a {
  font-size: 14px;
  font-weight: 400;
  color: #000;
  text-decoration: none;
  line-height: 1.4;
}

.pl-toc a:hover {
  color: var(--tan);
  text-decoration: underline;
}

.pl-main {
  flex: 1;
  min-width: 0;
  padding: 64px 48px 80px;
  display: flex;
  flex-direction: column;
}

.pl-inner {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.pl-sec {
  margin-bottom: 58px;
  scroll-margin-top: 100px;
}

.pl-sec h2,
.pl-related h2 {
  display: inline-block;
  margin: 0 0 22px;
  padding-bottom: 9px;
  border-bottom: 3px solid var(--brown);
  font-size: clamp(23px, 2.5vw, 29px);
  font-weight: 400;
  line-height: 1.2;
  color: #000;
}

.pl-sec p {
  margin: 0 0 18px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  color: #292929;
}

.pl-sec ul {
  margin: 0;
  padding-left: 22px;
  list-style: disc;
}

.pl-sec li {
  margin: 0 0 14px;
  padding-left: 3px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  color: #292929;
}

.pl-sec li::marker {
  color: var(--brown);
}

.pl-sec p.pl-note {
  font-size: 14px;
  font-weight: 400;
  color: var(--tan);
  margin-top: 20px;
  padding: 14px 18px;
  background: var(--blush);
  border-radius: 14px;
}

.pl-related {
  margin-top: 10px;
}

.pl-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 55px;
}

.pl-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  background: #fff;
  border: 2px solid var(--brown);
  border-radius: 24px;
  color: #000;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.pl-card:hover {
  background: var(--blush);
  transform: translateY(-3px);
}

.pl-card h3 {
  margin: 0 0 12px;
  font-size: 19px;
  font-weight: 400;
  color: var(--brown);
}

.pl-card p {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

.pl-card span {
  margin-top: auto;
  font-size: 14px;
  font-weight: 400;
  color: var(--brown);
}

.pl-card:hover span,
.pl-card:focus-visible span {
  text-decoration: underline;
}

.pl-cta {
  padding: 38px 24px;
  text-align: center;
  background: var(--blush);
  border-radius: 30px;
}

.pl-cta h2 {
  margin: 0 0 12px;
  font-size: 25px;
  font-weight: 400;
  color: var(--brown);
}

.pl-cta p {
  margin: 0 0 22px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
}

.pl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 24px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: background .2s ease;
}

.pl-btn:hover {
  background: var(--brown);
}

.pl-root a:focus-visible {
  outline: 3px solid var(--tan);
  outline-offset: 3px;
}

@media (min-width: 640px) {
  .pl-hero {
    height: 320px;
  }
}

@media (min-width: 768px) {
  .pl-hero {
    height: 340px;
  }
}

@media (max-width: 900px) {
  .pl-side {
    display: none;
  }

  .pl-main {
    padding: 48px 28px 64px;
  }
}

@media (max-width: 600px) {
  .pl-hero {
    height: 260px;
  }

  .pl-hero h1 {
    font-size: 34px;
  }

  .pl-main {
    padding: 40px 20px 55px;
  }

  .pl-sec {
    margin-bottom: 42px;
  }

  .pl-cards {
    grid-template-columns: 1fr;
  }

  .pl-card {
    padding: 21px;
  }

  .pl-cta {
    padding: 30px 20px;
  }
}
`;

export default function PolicyLayout({
  heroImage,
  title,
  subtitle,
  sections,
  related,
}: Props) {
  return (
    <div className="pl-root">

      <div className="mt-17">
        <style>{css}</style>

        {/* Hero */}
        <header
          className="pl-hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {/* Main Content */}
        <div className="pl-body">
          {/* Table of Contents */}
          <aside className="pl-side" aria-label="On this page">
            <nav className="pl-toc">
              <span className="pl-toc-title">On This Page</span>

              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.toc}
                </a>
              ))}
            </nav>
          </aside>

          <main className="pl-main">
            <div className="pl-inner">
              {/* Policy Sections */}
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="pl-sec"
                >
                  <h2>{section.title}</h2>

                  {section.blocks.map((block, index) =>
                    block.type === "ul" ? (
                      <ul key={index}>
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={index}
                        className={
                          block.type === "note" ? "pl-note" : undefined
                        }
                      >
                        {block.text}
                      </p>
                    )
                  )}
                </section>
              ))}

              {/* Related Policies */}
              <section className="pl-related">
                <h2>Related policies</h2>

                <div className="pl-cards">
                  {related.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="pl-card"
                    >
                      <h3>{item.title}</h3>

                      <p>{item.description}</p>

                      <span>{item.label} →</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Contact CTA */}
              <section className="pl-cta">
                <h2>Questions about this policy?</h2>

                <p>
                  We are happy to explain anything in plain language.
                </p>

                <Link to="/contact" className="pl-btn">
                  Contact us
                </Link>
              </section>
            </div>
          </main>
        </div>
      </div>

    </div>
  );
}