import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'renter',
        mobile: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email';
        if (!formData.password || formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        if (formData.role === 'owner') {
            if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required for owners';
            if (!formData.address.trim()) errors.address = 'Address is required for owners';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error for this field
        setValidationErrors(prev => ({ ...prev, [name]: null }));
        // Clear previous errors when user starts typing
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
            const res = await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting...');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Registration Error:', err);
            const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', paddingY: '40px' }}>
            <Card style={{ width: '450px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Create Account</h2>
                    
                    {error && (
                        <Alert variant="danger" className="d-flex align-items-center gap-2">
                            <span>⚠️</span>
                            <div>{error}</div>
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert variant="success" className="d-flex align-items-center gap-2">
                            <span>✓</span>
                            <div>{success}</div>
                        </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                                name="name" 
                                type="text" 
                                placeholder="Enter your full name"
                                required 
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                isInvalid={!!validationErrors.name}
                            />
                            {validationErrors.name && <Form.Control.Feedback type="invalid">{validationErrors.name}</Form.Control.Feedback>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                name="email" 
                                type="email" 
                                placeholder="Enter your email"
                                required 
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                isInvalid={!!validationErrors.email}
                            />
                            {validationErrors.email && <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                name="password" 
                                type="password" 
                                placeholder="Enter your password"
                                required 
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                isInvalid={!!validationErrors.password}
                            />
                            {validationErrors.password && <Form.Control.Feedback type="invalid">{validationErrors.password}</Form.Control.Feedback>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>I am a:</Form.Label>
                            <Form.Select 
                                name="role" 
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="renter">Renter</option>
                                <option value="owner">Property Owner</option>
                            </Form.Select>
                        </Form.Group>
                        
                        {formData.role === 'owner' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control 
                                        name="mobile" 
                                        type="tel" 
                                        placeholder="Enter mobile number (required for owners)"
                                        required 
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        disabled={loading}
                                        isInvalid={!!validationErrors.mobile}
                                    />
                                    {validationErrors.mobile && <Form.Control.Feedback type="invalid">{validationErrors.mobile}</Form.Control.Feedback>}
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control 
                                        name="address" 
                                        type="text" 
                                        placeholder="Enter your address (required for owners)"
                                        required 
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={loading}
                                        isInvalid={!!validationErrors.address}
                                    />
                                    {validationErrors.address && <Form.Control.Feedback type="invalid">{validationErrors.address}</Form.Control.Feedback>}
                                </Form.Group>
                            </>
                        )}
                        
                        <Button 
                            className="w-100 py-2 mt-3" 
                            type="submit"
                            disabled={loading}
                            variant="primary"
                        >
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
