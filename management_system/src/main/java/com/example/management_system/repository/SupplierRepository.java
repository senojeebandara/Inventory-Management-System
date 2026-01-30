package com.example.management_system.repository;

import com.example.management_system.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByCompanyNameContainingIgnoreCase(String name);

    @Query("SELECT s FROM Supplier s WHERE " +
            "LOWER(s.companyName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(s.contactPersonFirstName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(s.contactPersonLastName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(s.companyContactNo) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(s.contactPersonPhone) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Supplier> searchSuppliers(@Param("term") String term);
}

