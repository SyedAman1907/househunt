import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login_Premium = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.user.role === 'admin' || res.data.user.role === 'subadmin') {
                setError('PERMISSION ERROR: Administrative identities must use the dedicated Admin Terminal.');
                return;
            } else if (res.data.user.role === 'owner') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/owner-dashboard');
            } else {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            }
            window.location.reload(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed');
        }
    };

    return (
        <div className="reveal">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <Card className="glass-card p-4 stop-motion-image" style={{ width: '450px' }}>
                    <Card.Body>
                        <h2 className="premium-heading text-center mb-5 stop-motion-text">SECURE LOGIN</h2>
                        {error && <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">IDENTITY EMAIL</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    required 
                                    placeholder="ENTER YOUR REGISTERED EMAIL"
                                    className="p-3"
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">ACCESS KEY</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    required 
                                    placeholder="ENTER MASTER PASSWORD"
                                    className="p-3"
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </Form.Group>
                            <Button className="btn-premium w-100 py-3 mt-2" type="submit">AUTHORIZE ACCESS</Button>
                        </Form>
                        <div className="mt-4 text-center d-flex justify-content-between px-2">
                            <Link to="/forgot-password" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>RECOVER ACCESS</Link>
                            <Link to="/register" style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700'}}>NEW IDENTITY</Link>
                        </div>
                        <div className="mt-3 text-center">
                            <Link to="/admin-login" className="btn btn-link text-muted small text-decoration-none" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                                🔒 ADMIN ACCESS
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login_Premium;
