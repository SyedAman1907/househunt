import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppNavbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">HouseHunt</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {user && user.role === 'owner' && (
                            <Nav.Link as={Link} to="/owner-dashboard">Dashboard</Nav.Link>
                        )}
                        {user && user.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin-dashboard">Admin</Nav.Link>
                        )}
                        {user && user.role === 'renter' && (
                           <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Signed in as: <span className="text-white">{user?.email}</span>
                                </Navbar.Text>
                                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
