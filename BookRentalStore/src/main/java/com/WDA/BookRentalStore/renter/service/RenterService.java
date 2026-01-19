package com.WDA.BookRentalStore.renter.service;

import com.WDA.BookRentalStore.renter.dto.RenterDto;
import com.WDA.BookRentalStore.renter.exception.RenterAlreadyExistsException;
import com.WDA.BookRentalStore.renter.exception.RenterNotFoundException;
import com.WDA.BookRentalStore.renter.model.Renter;
import com.WDA.BookRentalStore.renter.repository.RenterRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RenterService {

    @Autowired
    RenterRepository repository;

    public List<Renter> getAll(){
        return repository.findAllByOrderByIdDesc();
    }

    public Renter getById(Integer id){
        return repository.findById(id).orElseThrow(() -> new RenterNotFoundException("Renter with ID: " + id + " not found"));

    }

    public Renter save(RenterDto dto){
        if (repository.findByRenterEmail(dto.renterEmail()).isPresent()){
            throw new RenterAlreadyExistsException("Já existe um locatário cadastrado com o e-mail" + dto.renterEmail());
        }

        if (repository.findByRenterCpf(dto.renterCpf()).isPresent()) {
            throw new RenterAlreadyExistsException("Já existe um locatário cadastrado com o CPF: " + dto.renterCpf());
        }

        Renter renter = new Renter();
        BeanUtils.copyProperties(dto, renter);
        return repository.save(renter);
    }

    public void delete(Integer id){
        Renter renter = getById(id);
        repository.delete(renter);
    }

    public Renter update(Integer id, RenterDto dto){
        Renter existingRenter = getById(id);

        Optional<Renter> renterWithSameEmail = repository.findByRenterEmail(dto.renterEmail());
        if (renterWithSameEmail.isPresent() && !renterWithSameEmail.get().getId().equals(id)){
            throw new RenterAlreadyExistsException("O e-mail '" + dto.renterEmail() + "' já está sendo usado por outro locatário");
        }

        Optional<Renter> renterWithSameDocument = repository.findByRenterCpf(dto.renterCpf());
        if (renterWithSameDocument.isPresent() && !renterWithSameDocument.get().getId().equals(id)) {
            throw new RenterAlreadyExistsException("O CPF '" + dto.renterCpf() + "' já está sendo usado por outro locatário.");
        }

        BeanUtils.copyProperties(dto, existingRenter);
        existingRenter.setId(id);
        return repository.save(existingRenter);
    }
}
