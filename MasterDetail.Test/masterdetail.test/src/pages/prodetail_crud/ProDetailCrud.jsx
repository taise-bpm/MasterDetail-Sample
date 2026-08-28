/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMasters, useCreateMaster, useUpdateMaster, useDeleteMaster } from '../../hooks/useMasterHooks';
import { useDetails, useCreateDetail, useUpdateDetail, useDeleteDetail } from '../../hooks/useDetailHooks';
import { useChildren, useCreateChild, useUpdateChild, useDeleteChild } from '../../hooks/useChildHooks';
import Modal from '../../components/Modal';
import RecordForm from '../../components/RecordForm';
import RecordView from '../../components/RecordView';
import { Loader, MoreVertical, Edit2, Trash2, Database, FileText, FolderTree, ChevronRight, Plus, Eye, ArrowLeft } from 'lucide-react';
import { masterFields } from '../../constants/masterFields';
import { detailFields } from '../../constants/detailFields';
import { childFields } from '../../constants/childFields';

export default function ProDetailCrud() {
    // --- SEARCH STATE ---
    const [masterSearch, setMasterSearch] = useState('');
    const [detailSearch, setDetailSearch] = useState('');
    const [childSearch, setChildSearch] = useState('');

    const [debouncedMSearch, setDebouncedMSearch] = useState('');
    const [debouncedDSearch, setDebouncedDSearch] = useState('');
    const [debouncedCSearch, setDebouncedCSearch] = useState('');

    useEffect(() => { const t = setTimeout(() => setDebouncedMSearch(masterSearch), 500); return () => clearTimeout(t); }, [masterSearch]);
    useEffect(() => { const t = setTimeout(() => setDebouncedDSearch(detailSearch), 500); return () => clearTimeout(t); }, [detailSearch]);
    useEffect(() => { const t = setTimeout(() => setDebouncedCSearch(childSearch), 500); return () => clearTimeout(t); }, [childSearch]);

    // --- SELECTION STATE ---
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);

    // --- CONTEXT MENU STATE ---
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, record: null, type: null });

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: null, editingRecord: null, mode: 'edit' });

    // --- MOBILE LAYOUT STATE ---
    const [activeMobilePanel, setActiveMobilePanel] = useState('master');

    // --- TANSTACK HOOKS ---
    const { data: mData, fetchNextPage: fetchM, hasNextPage: hasM, isFetchingNextPage: isFetchM, status: statM } = useMasters(debouncedMSearch, false);
    const { data: dData, fetchNextPage: fetchD, hasNextPage: hasD, isFetchingNextPage: isFetchD, status: statD } = useDetails(selectedMaster?.masterId, debouncedDSearch, false);
    const { data: cData, fetchNextPage: fetchC, hasNextPage: hasC, isFetchingNextPage: isFetchC, status: statC } = useChildren(selectedMaster?.masterId, selectedDetail?.detailId, debouncedCSearch, false);

    const masters = mData ? mData.pages.flatMap(p => p.masters || p.content || p.data || []) : [];
    const details = dData ? dData.pages.flatMap(p => p.details || p.detailList || p.content || p.data || []) : [];
    const children = cData ? cData.pages.flatMap(p => p.childs || p.children || p.childList || p.content || p.data || []) : [];

    const createMaster = useCreateMaster(); const updateMaster = useUpdateMaster(); const deleteMaster = useDeleteMaster();
    const createDetail = useCreateDetail(); const updateDetail = useUpdateDetail(); const deleteDetail = useDeleteDetail();
    const createChild = useCreateChild(); const updateChild = useUpdateChild(); const deleteChild = useDeleteChild();

    // --- INFINITE SCROLL OBSERVERS ---
    const observer = useRef();
    const lastMasterElementRef = useCallback(node => {
        if (isFetchM) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => { if (entries[0].isIntersecting && hasM) fetchM(); });
        if (node) observer.current.observe(node);
    }, [isFetchM, hasM, fetchM]);

    const detailObserver = useRef();
    const lastDetailElementRef = useCallback(node => {
        if (isFetchD) return;
        if (detailObserver.current) detailObserver.current.disconnect();
        detailObserver.current = new IntersectionObserver(entries => { if (entries[0].isIntersecting && hasD) fetchD(); });
        if (node) detailObserver.current.observe(node);
    }, [isFetchD, hasD, fetchD]);

    const childObserver = useRef();
    const lastChildElementRef = useCallback(node => {
        if (isFetchC) return;
        if (childObserver.current) childObserver.current.disconnect();
        childObserver.current = new IntersectionObserver(entries => { if (entries[0].isIntersecting && hasC) fetchC(); });
        if (node) childObserver.current.observe(node);
    }, [isFetchC, hasC, fetchC]);

    // Close Context Menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    // Cleanup state when Master changes
    useEffect(() => {
        setSelectedDetail(null);
        setDetailSearch('');
        setChildSearch('');
    }, [selectedMaster]);

    // Cleanup state when Detail changes
    useEffect(() => {
        setChildSearch('');
    }, [selectedDetail]);

    const handleContextMenu = (e, record, type) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            record,
            type
        });
    };

    const handleMasterSelect = (master) => {
        setSelectedMaster(master);
        setActiveMobilePanel('detail');
    };

    const handleDetailSelect = (detail) => {
        setSelectedDetail(detail);
        setActiveMobilePanel('child');
    };

    const openModal = (type, editingRecord = null, mode = 'edit') => {
        setModalConfig({ type, editingRecord, mode });
        setIsModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            const { type, editingRecord } = modalConfig;

            if (type === 'master') {
                const payload = { ...data, descritption: data.description };
                if (editingRecord) {
                    await updateMaster.mutateAsync({ id: editingRecord.masterId, updatedMaster: { masterId: editingRecord.masterId, ...payload } });
                } else {
                    await createMaster.mutateAsync(payload);
                }
            } else if (type === 'detail') {
                const payload = { ...data, descritpion: data.description, masterId: selectedMaster.masterId };
                if (editingRecord) {
                    await updateDetail.mutateAsync({ id: editingRecord.detailId, updatedDetail: { detailId: editingRecord.detailId, ...payload } });
                } else {
                    await createDetail.mutateAsync(payload);
                }
            } else if (type === 'child') {
                const payload = { ...data, description: data.description, masterId: selectedMaster.masterId, detailId: selectedDetail.detailId };
                if (editingRecord) {
                    await updateChild.mutateAsync({ id: editingRecord.childId, updatedChild: { childId: editingRecord.childId, ...payload } });
                } else {
                    await createChild.mutateAsync(payload);
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error(`Failed to save ${modalConfig.type}:`, error);
        }
    };

    const handleDelete = async (type, record) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            if (type === 'master') {
                await deleteMaster.mutateAsync(record.masterId);
                if (selectedMaster?.masterId === record.masterId) setSelectedMaster(null);
            } else if (type === 'detail') {
                await deleteDetail.mutateAsync(record.detailId);
                if (selectedDetail?.detailId === record.detailId) setSelectedDetail(null);
            } else if (type === 'child') {
                await deleteChild.mutateAsync(record.childId);
            }
        } catch (error) {
            console.error(`Failed to delete ${type}:`, error);
        }
    };

    // Helper for modal fields mapping due to backend typos
    const getInitialModalData = () => {
        if (!modalConfig.editingRecord) return null;
        const r = modalConfig.editingRecord;
        if (modalConfig.type === 'master') return { name: r.name, description: r.descritption };
        if (modalConfig.type === 'detail') return { name: r.name, description: r.descritpion };
        if (modalConfig.type === 'child') return { name: r.name, description: r.description };
        return null;
    };

    const getFields = () => {
        if (modalConfig.type === 'master') return masterFields;
        if (modalConfig.type === 'detail') return detailFields;
        if (modalConfig.type === 'child') return childFields;
        return [];
    };

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pro Detail View</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Triple-pane management console with infinite scroll.</p>
                </div>
            </div>

            {/* Mobile Breadcrumbs */}
            <div className="lg:hidden flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
                <button
                    onClick={() => setActiveMobilePanel('master')}
                    className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${activeMobilePanel === 'master' ? 'font-semibold text-indigo-700 dark:text-indigo-300' : ''}`}
                >
                    Masters
                </button>
                {selectedMaster && (
                    <>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <button
                            onClick={() => setActiveMobilePanel('detail')}
                            className={`truncate max-w-[120px] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${activeMobilePanel === 'detail' ? 'font-semibold text-indigo-700 dark:text-indigo-300' : ''}`}
                            title={selectedMaster.name}
                        >
                            {selectedMaster.name}
                        </button>
                    </>
                )}
                {selectedDetail && activeMobilePanel === 'child' && (
                    <>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300 truncate max-w-[120px]" title={selectedDetail.name}>
                            {selectedDetail.name}
                        </span>
                    </>
                )}
            </div>

            {/* Content Panels */}
            {/* 
                Desktop: flex-row, takes remaining height (- 8rem rough header calc), panels overflow naturally
                Mobile: flex-col, allows body scroll, panels grow based on content 
            */}
            <div className="flex-1 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 lg:h-[calc(100vh-12rem)] min-h-[500px]">

                {/* 1. MASTER PANEL */}
                <div className={`w-full lg:w-1/3 flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:overflow-hidden min-h-[300px] lg:min-h-0 ${activeMobilePanel === 'master' ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center"><Database className="w-4 h-4 mr-2" /> Masters</h2>
                        <button onClick={() => openModal('master')} className="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <input
                            type="text"
                            placeholder="Search masters..."
                            className="w-full text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
                            value={masterSearch}
                            onChange={(e) => setMasterSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
                        {statM === 'pending' ? (
                            <div className="py-8 flex justify-center"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
                        ) : masters.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No masters found.</div>
                        ) : (
                            <>
                                {masters.map((master, index) => {
                                    const isSelected = selectedMaster?.masterId === master.masterId;
                                    return (
                                        <div
                                            ref={masters.length === index + 1 ? lastMasterElementRef : null}
                                            key={`master-${master.masterId}`}
                                            onDoubleClick={() => handleMasterSelect(master)}
                                            onContextMenu={(e) => handleContextMenu(e, master, 'master')}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 shadow-sm dark:hover:bg-gray-700/50'} flex justify-between items-center group`}
                                        >
                                            <div className="truncate pr-4">
                                                <h3 className={`font-medium ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>{master.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{master.descritption}</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 shrink-0 transition-opacity ${isSelected ? 'text-indigo-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                    );
                                })}
                                {isFetchM && <div className="py-4 flex justify-center"><Loader className="w-5 h-5 animate-spin text-indigo-500" /></div>}
                            </>
                        )}
                    </div>
                </div>

                {/* 2. DETAIL PANEL */}
                <div className={`w-full lg:w-1/3 flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:overflow-hidden min-h-[300px] lg:min-h-0 ${activeMobilePanel === 'detail' ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActiveMobilePanel('master')}
                                className="lg:hidden p-1.5 mr-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 rounded-md transition-colors"
                                aria-label="Back to Masters"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {selectedMaster ? 'Details' : 'Select a Master'}
                            </h2>
                        </div>
                        {selectedMaster && (
                            <button onClick={() => openModal('detail')} className="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors"><Plus className="w-4 h-4" /></button>
                        )}
                    </div>
                    {selectedMaster && (
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                            <input
                                type="text"
                                placeholder="Search details..."
                                className="w-full text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
                                value={detailSearch}
                                onChange={(e) => setDetailSearch(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
                        {!selectedMaster ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Double-click a Master to view details</div>
                        ) : statD === 'pending' ? (
                            <div className="py-8 flex justify-center"><Loader className="w-6 h-6 animate-spin text-indigo-500" /></div>
                        ) : details.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No details found.</div>
                        ) : (
                            <>
                                {details.map((detail, index) => {
                                    const isSelected = selectedDetail?.detailId === detail.detailId;
                                    return (
                                        <div
                                            ref={details.length === index + 1 ? lastDetailElementRef : null}
                                            key={`detail-${detail.detailId}`}
                                            onClick={() => handleDetailSelect(detail)}
                                            onContextMenu={(e) => handleContextMenu(e, detail, 'detail')}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 shadow-sm dark:hover:bg-gray-700/50'} flex justify-between items-center group`}
                                        >
                                            <div className="truncate pr-4">
                                                <h3 className={`font-medium ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>{detail.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{detail.descritpion || detail.description}</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 shrink-0 transition-opacity ${isSelected ? 'text-blue-500 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                    );
                                })}
                                {isFetchD && <div className="py-4 flex justify-center"><Loader className="w-5 h-5 animate-spin text-indigo-500" /></div>}
                            </>
                        )}
                    </div>
                </div>

                {/* 3. CHILD PANEL */}
                <div className={`w-full lg:w-1/3 flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:overflow-hidden min-h-[300px] lg:min-h-0 lg:last:pb-0 ${activeMobilePanel === 'child' ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActiveMobilePanel('detail')}
                                className="lg:hidden p-1.5 mr-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 rounded-md transition-colors"
                                aria-label="Back to Details"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                                <FolderTree className="w-4 h-4 mr-2" />
                                {selectedDetail ? 'Children' : 'Select a Detail'}
                            </h2>
                        </div>
                        {selectedDetail && (
                            <button onClick={() => openModal('child')} className="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors"><Plus className="w-4 h-4" /></button>
                        )}
                    </div>
                    {selectedDetail && (
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                            <input
                                type="text"
                                placeholder="Search children..."
                                className="w-full text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 dark:text-gray-200"
                                value={childSearch}
                                onChange={(e) => setChildSearch(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
                        {!selectedDetail ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm px-4 text-center">Click a Detail to view children</div>
                        ) : statC === 'pending' ? (
                            <div className="py-8 flex justify-center"><Loader className="w-6 h-6 animate-spin text-teal-500" /></div>
                        ) : children.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No children found.</div>
                        ) : (
                            <>
                                {children.map((child, index) => (
                                    <div
                                        ref={children.length === index + 1 ? lastChildElementRef : null}
                                        key={`child-${child.childId}`}
                                        onContextMenu={(e) => handleContextMenu(e, child, 'child')}
                                        className="p-3 rounded-lg border bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{child.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{child.description}</p>
                                    </div>
                                ))}
                                {isFetchC && <div className="py-4 flex justify-center"><Loader className="w-5 h-5 animate-spin text-teal-500" /></div>}
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Context Menu Overlay */}
            {contextMenu.visible && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[150px] animate-in slide-in-from-top-2"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={() => openModal(contextMenu.type, contextMenu.record, 'view')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/30 flex items-center transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" /> View
                    </button>
                    <button
                        onClick={() => openModal(contextMenu.type, contextMenu.record, 'edit')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex items-center transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </button>
                    <button
                        onClick={() => handleDelete(contextMenu.type, contextMenu.record)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                </div>
            )}

            {/* Unified Modal Configuration */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalConfig.mode === 'view' ? `View ${modalConfig.type ? modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1) : ''}` : `${modalConfig.editingRecord ? 'Edit' : 'Create'} ${modalConfig.type ? modalConfig.type.charAt(0).toUpperCase() + modalConfig.type.slice(1) : ''}`}
            >
                {modalConfig.mode === 'view' ? (
                    <RecordView data={modalConfig.editingRecord} fields={getFields()} />
                ) : (
                    <RecordForm
                        fields={getFields()}
                        initialData={getInitialModalData()}
                        onSubmit={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                        submitLabel={modalConfig.editingRecord ? 'Save Changes' : 'Create Record'}
                    />
                )}
            </Modal>
        </div>
    );
}
