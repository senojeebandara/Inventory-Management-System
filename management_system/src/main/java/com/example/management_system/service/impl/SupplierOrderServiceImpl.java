package com.example.management_system.service.impl;

import com.example.management_system.model.SupplierOrder;
import com.example.management_system.model.Supplier;
import com.example.management_system.repository.SupplierOrderRespository;
import com.example.management_system.repository.SupplierRepository;
import com.example.management_system.service.SupplierOrderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierOrderServiceImpl implements SupplierOrderService {
    private final SupplierOrderRespository orderRepo;
    private final SupplierRepository supplierRepo;

    public SupplierOrderServiceImpl(SupplierOrderRespository orderRepo, SupplierRepository supplierRepo) {
        this.orderRepo = orderRepo;
        this.supplierRepo = supplierRepo;
    }

    @Override
    public List<SupplierOrder> getAllOrders() {
        return orderRepo.findAll();
    }

    @Override
    public SupplierOrder createOrder(SupplierOrder order) {
        // Ensure supplier exists and is attached
        Supplier supplier = supplierRepo.findById(order.getSupplier().getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        order.setSupplier(supplier);
        return orderRepo.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepo.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepo.deleteById(id);
    }

}

