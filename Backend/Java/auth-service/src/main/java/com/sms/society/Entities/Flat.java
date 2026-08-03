package com.sms.society.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="flats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SocietyId", referencedColumnName = "Id", nullable = false)
    private Society society;

    @Column(name = "FlatNumber", nullable = false, length = 20)
    private String flatNumber;

    @Column(name = "FloorNumber")
    private Integer floorNumber;

    @Column(name = "FlatType", length = 50)
    private String flatType;

    @Column(name = "Status")
    private String status = "Vacant";

    @ManyToOne
    @JoinColumn(name = "OwnerId", referencedColumnName = "Id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "TenantId", referencedColumnName = "Id")
    private User tenant;

}
