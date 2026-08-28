
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ENV from '../env';
import '../Appify.css';

const DetailTable = ({ master }) => {
	const controllerName = 'MasterDetail';
	const detailInitial = {
	  detailId: 0,masterId: 0,name: '',descritpion: '',createdBy: 0,createdOn: 0,createdIP: 0,modifiedBy: 0,modifiedOn: 0,modifiedIP: 0
    }
    const [details, setDetails] = useState([]);
    const [modalType, setModalType] = useState(null); // 'create', 'read', 'update', 'delete'
	const [selectedDetail, setSelectedDetail] = useState(null);
	const [formData, setFormData] = useState(detailInitial);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [pageSize, setPageSize] = useState(10); // Default page size
	const [loading, setLoading] = useState(false); // Default page size
	const [loadstatus, setLoadStatus] = useState(""); // Default page size
    const [errors, setErrors] = useState({}); // State to track validation errors
    const [toastMessage, setToastMessage] = useState(null); // State for toast message
    const [highlightedRow, setHighlightedRow] = useState(null); // State for highlighted row

    const modalRef = useRef(null); // Reference for the modal

    const cleanupModal = () => {
        const modalElement = modalRef.current;
        if (modalElement) {
            console.warn('Modal cleanup logic removed.');
        }
        console.log('Modal cleanup completed.');
    };

    useEffect(() => {
        if (modalType === null) {
            cleanupModal(); // Call cleanupModal when modalType is null
        }
    }, [modalType]);

    // Fetch all details on component load
    useEffect(() => {
        if (master) {
            fetchDetails();
            setDetails([]); // Clear details when master changes
            setLoading(true); // Set loading to true when fetching details
            setLoadStatus("Loading..."); // Set loading status message
        }
    }, [master]);

    const fetchDetails = async (page = 1, size = pageSize) => {
        try {
            const response = await axios.get(`${ENV.API_ROOT}/${controllerName}/GetAllDetailsByMasterId/${master?.masterId}`, {
                params: { page, limit: size, reverse: true } // Added reverse parameter
            });
            if (response.status === 200) {
                setDetails(response.data.details); // Assuming response contains `details` array
                setTotalPages(response.data.totalPages); // Assuming response contains `totalPages`
                setCurrentPage(page);
                setLoading(false); // Set loading to false after fetching details
                setLoadStatus(""); // Clear loading status message
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error fetching details. Please detail your administrator.' });
                setLoadStatus("Error! Please detail your administrator"); // Clear loading status message
            }

        } catch (error) {
            console.error('Error fetching details:', error);
            setToastMessage({ type: 'error', text: 'Server error. Please detail your administrator.' });
            setLoadStatus("Error! Please detail your administrator"); // Clear loading status message
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchDetails(page);
        }
    };

    const handlePageSizeChange = (e) => {
        console.log(e.target.value);
        const newSize = parseInt(e.target.value, 10);
        console.log(newSize);
        setPageSize(newSize);
        fetchDetails(1, newSize); // Reset to the first page when page size changes
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
		
	    if (!formData.detailId.trim()) newErrors.detailId = 'Detail Id is required';
        
	    if (!formData.masterId.trim()) newErrors.masterId = 'Master Id is required';
        
	    if (!formData.name.trim()) newErrors.name = 'Name is required';
        
	    if (!formData.descritpion.trim()) newErrors.descritpion = 'Descritpion is required';
        
	    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created By is required';
        
	    if (!formData.createdOn.trim()) newErrors.createdOn = 'Created On is required';
        
	    if (!formData.createdIP.trim()) newErrors.createdIP = 'Created I P is required';
        
	    if (!formData.modifiedBy.trim()) newErrors.modifiedBy = 'Modified By is required';
        
	    if (!formData.modifiedOn.trim()) newErrors.modifiedOn = 'Modified On is required';
        
	    if (!formData.modifiedIP.trim()) newErrors.modifiedIP = 'Modified I P is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleCreate = async () => {
        if (!validateForm()) return; // Stop if validation fails
        try {
            var response = await axios.post(`${ENV.API_ROOT}/${controllerName}/adddetail`, formData);
            if (response.status === 200) {
                setDetails([response.data, ...details]); // Update the state with the new detail
                setFormData(detailInitial); // Reset form data
                setModalType(null); // Reset modal type
                cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Detail added successfully!' });

                // Highlight the newly added row
                setHighlightedRow(response.data.detailId);
                setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error creating detail. Please detail your administrator.' });
            }
        } catch (error) {
            console.error('Error creating detail:', error);
            // Show error toast
            setToastMessage({ type: 'error', text: 'Server error. Please detail your administrator.' });
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return; // Stop if validation fails
        try {
            var response = await axios.put(`${ENV.API_ROOT}/${controllerName}/updatedetail/`, formData);
            if (response.status === 200) {
                const updatedDetails = details.map((detail) =>detail.detailId === formData.detailId ? response.data : detail
                );
                setDetails(updatedDetails); // Update the state with the modified detail
                setFormData(detailInitial); // Reset form data
                setModalType(null); // Reset modal type
                cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Detail updated successfully!' });
                setHighlightedRow(response.data.detailId);
                setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error updating detail. Please detail your administrator.' });
            }
            console.log(response.data);
            fetchDetails();
            setModalType(null);
        } catch (error) {
            console.error('Error updating detail:', error);
        }
    };

    const handleDelete = async () => {
        try {
            var response = await axios.delete(`${ENV.API_ROOT}/${controllerName}/deletedetail/${selectedDetail.detailId}`);
            if (response.status === 200) {
                const updatedDetails = details.filter((detail) =>detail.detailId !== selectedDetail.detailId);
                setDetails(updatedDetails); // Update the state with the modified detail
                //setFormData(detailInitial); // Reset form data
                setModalType(null); // Reset modal type
                cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Detail deleted successfully!' });
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error deleting detail. Please detail your administrator.' });
            }

        } catch (error) {
            console.error('Error deleting detail:', error);
        }
    };

    const generatePagination = () => {
        const maxButtons = window.innerWidth < 768 ? 3 : 5; // Limit buttons for small devices
        const buttons = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (startPage > 1) {
            buttons.push(1);
            if (startPage > 2) buttons.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) buttons.push('...');
            buttons.push(totalPages);
        }

        return buttons;
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Handle keyboard shortcut for creating a new detail
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'n') {
                setFormData(detailInitial);
                setErrors({});
                setModalType('create');
            }
        };

        window.addEventListener('keydown', handleKeyDown); // Attach the event listener
        return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup the event listener
    }, [master]); // Add `master` as a dependency to ensure the correct masterId is used

    return (
        <div className="container custom-container">
            {/* Toast Notification */}
            {toastMessage && (
                <div className={`toast-message ${toastMessage.type}`}>
                    {toastMessage.text}
                </div>
            )}

            {
                <div className="detail-table">
                    {master ? (
                        <><div className="breadcrumbs"><span>Home</span> &gt; <span>{master.name}</span></div><h3>Details for {master.name}</h3><p>{master.description}</p></>
                    ) : null}
                </div>
            }
            {details.length > 0 ? (
                <><button
                        className="custom-button primary"
                        onClick={() => (setFormData(detailInitial), setErrors({}), setModalType('create'))}
                        title="Shortcut: Ctrl+Alt+N" // Tooltip for the button
                    >
                        Add Detail</button><div className='table-section'><div className="custom-table-container"><table className="custom-table"><thead><tr><th>Detail Id</th><th>Master Id</th><th>Name</th><th>Descritpion</th><th>Created By</th><th>Created On</th><th>Created I P</th><th>Modified By</th><th>Modified On</th><th>Modified I P</th><th className="sticky-column">Actions</th></tr></thead><tbody>
                                    {details.map((detail) => (
                                        <tr
                                            key={detail.detailId}
                                            className={highlightedRow === detail.detailId ? 'highlight-row' : ''}
                                        ><td>{detail.detailId}</td><td>{detail.masterId}</td><td>{detail.name}</td><td>{detail.descritpion}</td><td>{detail.createdBy}</td><td>{detail.createdOn}</td><td>{detail.createdIP}</td><td>{detail.modifiedBy}</td><td>{detail.modifiedOn}</td><td>{detail.modifiedIP}</td><td className="sticky-column"><button className="custom-button info" onClick={() => { setSelectedDetail(detail); setModalType("read") }}>View</button><button className="custom-button warning" onClick={() => { setSelectedDetail(detail); setFormData(detail); setErrors({}); setModalType("update") }}>Edit</button><button className="custom-button danger" onClick={() => { setSelectedDetail(detail); setModalType("delete"); }}>Delete</button></td></tr>
                                    ))}
                                </tbody></table></div><div className='pagination-sticky'><div className="pagination-controls"><div className="page-size-selector"><label htmlFor="pageSize">Page Size:</label><select
                                        id="pageSize"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                    ><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option></select></div><div className="pagination"><button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                    {generatePagination().map((page, index) =>
                                        page === '...' ? (
                                            <span key={index}>...</span>
                                        ) : (
                                            <button
                                                key={index}
                                                className={page === currentPage ? 'active' : ''}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button></div></div></div></div></>

            ) : (
                master ? (
                    loading ? (<div className="loading" style={{ color: loadstatus === "Loading..." ? "blue" : "red" }}>{loadstatus}</div>) : (
                        <div className="no-master-selected"><p>No details for {master?.name}</p><button
                                className="custom-button primary"
                                onClick={() => (setFormData(detailInitial), setErrors({}), setModalType('create'))}
                                title="Shortcut: Ctrl+Alt+N" // Tooltip for the button
                            >
                                Add Detail</button></div>)) : (<div className="no-master-selected"><p>Select a master item to view details</p></div>)

            )}



            {/* Modal for Create/Update */}
            {modalType === 'create' || modalType === 'update' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>{modalType === 'create' ? 'Add Detail' : 'Edit Detail'}</h2><br /><form><div style={{overflowY:"auto", maxHeight:'400px'}}><div className="form-group floating-label"><input
                                        name="detailId"
                                        value={formData.detailId}
                                        onChange={handleInputChange}
                                        placeholder="Enter Detail Id"
                                        required
                                    /><label>Name</label>
                                    {errors.detailId&&<span className="error-message">{errors.detailId}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="masterId"
                                        value={formData.masterId}
                                        onChange={handleInputChange}
                                        placeholder="Enter Master Id"
                                        required
                                    /><label>Name</label>
                                    {errors.masterId&&<span className="error-message">{errors.masterId}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Name"
                                        required
                                    /><label>Name</label>
                                    {errors.name&&<span className="error-message">{errors.name}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="descritpion"
                                        value={formData.descritpion}
                                        onChange={handleInputChange}
                                        placeholder="Enter Descritpion"
                                        required
                                    /><label>Name</label>
                                    {errors.descritpion&&<span className="error-message">{errors.descritpion}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="createdBy"
                                        value={formData.createdBy}
                                        onChange={handleInputChange}
                                        placeholder="Enter Created By"
                                        required
                                    /><label>Name</label>
                                    {errors.createdBy&&<span className="error-message">{errors.createdBy}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="createdOn"
                                        value={formData.createdOn}
                                        onChange={handleInputChange}
                                        placeholder="Enter Created On"
                                        required
                                    /><label>Name</label>
                                    {errors.createdOn&&<span className="error-message">{errors.createdOn}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="createdIP"
                                        value={formData.createdIP}
                                        onChange={handleInputChange}
                                        placeholder="Enter Created I P"
                                        required
                                    /><label>Name</label>
                                    {errors.createdIP&&<span className="error-message">{errors.createdIP}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="modifiedBy"
                                        value={formData.modifiedBy}
                                        onChange={handleInputChange}
                                        placeholder="Enter Modified By"
                                        required
                                    /><label>Name</label>
                                    {errors.modifiedBy&&<span className="error-message">{errors.modifiedBy}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="modifiedOn"
                                        value={formData.modifiedOn}
                                        onChange={handleInputChange}
                                        placeholder="Enter Modified On"
                                        required
                                    /><label>Name</label>
                                    {errors.modifiedOn&&<span className="error-message">{errors.modifiedOn}</span>}
                                </div><div className="form-group floating-label"><input
                                        name="modifiedIP"
                                        value={formData.modifiedIP}
                                        onChange={handleInputChange}
                                        placeholder="Enter Modified I P"
                                        required
                                    /><label>Name</label>
                                    {errors.modifiedIP&&<span className="error-message">{errors.modifiedIP}</span>}
                                </div></div><br /><button type="button" onClick={modalType === 'create' ? handleCreate : handleUpdate}>
                                {modalType === 'create' ? 'Create' : 'Update'}
                            </button><button type="button" onClick={() => setModalType(null)}>Cancel</button></form></div></>
            ) : null}

            {/* Modal for Delete */}
            {modalType === 'delete' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>Delete Detail</h2><hr /><p>Are you sure you want to delete selected record?</p><p><strong>detailId:</strong> {selectedDetail?.detailId}</p><p><strong>masterId:</strong> {selectedDetail?.masterId}</p><p><strong>name:</strong> {selectedDetail?.name}</p><p><strong>descritpion:</strong> {selectedDetail?.descritpion}</p><p><strong>createdBy:</strong> {selectedDetail?.createdBy}</p><p><strong>createdOn:</strong> {selectedDetail?.createdOn}</p><p><strong>createdIP:</strong> {selectedDetail?.createdIP}</p><p><strong>modifiedBy:</strong> {selectedDetail?.modifiedBy}</p><p><strong>modifiedOn:</strong> {selectedDetail?.modifiedOn}</p><p><strong>modifiedIP:</strong> {selectedDetail?.modifiedIP}</p><hr /><button onClick={handleDelete}>Yes</button><button onClick={() => setModalType(null)}>No</button></div></>
            ) : null}

            {/* Modal for Read */}
            {modalType === 'read' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>Detail Details</h2><hr /><p><strong>detailId:</strong> {selectedDetail?.detailId}</p><p><strong>masterId:</strong> {selectedDetail?.masterId}</p><p><strong>name:</strong> {selectedDetail?.name}</p><p><strong>descritpion:</strong> {selectedDetail?.descritpion}</p><p><strong>createdBy:</strong> {selectedDetail?.createdBy}</p><p><strong>createdOn:</strong> {selectedDetail?.createdOn}</p><p><strong>createdIP:</strong> {selectedDetail?.createdIP}</p><p><strong>modifiedBy:</strong> {selectedDetail?.modifiedBy}</p><p><strong>modifiedOn:</strong> {selectedDetail?.modifiedOn}</p><p><strong>modifiedIP:</strong> {selectedDetail?.modifiedIP}</p><hr /><button onClick={() => setModalType(null)}>Close</button></div></>
            ) : null}

        </div>


    );
};

export default DetailTable;

  