import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight, ChevronDown, Mail, MapPin,
} from 'lucide-react';
import { cv } from '@/data/cv.js';
import './portfolio-preview.css';

const sections = [
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['products', 'Products'],
  ['skills', 'Skills'],
  ['education', 'Education'],
  ['contact', 'Contact'],
];

const skillLabels = {
  languages: 'Languages',
  coreCS: 'Computer science',
  backend: 'Backend',
  frontend: 'Frontend',
  databases: 'Databases',
  ai: 'AI & retrieval',
  infrastructure: 'Cloud & infrastructure',
  testingAndTools: 'Testing & tools',
};

function Tags({ items }) {
  return (
    <ul className="folio-tags">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function NewTabLink(props) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

export default function PortfolioPreview() {
  const { identity, experience, collection, products, projects, skills, education, certifications, contact, social, stats } = cv;
  const resume = `${import.meta.env.BASE_URL}resume.pdf`;
  const [productNavigation, setProductNavigation] = useState(null);
  const navigationSheet = useRef(null);

  useEffect(() => {
    if (!productNavigation) return;
    const reset = () => setProductNavigation(null);
    const restore = (event) => { if (event.persisted) reset(); };
    window.addEventListener('pageshow', restore);
    window.addEventListener('popstate', reset);
    let canceled = false;
    const visit = () => {
      if (!canceled) window.location.assign(productNavigation.url);
    };
    const entry = navigationSheet.current?.getAnimations?.()[0];
    if (entry) entry.finished.then(visit, visit);
    else visit();
    return () => {
      canceled = true;
      window.removeEventListener('pageshow', restore);
      window.removeEventListener('popstate', reset);
    };
  }, [productNavigation]);

  function openProduct(event, title) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const url = event.currentTarget.href;
    event.preventDefault();
    setProductNavigation((pending) => pending ?? { url, title });
  }

  function jumpTo(event, id) {
    event.preventDefault();
    const section = document.getElementById(`portfolio-${id}`);
    section?.focus({ preventScroll: true });
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    section?.scrollIntoView({ block: 'start', behavior });
  }

  return (
    <div className="folio-scroll">
      <div className="folio">
        <nav className="folio-nav" aria-label="Portfolio navigation">
          <div className="folio-inner folio-nav-inner">
            <a className="folio-mark" href="#portfolio-about" onClick={(event) => jumpTo(event, 'about')} aria-label="Portfolio home">
              {identity.avatarInitials}
            </a>
            <div className="folio-nav-links">
              {sections.map(([id, label]) => (
                <a key={id} href={`#portfolio-${id}`} onClick={(event) => jumpTo(event, id)}>{label}</a>
              ))}
            </div>
          </div>
        </nav>

        <header id="portfolio-about" className="folio-hero" tabIndex={-1}>
          <div className="folio-inner">
            {identity.available && <p className="folio-availability">{identity.availabilityNote}</p>}
            <h1>{identity.name}</h1>
            <p className="folio-role">{identity.role}</p>
            <p className="folio-tagline">{identity.tagline}</p>
            <div className="folio-hero-actions">
              <NewTabLink className="folio-primary" href={resume}>
                <ArrowUpRight size={16} aria-hidden="true" /> View résumé
              </NewTabLink>
              <a className="folio-secondary" href="#portfolio-contact" onClick={(event) => jumpTo(event, 'contact')}>
                Get in touch <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="folio-stats">
              {stats.map(({ label, value }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="folio-inner">
          <section id="portfolio-experience" className="folio-section" tabIndex={-1}>
            <h2>Experience</h2>
            <div className="folio-timeline">
              {experience.map((job) => (
                <article key={job.company} className="folio-job">
                  <p className="folio-meta">{job.period} <span>·</span> {job.location}</p>
                  <h3>{job.company}</h3>
                  <p className="folio-job-title">{job.title}</p>
                  <p className="folio-description">{job.summary}</p>
                  <Tags items={job.stack} />
                  <details className="folio-details">
                    <summary>View project details <ChevronDown size={15} aria-hidden="true" /></summary>
                    {Object.entries(job.projects).map(([name, highlights]) => (
                      <div key={name} className="folio-work">
                        <h4>{name}</h4>
                        <ul>{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                      </div>
                    ))}
                    {job.companyUrl && <NewTabLink className="folio-link" href={job.companyUrl}>Company website <ArrowUpRight size={13} aria-hidden="true" /></NewTabLink>}
                  </details>
                </article>
              ))}
            </div>
          </section>

          <section id="portfolio-projects" className="folio-section" tabIndex={-1}>
            <h2>Projects</h2>
            {projects.map((project) => (
              <article key={project.name} className="folio-project">
                {project.cover && (
                  <figure className="folio-project-figure">
                    <img
                      className="folio-project-cover"
                      src={`${import.meta.env.BASE_URL}${project.cover.src}`}
                      alt={project.cover.alt}
                      width={project.cover.width}
                      height={project.cover.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>Example browser task</figcaption>
                  </figure>
                )}
                <div className="folio-project-body">
                  <p className="folio-meta">{project.period}</p>
                  <h3>{project.name}</h3>
                  <p className="folio-job-title">{project.tagline}</p>
                  <p className="folio-description">{project.description}</p>
                  <Tags items={project.stack} />
                  <NewTabLink className="folio-link" href={project.url}>View source on GitHub <ArrowUpRight size={15} aria-hidden="true" /></NewTabLink>
                </div>
              </article>
            ))}
          </section>

          <section id="portfolio-products" className="folio-section" tabIndex={-1}>
            <h2>Live Products</h2>
            <p className="folio-products-intro">{collection.description}</p>
            {products.map((product) => (
              <article key={product.name} className="folio-product">
                <div className="folio-product-screens">
                  {product.screenshots.map(({ src, alt }) => (
                    <div key={src} className="folio-product-phone">
                      <img src={`${import.meta.env.BASE_URL}${src}`} alt={alt} width={360} height={800} loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
                <div className="folio-product-copy">
                  <p className="folio-product-meta">{product.platform} app <span>·</span> {product.status}</p>
                  <h3>{product.name}</h3>
                  <p className="folio-job-title">{product.tagline}</p>
                  <p className="folio-description">{product.description}</p>
                  <div className="folio-product-actions">
                    <a className="folio-primary" href={product.url} onClick={(event) => openProduct(event, product.name)}>
                      Explore {product.name} <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    {product.previewUrl && (
                      <a className="folio-primary folio-product-preview" href={product.previewUrl} onClick={(event) => openProduct(event, `${product.name} Preview`)}>
                        Preview live in browser <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
            <NewTabLink className="folio-link folio-collection-link" href={collection.url}>
              Browse {collection.name} <ArrowUpRight size={15} aria-hidden="true" />
            </NewTabLink>
          </section>

          <section id="portfolio-skills" className="folio-section" tabIndex={-1}>
            <h2>Skills</h2>
            <div className="folio-skills">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3>{skillLabels[category]}</h3>
                  <Tags items={items} />
                </div>
              ))}
            </div>
          </section>

          <section id="portfolio-education" className="folio-section" tabIndex={-1}>
            <h2>Education</h2>
            {education.map((program) => (
              <article key={program.university} className="folio-program">
                <p className="folio-meta">{program.year}</p>
                <h3>{program.university}</h3>
                <p>{program.degree} · {program.field}</p>
              </article>
            ))}
            {certifications.map((certification) => (
              <article key={certification.name} className="folio-program">
                <p className="folio-meta">{certification.year}</p>
                <h3>{certification.name}</h3>
              </article>
            ))}
          </section>

          <section id="portfolio-contact" className="folio-section folio-contact" tabIndex={-1}>
            <h2>Contact</h2>
            <NewTabLink className="folio-email" href={`mailto:${contact.email}`}><Mail size={18} aria-hidden="true" /> {contact.email}</NewTabLink>
            <div className="folio-contact-meta">
              <NewTabLink href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</NewTabLink>
              <span><MapPin size={15} aria-hidden="true" /> {contact.location}</span>
              {contact.calendar && <NewTabLink href={contact.calendar}>Book a call</NewTabLink>}
            </div>
            <ul className="folio-social">
              {social.map(({ label, handle, url }) => (
                <li key={label}>
                  <NewTabLink className="folio-link" href={url} title={handle}>{label} <ArrowUpRight size={14} aria-hidden="true" /></NewTabLink>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      {productNavigation && createPortal(
        <div className="folio-product-navigation" aria-hidden="true">
          <div ref={navigationSheet} className="folio-product-navigation-sheet">{productNavigation.title}</div>
        </div>,
        document.body,
      )}
    </div>
  );
}
