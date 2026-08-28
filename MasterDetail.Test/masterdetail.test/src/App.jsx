import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// Using placeholders for pages until we create them
import React from 'react';

const MasterList = React.lazy(() => import('./pages/godetail_crud/MasterList'));
const DetailList = React.lazy(() => import('./pages/godetail_crud/DetailList'));
const ChildList = React.lazy(() => import('./pages/godetail_crud/ChildList'));
const ProDetailCrud = React.lazy(() => import('./pages/prodetail_crud/ProDetailCrud'));
const FormShowcase = React.lazy(() => import('./pages/FormShowcase'));

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/godetail/masters" replace />} />

            {/* Go Detail Classic CRUD Routes */}
            <Route path="godetail/masters" element={<MasterList />} />
            <Route path="godetail/master/:masterId/details" element={<DetailList />} />
            <Route path="godetail/master/:masterId/detail/:detailId/children" element={<ChildList />} />

            {/* Pro Detail Single Window Route */}
            <Route path="prodetail" element={<ProDetailCrud />} />

            {/* Component Dev Route */}
            <Route path="form-showcase" element={<FormShowcase />} />

            {/* Legacy redirect to keep existing links alive if any */}
            <Route path="masters" element={<Navigate to="/godetail/masters" replace />} />

            <Route path="*" element={<div className="text-center mt-20 text-gray-500">Page Not Found</div>} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
