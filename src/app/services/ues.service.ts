import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Ue } from "../../models/ue.model";
import { Observable } from "rxjs";
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UEsService {
  private ApiUrl = "http://localhost:7777/api/ues";

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) {}

  // Get headers with auth token
  private getAuthHeaders(): HttpHeaders {
    const token = this.usersService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getData(): Observable<Ue[]> {
    // This endpoint is now public and doesn't require authentication
    return this.http.get<Ue[]>(this.ApiUrl);
  }

  addUe(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>(this.ApiUrl, ue, { headers: this.getAuthHeaders() });
  }

  updateUe(newUe: Ue): Observable<Ue> {
    return this.http.put<Ue>(`${this.ApiUrl}/${newUe._id}`, newUe, { headers: this.getAuthHeaders() });
  }

  deleteUe(id: string | undefined): Observable<void> {
    if (id != undefined){
      return this.http.delete<void>(`${this.ApiUrl}/${id}`, { headers: this.getAuthHeaders() });
    } else {
      throw new Error("ID is undefined");
    }
  }

  getNameById(id: string): Observable<Ue> {
    return this.http.get<any>(`${this.ApiUrl}/name/${id}`, { headers: this.getAuthHeaders() });
  }

  getDataById(id: string): Observable<Ue> {
    return this.http.get<Ue>(`${this.ApiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  addContentToUe(ueId: string, content: any): Observable<Ue> {
    return this.http.post<Ue>(`${this.ApiUrl}/content/${ueId}/`, content, { headers: this.getAuthHeaders() });
  }

  consultUe(ueId: string): Observable<any> {
    return this.http.post<any>(`${this.ApiUrl}/consult/${ueId}`, {}, { headers: this.getAuthHeaders() });
  }

}
