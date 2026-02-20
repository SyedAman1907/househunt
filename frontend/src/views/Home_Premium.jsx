import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Home_Premium = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ location: '', maxPrice: '' });
    const navigate = useNavigate();

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) {
            // Fix legacy local URLs if running in a different environment
            if (url.includes('localhost:5000/uploads/')) {
                return `/uploads/${url.split('/uploads/')[1]}`;
            }
            return url;
        }
        return `/uploads/${url}`;
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.location) params.location = filters.location;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            
            const res = await api.get('/properties', { params });
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    const defaultImages = [
        "https://images.unsplash.com/photo-1600585154340-be60998ad30c?auto=format",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format",
        "https://images.unsplash.com/photo-1600607687940-4e524cb35a3a?auto=format"
    ];

    return (
        <div className="reveal">
            <Container className="mt-5 pb-5">
                <Row className="mb-5 align-items-center">
                    <Col lg={7}>
                        <div className="reveal">
                            <h1 className="display-4 premium-heading mb-4">ARCHITECTURAL <span className="highlight-neon">MASTERPIECES</span></h1>
                            <p className="lead text-white mb-5" style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                                Discover curated luxury rentals with HouseHunt. Verified properties, 
                                secure identity management, and premium living experiences.
                            </p>
                            <div className="glass-card p-4">
                                <Form onSubmit={handleSearch} className="d-flex flex-wrap gap-3">
                                    <Form.Control 
                                        className="p-3 flex-grow-1"
                                        placeholder="WHERE ARE YOU LOOKING?" 
                                        onChange={(e) => setFilters({...filters, location: e.target.value})} 
                                    />
                                    <Form.Control 
                                        className="p-3"
                                        style={{ width: '160px' }}
                                        placeholder="MAX PRICE" 
                                        type="number" 
                                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
                                    />
                                    <Button className="btn-premium px-5" type="submit">SEARCH</Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                    <Col lg={5} className="d-none d-lg-block text-center mt-5">
                        <div className="glass-card p-2" style={{ borderRadius: '40px' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" 
                                alt="Modern Home" 
                                className="img-fluid rounded-4"
                                style={{ borderRadius: '30px' }}
                            />
                        </div>
                    </Col>
                </Row>

                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h2 className="premium-heading h5 mb-0">LATEST LISTINGS</h2>
                    <div style={{ flexGrow: 1, height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 30px' }}></div>
                    <span className="text-white small fw-bold">ONLINE REGISTRY</span>
                </div>

                <Row>
                    {loading ? (
                        [1,2,3].map(i => (
                            <Col key={i} md={6} lg={4} className="mb-5">
                                <div className="glass-card p-0 h-100" style={{ minHeight: '400px' }}>
                                    <div className="image-placeholder" style={{ height: '260px', borderRadius: '30px 30px 0 0' }}></div>
                                    <div className="p-4">
                                        <div style={{ height: '20px', width: '70%', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px' }} className="mb-3"></div>
                                        <div style={{ height: '15px', width: '90%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            </Col>
                        ))
                    ) : properties.map((property, index) => (
                        <Col key={property._id} md={6} lg={4} className="mb-5">
                            <Card className="glass-card h-100 border-0">
                                <div className="overflow-hidden" style={{ height: '280px', borderRadius: '30px 30px 0 0' }}>
                                    <Card.Img 
                                        variant="top" 
                                        className="hover-zoom h-100 w-100"
                                        src={getImageUrl(property.images?.[0]) || defaultImages[index % defaultImages.length]} 
                                        style={{ objectFit: 'cover' }} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'var(--primary)',
                                        color: '#000',
                                        padding: '4px 12px',
                                        borderRadius: '15px',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem'
                                    }}>
                                        VERIFIED
                                    </div>
                                </div>
                                <Card.Body className="p-4 text-center">
                                    <Card.Title className="h5 mb-2 text-white fw-bold">{property.title}</Card.Title>
                                    <p className="text-muted small mb-4">{property.location.toUpperCase()}</p>
                                    <div className="h4 text-primary mb-4">${property.rentAmount}<span className="small text-muted" style={{fontSize: '0.9rem'}}>/mo</span></div>
                                    <Button 
                                        className="btn-premium w-100" 
                                        onClick={() => navigate(`/properties/${property._id}`)}
                                    >
                                        VIEW PROPERTY
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Home_Premium;
