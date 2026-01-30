package com.example.management_system.repository;

import com.example.management_system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Custom query methods to support frontend filtering
    List<Employee> findByDepartment(String department);

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(e.position) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(e.department) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(e.phone) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Employee> searchEmployees(@Param("term") String term);

    // For salary sorting
    List<Employee> findAllByOrderBySalaryAsc();
    List<Employee> findAllByOrderBySalaryDesc();
}
