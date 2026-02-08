import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const PropertyDetails = () => {
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
        } catch (err) {
            setBookingStatus({ type: 'danger', msg: err.response?.data?.msg || 'Booking failed' });
        }
    };

    if (!property) return <Container>Loading...</Container>;

    return (
        <Container className="mt-5">
            <Card>
                <Card.Img variant="top" src={property.images[0] || 'https://via.placeholder.com/800x400'} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{property.title}</Card.Title>
                    <Card.Text>
                        <strong>Location:</strong> {property.location} <br />
                        <strong>Price:</strong> ${property.rentAmount}/mo <br />
                        <strong>Bedrooms:</strong> {property.bedrooms} <br />
                        <strong>Description:</strong> {property.description}
                    </Card.Text>

                    {user && user.role === 'renter' ? (
                        <>
                            <hr />
                            <h5>Book this Property</h5>
                            {bookingStatus && <Alert variant={bookingStatus.type}>{bookingStatus.msg}</Alert>}
                            <Form onSubmit={handleBooking}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message to Owner</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>
                                <Button type="submit">Request Booking</Button>
                            </Form>
                        </>
                    ) : (
                        !user && <Alert variant="info">Please <a href="/login">login</a> as a renter to book.</Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PropertyDetails;
