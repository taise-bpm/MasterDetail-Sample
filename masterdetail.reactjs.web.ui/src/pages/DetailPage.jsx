import EntityGridPage from '../components/common/EntityGridPage';
import { detailEntity } from '../entities/detailEntity';

// Standalone single-table CRUD grid for Detail, optionally scoped by
// ?masterId= (e.g. arriving here via a Master row's "View Details" link).
// Each row links forward to /child?detailId=... for that detail's children.
const DetailPage = () => (
  <EntityGridPage
    entity={detailEntity}
    breadcrumbItems={[{ label: 'Home', to: '/' }, { label: 'Details' }]}
    filterParamNames={['masterId']}
  />
);

export default DetailPage;
