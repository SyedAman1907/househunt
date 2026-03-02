import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login_Premium = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
        if (!password) errors.password = 'Password is required';
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.user.role === 'admin' || res.data.user.role === 'subadmin') {
                setError('⚠️ PERMISSION ERROR: Administrative identities must use the dedicated Admin Terminal.');
                setLoading(false);
                return;
            }
            
            setSuccess('✓ Access granted! Redirecting...');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            setTimeout(() => {
                if (res.data.user.role === 'owner') {
                    navigate('/owner-dashboard');
                } else {
                    navigate('/');
                }
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error('Login Error:', err);
            const errorMessage = err.response?.data?.msg || 'Verification failed. Please try again.';
            setError('⚠️ ' + errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="reveal">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', paddingY: '40px' }}>
                <Card className="glass-card p-4 stop-motion-image" style={{ width: '450px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', borderRadius: '10px' }}>
                    <Card.Body>
                        <h2 className="premium-heading text-center mb-5 stop-motion-text">SECURE LOGIN</h2>
                        
                        {error && (
                            <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white d-flex align-items-center gap-2" role="alert">
                                <span>⚠️</span>
                                <div>{error}</div>
                            </Alert>
                        )}
                        
                        {success && (
                            <Alert variant="success" className="border-0 bg-success bg-opacity-25 text-white d-flex align-items-center gap-2" role="alert">
                                <span>✓</span>
                                <div>{success}</div>
                            </Alert>
                        )}
                        
                        <Form onSubmit={handleSubmit} noValidate>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">IDENTITY EMAIL</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    required 
                                    placeholder="ENTER YOUR REGISTERED EMAIL"
                                    className={`p-3 ${validationErrors.email ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setValidationErrors(prev => ({ ...prev, email: null }));
                                        setError('');
                                        setSuccess('');
                                    }}
                                    disabled={loading}
                                />
                                {validationErrors.email && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.email}</div>}
                            </Form.Group>
                            
                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small">ACCESS KEY</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    required 
                                    placeholder="ENTER MASTER PASSWORD"
                                    className={`p-3 ${validationErrors.password ? 'is-invalid' : ''}`}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setValidationErrors(prev => ({ ...prev, password: null }));
                                        setError('');
                                        setSuccess('');
                                    }}
                                    disabled={loading}
                                />
                                {validationErrors.password && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.password}</div>}
                            </Form.Group>
                            
                            <Button 
                                className="btn-premium w-100 py-3 mt-2 fw-bold" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        AUTHORIZING...
                                    </>
                                ) : (
                                    'AUTHORIZE ACCESS'
                                )}
                            </Button>
                        </Form>
                        
                        <div className="mt-4 text-center d-flex justify-content-between px-2">
                            <Link to="/forgot-password" style={{fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none'}} className="link-underline-hover">
                                RECOVER ACCESS
                            </Link>
                            <Link to="/register" style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'none'}} className="link-underline-hover">
                                NEW IDENTITY
                            </Link>
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
