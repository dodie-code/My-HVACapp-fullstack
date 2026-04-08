import React, {useState, useEffect} from "react";
import { useMy } from "../../context/MyContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function TechnicianDashboard() {
    const{user, logout} =  useMy();
    const navigate = useNavigate();


     const [requests, setRequests] = useState([]);
     const [loading, setLoading ] = useState(false);
     const [selectedRequest, setSelectedRequest] = useState(null);
     const [note , setNote] = useState('');
     const [submittingNote, setSubmittingNote] = useState(false);
     const [updatingStatus, setUpdatingStatus] = useState(false);

     useEffect(() => {
        loadRequests();
     }, []);

     const handleLogout = () =>{
        logout();
        navigate('/login')
     };

     const loadRequests = async () => {
        setLoading(true);
        try{
            const response = await api.get('/request/assigned')
            setRequests(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
     };


     const handleStatusChange = async( requestId, newStatus) => {
        setUpdatingStatus(true)
        try {
            await api.put(`/requests/${requestId}/status`, {status: newStatus});
            await loadRequests();
            if(selectedRequest?._id === requestId) {
                setSelectedRequest(prev => ({...prev, Status: newStatus}));
            }
        } catch(error) {
            console.error(error);
        } finally {
            setUpdatingStatus(false);
        }
     };

     const handleAddNote = async (requestId) => {
        if(!note) return;
        setSubmittingNote(true);
        try {
            await api.put(`/requests/${requestId}/notes`, {text: note});
            setNote('');
            await loadRequests();
        } catch(error) {
            console.error(error);
        } finally {
            setSubmittingNote(false);
        }
     };


     if(!user) return <div>Loading...</div>;
     return(
        <div className="clientdashboard-container">
            <div className="clientbar">
                <div className="clienbar-logo">AppliancePro</div>
                <div className="clientbaruser">
                <p className="clientbar-role">Client</p>
                <p className="clientbar-name">Welcome, {user?.name || 'technician'}!</p>
                <button className="clientbar-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="tecnician-content">
                <div className="technician-list">
                    <h2 className="client-title">Assigned requests</h2>
                    {loading? (
                        <div className="loadind"> loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="empty"> <p>No request Assigned yet</p></div>
                    ): (
                        requests.map(r => (
                            <div key={r._id} className={`request-card ${selectedRequest?._id === r._id? 'selected' : ''}`} onCclick ={() => setSelectedRequest(r)}style = {{cursor: 'pointer'}}>
                                <div className="request_card_header">
                                    <span className="request-type">{r.type}</span>
                                    <span className={`status-badge status_${r.status?.replace(' ', '-').tolowerCase()}`}>{r.status}</span>
                                </div>

                                <div className="request_card_body">
                                    <p><strong>Client</strong>{r.client?.name}</p>
                                    <p><strong>Address</strong>{r.address}</p>
                                    <p><strong>Date</strong>{r.date?.slice(0, 10)}</p>
                                    <p><strong>Urgency</strong>{r.urgency}</p>
                                    
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedRequest && (
                    <div className="technician-detail">
                        <h2 className="client-title">Request Detail</h2>

                        <div className="detail-section">
                            <h3>Client Information</h3>
                            <p><strong>Name</strong> {selectedRequest.client?.name}</p>
                            <p><strong>Email</strong> {selectedRequest.client?.email}</p>
                            <p><strong>Phone</strong> {selectedRequest.phone}</p>
                            <p><strong>Address</strong> {selectedRequest.address}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Request information</h3>
                            <p><strong>type</strong> {selectedRequest.type}</p>
                            <p><strong>urgnecy</strong> {selectedRequest.urgency}</p>
                            <p><strong>Date</strong> {selectedRequest.date?.slice(0, 10)}</p>
                            <p><strong>Description</strong> {selectedRequest.description}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Update Status</h3>
                            <select className="form-input" value={selectedRequest.status} onChange={e => handleStatusChange(selectedRequest._id, e.target.value)} disabled={updatingStatus}>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="detail-section">
                            <h3>Add Note</h3>
                            <textarea className="form-textarea" placeholder="Write a note ..." value={note} onChange={e => setNote(e.target.value)}></textarea>

                            <button className="submit-btn" onClick={() => handleAddNote(selectedRequest._id)} disabled= {submittingNote}>
                                {submittingNote ? 
                                'Adding...' : 'Add Note'}
                            </button>
                        </div>

                        {selectedRequest.notes?.length > 0 && (
                            <div className="detail_section">
                                <h3>Notes</h3>
                                {selectedRequest.notes.map((n, i) =>(
                                    <div key={i} className="note-item">
                                        <p>{n.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
     )
}

export default TechnicianDashboard;