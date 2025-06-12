import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Ue} from "../../models/ue.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UEsService {

  constructor(private http:HttpClient) {
  }

  private ApiUrl = "http://localhost:7777/api";
  getData():Observable<Ue[]> {
    return this.http.get<Ue[]>(this.ApiUrl+"/ues");
  }

  addUe(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>(`${this.ApiUrl}/ues`, ue);
  }

  updateUe(newUe: Ue): Observable<Ue> {
    return this.http.put<Ue>(`${this.ApiUrl}/ues/${newUe._id}`, newUe);
  }

  deleteUe(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.ApiUrl}/ues/${id}`);
  }


}
