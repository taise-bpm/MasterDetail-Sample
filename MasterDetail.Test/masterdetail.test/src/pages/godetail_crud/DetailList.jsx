import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDetails, useCreateDetail, useUpdateDetail, useDeleteDetail } from '../../hooks/useDetailHooks';
import { useMasterById } from '../../hooks/useMasterHooks';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';
import Modal from '../../components/Modal';
import RecordCard from '../../components/RecordCard';
import RecordForm from '../../components/RecordForm';
import RecordView from '../../components/RecordView';
import CrudListLayout from '../../components/CrudListLayout';
import RecordTable from '../../components/RecordTable';
import { detailScenarios } from '../../constants/detailFields';

export default function DetailList() {
    const { masterId } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [viewingRecord, setViewingRecord] = useState(null);

    // --- FILTER STATE ---
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [reverse, setReverse] = useState(false);

    // --- TANSTACK HOOKS ---
    const { data: masterData } = useMasterById(masterId);
    const master = masterData;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useDetails(masterId, debouncedSearch, reverse);

    const createDetail = useCreateDetail();
    const updateDetail = useUpdateDetail();
    const deleteDetail = useDeleteDetail();

    const details = data ? data.pages.flatMap(page => page.details || page.detailList || page.content || page.data || []) : [];

    // --- INFINITE SCROLL ---
    const lastElementRef = useInfiniteScroll(isFetchingNextPage, hasNextPage, fetchNextPage);

    const handleOpenModal = (detail = null) => {
        setEditingDetail(detail);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDetail(null);
    };

    const handleSave = async (formData) => {
        try {
            const payload = {
                name: formData.name,
                descritpion: formData.descritpion,
                masterId: parseInt(masterId)
            };

            if (editingDetail) {
                payload.detailId = editingDetail.detailId;
                await updateDetail.mutateAsync({ id: editingDetail.detailId, updatedDetail: payload });
            } else {
                await createDetail.mutateAsync(payload);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save detail:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this detail list?')) return;
        try {
            await deleteDetail.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete detail:', error);
        }
    };

    const breadcrumbs = [
        { label: 'Masters', path: '/godetail/masters' },
        { label: master?.name || 'Loading...', path: `/godetail/master/${masterId}/details` },
        { label: 'Details', path: null }
    ];

    return (
        <>
            <CrudListLayout
                breadcrumbs={breadcrumbs}
                backUrl="/godetail/masters"
                title="Details"
                subtitle={`Manage details for ${master?.name || 'this record'}`}
                onAdd={() => handleOpenModal()}
                addLabel="Add Detail"
                search={search}
                onSearchChange={setSearch}
                reverse={reverse}
                onReverseToggle={() => setReverse(!reverse)}
                status={status}
                isFetchingNextPage={isFetchingNextPage}
                itemsCount={details.length}
                loadingMessage="Loading details..."
                errorMessage="Failed to load detail records. Please try again."
                emptyMessage="No detail records found for this master. Click 'Add Detail' to create one."
            >
                {(viewMode) => viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {details.map((detail, index) => (
                            <div key={detail.detailId} ref={details.length === index + 1 ? lastElementRef : null}>
                                <RecordCard
                                    data={detail}
                                    fields={detailScenarios.list}
                                    title={detail.name}
                                    description={detail.descritpion}
                                    onEdit={() => handleOpenModal(detail)}
                                    onDelete={() => handleDelete(detail.detailId)}
                                    onClickView={() => navigate(`/godetail/master/${masterId}/detail/${detail.detailId}/children`)}
                                    onViewDetail={() => setViewingRecord(detail)}
                                    viewLabel="View Children"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <RecordTable
                        data={details}
                        fields={detailScenarios.list}
                        idField="detailId"
                        onEdit={(detail) => handleOpenModal(detail)}
                        onDelete={(id) => handleDelete(id)}
                        onClickView={(detail) => navigate(`/godetail/master/${masterId}/detail/${detail.detailId}/children`)}
                        onViewDetail={(detail) => setViewingRecord(detail)}
                        viewLabel="View Children"
                        lastElementRef={lastElementRef}
                    />
                )}
            </CrudListLayout>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDetail ? 'Edit Detail' : 'Create Detail'}
            >
                <RecordForm
                    fields={editingDetail ? detailScenarios.update : detailScenarios.create}
                    initialData={editingDetail ? { name: editingDetail.name, descritpion: editingDetail.descritpion } : null}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                    submitLabel={editingDetail ? 'Save Changes' : 'Create Detail'}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={!!viewingRecord}
                onClose={() => setViewingRecord(null)}
                title="View Detail Record"
            >
                <RecordView data={viewingRecord} fields={detailScenarios.view} />
            </Modal>
        </>
    );
}

