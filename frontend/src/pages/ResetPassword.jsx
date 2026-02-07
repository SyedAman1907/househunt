import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/auth/resetpassword/${token}`, { password });
            setMsg('Password Reset Successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err);
            setMsg('Error resetting password');
        }
    };

    return (
        <Container className="mt-5" style={{maxWidth: '500px'}}>
            <h2>Reset Password</h2>
            {msg && <p className="text-info">{msg}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Password</Button>
            </Form>
        </Container>
    );
};

export default ResetPassword;
