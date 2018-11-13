import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/socialnet';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  SendMessage(senderId, reciverId, reciverName, message): Observable<any> {
    return this.http.post(`${BASEURL}/chat-messages/${senderId}/${reciverId}`, {
      reciverId,
      reciverName,
      message
    });
  }

  getAllMessages(senderId, reciverId): Observable<any> {
    return this.http.get(`${BASEURL}/chat-messages/${senderId}/${reciverId}`);
  }
}
