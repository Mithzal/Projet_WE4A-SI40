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
  getData():Observable<Ue[]> {
    return this.http.get<Ue[]>("http://localhost:7777/api/ues");
  }

  addUe(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>("http://localhost:7777/api/ues", ue);
  }

  updateUe(newUe: Ue): Observable<Ue> {
    return this.http.put<Ue>(`http://localhost:7777/api/ues/${newUe._id}`, newUe);
  }

  deleteUe(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`http://localhost:7777/api/ues/${id}`);
  }


}
