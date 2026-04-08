import react, {useState, useEffect } from "react";
import AdministratorNavbar from "./AdministratorNavbar";
import api from "../../services/api";

function AdministratorClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async() => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setClients(response.data.filter(u => u.role === 'client'));
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
       if(!window.confirm('delete this client?')) return;
       try {
            await api.delete(`/users/${userId}`);
            await loadClients();
           } catch (error) {
              console.error(error); 
            }
    };

    return(
            <div style={{ display: 'flex'}}>
                <AdministratorNavbar />
                <div style={{marginLeft: '220px', padding: '32px', width: '35%' }}>
                    <h2 className="client-title">Clients</h2>
                    {loading ? <div className="loading">Loading...</div> :
                        clients.length === 0 ? <div className="empty"><p>No clients found.</p></div> :
                        clients.map(c => (
                            <div key={c._id} className="request-card">
                                <div className="request-card-header">
                                    <span className="request-type">{c.name}</span>
                                    <span className="status-badge">client</span>
                                </div>
    
                                <div className="request-card-body">
                                    <p><strong>Email:</strong> {c.email}</p>
                                    <p><strong>Phone:</strong> {c.phone}</p>
                                </div>
    
                                <div className="request-card-footer">
                                    <button className="submit-btn btn-small" 
                                        style={{ background: '#ef4444', fontSize: '12px', padding: '6px 14px' }}
                                        onClick={() => handleDelete(c._id)}>
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

export default AdministratorClients;