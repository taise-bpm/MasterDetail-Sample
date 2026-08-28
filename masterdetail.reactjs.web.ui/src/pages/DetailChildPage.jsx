import { useState } from 'react';
import ParentChildLayout from '../components/ParentChildLayout';
import EntityTileList from '../components/common/EntityTileList';
import EntityChildGrid from '../components/common/EntityChildGrid';
import { detailEntity } from '../entities/detailEntity';
import { childEntity } from '../entities/childEntity';

// Same Parent -> Child shell as MasterDetailPage, pointed at Detail (parent)
// and Child (its records) instead of Master/Detail - proof the layout, tile
// list and child grid are genuinely reusable across table pairs.
const DetailChildPage = () => {
  const [selectedDetail, setSelectedDetail] = useState(null);

  return (
    <ParentChildLayout
      parentPanel={
        <EntityTileList entity={detailEntity} selectedId={selectedDetail?.detailId} onSelect={setSelectedDetail} />
      }
      childPanel={
        <EntityChildGrid
          entity={childEntity}
          parent={selectedDetail}
          parentIdField="detailId"
          childForeignKeyField="detailId"
          parentLabelField="name"
          parentDescriptionField="descritpion"
          noParentMessage="Select a detail item to view its children"
        />
      }
    />
  );
};

export default DetailChildPage;
