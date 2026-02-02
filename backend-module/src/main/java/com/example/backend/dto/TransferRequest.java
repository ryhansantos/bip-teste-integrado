package com.example.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferRequest(

        @NotNull(message = "O benefício de origem é obrigatório")
        Long fromId,

        @NotNull(message = "O benefício de destino é obrigatório")
        Long toId,

        @NotNull(message = "O valor da transferência é obrigatório")
        @Positive(message = "O valor da transferência deve ser maior que zero")
        BigDecimal amount
) {
}