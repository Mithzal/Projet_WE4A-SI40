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

  private ApiUrl = "http://localhost:7777/api/ues";
  getData():Observable<Ue[]> {
    return this.http.get<Ue[]>(this.ApiUrl);
  }

  addUe(ue: Ue): Observable<Ue> {
    return this.http.post<Ue>(this.ApiUrl, ue);
  }

  updateUe(newUe: Ue): Observable<Ue> {
    return this.http.put<Ue>(`${this.ApiUrl}/${newUe._id}`, newUe);
  }

  deleteUe(id: string | undefined): Observable<void> {
    if (id != undefined){
      return this.http.delete<void>(`${this.ApiUrl}/${id}`);
    }else {
      throw new Error("ID is undefined");
    }
  }


}
