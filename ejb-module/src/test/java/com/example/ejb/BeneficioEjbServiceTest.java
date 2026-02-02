package com.example.ejb;

import com.example.domain.Beneficio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class BeneficioEJBTest {

	@Mock
	private EntityManager em;

	@InjectMocks
	private BeneficioEjbService ejb;

	@Test
	void validaTransferenciaBeneficio() {
		Beneficio origem = new Beneficio(1L, "Origem", new BigDecimal("500"));
		Beneficio destino = new Beneficio(2L, "Destino", new BigDecimal("200"));

		doReturn(origem)
		.when(this.em)
		.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC);

		doReturn(destino)
		.when(this.em)
		.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC);

		this.ejb.transfer(1L, 2L, new BigDecimal("100"));

		assertEquals(new BigDecimal("400"), origem.getValor());
		assertEquals(new BigDecimal("300"), destino.getValor());
	}

	@Test
	void validaTransferenciaSaldoInsuficiente() {
		Beneficio origem = new Beneficio(1L, "Origem", new BigDecimal("50"));
		Beneficio destino = new Beneficio(2L, "Destino", new BigDecimal("200"));

		doReturn(origem)
		.when(this.em)
		.find(Beneficio.class, 1L, LockModeType.OPTIMISTIC);

		doReturn(destino)
		.when(this.em)
		.find(Beneficio.class, 2L, LockModeType.OPTIMISTIC);

		IllegalStateException exception = assertThrows(
				IllegalStateException.class,
				() -> ejb.transfer(1L, 2L, new BigDecimal("100"))
				);

		assertEquals(
				"Saldo insuficiente no benefício de origem.",
				exception.getMessage()
				);
	}

	@Test
	void validaTransferenciaMesmoBeneficio() {
		IllegalArgumentException exception = assertThrows(
				IllegalArgumentException.class,
				() -> ejb.transfer(1L, 1L, new BigDecimal("50"))
				);

		assertEquals(
				"Benefício de origem e destino não podem ser iguais.",
				exception.getMessage()
				);
	}
}
