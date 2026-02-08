import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            const res = await api.post('/auth/forgotpassword', { email });
            console.log(res.data);
            setMsg('OTP sent to your email (Check server console for simulation)');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error sending OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            await api.post('/auth/resetpassword', { email, otp, password });
            setMsg('Password Reset Successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid OTP or Error');
        }
    };

    return (
        <Container className="mt-5" style={{maxWidth: '500px'}}>
            <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
            {msg && <Alert variant="success">{msg}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {step === 1 ? (
                <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Send OTP</Button>
                </Form>
            ) : (
                <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control 
                            type="text" 
                            required 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">Reset Password</Button>
                </Form>
            )}
        </Container>
    );
};

export default ForgotPassword;
