package com.example.backend.repository;

import com.example.domain.Beneficio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeneficioRepository extends JpaRepository<Beneficio, Long> {
	
	boolean existsByNome(String nome);

}
