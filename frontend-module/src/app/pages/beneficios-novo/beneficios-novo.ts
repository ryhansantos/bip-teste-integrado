import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BeneficiosService } from '../../services/beneficios.service';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficios-novo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficios-novo.html',
  styleUrl: './beneficios-novo.css'
})
export class BeneficiosNovo {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private beneficioService = inject(BeneficiosService);

  nome = signal('');
  descricao = signal('');
  valor = signal<number | null>(null);
  ativo = signal(true);

  salvando = signal(false);
  tentouSalvar = signal(false);

  errosBackend = signal<Record<string, string>>({});

  beneficioId = signal<number | null>(null);
  isEdicao = signal(false);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      if (!Number.isNaN(id)) {
        this.beneficioId.set(id);
        this.isEdicao.set(true);
      } else {
        this.router.navigate(['/beneficios']);
      }
    }

    effect(() => {
      if (this.isEdicao() && this.beneficioId() !== null) {
        this.carregarBeneficio();
      }
    });
  }

  private carregarBeneficio(): void {
    this.beneficioService.buscarPorId(this.beneficioId()!).subscribe({
      next: (beneficio: Beneficio) => {
        this.nome.set(beneficio.nome);
        this.descricao.set(beneficio.descricao);
        this.valor.set(beneficio.valor);
        this.ativo.set(beneficio.ativo);
      },
      error: () => this.router.navigate(['/beneficios'])
    });
  }

  isValido(): boolean {
    const valor = this.valor();

    return (
      this.nome().trim().length > 0 &&
      valor !== null &&
      !Number.isNaN(valor) &&
      valor >= 0
    );
  }

  valorInvalido(): boolean {
    const valor = this.valor();
    return valor === null || Number.isNaN(valor) || valor < 0;
  }

  salvar(): void {
    this.tentouSalvar.set(true);
    this.errosBackend.set({});

    if (!this.isValido()) {
      return;
    }

    const valor = this.valor();
    if (valor === null || Number.isNaN(valor)) {
      return;
    }

    this.salvando.set(true);

    const payload = {
      nome: this.nome(),
      descricao: this.descricao(),
      valor: valor,
      ativo: this.isEdicao() ? this.ativo() : true
    };

    if (this.isEdicao() && this.beneficioId() !== null) {
      this.beneficioService
        .atualizar(this.beneficioId()!, payload)
        .subscribe({
          next: () => this.router.navigate(['/beneficios']),
          error: (err) => {
            this.salvando.set(false);

            if (err.status === 400 && err.error) {
              this.errosBackend.set(err.error);
            }
          }
        });
    } else {
      this.beneficioService
        .adicionar(payload)
        .subscribe({
          next: () => this.router.navigate(['/beneficios']),
          error: (err) => {
            this.salvando.set(false);

            if (err.status === 400 && err.error) {
              this.errosBackend.set(err.error);
            }
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/beneficios']);
  }
}
