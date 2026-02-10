package com.WDA.BookRentalStore.renter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "renter")
@Table(name = "renter")
@Getter
@Setter
@NoArgsConstructor
public class Renter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String renterName;
    private String renterEmail;
    private String renterTelephone;

    @Column(name = "renter_cpf")

    private String renterCpf;

    private String renterAddress;
    private Boolean activeNotifications = true;

    public Boolean getActiveNotifications() {
        return activeNotifications != null ? activeNotifications : false;
    }

    public Renter(Integer id, String renterName, String renterEmail, String renterTelephone, String renterCpf,
            String renterAddress, Boolean activeNotifications) {
        this.id = id;
        this.renterName = renterName;
        this.renterEmail = renterEmail;
        this.renterTelephone = renterTelephone;
        this.renterCpf = renterCpf;
        this.renterAddress = renterAddress;
        this.activeNotifications = activeNotifications;
    }

}
