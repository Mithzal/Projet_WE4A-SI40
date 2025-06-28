import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Files } from "../../models/file.model";
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = "http://localhost:7777/api/files";

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) {}

  // Méthode pour uploader un fichier
  uploadFile(file: File, coursId: string, userId: string, description: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Ajouter l'ID utilisateur s'il est fourni
    formData.append('uploadedBy', userId);
    formData.append('coursId', coursId);
    formData.append('description', description || '');
    formData.append('nom', file.name);
    formData.append('type', file.type || '');

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: this.usersService.getAuthHeaders() });
  }

  getFiles(): Observable<any> {
    return this.http.get<Files[]>(`${this.apiUrl}`, { headers: this.usersService.getAuthHeaders() });
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileId}`, {
      responseType: 'blob',
      headers: this.usersService.getAuthHeaders()
    });
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${fileId}`, { headers: this.usersService.getAuthHeaders() });
  }

  getFileName(fileId : string){
    return this.http.get(`${this.apiUrl}/name/${fileId}`, { headers: this.usersService.getAuthHeaders() });
  }

}
