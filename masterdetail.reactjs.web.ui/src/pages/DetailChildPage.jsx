import { useEffect, useState } from 'react';
import ParentChildLayout from '../components/ParentChildLayout';
import EntityTileList from '../components/common/EntityTileList';
import EntityChildGrid from '../components/common/EntityChildGrid';
import ForeignKeySelect from '../components/common/ForeignKeySelect';
import useQueryFilters from '../hooks/useQueryFilters';
import { masterEntity } from '../entities/masterEntity';
import { detailEntity } from '../entities/detailEntity';
import { childEntity } from '../entities/childEntity';

// Same Parent -> Child shell as MasterDetailPage, pointed at Detail (parent)
// and Child (its records) instead of Master/Detail - proof the layout, tile
// list and child grid are genuinely reusable across table pairs.
//
// Detail's masterId is a foreign key (see detailEntity), so the Detail list
// gets a dependent Master dropdown filter for free - the same ForeignKeySelect
// used by editors and by EntityGridPage's grid filters, backed by the same
// ?masterId= query param a Master row's "View Details" link already uses.
const DetailChildPage = () => {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [{ masterId }, setFilterValues] = useQueryFilters(['masterId']);

  // Drop the current selection if the master filter changes out from under it
  // (e.g. navigating from ?masterId=5 to ?masterId=9) so the right pane doesn't
  // keep showing a detail that's no longer in the filtered list.
  useEffect(() => {
    setSelectedDetail(null);
  }, [masterId]);

  return (
    <ParentChildLayout
      parentPanel={
        <>
          <div className="filter-bar">
            <div className="filter-bar__item">
              <label htmlFor="filter-masterId">Master</label>
              <ForeignKeySelect
                name="filter-masterId"
                entity={masterEntity}
                value={masterId || ''}
                onChange={(e) => setFilterValues({ masterId: Number(e.target.value) || 0 })}
                placeholder="All Masters"
              />
            </div>
          </div>
          <EntityTileList
            entity={detailEntity}
            selectedId={selectedDetail?.detailId}
            onSelect={setSelectedDetail}
            listFilters={{ masterId }}
          />
        </>
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
