package com.example.management_system.repository;

import com.example.management_system.model.SupplierOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierOrderRespository extends JpaRepository<SupplierOrder, Long> {
}
