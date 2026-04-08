import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMy } from "../../context/MyContext";

function AdministratorNavbar() {
    const { user, logout } = useMy();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        { label: 'Dashboard', path: '/administrator' },
        { label: 'Requests', path: '/administrator/requests' },
        { label: 'Clients', path: '/administrator/clients' },
        { label: 'Technicians', path: '/administrator/technicians' },
    ];

    return (
        <div className="clientbar" style={{ flexDirection: 'column', height: '100vh', width: '220px', position: 'fixed', top: 0, left: 0 }}>
            <div className="clienbar-logo" style={{ padding: '24px' }}>AppliancePro</div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                {links.map(link => (
                    <button
                        key={link.path}
                        className={`client-tab ${location.pathname === link.path ? 'active' : ''}`}
                        onClick={() => navigate(link.path)}
                        style={{ textAlign: 'left' }}
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            <div style={{ padding: '24px' }}>
                <p className="clientbar-role">Administrator</p>
                <p className="clientbar-name">{user?.name}</p>
                <button className="clientbar-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default AdministratorNavbar;