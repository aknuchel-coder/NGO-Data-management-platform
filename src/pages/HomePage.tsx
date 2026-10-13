import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EarthSection } from "../components/EarthSection";
import { ProjectCard } from "../components/ProjectCard";
import { ContactForm } from "../components/ContactForm";
import { projects } from "../data/projects";
import { site } from "../data/site";

export function HomePage() {
  const [amount, setAmount] = useState<number | "custom">(50);
  const [custom, setCustom] = useState("");
  const [donationOpen, setDonationOpen] = useState(false);
  useEffect(() => {
    document.title = "Earth / Action — A world worth acting for";
  }, []);
  const upcoming = projects.find((project) => project.status === "upcoming")!;
  return (
    <>
      <EarthSection />
      <section
        id="notable"
        className="content-section page-width"
        aria-labelledby="notable-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / Work that matters</p>
          <h2 id="notable-title">Small places. Lasting change.</h2>
          <p>
            Explore real external initiatives. Every project opens a full report
            with its story, images, evidence and dashboard.
          </p>
        </div>
        <div className="project-grid">
          {projects
            .filter((project) => project.status === "notable")
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
      </section>
      <section
        id="upcoming"
        className="content-section mint-section"
        aria-labelledby="upcoming-title"
      >
        <div className="page-width">
          <div className="section-heading">
            <p className="eyebrow">02 / What comes next</p>
            <h2 id="upcoming-title">The next chapter starts here.</h2>
            <p>
              Planned work needs a clear purpose, a trusted local partner and a
              path to delivery.
            </p>
          </div>
          <Link className="upcoming-card" to={`/projects/${upcoming.slug}`}>
            <div>
              <p className="eyebrow">Upcoming / sample proposal</p>
              <h3>{upcoming.title}</h3>
              <p>
                Next milestone: confirm the local partner, scope and delivery
                date.
              </p>
            </div>
            <span className="button button-outline">
              Explore the proposal ↗
            </span>
          </Link>
        </div>
      </section>
      <section
        id="potential"
        className="content-section page-width"
        aria-labelledby="potential-title"
      >
        <div className="section-heading">
          <p className="eyebrow">03 / Problems into possibilities</p>
          <h2 id="potential-title">Where action is still missing.</h2>
          <p>
            Start with the problem. Understand the local need. Build a response
            with the people affected.
          </p>
        </div>
        <div className="project-grid">
          {projects
            .filter((project) => project.status === "potential")
            .map((project) => (
              <ProjectCard key={project.slug} project={project} compact />
            ))}
        </div>
      </section>
      <section id="approach" className="approach-section page-width">
        <p className="eyebrow">Our approach</p>
        <h2>Understand. Act. Report.</h2>
        <div className="approach-grid">
          <div>
            <span>01</span>
            <h3>Begin with the place.</h3>
            <p>Understand the challenge and the people connected to it.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Make the response clear.</h3>
            <p>Show the partner, the intervention and the path to delivery.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Keep evidence visible.</h3>
            <p>Connect the story to dated sources and transparent reporting.</p>
          </div>
        </div>
      </section>
      <section
        id="donate"
        className="content-section donation-section"
        aria-labelledby="donate-title"
      >
        <div className="page-width">
          <p className="eyebrow">04 / Make it possible</p>
          <h2 id="donate-title">Turn attention into action.</h2>
          <p className="donation-intro">
            Support a specific project or help fund the next response.
            Understand the purpose, the partner and how progress will be
            reported.
          </p>
          <div
            className="donation-amounts"
            role="group"
            aria-label="Choose a donation amount"
          >
            {([25, 50, 100, "custom"] as const).map((value) => (
              <button
                type="button"
                key={value}
                className="amount-button"
                aria-pressed={amount === value}
                onClick={() => setAmount(value)}
              >
                {value === "custom" ? "Custom" : `CHF ${value}`}
              </button>
            ))}
            <button
              className="button button-mint"
              type="button"
              aria-expanded={donationOpen}
              aria-controls="donation-options"
              onClick={() => setDonationOpen(!donationOpen)}
            >
              Choose a project ↗
            </button>
          </div>
          {amount === "custom" && (
            <label className="custom-amount">
              Amount in CHF
              <input
                type="number"
                min="1"
                max="1000000"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                inputMode="decimal"
              />
            </label>
          )}
          {donationOpen && (
            <div id="donation-options" className="donation-options">
              <h3>
                {site.donations.length
                  ? "Choose an authorised donation destination."
                  : "Explore the project before contributing."}
              </h3>
              {site.donations.length ? (
                site.donations.map((destination) => (
                  <a
                    key={destination.url}
                    href={destination.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {destination.label} ↗
                  </a>
                ))
              ) : (
                <>
                  <p>
                    No payment destination is connected. Your selected amount is
                    not charged.
                  </p>
                  <div>
                    {projects
                      .filter((project) => project.status === "notable")
                      .map((project) => (
                        <Link
                          key={project.slug}
                          to={`/projects/${project.slug}`}
                        >
                          {project.title} ↗
                        </Link>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
          <p className="donation-note">
            Contribution preview · no payments are collected on this site.
          </p>
        </div>
      </section>
      <section
        id="contact"
        className="content-section page-width"
        aria-labelledby="contact-title"
      >
        <div className="section-heading">
          <p className="eyebrow">05 / Let’s talk</p>
          <h2 id="contact-title">Have a project in mind?</h2>
          <p>Tell us about a place, an idea or a partnership.</p>
        </div>
        <div className="contact-grid">
          <div>
            <h3>
              A conversation can be
              <br />
              <em>the beginning of change.</em>
            </h3>
            <p>Project proposals · partnerships · donor enquiries</p>
            {site.contactEmail && (
              <a className="text-link" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail} ↗
              </a>
            )}
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
