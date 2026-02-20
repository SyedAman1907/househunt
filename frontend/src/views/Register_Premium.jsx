import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register_Premium = () => {
    const [formData, setFormData] = useState({
        email: '', password: '', role: 'renter', mobile: '', address: '', name: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setImage(e.target.files[0]);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            const res = await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.msg || err.message || 'Registration failed (Unknown Error)';
            setError(errorMessage);
        }
    };

    return (
        <div className="reveal">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <Card className="glass-card p-4 my-5 stop-motion-image" style={{ width: formData.role === 'owner' ? '650px' : '450px' }}>
                    <Card.Body>
                        <h2 className="premium-heading text-center mb-5 stop-motion-text">CREATE IDENTITY</h2>
                        {error && <Alert variant="danger" className="border-0 bg-danger bg-opacity-25 text-white">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={formData.role === 'owner' ? 6 : 12}>
                                    <Form.Control name="name" type="text" required placeholder="FULL NAME" className="p-3 mb-4" value={formData.name} onChange={handleChange} />
                                    <Form.Control name="email" type="email" required placeholder="PRIMARY EMAIL" className="p-3 mb-4" value={formData.email} onChange={handleChange} />
                                    <Form.Control name="password" type="password" required placeholder="SECRET KEY" className="p-3 mb-4" value={formData.password} onChange={handleChange} />
                                    <Form.Select name="role" className="p-3 mb-4 text-center fw-bold" value={formData.role} onChange={handleChange}>
                                        <option value="renter">CITIZEN (RENTER)</option>
                                        <option value="owner">TRUSTEE (OWNER)</option>
                                    </Form.Select>
                                </Col>
                                {formData.role === 'owner' && (
                                    <Col md={6}>
                                        <Form.Control name="mobile" type="text" placeholder="COMMS NUMBER" className="p-3 mb-4" value={formData.mobile} onChange={handleChange} />
                                        <Form.Control name="address" type="text" placeholder="BASE ADDRESS" className="p-3 mb-4" value={formData.address} onChange={handleChange} />
                                        <div className="mb-4">
                                            <label className="text-muted small mb-2 d-block ms-1">IDENTITY PROOF (IMAGE)</label>
                                            <Form.Control name="image" type="file" required className="p-3" onChange={handleChange} accept="image/*" />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                            <Button className="btn-premium w-100 py-3 mt-2" type="submit">INITIALIZE REGISTRY</Button>
                        </Form>
                        <div className="mt-4 text-center">
                            <Link to="/login" style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>ALREADY IDENTIFIED? <span className="highlight-neon">SIGN IN</span></Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Register_Premium;
