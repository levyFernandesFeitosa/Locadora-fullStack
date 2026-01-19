package com.WDA.BookRentalStore.publisher.service;

import com.WDA.BookRentalStore.publisher.dto.PublishersDto;
import com.WDA.BookRentalStore.publisher.exception.InvalidPublisherSiteException;
import com.WDA.BookRentalStore.publisher.exception.PublishersAlreadyExistsException;
import com.WDA.BookRentalStore.publisher.exception.PublishersNotFoundException;
import com.WDA.BookRentalStore.publisher.model.Publishers;
import com.WDA.BookRentalStore.publisher.repository.PublishersRepository;
import com.WDA.BookRentalStore.renter.model.Renter;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;

@Service
public class PublishersService {
    @Autowired
    PublishersRepository repository;

    private final WebClient webClient = WebClient.create();

    public List<Publishers> getAll(){
        return repository.findAllByOrderByIdDesc();
    }

    public Publishers getById(Integer id){
        return repository.findById(id).orElseThrow(() -> new PublishersNotFoundException("Publisher with ID: " + id + " not found"));

    }

    public Publishers save(PublishersDto dto){
        if (repository.findByPublishersEmail(dto.publishersEmail()).isPresent()){
            throw new PublishersNotFoundException("O e-mail '" + dto.publishersEmail() + "' já está cadastrado por outra editora.");
        }
        if (dto.publishersSite() != null && !dto.publishersSite().isBlank()) {
            validatePublisherSite(dto.publishersSite());
        }

        Publishers publishers = new Publishers();
        BeanUtils.copyProperties(dto, publishers);
        return repository.save(publishers);
    }

    public void delete(Integer id){
        Publishers publishers = getById(id);
        repository.delete(publishers);
    }

    public Publishers update(Integer id, PublishersDto dto){
        Optional<Publishers> publisherWithSameEmail = repository.findByPublishersEmail(dto.publishersEmail());
        if (publisherWithSameEmail.isPresent() && !publisherWithSameEmail.get().getId().equals(id)) {
            throw new PublishersAlreadyExistsException("O e-mail '" + dto.publishersEmail() + "' já está sendo usado por outra editora.");
        }

        if (dto.publishersSite() != null && !dto.publishersSite().isBlank()) {
            validatePublisherSite(dto.publishersSite());
        }

        Publishers existingPublishers = getById(id);
        BeanUtils.copyProperties(dto, existingPublishers);
        existingPublishers.setId(id);

        return repository.save(existingPublishers);
    }
    private void validatePublisherSite(String siteUrl) {
        String url = siteUrl;
        if (!url.toLowerCase().startsWith("http://") && !url.toLowerCase().startsWith("https://")) {
            url = "http://" + url;
        }

        try {
            org.springframework.http.HttpStatus status = (HttpStatus) webClient.head()
                    .uri(url)
                    .retrieve()
                    .toBodilessEntity()
                    .block() // Bloqueia para obter o resultado
                    .getStatusCode();

            if (!status.is2xxSuccessful()) {
                throw new com.WDA.BookRentalStore.publisher.exception.InvalidPublisherSiteException(
                        "O site da editora retornou um status HTTP de erro (" + status.value() + "). Verifique o endereço."
                );
            }
        } catch (Exception e) {
            throw new com.WDA.BookRentalStore.publisher.exception.InvalidPublisherSiteException(
                    "Não foi possível acessar o site '" + url + "'. Erro de conexão ou URL não existe. Detalhe: " + e.getLocalizedMessage()
            );
        }
    }
}
