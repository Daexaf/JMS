import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalServiceService {
  private apiUrl = 'assets/employees.json';
  private employeesSubject = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.employeesSubject.asObservable();
  }

  getEmployeeById(employeeId: number): Observable<any> {
    const getUrl = `/api/employees/${employeeId}`;

    return this.httpClient.get(getUrl);
  }

  addEmployee(employee: any): Observable<any> {
    const httpOptions = this.getHttpOptions();
    return this.httpClient.post(this.apiUrl, employee, httpOptions)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  updateEmployeesData(data: any): void {
    this.employeesSubject.next(data);
  }

  deleteEmployee(employeeId: number): Observable<any> {
    const deleteUrl = `/api/employees/${employeeId}`;

    return this.httpClient.delete(deleteUrl);
  }

  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error: any) {
    return throwError(error);
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
  }
}
