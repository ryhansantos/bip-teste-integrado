package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.example.domain.Beneficio;

@Stateless
@Component
public class BeneficioEjbService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void transfer(final Long fromId, final Long toId, final BigDecimal amount) {

        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("Benefício de origem e destino não podem ser iguais.");
        }

        Beneficio from = this.em.find(Beneficio.class, fromId, LockModeType.OPTIMISTIC);

        if (from == null) {
            throw new IllegalArgumentException("Benefício de origem não encontrado.");
        }
        
        Beneficio to = this.em.find(Beneficio.class, toId, LockModeType.OPTIMISTIC);

        if (to == null) {
            throw new IllegalArgumentException("Benefício de destino não encontrado.");
        }

        if (amount == null || from.getValor().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente no benefício de origem.");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));
    }
}
