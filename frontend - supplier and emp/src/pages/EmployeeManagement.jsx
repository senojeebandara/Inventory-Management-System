import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from 'react-icons/fa';

const API_URL = 'http://localhost:8081/api/employees';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: 'employee',
    nicNumber: '',
    dateOfBirth: '',
    hireDate: '',
    salary: 0,
    address: ''
  });
  const [editEmployee, setEditEmployee] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: '',
    nicNumber: '',
    dateOfBirth: '',
    hireDate: '',
    salary: 0,
    address: ''
  });

  useEffect(() => {
    if (searchTerm) {
      searchEmployees(searchTerm);
    } else {
      fetchEmployees();
    }
  }, [searchTerm]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const searchEmployees = async (term) => {
    try {
      const response = await axios.get(`${API_URL}/search?term=${term}`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error searching employees:', error);
    }
  };

  const handleInputChange = (e, formType = 'new') => {
    const { name, value } = e.target;
    const updateEmployee = formType === 'new' ? setNewEmployee : setEditEmployee;
    updateEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEmployee = async () => {
    try {
      if (!validateForm(newEmployee)) {
        alert('Please fill all required fields');
        return;
      }
      const existingEmployee = employees.find(emp => emp.id === newEmployee.id);
      if (existingEmployee) {
        alert('Employee ID already exists. Please use a different ID.');
        return;
      }

      console.log('Sending employee data:', newEmployee);
      const response = await axios.post(API_URL, newEmployee);
      console.log('Server response:', response.data);
      
      setEmployees([...employees, response.data]);
      setIsAddModalOpen(false);
      setNewEmployee({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        role: 'employee',
        nicNumber: '',
        dateOfBirth: '',
        hireDate: '',
        salary: 0,
        address: ''
      });
    } catch (error) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        alert(`Failed to add employee: ${error.response.data.message || error.response.data || 'Server error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('Failed to add employee: No response from server. Please check if the server is running.');
      } else {
        console.error('Error message:', error.message);
        alert(`Failed to add employee: ${error.message}`);
      }
    }
  };

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditEmployee({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      role: employee.role,
      nicNumber: employee.nicNumber,
      dateOfBirth: employee.dateOfBirth,
      hireDate: employee.hireDate,
      salary: employee.salary,
      address: employee.address
    });
    setIsEditModalOpen(true);
  };

  const updateEmployee = async () => {
    try {
      if (!validateForm(editEmployee)) {
        alert('Please fill all required fields');
        return;
      }
      const existingEmployee = employees.find(emp => emp.id === editEmployee.id && emp.id !== editEmployee.id);
      if (existingEmployee) {
        alert('Employee ID already exists. Please use a different ID.');
        return;
      }
      const response = await axios.put(`${API_URL}/${editEmployee.id}`, editEmployee);
      setEmployees(employees.map(e => e.id === editEmployee.id ? response.data : e));
      setIsEditModalOpen(false);
    } catch (error) {
      alert('Failed to update employee');
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${API_URL}/${employeeId}`);
      setEmployees(employees.filter(e => e.id !== employeeId));
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      alert('Failed to delete employee');
      console.error('Error deleting employee:', error);
    }
  };

  const validateForm = (employee) => {
    const requiredFields = [
      employee.id,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.phone,
      employee.position,
      employee.department,
      employee.nicNumber,
      employee.dateOfBirth,
      employee.hireDate,
      employee.address
    ];
    return requiredFields.every(field => field && field.trim() !== '');
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
          <p className="text-sm text-gray-500">Track and manage your employee information</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
        >
          + Add Employee
        </button>
      </div>

      <input
        type="text"
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mb-6 p-2 border border-gray-300 rounded"
      />

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="p-4">{employee.id}</td>
                  <td className="p-4">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="p-4">{employee.position}</td>
                  <td className="p-4">{employee.department}</td>
                  <td className="p-4">
                    <div>{employee.phone}</div>
                    <div className="text-gray-500">{employee.email}</div>
                  </td>
                  <td className="p-4 text-center space-x-4">
                    <button
                      onClick={() => viewEmployeeDetails(employee)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => openEditModal(employee)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteEmployee(employee.id)}
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
                <td className="p-4 text-center" colSpan="5">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee ID</label>
                <input
                  type="text"
                  name="id"
                  value={newEmployee.id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={newEmployee.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newEmployee.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIC Number</label>
                <input
                  type="text"
                  name="nicNumber"
                  value={newEmployee.nicNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newEmployee.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  value={newEmployee.hireDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={newEmployee.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newEmployee.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addEmployee}
                disabled={!validateForm(newEmployee)}
                className={`px-4 py-2 rounded ${
                  validateForm(newEmployee)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee ID</label>
                <input
                  type="text"
                  name="id"
                  value={editEmployee.id}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editEmployee.firstName}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editEmployee.lastName}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editEmployee.email}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editEmployee.phone}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={editEmployee.position}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={editEmployee.department}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NIC Number</label>
                <input
                  type="text"
                  name="nicNumber"
                  value={editEmployee.nicNumber}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editEmployee.dateOfBirth}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  value={editEmployee.hireDate}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={editEmployee.salary}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editEmployee.address}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateEmployee}
                disabled={!validateForm(editEmployee)}
                className={`px-4 py-2 rounded ${
                  validateForm(editEmployee)
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

      {/* View Employee Details Modal */}
      {isDetailsModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium">{selectedEmployee.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Information</p>
                <p className="font-medium">{selectedEmployee.phone}</p>
                <p className="font-medium">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NIC Number</p>
                <p className="font-medium">{selectedEmployee.nicNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{selectedEmployee.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium">{selectedEmployee.hireDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">${selectedEmployee.salary}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedEmployee.address}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  openEditModal(selectedEmployee);
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEmployee(selectedEmployee.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;