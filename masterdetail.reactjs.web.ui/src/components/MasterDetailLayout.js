
import React, { useState } from 'react';
import MasterTable from './Master';
import DetailTable from './Detail';
import '../Appify.css';

const MasterDetailLayout = () => {
  const [selectedMaster, setSelectedMaster] = useState(null); // Store selected master details
  const [isMasterVisible, setIsMasterVisible] = useState(true);

  const handleMasterSelect = (master) => {
    setSelectedMaster(master); // Pass the entire master object
  };

  const toggleMasterVisibility = () => {
    setIsMasterVisible(!isMasterVisible);
  };

  return (
    <div className="master-detail-layout"><button className="hamburger-menu" onClick={toggleMasterVisibility}>
        {isMasterVisible ? (
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
          ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
          ><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button><div className={`master-table-container ${isMasterVisible ? 'visible' : 'hidden'}`}><MasterTable 
          onSelect={handleMasterSelect} 
          selectedMasterId={selectedMaster?.masterId} 
        /></div><DetailTable master={selectedMaster} /></div>
  );
};

export default MasterDetailLayout;


  