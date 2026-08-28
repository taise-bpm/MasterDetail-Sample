import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChildren, useCreateChild, useUpdateChild, useDeleteChild } from '../../hooks/useChildHooks';
import { useMasterById } from '../../hooks/useMasterHooks';
import { useDetailById } from '../../hooks/useDetailHooks';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useDebounce } from '../../hooks/useDebounce';
import Modal from '../../components/Modal';
import RecordCard from '../../components/RecordCard';
import RecordForm from '../../components/RecordForm';
import RecordView from '../../components/RecordView';
import CrudListLayout from '../../components/CrudListLayout';
import RecordTable from '../../components/RecordTable';
import { childScenarios } from '../../constants/childFields';

export default function ChildList() {
    const { masterId, detailId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState(null);
    const [viewingRecord, setViewingRecord] = useState(null);

    // --- FILTER STATE ---
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [reverse, setReverse] = useState(false);

    // --- TANSTACK HOOKS ---
    const { data: masterData } = useMasterById(masterId);
    const master = masterData;

    const { data: detailData } = useDetailById(detailId);
    const detail = detailData;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChildren(masterId, detailId, debouncedSearch, reverse);

    const createChild = useCreateChild();
    const updateChild = useUpdateChild();
    const deleteChild = useDeleteChild();

    const children = data ? data.pages.flatMap(page => page.childs || page.children || page.childList || page.content || page.data || []) : [];

    // --- INFINITE SCROLL ---
    const lastElementRef = useInfiniteScroll(isFetchingNextPage, hasNextPage, fetchNextPage);

    const handleOpenModal = (childRecord = null) => {
        setEditingChild(childRecord);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChild(null);
    };

    const handleSave = async (formData) => {
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                masterId: parseInt(masterId),
                detailId: parseInt(detailId)
            };

            if (editingChild) {
                payload.childId = editingChild.childId;
                await updateChild.mutateAsync({ id: editingChild.childId, updatedChild: payload });
            } else {
                await createChild.mutateAsync(payload);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save child:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this child list?')) return;
        try {
            await deleteChild.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete child:', error);
        }
    };

    const breadcrumbs = [
        { label: 'Masters', path: '/godetail/masters' },
        { label: master?.name || 'Loading...', path: `/godetail/master/${masterId}/details` },
        { label: detail?.name || 'Loading...', path: `/godetail/master/${masterId}/detail/${detailId}/children` },
        { label: 'Children', path: null }
    ];

    return (
        <>
            <CrudListLayout
                breadcrumbs={breadcrumbs}
                backUrl={`/godetail/master/${masterId}/details`}
                title="Children"
                subtitle={`Manage children for ${detail?.name || 'this record'}`}
                onAdd={() => handleOpenModal()}
                addLabel="Add Child"
                search={search}
                onSearchChange={setSearch}
                reverse={reverse}
                onReverseToggle={() => setReverse(!reverse)}
                status={status}
                isFetchingNextPage={isFetchingNextPage}
                itemsCount={children.length}
                loadingMessage="Loading children..."
                errorMessage="Failed to load child records. Please try again."
                emptyMessage="No child records found for this detail. Click 'Add Child' to create one."
            >
                {(viewMode) => viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {children.map((child, index) => (
                            <div key={child.childId} ref={children.length === index + 1 ? lastElementRef : null}>
                                <RecordCard
                                    data={child}
                                    fields={childScenarios.list}
                                    title={child.name}
                                    description={child.description}
                                    onEdit={() => handleOpenModal(child)}
                                    onDelete={() => handleDelete(child.childId)}
                                    onViewDetail={() => setViewingRecord(child)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <RecordTable
                        data={children}
                        fields={childScenarios.list}
                        idField="childId"
                        onEdit={(child) => handleOpenModal(child)}
                        onDelete={(id) => handleDelete(id)}
                        onViewDetail={(child) => setViewingRecord(child)}
                        lastElementRef={lastElementRef}
                    />
                )}
            </CrudListLayout>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingChild ? 'Edit Child' : 'Create Child'}
            >
                <RecordForm
                    fields={editingChild ? childScenarios.update : childScenarios.create}
                    initialData={editingChild ? { name: editingChild.name, description: editingChild.description } : null}
                    onSubmit={handleSave}
                    onCancel={handleCloseModal}
                    submitLabel={editingChild ? 'Save Changes' : 'Create Child'}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={!!viewingRecord}
                onClose={() => setViewingRecord(null)}
                title="View Child Record"
            >
                <RecordView data={viewingRecord} fields={childScenarios.view} />
            </Modal>
        </>
    );
}

