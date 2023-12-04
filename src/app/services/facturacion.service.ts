// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FacturacionService  {
  private apiUrl = 'https://api.cafebritt.com/test/functions/api.cfc';
  //private apiUrl = '/test/functions/api.cfc';
  public token = '8673218090'; 

  constructor(private http: HttpClient) {}

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('token', this.token);
  }

  obtenerFactura(numeroFactura: number, linea?: number): Observable<any> {
    if (numeroFactura === 0 && linea === 0) {
      return of();
    }

    const request =`${this.apiUrl}?method=ObtieneFactura&token=${this.token}&numero_factura=${numeroFactura}`;

    return this.http.get<any>(request)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener factura:', error);
          return throwError(error);
        })
      );
  }

  buscarProductos(producto: string): Observable<string[]> {
     const request =`${this.apiUrl}?method=BuscarProducto&token=${this.token}&producto=${producto}`;
    return this.http.get<any>(request)
      .pipe(
        catchError((error) => {
          console.error('Error al buscar productos:', error);
          return throwError(error);
        })
      );
  }

  agregarDetalle(numeroFactura: number, codigoArticulo: string, cantidad: number): Observable<any> {
    const request =`${this.apiUrl}?method=AgregaDetalle&token=${this.token}&codigo_articulo=${codigoArticulo}&cantidad=${cantidad}&numero_factura=${numeroFactura}`;
    return this.http.post<any>(request, {})
      .pipe(
        catchError((error) => {
          console.error('Error al agregar detalle:', error);
          return throwError(error);
        })
      );
  }

  borrarDetalle(numeroFactura: number, linea: number): Observable<any> {
    const request =`${this.apiUrl}?method=BorrarDetalle&token=${this.token}&linea=${linea}&numero_factura=${numeroFactura}`;
    return this.http.post<any>(request, { })
      .pipe(
        catchError((error) => {
          console.error('Error al borrar detalle:', error);
          return throwError(error);
        })
      );
  }

 crearFactura(numeroFactura: number, fecha: string): Observable<any> {
  const request =`${this.apiUrl}?method=CreaFactura&token=${this.token}&numero_factura=${numeroFactura}&fecha=${fecha}`;
      return this.http.post<any>(request,{}).pipe(
        catchError((error) => {
          console.error('Error al borrar detalle:', error);
          return throwError(error);
        })
      );
  }
}
