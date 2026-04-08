import React, {useState, useEffect} from "react";
import AdministratorNavbar from './AdministratorNavbar';
import api from "../../services/api";

function AdministratorTechnicians() {
    const [technicians, setTechnicians] = useState([]);const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [speciality, setSpeciality] = useState('');

    useEffect(() => {loadTechnicians(); }, []);

    const loadTechnicians = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/technicians');
            setTechnicians(response.data);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name || !email || !phone || !password) {
            setFormError('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/users/technicians', { name, email, phone, password, speciality });
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setSpeciality('');
            setShowForm(false);
            await loadTechnicians();
        } catch (error) {
            setFormError('Error creating technician. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    const handleDelete = async(userId) => {
        if(!window.confirm('delete this technician'))return;
            try {
                const response = await api.delete(`/users/${userId}`);
                await loadTechnicians();
            } catch (error) {
                console.error(error);
            }
    };

    return(
        <div style={{ display: 'flex'}}>
            <AdministratorNavbar />
            <div style={{marginLeft: '220px', padding: '32px', width: '50%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="client-title">Technicians</h2>
                    <button className="submit-btn btn-small" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add Technician'}
                    </button>
                </div>

                {/* Formulaire ajout technicien */}
                {showForm && (
                    <div className="technician-detail" style={{ marginBottom: '24px' }}>
                        <h3 style={{ color: '#38BDF8', marginBottom: '16px' }}>New Technician</h3>
                        {formError && <div className="form-error">{formError}</div>}
                        <form onSubmit={handleSubmit} className="request-form">
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-input" placeholder="John Doe"
                                    value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" placeholder="john@example.com"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input type="tel" className="form-input" placeholder="(514) 010-4568"
                                    value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-input" placeholder="..........."
                                    value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Speciality</label>
                                <select className="form-input" value={speciality} onChange={e => setSpeciality(e.target.value)}>
                                    <option value="">Select a speciality</option>
                                    <option value="AC">AC</option>
                                    <option value="heating">Heating</option>
                                    <option value="refrigeration">Refrigeration</option>
                                    <option value="ventilation">Ventilation</option>
                                    <option value="appliance">Appliance</option>
                                    <option value="inspection">Inspection</option>
                                </select>
                            </div>
                            <button className="submit-btn" type="submit" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Technician'}
                            </button>
                        </form>
                    </div>
                )}
                
                {loading ? <div className="loading">Loading...</div> :
                    technicians.length === 0 ? <div className="empty"><p>No technicians found.</p></div> :
                    technicians.map(t => (
                        <div key={t._id} className="request-card">
                            <div className="request-card-header">
                                <span className="request-type">{t.name}</span>
                                <span className="status-badge">technician</span>
                            </div>

                            <div className="request-card-body">
                                <p><strong>Email:</strong> {t.email}</p>
                                <p><strong>Phone:</strong> {t.phone}</p>
                            </div>

                            <div className="request-card-footer">
                                <button className="submit-btn"
                                    style={{ background: '#ef4444', fontSize: '12px', padding: '6px 14px' }}
                                    onClick={() => handleDelete(t._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }        
            </div>
        </div>
    );

    }
    export default AdministratorTechnicians; 
