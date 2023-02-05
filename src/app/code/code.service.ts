import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Code } from './code';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  private apiServer = "http://localhost:8080";
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'skip': 'true'
    })
  }

  constructor(private http : HttpClient) { }

  create(code: any): Observable<Code> {
    console.log("###code=>"+JSON.stringify(code));
    return this.http
        .post<Code>(this.apiServer + '/codes/', JSON.stringify(code), this.httpOptions)
        .pipe(
          catchError(this.errorHandler)
        )
  }  
  
  getById(id: any): Observable<Code> {
    return this.http.get<Code>(this.apiServer + '/codes/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<Code[]> {
    return this.http.get<Code[]>(this.apiServer + '/codes/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // update(id, product): Observable<Product> {
  //   return this.httpClient.put<Product>(this.apiServer + '/products/' + id, JSON.stringify(product), this.httpOptions)
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  delete(id: any){
    return this.http.delete<Code>(this.apiServer + '/codes/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  errorHandler(error: any) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log(errorMessage);
     return throwError(errorMessage);
  }

}
