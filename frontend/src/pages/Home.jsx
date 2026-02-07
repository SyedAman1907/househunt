import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({ location: '', maxPrice: '' });
    const navigate = useNavigate();

    const fetchProperties = async () => {
        try {
            const params = {};
            if (filters.location) params.location = filters.location;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            
            const res = await api.get('/properties', { params });
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <Container className="mt-4">
            <div className="p-5 mb-4 bg-light rounded-3">
                <h1>Find Your Perfect Home</h1>
                <Form onSubmit={handleSearch} className="d-flex gap-2">
                    <Form.Control 
                        placeholder="Location" 
                        onChange={(e) => setFilters({...filters, location: e.target.value})} 
                    />
                    <Form.Control 
                        placeholder="Max Price" 
                        type="number" 
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
                    />
                    <Button type="submit">Search</Button>
                </Form>
            </div>

            <Row>
                {properties.map(property => (
                    <Col key={property._id} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={property.images[0] || 'https://via.placeholder.com/300'} style={{height: '200px', objectFit: 'cover'}} />
                            <Card.Body>
                                <Card.Title>{property.title}</Card.Title>
                                <Card.Text>
                                    Location: {property.location} <br/>
                                    Price: ${property.rentAmount}/mo <br/>
                                    Bedrooms: {property.bedrooms}
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/properties/${property._id}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
