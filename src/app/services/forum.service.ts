import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ForumMessage, Forums} from "../../models/forums.model";
import {Observable} from "rxjs";
import {UsersService} from "./users.service";

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:7777/api/forums/';

  constructor(private http: HttpClient, private usersService: UsersService) { }

  private getAuthHeaders() : HttpHeaders {
    const token = this.usersService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  }

  // Get all forums
  getAllForums() {
    return this.http.get<Forums[]>(this.apiUrl,{headers : this.getAuthHeaders()});
  }

  // Get all forums for a specific course (UE)
  getForumsByCourseId(courseId: string): Observable<Forums[]> {
    return this.http.get<Forums[]>(`${this.apiUrl}byCourse/${courseId}`, { headers: this.getAuthHeaders() });
  }

  getMessagesByForumId(forumId: string): Observable<ForumMessage[]> {
    return this.http.get<ForumMessage[]>(`${this.apiUrl}${forumId}`,{headers : this.getAuthHeaders()});
  }

  getForumById(forumId: string) {
    return this.http.get<Forums>(`${this.apiUrl}${forumId}`, {headers : this.getAuthHeaders()});
  }

  // Create a new forum
  createForum(courseId: string, title: string): Observable<Forums> {
    const forum: Forums = new Forums(courseId, title);
    return this.http.post<Forums>(this.apiUrl, forum,{headers : this.getAuthHeaders()});
  }

  //add a message to a forum
  addMessageToForum(forumId: string, message: { content: string, type: string, author: string }): Observable<Forums> {
    return this.http.put<Forums>(`${this.apiUrl}${forumId}/addMessages`, message, {headers : this.getAuthHeaders()});
  }

  //delete a forum by id
  deleteForumById(forumId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${forumId}`,{headers : this.getAuthHeaders()});
  }

  // Update forum title
  updateForumTitle(forumId: string, newTitle: string): Observable<Forums> {
    return this.http.put<Forums>(`${this.apiUrl}${forumId}/updateTitle`, { title: newTitle }, {headers : this.getAuthHeaders()});
  }

  // Delete a message from a forum by index
  deleteForumMessage(forumId: string, messageIndex: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${forumId}/messages/${messageIndex}`, { headers: this.getAuthHeaders() });
  }
}