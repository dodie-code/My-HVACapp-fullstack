import React, { useState } from "react";
import { useMy } from "../context/MyContext";
import { useNavigate } from "react-router-dom"; import api from "../services/api";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useMy();
    const navigate  = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if(!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user} = response.data;

        localStorage.setItem('token', token );
        login(user);

        if(user.role === 'administrator') navigate('/administrator');
        else if(user.role === 'technician') navigate('/technician');
        else if(user.role === 'client') navigate('/client-dashboard');

        } catch (error) {
            if (!error.response) {
                setError('Server unreachable. Check your connection.');
                return;
             }

            const status = error.response.status;

            if (status === 401) {
               setError('Email or password incorrect.');
            } else if (status === 404) {
               navigate('/register');
            } else {
               setError('An error occurred. Please try again later.');
            }
        }
    };
    

    return(
       <div className="login-container">
        <div className="login-box">
            <h1 className="login-title">AppliancePro</h1>

            { error && (
                <p className="login-error">
                    {error}
                    {error.includes('register') && (
                        <span onClick={() => navigate('/register')} style={{ color: 'blue', cursor: 'pointer' }}>
                            Register
                        </span>
                    )}
                </p>
            )}

        <form  onSubmit={handleSubmit}>
            <div className="login-email">
                <label className="login-label">Email:</label>
                <input type="email" 
                className="login-input"
                placeholder="JohnDoe@gmail.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="login-password">
                <label className="login-label">Password:</label>
                <input type="password" 
                className="login-input"
                placeholder="..........."
                value={password} 
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="login-btn" type="submit">Login</button>
        </form>


        <div className="login-registerlink">
            Don't have an account? {' '}
            <span onClick={() => navigate('/register')}>Register</span>
        </div>
        </div>
        
       </div> 
    )
}
export default Login;