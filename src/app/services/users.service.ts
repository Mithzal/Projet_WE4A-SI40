import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  private ApiUrl = "http://localhost:7777/api/users";

  getAllUsers() {
    return this.http.get<User[]>(this.ApiUrl);
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.ApiUrl}/${user._id}`, user);
  }

  adduser(user: User) {
    return this.http.post<User>(this.ApiUrl, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.ApiUrl}/${id}`);
  }

  assignUeToUser(userId: string, ueId: string) {
    return this.http.put<User>(`${this.ApiUrl}/enroll/${userId}/${ueId}`,{});
  }

  getTeachers() {
    return this.http.get<User[]>(`${this.ApiUrl}/teachers`);
  }

  getStudents() {
    return this.http.get<User[]>(`${this.ApiUrl}/students`);
  }

}
