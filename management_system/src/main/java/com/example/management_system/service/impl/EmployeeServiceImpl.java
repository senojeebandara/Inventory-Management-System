package com.example.management_system.service.impl;

import com.example.management_system.model.Employee;
import com.example.management_system.repository.EmployeeRepository;
import com.example.management_system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            Employee existingEmployee = employee.get();
            existingEmployee.setFirstName(employeeDetails.getFirstName());
            existingEmployee.setLastName(employeeDetails.getLastName());
            existingEmployee.setEmail(employeeDetails.getEmail());
            existingEmployee.setPhone(employeeDetails.getPhone());
            existingEmployee.setDepartment(employeeDetails.getDepartment());
            existingEmployee.setPosition(employeeDetails.getPosition());
            existingEmployee.setAddress(employeeDetails.getAddress());
            existingEmployee.setSalary(employeeDetails.getSalary());
            existingEmployee.setNicNumber(employeeDetails.getNicNumber());
            existingEmployee.setDateOfBirth(employeeDetails.getDateOfBirth());
            existingEmployee.setRole(employeeDetails.getRole());
            return employeeRepository.save(existingEmployee);
        }
        return null;
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public List<Employee> searchEmployees(String term) {
        return employeeRepository.searchEmployees(term);
    }
} 