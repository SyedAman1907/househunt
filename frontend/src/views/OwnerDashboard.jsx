import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Tab, Tabs } from 'react-bootstrap';
import api from '../api/axiosConfig';

const OwnerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProperty, setNewProperty] = useState({
        title: '', location: '', rentAmount: '', bedrooms: '', description: '', images: []
    });

    useEffect(() => {
        fetchProperties();
        fetchBookings();
    }, []);

    const fetchProperties = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await api.get(`/properties?owner=${user.id}`);
        setProperties(res.data);
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/owner-bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newProperty.title);
            formData.append('location', newProperty.location);
            formData.append('rentAmount', newProperty.rentAmount);
            formData.append('bedrooms', newProperty.bedrooms);
            formData.append('description', newProperty.description);
            if (newProperty.image) {
                formData.append('image', newProperty.image);
            }

            await api.post('/properties', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            fetchProperties();
        } catch (err) { console.error(err); }
    };

    const handleBookingAction = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            fetchBookings();
        } catch (err) { console.error(err); }
    };

    return (
        <Container className="mt-4">
            <h2>Owner Dashboard</h2>
            <Tabs defaultActiveKey="properties" className="mb-3">
                <Tab eventKey="properties" title="My Properties">
                    <Button className="mb-3" onClick={() => setShowModal(true)}>Add Property</Button>
                    <Table striped bordered>
                        <thead><tr><th>Title</th><th>Location</th><th>Price</th><th>Status</th></tr></thead>
                        <tbody>
                            {properties.map(p => (
                                <tr key={p._id}>
                                    <td>{p.title}</td>
                                    <td>{p.location}</td>
                                    <td>${p.rentAmount}</td>
                                    <td>{p.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="bookings" title="Bookings">
                    <Table striped bordered>
                        <thead><tr><th>Property</th><th>Renter</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b._id}>
                                    <td>{b.property?.title}</td>
                                    <td>{b.renter?.email}</td>
                                    <td>{b.message}</td>
                                    <td>{b.status}</td>
                                    <td>
                                        {b.status === 'pending' && (
                                            <>
                                                <Button variant="success" size="sm" className="me-2" onClick={() => handleBookingAction(b._id, 'confirmed')}>Accept</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleBookingAction(b._id, 'rejected')}>Reject</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Add Property</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddProperty}>
                        <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control onChange={(e) => setNewProperty({...newProperty, title: e.target.value})} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Location</Form.Label><Form.Control onChange={(e) => setNewProperty({...newProperty, location: e.target.value})} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Rent</Form.Label><Form.Control type="number" onChange={(e) => setNewProperty({...newProperty, rentAmount: e.target.value})} required /></Form.Group>
                         <Form.Group className="mb-2"><Form.Label>Bedrooms</Form.Label><Form.Control type="number" onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" onChange={(e) => setNewProperty({...newProperty, description: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Property Image</Form.Label><Form.Control type="file" onChange={(e) => setNewProperty({...newProperty, image: e.target.files[0]})} /></Form.Group>
                        <Button type="submit">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default OwnerDashboard;
