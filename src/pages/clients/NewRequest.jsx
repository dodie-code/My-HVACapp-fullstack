import React, { useState } from "react";
import { useMy } from "../../context/MyContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function NewRequest() {
    const { user } = useMy();
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!type || !description || !address || !date || !phone) {
            setFormError('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/requests', { type, urgency, description, address, phone, date });
            navigate('/client-dashboard');
        } catch (error) {
            setFormError('Error submitting request, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="clientdashboard-container">
            <div className="clientbar">
                <div className="clienbar-logo">AppliancePro</div>
                <div className="clientbaruser">
                    <p className="clientbar-role">Client</p>
                    <p className="clientbar-name">Welcome, {user?.name || 'client'}!</p>
                    <button className="clientbar-btn" onClick={() => navigate('/client-dashboard')}>← Back</button>
                </div>
            </div>

            <div className="client-content">
                <div className="client-new">
                    <h2 className="client-title">New Service Request</h2>
                    <p className="client-sub">Describe your problem and a technician will be assigned</p>

                    {formError && <div className="form-error">{formError}</div>}

                    <form onSubmit={handleSubmit} className="request-form">
                        <div className="form-group">
                            <label className="form-label">Service Type</label>
                            <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                                <option value="">Select a service</option>
                                <option value="AC">AC</option>
                                <option value="heating">Heating</option>
                                <option value="refrigeration">Refrigeration</option>
                                <option value="ventilation">Ventilation</option>
                                <option value="appliance">Appliance</option>
                                <option value="inspection">Inspection</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Urgency</label>
                            <select className="form-input" value={urgency} onChange={e => setUrgency(e.target.value)}>
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-input" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-input" placeholder="(514) 010-4568" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" placeholder="Describe your problem..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <button className="submit-btn" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewRequest;