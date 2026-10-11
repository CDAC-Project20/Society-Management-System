package com.sms.society.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="societies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "SocietyName", nullable = false, length = 200)
    private String societyName;

    @Column(name = "RegistrationNumber", unique = true, length = 100)
    private String registrationNumber;

    @Column(name = "Address", length = 500)
    private String address;

    @Column(name = "City", length = 100)
    private String city;

    @Column(name = "State", length = 100)
    private String state;

    @Column(name = "Pincode", length = 20)
    private String pincode;

    @Column(name = "ContactEmail", length = 255)
    private String contactEmail;

    @Column(name = "ContactPhone", length = 20)
    private String contactPhone;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Column(name = "Status", length = 20)
    private String status = "PENDING";

}
