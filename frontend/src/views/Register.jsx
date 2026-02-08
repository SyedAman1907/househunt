import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'renter',
        mobile: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" type="password" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>I am a:</Form.Label>
                            <Form.Select name="role" onChange={handleChange}>
                                <option value="renter">Renter</option>
                                <option value="owner">Property Owner</option>
                            </Form.Select>
                        </Form.Group>
                        
                        {formData.role === 'owner' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control name="mobile" type="text" placeholder="Required for Owners" required onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control name="address" type="text" placeholder="Required for Owners" required onChange={handleChange} />
                                </Form.Group>
                            </>
                        )}
                        <Button className="w-100" type="submit">Register</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
