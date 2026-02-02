import { Routes } from '@angular/router';

import { Beneficios } from './pages/beneficios/beneficios';
import { BeneficiosNovo } from './pages/beneficios-novo/beneficios-novo';
import { BeneficiosTransferirComponent } from './pages/beneficios-transferir/beneficios-transferir';

export const routes: Routes = [
  { path: '', redirectTo: 'beneficios', pathMatch: 'full' },

  { path: 'beneficios', component: Beneficios },
  { path: 'beneficios/novo', component: BeneficiosNovo },
  { path: 'beneficios/editar/:id', component: BeneficiosNovo },

  { path: 'beneficios/transferir', component: BeneficiosTransferirComponent }
];
