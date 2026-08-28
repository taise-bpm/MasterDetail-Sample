
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ENV from '../env';
import '../Appify.css';

const MasterTable = ({ onSelect, selectedMasterId }) => {
const controllerName = 'MasterDetail'; 
const masterInitial = {
	  masterId: 0,name: '',descritption: '',createdBy: 0,createdOn: 0,createdIP: 0,modifiedBy: 0,modifiedOn: 0,modifiedIP: 0
	    
	};
	  
	const [masters, setMasters] = useState([]);
    const [filteredMasters, setFilteredMasters] = useState([]); // State for filtered masters
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [activeOptions, setActiveOptions] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const scrollContainerRef = useRef(null);

    const [modalType, setModalType] = useState(null); // 'create', 'read', 'update', 'delete'
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [formData, setFormData] = useState(masterInitial);
    const [loading, setLoading] = useState(false); // Default page size
    const [loadstatus, setLoadStatus] = useState(""); // Default page size
    const [errors, setErrors] = useState({}); // State to track validation errors
    const [toastMessage, setToastMessage] = useState(null); // State for toast message
    const [highlightedRow, setHighlightedRow] = useState(null); // State for highlighted row

    useEffect(() => {
        fetchMasters(1, searchQuery); // Ensure initial data is loaded
    }, [searchQuery]);

    useEffect(() => {
        if (page > 1) {
            fetchMasters(page, searchQuery); // Fetch additional pages when `page` changes
        }
    }, [page]);
    useEffect(() => {
            if (toastMessage) {
                const timer = setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
                return () => clearTimeout(timer);
            }
        }, [toastMessage]);

    const fetchMasters = async (page, search = '', size = 20) => {
        try {
            const response = await axios.get(`${ENV.API_ROOT}/${controllerName}/GetAllMasters`, {
                params: { page, limit: size, search, reverse: true } // Include search query
            });
            if (response.data.masters.length > 0) {
                setMasters((prevMasters) =>
                    page === 1 ? response.data.masters : [...prevMasters, ...response.data.masters]
                );
                setFilteredMasters((prevMasters) =>
                    page === 1 ? response.data.masters : [...prevMasters, ...response.data.masters]
                );
            } else {
                setHasMore(false); // No more data to load
                if (page === 1) setFilteredMasters([]); // Clear filtered masters if no results
            }
        } catch (error) {
            console.error('Error fetching masters:', error);
        }
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            setPage((prevPage) => prevPage + 1); // Load next page
        }
    };

    const handleSelect = (master) => {
        onSelect(master);
        setActiveOptions(null);
    };

    const toggleOptions = (id) => {
        setActiveOptions(activeOptions === id ? null : id);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to the first page when search query changes
        setHasMore(true); // Reset hasMore to allow fetching new results
    };
    const handleCreate = async () => {
        if (!validateForm()) return; // Stop if validation fails
        try {
            var response = await axios.post(`${ENV.API_ROOT}/${controllerName}/addMaster`, formData);
            if (response.status === 200) {
                setMasters([response.data, ...masters]); // Update the state with the new detail
                setFilteredMasters([response.data, ...filteredMasters]); // Update the filtered masters
                setFormData(masterInitial); // Reset form data
                setModalType(null); // Reset modal type
                // cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Master added successfully!' });

                // Highlight the newly added row
                setHighlightedRow(response.data.masterId);
                setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error creating master. Please detail your administrator.' });
            }
        } catch (error) {
            console.error('Error creating master:', error);
            // Show error toast
            setToastMessage({ type: 'error', text: 'Server error. Please detail your administrator.' });
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return; // Stop if validation fails
        try {
            var response = await axios.put(`${ENV.API_ROOT}/${controllerName}/updatemaster/`, formData);
            if (response.status === 200) {
                const updatedMasters = masters.map((master) =>master.masterId === formData.masterId ? response.data : master
                );
                setMasters(updatedMasters); // Update the state with the modified detail
                setFilteredMasters(updatedMasters); // Update the filtered masters
                setFormData(masterInitial); // Reset form data
                setModalType(null); // Reset modal type
                // cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Master updated successfully!' });
                setHighlightedRow(response.data.masterId);
                setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error updating master. Please detail your administrator.' });
            }
            console.log(response.data);
            fetchMasters();
            setModalType(null);
        } catch (error) {
            console.error('Error updating master:', error);
        }
    };

    const handleDelete = async () => {
        try {
            var response = await axios.delete(`${ENV.API_ROOT}/${controllerName}/deletemaster/${selectedMaster.masterId}`);
            if (response.status === 200) {
                const updatedMasters = masters.filter((detail) => detail.masterId !== selectedMaster.masterId);
                setMasters(updatedMasters); // Update the state with the modified detail
                setFilteredMasters(updatedMasters); // Update the filtered masters
                //setFormData(detail); // Reset form data
                setModalType(null); // Reset modal type
                // cleanupModal(); // Explicitly clean up the modal

                // Show success toast
                setToastMessage({ type: 'success', text: 'Master deleted successfully!' });
            } else {
                // Show error toast
                setToastMessage({ type: 'error', text: 'Error deleting master. Please detail your administrator.' });
            }

        } catch (error) {
            console.error('Error deleting master:', error);
        }
    };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const validateForm = () => {
	  const newErrors = {};
	  
		  if (!formData.masterId.trim()) newErrors.masterId = 'Master Id is required';
	  
		  if (!formData.name.trim()) newErrors.name = 'Name is required';
	  
		  if (!formData.descritption.trim()) newErrors.descritption = 'Descritption is required';
	  
		  if (!formData.createdBy.trim()) newErrors.createdBy = 'Created By is required';
	  
		  if (!formData.createdOn.trim()) newErrors.createdOn = 'Created On is required';
	  
		  if (!formData.createdIP.trim()) newErrors.createdIP = 'Created I P is required';
	  
		  if (!formData.modifiedBy.trim()) newErrors.modifiedBy = 'Modified By is required';
	  
		  if (!formData.modifiedOn.trim()) newErrors.modifiedOn = 'Modified On is required';
	  
		  if (!formData.modifiedIP.trim()) newErrors.modifiedIP = 'Modified I P is required';
	  
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    return (
        <>
            {/* Toast Notification */}
            {toastMessage && (
                <div className={`toast-message ${toastMessage.type}`}>
                    {toastMessage.text}
                </div>
            )}
            <div className="master-table"><h3 style={{ marginLeft: '40px' }}>Master Table</h3><button
                    className="custom-button primary"
                    onClick={() => (setFormData(masterInitial), setErrors({}), setModalType('create'))}

                >
                    Add Detail
                </button><input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                /><p className="master-count">Count: {filteredMasters.length}</p> {/* Display count */}
                <div
                    className="master-table-scrollable"
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                >
                    {filteredMasters.length > 0 ? (
                        <ul>
                            {filteredMasters.map((master, index) => (
                                <li
                                    key={`${master.masterId}-${index}`} // Ensure unique keys
                                    onClick={() => handleSelect(master)}
                                    className={master.masterId === selectedMasterId ? 'active' : ''}
                                ><div className={highlightedRow === master.masterId ? 'master-tile highlight-row' : 'master-tile'}
                                        
                                    ><div className="leading-icon">📄</div><div className="content"><div className="title">{master.masterName}</div><div className="description">{master.masterDescription}</div></div><div className="options"><button
                                                className="options-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleOptions(master.masterId);
                                                }}
                                            >
                                                ⋮
                                            </button>
                                            {activeOptions === master.masterId&& (
                                                <div className="options-menu"><button className="custom-button info" onClick={() => { setSelectedMaster(master); setModalType("read") }}>View</button><button className="custom-button warning" onClick={() => { setSelectedMaster(master); setFormData(master); setErrors({}); setModalType("update") }}>Edit</button><button className="custom-button danger" onClick={() => { setSelectedMaster(master); setModalType("delete"); }}>Delete</button></div>
                                            )}
                                        </div></div></li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-records">No records found</p>
                    )}
                    {!hasMore && filteredMasters.length > 0 && (
                        <p className="no-more-data">No more data to load</p>
                    )}
                </div></div>
            {/* Modal for Create/Update */}
            {modalType === 'create' || modalType === 'update' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>{modalType === 'create' ? 'Add Master' : 'Edit Master'}</h2><br /><form><div style={{ overflowY: "auto", maxHeight: '400px' }}><div className="form-group floating-label"><input
								          name="masterId"
								          value={formData.masterId}
								          onChange={handleInputChange}
								          placeholder="Enter Master Id"
								          required
								      /><label>Master Id</label>
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
								          name="descritption"
								          value={formData.descritption}
								          onChange={handleInputChange}
								          placeholder="Enter Descritption"
								          required
								      /><label>Descritption</label>
								  {errors.descritption&&<span className="error-message">{errors.descritption}</span>}
								  </div><div className="form-group floating-label"><input
								          name="createdBy"
								          value={formData.createdBy}
								          onChange={handleInputChange}
								          placeholder="Enter Created By"
								          required
								      /><label>Created By</label>
								  {errors.createdBy&&<span className="error-message">{errors.createdBy}</span>}
								  </div><div className="form-group floating-label"><input
								          name="createdOn"
								          value={formData.createdOn}
								          onChange={handleInputChange}
								          placeholder="Enter Created On"
								          required
								      /><label>Created On</label>
								  {errors.createdOn&&<span className="error-message">{errors.createdOn}</span>}
								  </div><div className="form-group floating-label"><input
								          name="createdIP"
								          value={formData.createdIP}
								          onChange={handleInputChange}
								          placeholder="Enter Created I P"
								          required
								      /><label>Created I P</label>
								  {errors.createdIP&&<span className="error-message">{errors.createdIP}</span>}
								  </div><div className="form-group floating-label"><input
								          name="modifiedBy"
								          value={formData.modifiedBy}
								          onChange={handleInputChange}
								          placeholder="Enter Modified By"
								          required
								      /><label>Modified By</label>
								  {errors.modifiedBy&&<span className="error-message">{errors.modifiedBy}</span>}
								  </div><div className="form-group floating-label"><input
								          name="modifiedOn"
								          value={formData.modifiedOn}
								          onChange={handleInputChange}
								          placeholder="Enter Modified On"
								          required
								      /><label>Modified On</label>
								  {errors.modifiedOn&&<span className="error-message">{errors.modifiedOn}</span>}
								  </div><div className="form-group floating-label"><input
								          name="modifiedIP"
								          value={formData.modifiedIP}
								          onChange={handleInputChange}
								          placeholder="Enter Modified I P"
								          required
								      /><label>Modified I P</label>
								  {errors.modifiedIP&&<span className="error-message">{errors.modifiedIP}</span>}
								  </div></div><br /><button type="button" onClick={modalType === 'create' ? handleCreate : handleUpdate}>
                                {modalType === 'create' ? 'Create' : 'Update'}
                            </button><button type="button" onClick={() => setModalType(null)}>Cancel</button></form></div></>
            ) : null}

            {/* Modal for Delete */}
            {modalType === 'delete' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>Delete Detail</h2><hr /><p>Are you sure you want to delete selected record?</p><p><strong>Id:</strong> {selectedMaster?.masterId}</p><p><strong>Id:</strong> {selectedMaster?.name}</p><p><strong>Id:</strong> {selectedMaster?.descritption}</p><p><strong>Id:</strong> {selectedMaster?.createdBy}</p><p><strong>Id:</strong> {selectedMaster?.createdOn}</p><p><strong>Id:</strong> {selectedMaster?.createdIP}</p><p><strong>Id:</strong> {selectedMaster?.modifiedBy}</p><p><strong>Id:</strong> {selectedMaster?.modifiedOn}</p><p><strong>Id:</strong> {selectedMaster?.modifiedIP}</p><hr /><button onClick={handleDelete}>Yes</button><button onClick={() => setModalType(null)}>No</button></div></>
            ) : null}

            {/* Modal for Read */}
            {modalType === 'read' ? (
                <><div className="popup-modal-overlay" onClick={() => setModalType(null)}></div><div className="popup-modal"><button className="popup-close-button" onClick={() => setModalType(null)}>×</button><h2>Detail Details</h2><hr /><p><strong>Id:</strong> {selectedMaster?.masterId}</p><p><strong>Id:</strong> {selectedMaster?.name}</p><p><strong>Id:</strong> {selectedMaster?.descritption}</p><p><strong>Id:</strong> {selectedMaster?.createdBy}</p><p><strong>Id:</strong> {selectedMaster?.createdOn}</p><p><strong>Id:</strong> {selectedMaster?.createdIP}</p><p><strong>Id:</strong> {selectedMaster?.modifiedBy}</p><p><strong>Id:</strong> {selectedMaster?.modifiedOn}</p><p><strong>Id:</strong> {selectedMaster?.modifiedIP}</p><hr /><button onClick={() => setModalType(null)}>Close</button></div></>
            ) : null}
        </>
    );
};
export default MasterTable;

  