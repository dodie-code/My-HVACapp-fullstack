import React, {useState, useEffect} from "react";
import { useMy } from "../../context/MyContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ClientDashboard() {
const { user, logout } = useMy();
const navigate = useNavigate();



const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(false);


useEffect(() => {
        loadRequests();
    }, []);


const handleLogout = () =>{
    logout();
    navigate('/login');
};

const loadRequests = async () => {
    setLoading(true);
    try {
        const response = await api.get('/requests/my');
        console.log("REQUESTS:", response.data);
        setRequests(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};


if (!user) {
    return <div>Loading...</div>
}

return(
    <div className="clientdashboard-container">
        <div className="clientbar">
            <div className="clienbar-logo">AppliancePro</div>
            <div className="clientbaruser">
                <p className="clientbar-role">Client</p>
                <p className="clientbar-name">Welcome, {user?.name || 'client'}!</p>
                <button className="clientbar-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>

        <div className="client-tabs">
            <button className="client-tab active">My Request</button>
            <button className="client-tab" onClick={() => navigate('/new-request')}>
                    + New Request
                </button>
        </div>

        <div className="client-content">
                <div className="client-new">
                    <h2 className="client-title"> My Requests</h2>
                    <p className="client-sub">track the status of all your service requests</p>

                    {loading ? (
                        <div className="loading"> Loading...</div>
                    ) : requests.length === 0 ? (
                        <div className="empty">
                            <p> No requests yet.</p>
                            <button className="submit-btn" onClick={() => navigate('/new-request')}> Create your first request
                            </button>
                        </div>

                    ) : (
                        requests.map(r =>(
                            <div key={r._id} className="request-card">
                                <div className="request-card-header">
                                    <span className="request-type">{r.type}</span>
                                    <span className={`status-bagde status-${r.status?.replace(' ', '-').toLowerCase()}`}>
                                    {r.status}
                                    </span>
                                </div>

                                <div className="request-card-body">
                                    <p>{r.address}</p>
                                    <p>{r.date?.slice(0, 10)}</p>
                                    <p>{r.urgency}</p>
                                    {r.technician && <p> {r.technician.name}</p>}
                                    <p className="request-desc">{r.description}</p>
                                </div>

                                <div className="request-card-footer">
                                    <span className={`payment-badge ${r.payment === 'paid' ? 'paid' : 'unpaid'}`}>
                                        {r.payment === 'paid' ? 'paid' : 'unpaid'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
        </div>
    </div>
  );
}
export default ClientDashboard;


