import { useState } from 'react';
import ParentChildLayout from '../components/ParentChildLayout';
import EntityTileList from '../components/common/EntityTileList';
import EntityChildGrid from '../components/common/EntityChildGrid';
import { masterEntity } from '../entities/masterEntity';
import { detailEntity } from '../entities/detailEntity';

const MasterDetailPage = () => {
  const [selectedMaster, setSelectedMaster] = useState(null);

  return (
    <ParentChildLayout
      parentPanel={
        <EntityTileList entity={masterEntity} selectedId={selectedMaster?.masterId} onSelect={setSelectedMaster} />
      }
      childPanel={
        <EntityChildGrid
          entity={detailEntity}
          parent={selectedMaster}
          parentIdField="masterId"
          childForeignKeyField="masterId"
          parentLabelField="name"
          parentDescriptionField="descritption"
          noParentMessage="Select a master item to view details"
        />
      }
    />
  );
};

export default MasterDetailPage;
