import { useState } from 'react';
import '../Appify.css';

// Generic two-pane "select a parent on the left, manage its children on the
// right" shell (collapsible sidebar + main content). Master -> Detail and
// Detail -> Child both compose this with different EntityTileList /
// EntityChildGrid panes rather than duplicating the sidebar toggle chrome.
const ParentChildLayout = ({ parentPanel, childPanel }) => {
  const [isParentVisible, setIsParentVisible] = useState(true);

  const toggleParentVisibility = () => setIsParentVisible((visible) => !visible);

  return (
    <div className="master-detail-layout">
      <button className="hamburger-menu" onClick={toggleParentVisibility}>
        {isParentVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-menu"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      <div className={`master-table-container ${isParentVisible ? 'visible' : 'hidden'}`}>{parentPanel}</div>

      {childPanel}
    </div>
  );
};

export default ParentChildLayout;
