import React, { useState } from 'react';
import { useMy } from '../context/MyContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useMy();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(!name || !email || !phone 
            || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('/auth/register' , { name, email, phone, password });
            navigate('/login', {
                state: { message: 'Account created please login', type: 'success' }
            });

        } catch (error) {
            if(!error.response) {
                setError ('Server unreachable. Check your connection.');
                return;
            }

            const status = error.response.status;
            if(status === 400) {
                navigate ('/login', {
                    state: {message: 'Email already exists please login', type: 'error'}
                    });
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };
return(
    <div className='register-container'>
        <div className='register-box'>
            <h1 className='register-title'>Create Account</h1>

            { error && <p className='register-error'>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className='register-form'>
                    <label className='register-label'>Name</label>
                    <input className='register-input'
                    type="text"
                    placeholder='John Doe' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                </div>

                <div className='register-form'>
                    <label className='register-label'>email</label>
                    <input className='register-input'
                    type="email"
                    placeholder='john@example.com' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className='register-form'>
                    <label className='register-label'>Password</label>
                    <input className='register-input'
                    type="password"
                    placeholder='...........' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className='register-form'>
                    <label className='register-label'>Phone Number</label>
                    <input className='register-input'
                    type="tel"
                    placeholder='123-456-7890' 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}/>
                </div>

                <div className='register-form'>
                    <label className='register-label'>Confirm Password</label>
                    <input className='register-input'
                    type="password"
                    placeholder='...........' 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <button className='register-btn' type='submit'>register Account</button>
            </form>

            <div className='register-accountexists'>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    </div>
)
}
export default Register;