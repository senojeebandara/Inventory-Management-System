package com.example.management_system.controller;

import com.example.management_system.model.SupplierOrder;
import com.example.management_system.service.SupplierOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierOrderController {
    private final SupplierOrderService orderService;

    public SupplierOrderController(SupplierOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<SupplierOrder> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public SupplierOrder createOrder(@RequestBody SupplierOrder order) {
        return orderService.createOrder(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
