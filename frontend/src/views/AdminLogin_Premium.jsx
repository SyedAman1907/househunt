import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AdminLogin_Premium = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            
            // Strictly check for admin/subadmin roles
            if (res.data.user.role === 'admin' || res.data.user.role === 'subadmin') {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/admin-dashboard');
            } else {
                setError('ACCESS DENIED: Insufficient permissions for administrative access.');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'AUTHENTICATION FAILED');
        }
    };

    return (
        <div>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <Card className="glass-card p-4" style={{ width: '450px', border: '1px solid var(--accent)' }}>
                    <Card.Body>
                        <div className="text-center mb-4">
                            <div className="admin-status-dot mb-3"></div>
                            <h2 className="premium-heading text-center mb-1">ADMIN CONTROL</h2>
                            <p className="text-muted small letter-spacing-2">RESTRICTED TERMINAL</p>
                        </div>
                        
                        {error && <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white small mb-4">{error}</Alert>}
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">ADMIN IDENTIFIER</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    required 
                                    placeholder="Enter Admin Email"
                                    className="p-3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">SECURE KEY-STORE</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    required 
                                    placeholder="Enter Access Key"
                                    className="p-3"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </Form.Group>
                            <Button className="btn-premium w-100 py-3 mt-2" type="submit" style={{background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)'}}>
                                VERIFY IDENTITY
                            </Button>
                        </Form>
                        <div className="mt-4 text-center">
                            <button onClick={() => navigate('/login')} className="btn btn-link text-muted small text-decoration-none">
                                ← RETURN TO USER LOGIN
                            </button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminLogin_Premium;
