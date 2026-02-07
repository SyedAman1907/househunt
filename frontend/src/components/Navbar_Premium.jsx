import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar_Premium = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar expand="lg" sticky="top" className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand">
                    <span style={{color: '#fff'}}>HOUSE</span>HUNT
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 bg-primary" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-lg-5">
                        <Nav.Link as={Link} to="/" className="nav-link">EXPLORE</Nav.Link>
                        {user && user.role === 'owner' && (
                            <Nav.Link as={Link} to="/owner-dashboard" className="nav-link">DASHBOARD</Nav.Link>
                        )}
                        {user && (user.role === 'admin' || user.role === 'subadmin') && (
                            <Nav.Link as={Link} to="/admin-dashboard" className="nav-link admin-link">
                                <span className="admin-status-dot"></span> ADMIN PANEL
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {token ? (
                            <>
                                <div className="d-flex align-items-center me-4">
                                    <div className="text-end me-3 d-none d-md-block">
                                        <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px'}}>IDENTITY</div>
                                        <div style={{fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)'}}>{user?.email.split('@')[0].toUpperCase()}</div>
                                    </div>
                                    <div className="pulse" style={{
                                        width: '45px', height: '45px', borderRadius: '50%', 
                                        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                        boxShadow: '0 0 15px var(--primary-glow)'
                                    }}>
                                        {user?.email?.[0].toUpperCase()}
                                    </div>
                                </div>
                                <Button className="btn-premium py-2 px-4 shadow" onClick={handleLogout}>LOGOUT</Button>
                            </>
                        ) : (
                            <div className="d-flex gap-3 align-items-center">
                                <Nav.Link as={Link} to="/login" className="nav-link">SIGN IN</Nav.Link>
                                <Button as={Link} to="/register" className="btn-premium px-4">START JOURNEY</Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navbar_Premium;
