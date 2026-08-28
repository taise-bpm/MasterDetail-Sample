import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasters, useCreateMaster, useUpdateMaster, useDeleteMaster } from '../../hooks/useMasterHooks';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';
import Modal from '../../components/Modal';
import RecordCard from '../../components/RecordCard';
import RecordForm from '../../components/RecordForm';
import RecordView from '../../components/RecordView';
import CrudListLayout from '../../components/CrudListLayout';
import RecordTable from '../../components/RecordTable';
import { masterScenarios } from '../../constants/masterFields';

export default function MasterList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaster, setEditingMaster] = useState(null);
    const [viewingRecord, setViewingRecord] = useState(null);
    const navigate = useNavigate();

    // --- FILTER STATE ---
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [reverse, setReverse] = useState(false);

    // --- TANSTACK HOOKS ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useMasters(debouncedSearch, reverse);

    const createMaster = useCreateMaster();
    const updateMaster = useUpdateMaster();
    const deleteMaster = useDeleteMaster();

    // Flatten pages into a single masters array
    const masters = data ? data.pages.flatMap(page => page.masters || page.content || page.data || []) : [];

    // --- INFINITE SCROLL ---
    const lastElementRef = useInfiniteScroll(isFetchingNextPage, hasNextPage, fetchNextPage);

    const handleOpenModal = (master = null) => {
        setEditingMaster(master);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMaster(null);
    };

    const handleSave = async (formData) => {
        try {
            const payload = {
                name: formData.name,
                descritption: formData.descritption
            };

            if (editingMaster) {
                await updateMaster.mutateAsync({
                    id: editingMaster.masterId,
                    updatedMaster: { masterId: editingMaster.masterId, ...payload }
                });
            } else {
                await createMaster.mutateAsync(payload);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save master:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this master list?')) return;
        try {
            await deleteMaster.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete master:', error);
        }
    };

    return (
        <>
            <CrudListLayout
                title="Masters"
                subtitle="Manage your top-level data entries."
                onAdd={() => handleOpenModal()}
                addLabel="Add Master"
                search={search}
                onSearchChange={setSearch}
                reverse={reverse}
                onReverseToggle={() => setReverse(!reverse)}
                status={status}
                isFetchingNextPage={isFetchingNextPage}
                itemsCount={masters.length}
                loadingMessage="Loading master records..."
                errorMessage="Failed to load master records. Please try again."
                emptyMessage="No master records found. Click 'Add Master' to create one."
            >
                {(viewMode) => viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {masters.map((master, index) => (
                            <div key={master.masterId} ref={masters.length === index + 1 ? lastElementRef : null}>
                                <RecordCard
                                    data={master}
                                    fields={masterScenarios.list}
                                    title={master.name}
                                    description={master.descritption}
                                    onEdit={() => handleOpenModal(master)}
                                    onDelete={() => handleDelete(master.masterId)}
                                    onClickView={() => navigate(`/godetail/master/${master.masterId}/details`)}
                                    onViewDetail={() => setViewingRecord(master)}
                                    viewLabel="View Details"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <RecordTable
                        data={masters}
                        fields={masterScenarios.list}
                        idField="masterId"
                        onEdit={(master) => handleOpenModal(master)}
                        onDelete={(id) => handleDelete(id)}
                        onClickView={(master) => navigate(`/godetail/master/${master.masterId}/details`)}
                        onViewDetail={(master) => setViewingRecord(master)}
                        viewLabel="View Details"
                        lastElementRef={lastElementRef}
                    />
                )}
            </CrudListLayout>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMaster ? "Edit Master" : "Create Master"}
            >
                <RecordForm
                    fields={editingMaster ? masterScenarios.update : masterScenarios.create}
                    initialData={editingMaster ? { name: editingMaster.name, descritption: editingMaster.descritption } : null}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                    submitLabel={editingMaster ? "Save Changes" : "Create Master"}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={!!viewingRecord}
                onClose={() => setViewingRecord(null)}
                title="View Master Record"
            >
                <RecordView data={viewingRecord} fields={masterScenarios.view} />
            </Modal>
        </>
    );
}
