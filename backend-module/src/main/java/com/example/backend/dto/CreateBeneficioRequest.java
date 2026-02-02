package com.example.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateBeneficioRequest(
		    @NotBlank(message = "O nome do benefício é obrigatório.")
		    @Size(max = 100, message = "O nome do benefício deve ter no máximo 100 caracteres.")
		    String nome,

		    @Size(max = 255)
		    String descricao,

		    @NotNull(message = "O valor do benefício é obrigatório.")
		    @Positive(message = "O valor do benefício deve ser maior que zero.")
		    BigDecimal valor,
		    
		    Boolean ativo) {
	}