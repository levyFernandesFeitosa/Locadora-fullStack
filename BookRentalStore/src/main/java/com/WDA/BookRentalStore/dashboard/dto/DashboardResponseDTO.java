package com.WDA.BookRentalStore.dashboard.dto;

import com.WDA.BookRentalStore.rental.dto.RentalDto;
import com.WDA.BookRentalStore.renter.dto.RenterDto;

import java.util.List;

public record DashboardResponseDTO(
        // Métricas Simples (Cards)
        Long totalLocatarios,
        Long totalAlugueis,

        // Contadores para o Gráfico de Pizza (Distribuição)
        Long entreguesNoPrazo, // IN_TIME, por exemplo
        Long entreguesAtraso, // RETURNED_WITH_DELAY, por exemplo
        Long alugueisAtrasados, // LATE (Em aberto)

        // Livros Mais Alugados (Gráfico de Barra)
        List<BookMoreRentedDTO> livrosMaisAlugados,

        // Locatários (Tabela) - O Vue espera esta lista para processar as linhas
        List<RenterDto> locatarios,

        // Aluguéis (Para a Tabela - O Vue espera esta lista para calcular métricas por Locatário)
        List<RentalDto> alugueis
) {
}
