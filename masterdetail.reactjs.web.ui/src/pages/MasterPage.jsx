import EntityGridPage from '../components/common/EntityGridPage';
import { masterEntity } from '../entities/masterEntity';

// Standalone single-table CRUD grid for Master (no parent to scope by). Each
// row links forward to /detail?masterId=... for that master's details.
const MasterPage = () => (
  <EntityGridPage entity={masterEntity} breadcrumbItems={[{ label: 'Home', to: '/' }, { label: 'Masters' }]} />
);

export default MasterPage;
