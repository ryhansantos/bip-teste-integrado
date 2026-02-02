import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { BeneficiosService } from '../../services/beneficios.service';
import { Beneficio } from '../../models/beneficio.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css'
})
export class Beneficios {

  private beneficioService: BeneficiosService =
    inject(BeneficiosService);

  private router: Router = inject(Router);

  beneficios = signal<Beneficio[]>([]);
  carregando = signal(true);
  excluindo = signal<number | null>(null);

  constructor() {
    this.carregarBeneficios();
  }

  private carregarBeneficios(): void {
    this.carregando.set(true);

    this.beneficioService.listar().subscribe({
      next: (res: Beneficio[]) => this.beneficios.set(res),
      error: () => this.beneficios.set([]),
      complete: () => this.carregando.set(false)
    });
  }

  excluir(id: number): void {
    if (this.excluindo() !== null) return;

    const confirmar = confirm('Deseja realmente excluir este benefício?');
    if (!confirmar) return;

    this.excluindo.set(id);

    this.beneficioService.remover(id).subscribe({
      next: () => {
        this.excluindo.set(null);
        this.carregarBeneficios();
      },
      error: () => this.excluindo.set(null)
    });
  }

  editar(id: number): void {
    this.router.navigate(['/beneficios/editar', id]);
  }
}
