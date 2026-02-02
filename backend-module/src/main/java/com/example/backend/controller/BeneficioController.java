package com.example.backend.controller;

import com.example.backend.dto.CreateBeneficioRequest;
import com.example.backend.dto.TransferRequest;
import com.example.backend.service.BeneficioService;
import com.example.domain.Beneficio;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(
	    origins = "http://localhost:4200",
	    methods = {
	        RequestMethod.GET,
	        RequestMethod.POST,
	        RequestMethod.PUT,
	        RequestMethod.OPTIONS
	    },
	    allowedHeaders = "*"
	)
@RestController
@RequestMapping("/api/v1/beneficios")
public class BeneficioController {

    private final BeneficioService service;

    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Beneficio criar(@Valid @RequestBody CreateBeneficioRequest request) {
        return this.service.criar(request);
    }

    @GetMapping
    public List<Beneficio> listar() {
        return this.service.listar();
    }

    @GetMapping("/{id}")
    public Beneficio buscar(@PathVariable("id") Long id) {
        return this.service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable("id") Long id) {
    	this.service.deletar(id);
    }
    
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void editar(@PathVariable("id") Long id, @Valid @RequestBody CreateBeneficioRequest request) {
    	this.service.editar(id,request);
    }


    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@Valid @RequestBody TransferRequest request) {
    	this.service.transferir(
                request.fromId(),
                request.toId(),
                request.amount()
        );
    }
}
