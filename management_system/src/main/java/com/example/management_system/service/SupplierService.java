package com.example.management_system.service;

import com.example.management_system.model.Supplier;

import java.util.List;
import java.util.Optional;

public interface SupplierService {

    List<Supplier> getAllSuppliers();
    Optional<Supplier> getSupplierById(Long id);
    Supplier saveSupplier(Supplier supplier);
    void deleteSupplier(Long id);
    List<Supplier> searchSuppliers(String searchTerm);

}

