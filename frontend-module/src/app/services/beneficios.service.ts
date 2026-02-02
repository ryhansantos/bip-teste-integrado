import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Beneficio } from '../models/beneficio.model';
import { TransferRequest } from '../models/transfer.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {

  private readonly baseUrl = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.baseUrl}/${id}`);
  }

  adicionar(payload: Omit<Beneficio, 'id'>): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.baseUrl, payload);
  }

  atualizar(
    id: number,
    payload: {
      nome: string;
      descricao: string;
      valor: number;
      ativo: boolean;
    }
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${id}`,
      payload
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

transferir(request: TransferRequest): Observable<void> {
  return this.http.post<void>(
    `${this.baseUrl}/transfer`,
    request
  );
}
}
