package com.example.management_system.repository;

import com.example.management_system.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Custom query to count customers registered this week
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.registrationDate >= :startOfWeek AND c.registrationDate <= :endOfWeek")
    long countNewCustomersThisWeek(LocalDate startOfWeek, LocalDate endOfWeek);
}

