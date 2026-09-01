import { Link } from 'react-router-dom';
import './LandingPage.css';

const sections = [
  {
    to: '/master-detail',
    title: 'Master / Detail',
    description: 'Browse masters, drill into their details, and manage both from one workspace.',
  },
  {
    to: '/detail-child',
    title: 'Detail / Child',
    description: 'Browse details, drill into their child records, and manage both from one workspace.',
  },
  {
    to: '/master',
    title: 'Masters',
    description: 'Search, page through, and manage every master in a single grid.',
  },
  {
    to: '/detail',
    title: 'Details',
    description: 'Search, page through, and manage every detail in a single grid.',
  },
  {
    to: '/child',
    title: 'Children',
    description: 'Search, page through, and manage every child record in a single grid.',
  },
  {
    to: '/controls-demo',
    title: 'Controls Demo',
    description: 'Every reusable form control - text, date, datetime, checkbox, radio, select - in one editor.',
  },
];

const LandingPage = () => (
  <div className="landing-page">
    <div className="landing-hero">
      <h1>MasterDetail</h1>
      <p>Manage masters, their details, and child records from one place.</p>
    </div>

    <div className="landing-cards">
      {sections.map((section) => (
        <Link to={section.to} key={section.to} className="landing-card">
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <span className="landing-card__cta">Open →</span>
        </Link>
      ))}
    </div>
  </div>
);

export default LandingPage;
