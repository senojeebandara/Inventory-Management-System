package com.example.management_system.service;

import com.example.management_system.model.SupplierOrder;
import java.util.List;

public interface SupplierOrderService {
    List<SupplierOrder> getAllOrders();
    SupplierOrder createOrder(SupplierOrder order);
    void deleteOrder(Long id);

}

