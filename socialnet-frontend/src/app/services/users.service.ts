import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/socialnet';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  getUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  followUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  unfollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  markNotification(id, deleteValue?: boolean): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  addImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }
  setDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
  }

  profileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { id });
  }

  changePassword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }
}
