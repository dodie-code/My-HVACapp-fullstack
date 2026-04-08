import React, {useState, useEffect} from "react";
import AdministratorNavbar from "./AdministratorNavbar"
import api from "../../services/api";

function AdministratorRequests() {

     const [requests, setRequests] = useState([]);
     const [technicians, setTechnicians] = useState([]);
     const [loading, setLoading ] = useState(false);
     const [selectedRequest, setSelectedRequest] = useState(null);
     

     useEffect(() => {
        loadData();
     }, []);

     const loadData = async () => {
        setLoading(true);
        try{
            const [requestResponse, usersResponse] = await Promise.all([
                api.get('/requests'),
                api.get('/users')
            ])
            setRequests(requestResponse.data);
            setTechnicians(usersResponse.data.filter(u => u.role ==='technician'))
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
     };


     const handleAssign = async( requestId, technicianId) => {
        try {
            await api.put(`/requests/${requestId}/assign`, { technicianId});
            await loadData();
        } catch(error) {
            console.error(error);
        }
     };

     const handleStatus = async (requestId, status) => {
        try {
            await api.put(`/requests/${requestId}/status`, {status});
            await loadData();
            setSelectedRequest(prev => ({...prev, status}));
        } catch(error) {
            console.error(error);
        }
     };
     const handlePayment = async (requestId, payment) => {
        try {
            await api.put(`/requests/${requestId}/payment`, {payment});
            await loadData();
            setSelectedRequest(prev => ({...prev, payment}));
        } catch(error) {
            console.error(error);
        }
     };

return (
        <div style={{ display: 'flex' }}>
            <AdministratorNavbar />
            <div style={{ marginLeft: '220px', padding: '32px', width: '100%' }}>
                <div className="technician-content">
                    <div className="technician-list">
                        <h2 className="client-title">All Requests</h2>
                        {loading ? <div className="loading">Loading...</div> :
                            requests.map(r => (
                                <div key={r._id}
                                    className={`request-card ${selectedRequest?._id === r._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRequest(r)}
                                    style={{ cursor: 'pointer' }}>
                                    <div className="request-card-header">
                                        <span className="request-type">{r.type}</span>
                                        <span className={`status-badge status-${r.status?.replace(' ', '-').toLowerCase()}`}>{r.status}</span>
                                    </div>
                                    <div className="request-card-body">
                                        <p><strong>Client:</strong> {r.client?.name}</p>
                                        <p><strong>Date:</strong> {r.date?.slice(0, 10)}</p>
                                        <p><strong>Technician:</strong> {r.technician?.name || 'Not assigned'}</p>
                                    </div>
                                    <div className="request-card-footer">
                                        <span className={`payment-badge ${r.payment === 'paid' ? 'paid' : 'unpaid'}`}>
                                            {r.payment === 'paid' ? 'paid' : 'unpaid'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {selectedRequest && (
                        <div className="tech-detail">
                            <h2 className="client-title">Request Detail</h2>

                            <div className="detail-section">
                                <h3>Client Info</h3>
                                <p><strong>Name:</strong> {selectedRequest.client?.name}</p>
                                <p><strong>Email:</strong> {selectedRequest.client?.email}</p>
                                <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                                <p><strong>Address:</strong> {selectedRequest.address}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Request Info</h3>
                                <p><strong>Type:</strong> {selectedRequest.type}</p>
                                <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
                                <p><strong>Date:</strong> {selectedRequest.date?.slice(0, 10)}</p>
                                <p><strong>Description:</strong> {selectedRequest.description}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Assign Technician</h3>
                                <select className="form-input"
                                    value={selectedRequest.technician?._id || ''}
                                    onChange={e => handleAssign(selectedRequest._id, e.target.value)}>
                                    <option value="">Select a technician</option>
                                    {technicians.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="detail-section">
                                <h3>Update Status</h3>
                                <select className="form-input"
                                    value={selectedRequest.status}
                                    onChange={e => handleStatus(selectedRequest._id, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="detail-section">
                                <h3>Payment</h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="submit-btn" onClick={() => handlePayment(selectedRequest._id, 'paid')}>Mark as Paid</button>
                                    <button className="submit-btn" onClick={() => handlePayment(selectedRequest._id, 'unpaid')}>Mark as Unpaid</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdministratorRequests;