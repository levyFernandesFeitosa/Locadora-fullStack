package com.WDA.BookRentalStore.rental.service;

import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.book.service.BookService;
import com.WDA.BookRentalStore.rental.dto.RentalCreateDto;
import com.WDA.BookRentalStore.rental.dto.RentalDto;
import com.WDA.BookRentalStore.rental.exception.RentalBusinessException;
import com.WDA.BookRentalStore.rental.exception.RentalNotFoundException;
import com.WDA.BookRentalStore.rental.model.Rental;
import com.WDA.BookRentalStore.rental.model.Status;
import com.WDA.BookRentalStore.rental.repository.RentalRepository;
import com.WDA.BookRentalStore.renter.model.Renter;
import com.WDA.BookRentalStore.renter.service.RenterService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class RentalService {
    @Autowired
    RentalRepository repository;

    @Autowired
    BookService bookService;

    @Autowired
    RenterService renterService;

    // --- CRUD BÁSICO ---

    public List<Rental> getAll(){
        return repository.findAll();
    }

    public Rental getById(Integer id){
        return repository.findById(id).orElseThrow(() -> new RentalNotFoundException("Rental with ID: " + id + " not found"));
    }

    public void delete(Integer id){
        Rental rental = getById(id);
        repository.delete(rental);
    }

    // Método 'update' mantido, presumindo que 'RentalDto' é usado para edição
    // de campos como 'rentalDeadline' (data limite), e ele contém o ID.
    public Rental update(Integer id, RentalDto dto){
        Rental existingRental = getById(id);
        // Garante que apenas os campos do DTO sejam copiados (como a data limite)
        BeanUtils.copyProperties(dto, existingRental);
        return repository.save(existingRental);
    }

    // --- MÉTODO SAVE (CRIAÇÃO) - CORRIGIDO PARA USAR IDS DO RENTALCREATEDTO ---
    public Rental save (RentalCreateDto dto){
        // 1. Busca os objetos completos a partir dos IDs enviados pelo Frontend
        Renter renter = renterService.getById(dto.renterId());
        Book book = bookService.getById(dto.bookId());

        // 2. Verifica regras de negócio (duplicidade de aluguel)
        Optional<Rental> existingActiveRental = repository.findByRenterAndBookAndStatus(renter, book, Status.rented);

        if (existingActiveRental.isPresent()){
            throw new RentalBusinessException("O Locatário '" + renter.getRenterName() + "' já possui o livro '" + book.getBookTitle() + "' alugado.");
        }

        // 3. Atualiza o estoque (incrementa o 'bookInUse' do livro em 1)
        bookService.updateStockForRental(book.getId(), 1);

        // 4. Cria e popula o objeto Rental
        Rental rental = new Rental();

        // Mapeamento Manual do DTO para o Model, pois BeanUtils falhará com IDs
        // Data Limite é o único campo de data que vem do DTO no cadastro
        rental.setRentalDeadline(dto.rentalDeadline());

        rental.setRenter(renter);
        rental.setBook(book);

        // Define status e data de aluguel
        rental.setStatus(Status.rented);
        rental.setRentalRentedDate(LocalDate.now());

        // 5. Salva e retorna
        return repository.save(rental);
    }

    // --- MÉTODO DE DEVOLUÇÃO - CORRIGIDO PARA ESTOQUE E STATUS ---
    public Rental returnBook(Integer rentalId){
        Rental rental = getById(rentalId);

        // 1. Validação de status (garante que não foi devolvido)
        if(rental.getStatus() != Status.rented && rental.getStatus() != Status.late){
            throw new RentalBusinessException("O aluguel ID "+ rentalId + " já foi devolvido e não pode ser alterado.");
        }

        // 2. Atualiza o estoque (decrementa o 'bookInUse' do livro em 1)
        bookService.updateStockForRental(rental.getBook().getId(), -1);

        // 3. Define a data de devolução
        rental.setRentalReturnDate(LocalDate.now());

        // 4. Define o status final
        if (rental.getRentalReturnDate().isAfter(rental.getRentalDeadline())){
            rental.setStatus(Status.returned_with_delay);
        } else{
            rental.setStatus(Status.in_time);
        }

        // 5. Salva a devolução
        return repository.save(rental);
    }


}