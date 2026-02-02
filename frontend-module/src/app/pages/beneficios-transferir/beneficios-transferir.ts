import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BeneficiosService } from '../../services/beneficios.service';
import { Beneficio } from '../../models/beneficio.model';
import { TransferRequest } from '../../models/transfer.model';

@Component({
  selector: 'app-beneficios-transferir',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficios-transferir.html',
  styleUrls: ['./beneficios-transferir.css']
})
export class BeneficiosTransferirComponent implements OnInit {

  beneficios: Beneficio[] = [];

  // SELECTS SEMPRE STRING
  origemId: string = '';
  destinoId: string = '';
  valor: number | null = null;

  tentouSalvar = false;
  salvando = false;

  mensagensErro: string[] = [];

  constructor(
    private beneficiosService: BeneficiosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.beneficiosService.listar().subscribe({
      next: dados => {
        this.beneficios = dados;
      }
    });
  }

  formularioValido(): boolean {
    return (
      this.origemId !== '' &&
      this.destinoId !== '' &&
      this.origemId !== this.destinoId &&
      this.valor !== null &&
      this.valor > 0
    );
  }

  transferir(): void {
    this.tentouSalvar = true;
    this.mensagensErro = [];

    if (!this.formularioValido()) {
      return;
    }

    this.salvando = true;

    const request: TransferRequest = {
      fromId: Number(this.origemId),
      toId: Number(this.destinoId),
      amount: this.valor!
    };

    this.beneficiosService.transferir(request).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/beneficios']);
      },
      error: err => {
        this.salvando = false;

        if (err.status === 400 && err.error) {
          Object.values(err.error).forEach((msg: any) =>
            this.mensagensErro.push(String(msg))
          );
        } else {
          this.mensagensErro.push(
            'Erro inesperado ao realizar a transferência.'
          );
        }
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/beneficios']);
  }
}
