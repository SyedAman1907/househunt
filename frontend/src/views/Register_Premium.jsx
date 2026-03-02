import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register_Premium = () => {
    const [formData, setFormData] = useState({
        email: '', password: '', role: 'renter', mobile: '', address: '', name: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email';
        if (!formData.password || formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        if (formData.role === 'owner') {
            if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required for owners';
            if (!formData.address.trim()) errors.address = 'Address is required for owners';
            if (!image) errors.image = 'Identity proof image is required for owners';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'image') {
            setImage(e.target.files[0]);
            setValidationErrors(prev => ({ ...prev, image: null }));
        } else {
            setFormData({ ...formData, [name]: value });
            // Clear validation error for this field as user types
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
        // Clear previous errors/success when user starts typing
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            const res = await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setSuccess('Registration successful! Redirecting...');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Registration Error:', err);
            const errorMessage = err.response?.data?.msg || err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reveal">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', paddingY: '40px' }}>
                <Card className="glass-card p-4 my-5 stop-motion-image" style={{ width: formData.role === 'owner' ? '650px' : '450px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', borderRadius: '10px' }}>
                    <Card.Body>
                        <h2 className="premium-heading text-center mb-5 stop-motion-text">CREATE IDENTITY</h2>
                        
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
                            <Row>
                                <Col md={formData.role === 'owner' ? 6 : 12}>
                                    <Form.Group className="mb-4">
                                        <Form.Control 
                                            name="name" 
                                            type="text" 
                                            required 
                                            placeholder="FULL NAME" 
                                            className={`p-3 ${validationErrors.name ? 'is-invalid' : ''}`}
                                            value={formData.name} 
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {validationErrors.name && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.name}</div>}
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Control 
                                            name="email" 
                                            type="email" 
                                            required 
                                            placeholder="PRIMARY EMAIL" 
                                            className={`p-3 ${validationErrors.email ? 'is-invalid' : ''}`}
                                            value={formData.email} 
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {validationErrors.email && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.email}</div>}
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Control 
                                            name="password" 
                                            type="password" 
                                            required 
                                            placeholder="SECRET KEY" 
                                            className={`p-3 ${validationErrors.password ? 'is-invalid' : ''}`}
                                            value={formData.password} 
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {validationErrors.password && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.password}</div>}
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Select 
                                            name="role" 
                                            className="p-3 text-center fw-bold" 
                                            value={formData.role} 
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            <option value="renter">CITIZEN (RENTER)</option>
                                            <option value="owner">TRUSTEE (OWNER)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                
                                {formData.role === 'owner' && (
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Control 
                                                name="mobile" 
                                                type="tel" 
                                                placeholder="COMMS NUMBER" 
                                                className={`p-3 ${validationErrors.mobile ? 'is-invalid' : ''}`}
                                                value={formData.mobile} 
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                            {validationErrors.mobile && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.mobile}</div>}
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-4">
                                            <Form.Control 
                                                name="address" 
                                                type="text" 
                                                placeholder="BASE ADDRESS" 
                                                className={`p-3 ${validationErrors.address ? 'is-invalid' : ''}`}
                                                value={formData.address} 
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                            {validationErrors.address && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.address}</div>}
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-4">
                                            <label className="text-muted small mb-2 d-block ms-1">IDENTITY PROOF (IMAGE)</label>
                                            <div className="position-relative">
                                                <Form.Control 
                                                    name="image" 
                                                    type="file" 
                                                    className={`p-3 ${validationErrors.image ? 'is-invalid' : ''}`}
                                                    onChange={handleChange} 
                                                    accept="image/*"
                                                    disabled={loading}
                                                />
                                                {image && <small className="text-muted d-block mt-1">✓ {image.name}</small>}
                                                {validationErrors.image && <div className="invalid-feedback d-block text-warning small mt-1">{validationErrors.image}</div>}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>
                            
                            <Button 
                                className="btn-premium w-100 py-3 mt-2 fw-bold" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        PROCESSING...
                                    </>
                                ) : (
                                    'INITIALIZE REGISTRY'
                                )}
                            </Button>
                        </Form>
                        
                        <div className="mt-4 text-center">
                            <Link to="/login" style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                                ALREADY IDENTIFIED? <span className="highlight-neon">SIGN IN</span>
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Register_Premium;
