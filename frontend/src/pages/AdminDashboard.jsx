import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Tabs, Tab } from 'react-bootstrap';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
    const [owners, setOwners] = useState([]);
    const [properties, setProperties] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPendingOwners();
        fetchProperties();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchPendingOwners = async () => {
        try {
            const res = await api.get('/admin/pending-owners');
            setOwners(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProperties = async () => {
        try {
            const res = await api.get('/admin/properties');
            setProperties(res.data);
        } catch (err) { console.error(err); }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/approve-owner/${id}`);
            fetchPendingOwners();
        } catch (err) { console.error(err); }
    };

    const handleDeleteProperty = async (id) => {
         if(!window.confirm('Are you sure you want to delete this property?')) return;
         try {
             await api.delete(`/admin/properties/${id}`);
             fetchProperties();
         } catch(err) { console.error(err); }
    };

    return (
        <Container className="mt-4">
            <h2>Admin Dashboard</h2>
            <Tabs defaultActiveKey="pending" className="mb-3">
                <Tab eventKey="pending" title="Pending Approvals">
                    <div className="mb-3">
                        <h4>Pending Owner Approvals</h4>
                        <Table striped bordered hover>
                             {/* ... existing table code ... */}
                             <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.length > 0 ? owners.map(owner => (
                                    <tr key={owner._id}>
                                        <td>{owner.email}</td>
                                        <td>{owner.role}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleApprove(owner._id)}>Approve</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center">No pending approvals</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="governance" title="Platform Governance">
                    <div className="mb-3">
                         <h4>All Properties</h4>
                         <Table striped bordered>
                             <thead><tr><th>Title</th><th>Owner</th><th>Location</th><th>Action</th></tr></thead>
                             <tbody>
                                 {properties.map(p => (
                                     <tr key={p._id}>
                                         <td>{p.title}</td>
                                         <td>{p.owner?.email}</td>
                                         <td>{p.location}</td>
                                         <td>
                                             <Button variant="danger" size="sm" onClick={() => handleDeleteProperty(p._id)}>Remove</Button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </Table>
                    </div>
                </Tab>
                <Tab eventKey="users" title="User Management">
                    <h4>All Users</h4>
                    <Table striped bordered hover>
                        <thead><tr><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.role === 'owner' ? (u.isApproved ? 'Approved' : 'Pending') : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;
