import EntityGridPage from '../components/common/EntityGridPage';
import { sampleEntity } from '../entities/sampleEntity';

// Demonstrates every reusable form control (text, textarea, number, date,
// datetime, checkbox, radio, select, dependent foreign-key select) running
// through the exact same CRUD pipeline as Master/Detail/Child. Backed by an
// in-memory mock (sampleApi.js) rather than the real backend - see
// sampleEntity.js for what each field is demonstrating and why.
const ControlsDemoPage = () => (
  <EntityGridPage
    entity={sampleEntity}
    breadcrumbItems={[{ label: 'Home', to: '/' }, { label: 'Controls Demo' }]}
  />
);

export default ControlsDemoPage;
