import React, { useState, useEffect } from "react";
import AdministratorNavbar from "./AdministratorNavbar";
import api from "../../services/api";

function AdministratorDashboard() {
    const [stats, setStats] = useState({
        total: 0, pending: 0, inProgress: 0, completed: 0, unpaid: 0,
        totalClients: 0, totalTechnicians: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [requestResponse, usersResponse] = await Promise.all([
                api.get('/requests'),
                api.get('/users')
            ]);
            const requests = requestResponse.data;
            const users = usersResponse.data;
            setStats({
                total: requests.length,
                pending: requests.filter(r => r.status === 'pending').length,
                inProgress: requests.filter(r => r.status === 'in progress').length,
                completed: requests.filter(r => r.status === 'completed').length,
                unpaid: requests.filter(r => r.payment !== 'paid').length,
                totalClients: users.filter(u => u.role === 'client').length,
                totalTechnicians: users.filter(u => u.role === 'technician').length,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <AdministratorNavbar />
            <div style={{ marginLeft: '220px', padding: '32px', width: '100%' }}>
                <h2 className="client-title">Dashboard Overview</h2>
                {loading ? <div className="loading">Loading...</div> : (
                    <div className="stats-grid">
                        <div className="stat-card"><p className="stat-number">{stats.total}</p><p className="stat-label">Total Requests</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.pending}</p><p className="stat-label">Pending</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.inProgress}</p><p className="stat-label">In Progress</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.completed}</p><p className="stat-label">Completed</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.unpaid}</p><p className="stat-label">Unpaid</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.totalClients}</p><p className="stat-label">Clients</p></div>
                        <div className="stat-card"><p className="stat-number">{stats.totalTechnicians}</p><p className="stat-label">Technicians</p></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdministratorDashboard;