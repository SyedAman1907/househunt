import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Tab, Tabs, Row, Col, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';

const OwnerDashboard_Premium = () => {
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProperty, setNewProperty] = useState({
        title: '', location: '', rentAmount: '', bedrooms: '', description: '', image: null
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
            if (newProperty.image) formData.append('image', newProperty.image);

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
        <div className="reveal">
            <Container className="mt-5 pb-5">
                <div className="d-flex justify-content-between align-items-end mb-5 reveal" style={{animationDelay: '0.1s'}}>
                    <div>
                        <h2 className="premium-heading mb-1">PORTFOLIO HUB</h2>
                        <p className="text-muted small">MANAGE YOUR LUXURY ASSETS</p>
                    </div>
                    <Button className="btn-premium px-5 py-3" onClick={() => setShowModal(true)}>+ EXPAND PORTFOLIO</Button>
                </div>
                
                <div className="glass-card mb-5 reveal" style={{animationDelay: '0.3s'}}>
                    <Tabs defaultActiveKey="portfolio" className="custom-tabs">
                        <Tab eventKey="portfolio" title="CURRENT ASSETS">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr><th>ASSET</th><th>LOCATION</th><th>REVENUE</th><th>STATUS</th></tr>
                                </thead>
                                <tbody>
                                    {properties.map(p => (
                                        <tr key={p._id}>
                                            <td className="fw-bold text-white">{p.title}</td>
                                            <td className="small text-muted">{p.location}</td>
                                            <td className="text-primary fw-bold">${p.rentAmount}</td>
                                            <td>
                                                <Badge className="neon-badge" style={{color: p.isApproved ? 'var(--primary)' : 'var(--accent)'}}>
                                                    {p.isApproved ? 'VERIFIED' : 'PENDING'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {properties.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted">NO ASSETS REGISTERED IN HUB</td></tr>}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey="bookings" title="RESERVATIONS">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr><th>TARGET ASSET</th><th>IDENTITY</th><th>STATUS</th><th>ACTIONS</th></tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id}>
                                            <td className="text-white small fw-bold">{b.property?.title}</td>
                                            <td className="small text-muted">{b.renter?.email}</td>
                                            <td>
                                                <Badge className="neon-badge" style={{color: b.status === 'confirmed' ? 'var(--primary)' : b.status === 'rejected' ? 'var(--accent)' : '#fff'}}>
                                                    {b.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>
                                                {b.status === 'pending' && (
                                                    <div className="d-flex gap-2">
                                                        <Button variant="outline-success" className="px-3" size="sm" onClick={() => handleBookingAction(b._id, 'confirmed')}>ACCEPT</Button>
                                                        <Button variant="outline-danger" className="px-3" size="sm" onClick={() => handleBookingAction(b._id, 'rejected')}>REJECT</Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-muted">AWAITING RESERVATION REQUESTS</td></tr>}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card text-white border-0">
                    <Modal.Header closeButton closeVariant="white" className="border-secondary p-4">
                        <Modal.Title className="premium-heading h5">NEW ASSET SUBMISSION</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 bg-dark bg-opacity-25">
                        <Form onSubmit={handleAddProperty}>
                            <Form.Control className="p-3 mb-3" placeholder="PROPERTY IDENTIFIER (TITLE)" onChange={(e) => setNewProperty({...newProperty, title: e.target.value})} required />
                            <Row className="g-3 mb-3">
                                <Col md={6}><Form.Control className="p-3" placeholder="LOCATION COORDS" onChange={(e) => setNewProperty({...newProperty, location: e.target.value})} required /></Col>
                                <Col md={6}><Form.Control type="number" className="p-3" placeholder="MONTHLY RENT ($)" onChange={(e) => setNewProperty({...newProperty, rentAmount: e.target.value})} required /></Col>
                            </Row>
                            <Form.Control type="number" className="p-3 mb-3" placeholder="ROOM CAPACITY" onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})} required />
                            <Form.Control as="textarea" rows={3} className="p-3 mb-4" placeholder="ARCHITECTURAL DESCRIPTION" onChange={(e) => setNewProperty({...newProperty, description: e.target.value})} />
                            <div className="glass-card p-3 mb-4 text-center border-dashed">
                                <Form.Label className="text-muted small mb-2 d-block">CHOOSE ASSET VISUAL (IMAGE)</Form.Label>
                                <Form.Control type="file" className="bg-transparent border-0 text-white" onChange={(e) => setNewProperty({...newProperty, image: e.target.files[0]})} />
                            </div>
                            <Button className="btn-premium w-100 py-3 mt-2" type="submit">TRANSMIT TO GOVERNANCE</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default OwnerDashboard_Premium;
