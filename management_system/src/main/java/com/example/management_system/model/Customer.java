package com.example.management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDate registrationDate;
    private LocalDate birthDate;
    private int loyaltyPoints;


    public Customer() {}

    public Customer(String firstName, String lastName, String email, String phoneNumber, String address, LocalDate registrationDate, LocalDate birthDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.registrationDate = registrationDate;
        this.birthDate = birthDate;

    }

        // Getters and Setters
        public Long getId() {
            return id;
        }

    public void setId(Long id) {
        this.id = id;
    }

 
    public String getFirstName() {
        return firstName;
    }

    public void setName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {return lastName;}

    public void setLastName(String lastName) {this.lastName = lastName;}

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}

    public String getPhoneNumber() {return phoneNumber;}

    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber;}

    public String getAddress() {return address;}

    public void setAddress(String address) {this.address = address;}

    public LocalDate getRegistrationDate() {return registrationDate;}

    public void setRegistrationDate(LocalDate registrationDate) {this.registrationDate = registrationDate;}

    public LocalDate getBirthDate() {return birthDate;}

    public void setBirthDate(LocalDate birthDate) {this.birthDate = birthDate;}

    public int getLoyaltyPoints() {return loyaltyPoints;}

    public  void setLoyaltyPoints(int loyaltyPoints) {this.loyaltyPoints = loyaltyPoints;}



}