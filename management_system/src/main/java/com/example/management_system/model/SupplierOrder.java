package com.example.management_system.model;

import jakarta.persistence.*;

@Entity
@Table(name = "supplier_orders")
public class SupplierOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to Supplier
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(columnDefinition = "TEXT") // Use "json" if your MySQL supports it
    private String items; // JSON array as string

    private Double total;

    // getters and setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public String getItems() { return items; }
    public void setItems(String items) { this.items = items; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}
