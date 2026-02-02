import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.error('Erro HTTP:', error);

      let mensagem = 'Erro inesperado ao comunicar com o servidor';

      if (error.status === 0) {
        mensagem = 'Servidor indisponível';
      } else if (error.status >= 500) {
        mensagem = 'Erro interno do servidor';
      } else if (error.status === 404) {
        mensagem = 'Recurso não encontrado';
      } else if (error.error?.message) {
        mensagem = error.error.message;
      }

      alert(mensagem);

      return throwError(() => error);
    })
  );
};
