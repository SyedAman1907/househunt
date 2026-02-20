import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Tabs, Tab, Form, Row, Col, Badge, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AdminDashboard_Premium = () => {
    const [owners, setOwners] = useState([]);
    const [properties, setProperties] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [users, setUsers] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [subAdminData, setSubAdminData] = useState({ email: '', password: '', name: '' });
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [modalType, setModalType] = useState(''); // 'owner' or 'property'
    const [stats, setStats] = useState({ totalUsers: 0, pendingOwners: 0, totalProperties: 0, recentActivities: 0 });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const getImageUrl = (url) => {
        if (!url) return null;
        if (typeof url !== 'string') return null;
        if (url.startsWith('http')) {
            if (url.includes('localhost:5000/uploads/')) {
                return `/uploads/${url.split('/uploads/')[1]}`;
            }
            return url;
        }
        return `/uploads/${url}`;
    };

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
            navigate('/admin-login');
            return;
        }
        fetchAllData();
    }, [user, navigate]);

    const fetchAllData = () => {
        fetchPendingOwners();
        fetchProperties();
        fetchUsers();
        fetchPendingProperties();
        fetchActivityLogs();
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
            updateStats({ totalUsers: res.data.length });
        } catch (err) { console.error(err); }
    };

    const fetchPendingOwners = async () => {
        try {
            const res = await api.get('/admin/pending-owners');
            setOwners(res.data);
            updateStats({ pendingOwners: res.data.length });
        } catch (err) { console.error(err); }
    };

    const fetchProperties = async () => {
        try {
            const res = await api.get('/admin/properties');
            setProperties(res.data);
            updateStats({ totalProperties: res.data.length });
        } catch (err) { console.error(err); }
    };

    const fetchPendingProperties = async () => {
        try {
            const res = await api.get('/admin/pending-properties');
            setPendingProperties(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchActivityLogs = async () => {
        try {
            const res = await api.get('/admin/activity-logs?limit=20');
            setActivityLogs(res.data.logs || []);
            updateStats({ recentActivities: res.data.totalLogs || 0 });
        } catch (err) { console.error(err); }
    };

    const updateStats = (newStats) => {
        setStats(prev => ({ ...prev, ...newStats }));
    };

    const handleApproveOwner = async () => {
        try {
            await api.put(`/admin/approve-owner/${selectedItem._id}`);
            setShowApprovalModal(false);
            setApprovalNotes('');
            fetchAllData();
        } catch (err) { console.error(err); }
    };

    const handleApproveProperty = async () => {
        try {
            await api.put(`/admin/approve-property/${selectedItem._id}`, { notes: approvalNotes });
            setShowApprovalModal(false);
            setApprovalNotes('');
            fetchAllData();
        } catch (err) { console.error(err); }
    };

    const handleReject = async () => {
        try {
            if (modalType === 'owner') {
                await api.put(`/admin/reject-owner/${selectedItem._id}`, { reason: rejectReason });
            } else {
                await api.put(`/admin/reject-property/${selectedItem._id}`, { reason: rejectReason });
            }
            setShowRejectModal(false);
            setRejectReason('');
            fetchAllData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteProperty = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await api.delete(`/admin/properties/${id}`);
            fetchAllData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchAllData();
        } catch (err) { console.error(err); }
    };

    const handleCreateSubadmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/create-subadmin', subAdminData);
            alert('Sub-admin authorized successfully');
            setSubAdminData({ email: '', password: '', name: '' });
            fetchAllData();
        } catch (err) { console.error(err); alert('Authorization failed'); }
    };

    const openApprovalModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setShowApprovalModal(true);
    };

    const openRejectModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setShowRejectModal(true);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionBadgeColor = (action) => {
        if (action.includes('APPROVED')) return 'success';
        if (action.includes('REJECTED') || action.includes('DELETED')) return 'danger';
        if (action.includes('CREATED') || action.includes('REGISTERED')) return 'info';
        return 'secondary';
    };

    return (
        <div className="reveal">
            <Container className="mt-5 pb-5">
                <div className="text-center mb-5 reveal" style={{animationDelay: '0.1s'}}>
                    <h2 className="premium-heading mb-2">SYSTEM GOVERNANCE</h2>
                    <p className="text-muted small letter-spacing-2">AUTHORIZED PERSONNEL ONLY</p>
                </div>

                {/* Statistics Dashboard */}
                <Row className="mb-4 g-3 reveal" style={{animationDelay: '0.2s'}}>
                    <Col md={3}>
                        <div className="glass-card p-3 text-center">
                            <h3 className="text-primary mb-1">{stats.totalUsers}</h3>
                            <p className="small text-muted mb-0">TOTAL USERS</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="glass-card p-3 text-center">
                            <h3 className="text-warning mb-1">{stats.pendingOwners}</h3>
                            <p className="small text-muted mb-0">PENDING APPROVALS</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="glass-card p-3 text-center">
                            <h3 className="text-success mb-1">{stats.totalProperties}</h3>
                            <p className="small text-muted mb-0">TOTAL PROPERTIES</p>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="glass-card p-3 text-center">
                            <h3 className="text-info mb-1">{stats.recentActivities}</h3>
                            <p className="small text-muted mb-0">PLATFORM ACTIVITIES</p>
                        </div>
                    </Col>
                </Row>

                <div className="glass-card p-4 reveal" style={{animationDelay: '0.3s'}}>
                    <Tabs defaultActiveKey="owners" className="mb-4 custom-tabs">
                        <Tab eventKey="owners" title="OWNER QUEUE">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr>
                                        <th>PROOF</th>
                                        <th>IDENTIFIER</th>
                                        <th>NAME</th>
                                        <th>MOBILE</th>
                                        <th>ADDRESS</th>
                                        <th>REGISTERED</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {owners.map(o => (
                                        <tr key={o._id} className="reveal-stagger">
                                            <td>
                                                {o.image ? (
                                                    <img 
                                                        src={getImageUrl(o.image)} 
                                                        alt="Proof" 
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                                                        onClick={() => window.open(getImageUrl(o.image), '_blank')}
                                                    />
                                                ) : <span className="text-muted small">NO IMAGE</span>}
                                            </td>
                                            <td className="small text-muted">{o.email}</td>
                                            <td className="fw-bold text-white">{o.name || 'ANONYMOUS'}</td>
                                            <td className="small text-info">{o.mobile || 'N/A'}</td>
                                            <td className="small text-muted">{o.address || 'N/A'}</td>
                                            <td className="small text-muted">{formatDate(o.createdAt)}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        className="btn-premium py-1 px-4" 
                                                        onClick={() => openApprovalModal(o, 'owner')}
                                                    >
                                                        AUTHORIZE
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        className="py-1 px-3" 
                                                        onClick={() => openRejectModal(o, 'owner')}
                                                    >
                                                        REJECT
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {owners.length === 0 && <tr><td colSpan="7" className="text-center py-5 text-muted h6">QUEUE CLEAR</td></tr>}
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey="properties" title="ASSET VERIFICATION">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr>
                                        <th>TITLE</th>
                                        <th>LOCATION</th>
                                        <th>OWNER</th>
                                        <th>SUBMITTED</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingProperties.map(p => (
                                        <tr key={p._id}>
                                            <td className="fw-bold text-white">{p.title}</td>
                                            <td className="small text-muted">{p.location}</td>
                                            <td className="small text-muted">{p.owner?.email || 'N/A'}</td>
                                            <td className="small text-muted">{formatDate(p.createdAt)}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        className="btn-premium py-1 px-4" 
                                                        onClick={() => openApprovalModal(p, 'property')}
                                                    >
                                                        VERIFY ASSET
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        className="py-1 px-3" 
                                                        onClick={() => openRejectModal(p, 'property')}
                                                    >
                                                        REJECT
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingProperties.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted h6">NO PENDING ASSETS</td></tr>}
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey="registry" title="ACTIVE REGISTRY">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr>
                                        <th>EMAIL</th>
                                        <th>NAME</th>
                                        <th>ROLE</th>
                                        <th>STATUS</th>
                                        <th>REGISTERED</th>
                                        <th>APPROVED</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td className="small text-muted">{u.email}</td>
                                            <td className="text-white">{u.name || 'N/A'}</td>
                                            <td>
                                                <Badge 
                                                    className="neon-badge" 
                                                    style={{color: u.role === 'admin' ? 'var(--accent)' : 'var(--primary)'}}
                                                >
                                                    {u.role.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>
                                                {u.role === 'owner' ? (
                                                    u.isApproved ? 
                                                    <span className="text-success small">AUTHORIZED</span> : 
                                                    <span className="text-warning small">PENDING</span>
                                                ) : <span className="text-muted small">ACTIVE</span>}
                                            </td>
                                            <td className="small text-muted">{formatDate(u.createdAt)}</td>
                                            <td className="small text-muted">
                                                {u.approvedAt ? formatDate(u.approvedAt) : 'N/A'}
                                            </td>
                                            <td>
                                                {u.role !== 'admin' && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        className="py-1 px-3" 
                                                        size="sm" 
                                                        onClick={() => handleDeleteUser(u._id)}
                                                    >
                                                        REMOVE
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey="assets" title="ALL ASSETS">
                            <Table variant="dark" hover responsive className="bg-transparent mt-3 align-middle">
                                <thead>
                                    <tr>
                                        <th>TITLE</th>
                                        <th>OWNER</th>
                                        <th>STATUS</th>
                                        <th>CREATED</th>
                                        <th>APPROVED</th>
                                        <th>NOTES</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(p => (
                                        <tr key={p._id}>
                                            <td className="fw-bold text-white">{p.title}</td>
                                            <td className="small text-muted">{p.owner?.email || 'N/A'}</td>
                                            <td>
                                                <Badge bg={p.isApproved ? 'success' : 'warning'}>
                                                    {p.isApproved ? 'VERIFIED' : 'PENDING'}
                                                </Badge>
                                            </td>
                                            <td className="small text-muted">{formatDate(p.createdAt)}</td>
                                            <td className="small text-muted">{formatDate(p.approvedAt)}</td>
                                            <td className="small text-muted" style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                {p.verificationNotes || 'N/A'}
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="outline-danger" 
                                                    className="py-1 px-3" 
                                                    size="sm" 
                                                    onClick={() => handleDeleteProperty(p._id)}
                                                >
                                                    RESCIND
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey="activity" title="PLATFORM ACTIVITY">
                            <div className="mt-3">
                                <Alert variant="info" className="mb-3">
                                    <small>Showing last 20 platform activities</small>
                                </Alert>
                                <Table variant="dark" hover responsive className="bg-transparent align-middle">
                                    <thead>
                                        <tr>
                                            <th>ACTION</th>
                                            <th>PERFORMED BY</th>
                                            <th>DETAILS</th>
                                            <th>TIMESTAMP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activityLogs.map(log => (
                                            <tr key={log._id}>
                                                <td>
                                                    <Badge bg={getActionBadgeColor(log.action)}>
                                                        {log.action.replace(/_/g, ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="small text-white">
                                                    {log.performedBy?.email || 'System'}
                                                    <br />
                                                    <span className="text-muted">{log.performedBy?.role?.toUpperCase()}</span>
                                                </td>
                                                <td className="small text-muted">{log.details}</td>
                                                <td className="small text-muted">{formatDate(log.createdAt)}</td>
                                            </tr>
                                        ))}
                                        {activityLogs.length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-5 text-muted h6">NO ACTIVITIES RECORDED</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        {user?.role === 'admin' && (
                            <Tab eventKey="subadmin" title="PROVISIONING">
                                <div className="p-4 glass-card mt-3 bg-dark bg-opacity-50">
                                    <h5 className="h6 mb-4 text-primary fw-bold">CREATE SUB-ADMIN IDENTITY</h5>
                                    <Form onSubmit={handleCreateSubadmin}>
                                        <Row className="g-4">
                                            <Col md={4}>
                                                <Form.Control 
                                                    className="p-3" 
                                                    placeholder="FULL NAME" 
                                                    value={subAdminData.name} 
                                                    onChange={e => setSubAdminData({...subAdminData, name: e.target.value})} 
                                                    required 
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control 
                                                    className="p-3" 
                                                    placeholder="EMAIL" 
                                                    type="email"
                                                    value={subAdminData.email} 
                                                    onChange={e => setSubAdminData({...subAdminData, email: e.target.value})} 
                                                    required 
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <Form.Control 
                                                    className="p-3" 
                                                    type="password" 
                                                    placeholder="ACCESS CODE" 
                                                    value={subAdminData.password} 
                                                    onChange={e => setSubAdminData({...subAdminData, password: e.target.value})} 
                                                    required 
                                                />
                                            </Col>
                                            <Col md={1}>
                                                <Button className="btn-premium w-100 p-3" type="submit">➕</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Tab>
                        )}
                    </Tabs>
                </div>
            </Container>

            {/* Approval Modal */}
            <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title>
                        {modalType === 'owner' ? 'Authorize Owner' : 'Verify Property'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <p className="mb-3">
                        {modalType === 'owner' 
                            ? `Authorize ${selectedItem?.email} as a property owner?`
                            : `Verify property "${selectedItem?.title}"?`
                        }
                    </p>
                    {modalType === 'property' && (
                        <Form.Group>
                            <Form.Label>Verification Notes (Optional)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                placeholder="Add any verification notes..."
                            />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="outline-secondary" onClick={() => setShowApprovalModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        className="btn-premium" 
                        onClick={modalType === 'owner' ? handleApproveOwner : handleApproveProperty}
                    >
                        Confirm Authorization
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Rejection Modal */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title>
                        {modalType === 'owner' ? 'Reject Owner' : 'Reject Property'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <p className="mb-3">
                        {modalType === 'owner' 
                            ? `Reject ${selectedItem?.email}? This will permanently remove their account.`
                            : `Reject property "${selectedItem?.title}"? This will permanently remove the listing.`
                        }
                    </p>
                    <Form.Group>
                        <Form.Label>Rejection Reason (Required)</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide a reason for rejection..."
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="outline-secondary" onClick={() => setShowRejectModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleReject}
                        disabled={!rejectReason.trim()}
                    >
                        Confirm Rejection
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard_Premium;
