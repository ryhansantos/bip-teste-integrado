package com.example.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.dto.CreateBeneficioRequest;
import com.example.backend.repository.BeneficioRepository;
import com.example.domain.Beneficio;
import com.example.ejb.BeneficioEjbService;

@Service
public class BeneficioService {

    private final BeneficioRepository repository;
    private final BeneficioEjbService ejbService;

    public BeneficioService(BeneficioRepository repository,
                            BeneficioEjbService ejbService) {
        this.repository = repository;
        this.ejbService = ejbService;
    }

    public Beneficio criar(final CreateBeneficioRequest request) {
    	String nomeNormalizado = request.nome().trim().toUpperCase();
        if (this.repository.existsByNome(nomeNormalizado)) {
        	throw new IllegalStateException("Já existe um benefício com esse nome.");
        }
        
        Beneficio beneficio = new Beneficio();
        beneficio.setNome(nomeNormalizado);
        beneficio.setDescricao(request.descricao());
        beneficio.setValor(request.valor());

        return this.repository.save(beneficio);
    }
    public List<Beneficio> listar() {
        return this.repository.findAll();
    }

    public Beneficio buscarPorId(Long id) {
        return this.repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Benefício não encontrado"));
    }

    public void deletar(final Long id) {
        this.repository.deleteById(id);
    }
    
    public void editar(final Long id, final CreateBeneficioRequest request) {
    	Beneficio beneficio = repository.findById(id)
    	        .orElseThrow(() -> new RuntimeException("Benefício não encontrado"));

    	    beneficio.setNome(request.nome());
    	    beneficio.setDescricao(request.descricao());
    	    beneficio.setValor(request.valor());
    	    beneficio.setAtivo(request.ativo());

    	   this.repository.save(beneficio);    
   }


    public void transferir(final Long fromId,final Long toId, final BigDecimal amount) {
        this.ejbService.transfer(fromId, toId, amount);
    }
}
