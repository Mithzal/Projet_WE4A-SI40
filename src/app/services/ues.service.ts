import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Ue} from "../../models/ue.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UEsService {
  //ue!: Ue
  constructor(private http:HttpClient) {

  }
  getData():Observable<Ue[]> {
    return this.http.get<Ue[]>("http://localhost:7777/api/ues");
  }
}
