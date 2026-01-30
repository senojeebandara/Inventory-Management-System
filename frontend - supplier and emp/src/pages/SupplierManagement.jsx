import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';

const API_URL = 'http://localhost:8081/suppliers';

// Helper: Convert backend supplier to frontend shape
function backendToFrontend(s) {
  let street = '', city = '', state = '', zipCode = '', country = '';
  if (s.companyAddress) {
    const parts = s.companyAddress.split(',');
    street = parts[0]?.trim() || '';
    city = parts[1]?.trim() || '';
    state = parts[2]?.trim() || '';
    zipCode = parts[3]?.trim() || '';
    country = parts[4]?.trim() || '';
  }
  return {
    id: s.id,
    name: s.companyName,
    email: s.email,
    phone: s.companyContactNo,
    contactPerson: {
      firstName: s.contactPersonFirstName,
      lastName: s.contactPersonLastName,
      phone: s.contactPersonPhone,
    },
    address: {
      street,
      city,
      state,
      zipCode,
      country,
    },
  };
}

// Helper: Convert frontend supplier to backend shape
function frontendToBackend(s) {
  return {
    companyName: s.name,
    companyContactNo: s.phone,
    companyAddress: [
      s.address.street,
      s.address.city,
      s.address.state,
      s.address.zipCode,
      s.address.country,
    ].filter(Boolean).join(', '),
    contactPersonFirstName: s.contactPerson.firstName,
    contactPersonLastName: s.contactPerson.lastName,
    contactPersonPhone: s.contactPerson.phone,
    email: s.email,
  };
}

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800">Something went wrong</h3>
        <button 
          onClick={() => setHasError(false)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  return children;
};

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    contactPerson: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [editSupplier, setEditSupplier] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    contactPerson: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(API_URL);
      setSuppliers(response.data.map(backendToFrontend));
      setError(null);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to fetch suppliers');
      setSuppliers([]);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e, formType = 'new') => {
    const { name, value } = e.target;
    const updateSupplier = formType === 'new' ? setNewSupplier : setEditSupplier;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updateSupplier(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      updateSupplier(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addSupplier = async () => {
    try {
      const backendSupplier = frontendToBackend(newSupplier);
      console.log('Sending supplier data:', backendSupplier);
      
      const response = await axios.post(API_URL, backendSupplier);
      console.log('Response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const newSupplierFrontend = backendToFrontend(response.data);
      console.log('Converted supplier:', newSupplierFrontend);
      
      setSuppliers(prevSuppliers => [...prevSuppliers, newSupplierFrontend]);
      setIsAddModalOpen(false);
      setNewSupplier({
        name: '',
        email: '',
        phone: '',
        contactPerson: { firstName: '', lastName: '', phone: '' },
        address: { street: '', city: '', state: '', zipCode: '', country: '' }
      });
      setError(null);
    } catch (error) {
      console.error('Error adding supplier:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(`Failed to add supplier: ${error.response?.data?.message || error.message}`);
    }
  };

  const viewSupplierDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditSupplier({ ...supplier });
    setIsEditModalOpen(true);
  };

  const updateSupplier = async () => {
    try {
      const backendSupplier = frontendToBackend(editSupplier);
      const response = await axios.put(`${API_URL}/${editSupplier.id}`, backendSupplier);
      setSuppliers(suppliers.map(s => s.id === editSupplier.id ? backendToFrontend(response.data) : s));
      setIsEditModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error updating supplier:', error);
      setError('Failed to update supplier');
    }
  };

  const deleteSupplier = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`${API_URL}/${supplierId}`);
        setSuppliers(suppliers.filter(s => s.id !== supplierId));
        if (selectedSupplier && selectedSupplier.id === supplierId) {
          setIsDetailsModalOpen(false);
        }
        setError(null);
      } catch (error) {
        console.error('Error deleting supplier:', error);
        setError('Failed to delete supplier');
      }
    }
  };

  const validateForm = (supplier) => {
    const requiredFields = [
      supplier.name,
      supplier.email,
      supplier.phone,
      supplier.contactPerson.firstName,
      supplier.contactPerson.lastName,
      supplier.contactPerson.phone,
      supplier.address.street,
      supplier.address.city,
      supplier.address.state,
      supplier.address.zipCode,
      supplier.address.country
    ];
    return requiredFields.every(field => field && field.trim() !== '');
  };

  return (
    <ErrorBoundary>
      <div className="p-8 min-h-screen bg-gray-50">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
            <p className="text-sm text-gray-500">Track and manage your supplier information</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow flex items-center gap-2"
          >
            <FaPlus />
            <span>Add Supplier</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 pl-10 border border-gray-300 rounded"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Suppliers Table */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Contact Person</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="text-gray-600">{supplier.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{supplier.name}</div>
                    </td>
                    <td className="p-4">
                      <div>{supplier.phone}</div>
                      <div className="text-gray-500">{supplier.email}</div>
                    </td>
                    <td className="p-4">
                      <div>{supplier.contactPerson.firstName} {supplier.contactPerson.lastName}</div>
                      <div className="text-gray-500">{supplier.contactPerson.phone}</div>
                    </td>
                    <td className="p-4 text-center space-x-4">
                      <button
                        onClick={() => viewSupplierDetails(supplier)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditModal(supplier)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteSupplier(supplier.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center" colSpan="4">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Supplier Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add New Supplier</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newSupplier.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newSupplier.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newSupplier.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person First Name</label>
                  <input
                    type="text"
                    name="contactPerson.firstName"
                    value={newSupplier.contactPerson.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person Last Name</label>
                  <input
                    type="text"
                    name="contactPerson.lastName"
                    value={newSupplier.contactPerson.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person Phone</label>
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={newSupplier.contactPerson.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={newSupplier.address.street}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={newSupplier.address.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={newSupplier.address.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={newSupplier.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={newSupplier.address.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={addSupplier}
                  disabled={!validateForm(newSupplier)}
                  className={`w-full sm:w-auto px-4 py-2 rounded ${
                    validateForm(newSupplier)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Supplier Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Supplier</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Same fields as Add Supplier modal, but with editSupplier values */}
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editSupplier.name}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editSupplier.email}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editSupplier.phone}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person First Name</label>
                  <input
                    type="text"
                    name="contactPerson.firstName"
                    value={editSupplier.contactPerson.firstName}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person Last Name</label>
                  <input
                    type="text"
                    name="contactPerson.lastName"
                    value={editSupplier.contactPerson.lastName}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person Phone</label>
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={editSupplier.contactPerson.phone}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={editSupplier.address.street}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={editSupplier.address.city}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={editSupplier.address.state}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={editSupplier.address.zipCode}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={editSupplier.address.country}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={updateSupplier}
                  disabled={!validateForm(editSupplier)}
                  className={`w-full sm:w-auto px-4 py-2 rounded ${
                    validateForm(editSupplier)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Supplier Details Modal */}
        {isDetailsModalOpen && selectedSupplier && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Supplier Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Supplier ID</p>
                  <p className="font-medium">{selectedSupplier.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-medium">{selectedSupplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="font-medium">{selectedSupplier.phone}</p>
                  <p className="font-medium">{selectedSupplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">
                    {selectedSupplier.contactPerson.firstName} {selectedSupplier.contactPerson.lastName}
                  </p>
                  <p className="font-medium">{selectedSupplier.contactPerson.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedSupplier.address.street}</p>
                  <p className="font-medium">
                    {selectedSupplier.address.city}, {selectedSupplier.address.state} {selectedSupplier.address.zipCode}
                  </p>
                  <p className="font-medium">{selectedSupplier.address.country}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openEditModal(selectedSupplier);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSupplier(selectedSupplier.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SupplierManagement;