import EntityGridPage from '../components/common/EntityGridPage';
import { childEntity } from '../entities/childEntity';

// Standalone single-table CRUD grid for Child, optionally scoped by
// ?masterId= and/or ?detailId= (e.g. arriving here via a Detail row's
// "View Children" link).
const ChildPage = () => (
  <EntityGridPage
    entity={childEntity}
    breadcrumbItems={[{ label: 'Home', to: '/' }, { label: 'Children' }]}
    filterParamNames={['masterId', 'detailId']}
  />
);

export default ChildPage;
