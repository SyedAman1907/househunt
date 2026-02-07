import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const PropertyDetails_Premium = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [message, setMessage] = useState('');
    const [bookingStatus, setBookingStatus] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/properties/${id}`);
                setProperty(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProperty();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings', { propertyId: id, message });
            setBookingStatus({ type: 'success', msg: 'Booking request sent!' });
            setMessage('');
        } catch (err) {
            setBookingStatus({ type: 'danger', msg: err.response?.data?.msg || 'Booking failed' });
        }
    };

    if (!property) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </Container>
    );

    return (
        <div className="reveal">
            <Container className="mt-5 pb-5">
                <Row className="g-4">
                    <Col lg={8}>
                        <div className="glass-card p-2 floating mb-4" style={{ borderRadius: '32px' }}>
                            <img 
                                src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
                                className="img-fluid w-100" 
                                style={{ borderRadius: '28px', maxHeight: '550px', objectFit: 'cover' }}
                                alt={property.title}
                            />
                        </div>
                        <div className="glass-card p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="premium-heading mb-0">{property.title}</h2>
                                <h3 className="text-primary mb-0">${property.rentAmount}</h3>
                            </div>
                            <div className="d-flex gap-4 mb-4">
                                <span className="glass-card px-3 py-2 small">📍 {property.location}</span>
                                <span className="glass-card px-3 py-2 small">🛏️ {property.bedrooms} Bed</span>
                                <span className="glass-card px-3 py-2 small">⭐ Verified</span>
                            </div>
                            <h5 className="text-white mb-3">Description</h5>
                            <p className="text-muted lead" style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                                {property.description || "A premium living experience awaits you in this beautifully designed home."}
                            </p>
                        </div>
                    </Col>
                    
                    <Col lg={4}>
                        <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
                            <h4 className="premium-heading h5 mb-4">RESERVE NOW</h4>
                            {user && user.role === 'renter' ? (
                                <>
                                    {bookingStatus && <Alert variant={bookingStatus.type} className="bg-transparent text-white border-0">{bookingStatus.msg}</Alert>}
                                    <Form onSubmit={handleBooking}>
                                        <Form.Group className="mb-4">
                                            <Form.Control 
                                                as="textarea" 
                                                rows={4} 
                                                placeholder="Message to owner..."
                                                className="bg-dark text-white border-secondary p-3"
                                                value={message} 
                                                onChange={(e) => setMessage(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>
                                        <Button className="btn-premium w-100 py-3" type="submit">BOOK NOW</Button>
                                    </Form>
                                </>
                            ) : (
                                <div className="text-center py-3">
                                    <p className="text-muted small">Sign in as renter to book this home.</p>
                                    {!user && <Button as={Link} to="/login" className="btn-premium w-100">JOIN TO BOOK</Button>}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PropertyDetails_Premium;
