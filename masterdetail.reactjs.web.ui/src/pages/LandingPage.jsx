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
    to: '/child',
    title: 'Child Records',
    description: 'Search, page through, and manage every child record in a single grid.',
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
