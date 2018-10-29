import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private cookieService: CookieService) {}

  setToken(token) {
    this.cookieService.set('socialnet_token', token);
  }

  getToken() {
    return this.cookieService.get('socialnet_token');
  }

  deleteToken() {
    this.cookieService.delete('socialnet_token');
  }
  getPayload() {
    const token = this.getToken();
    let payload = null;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(window.atob(payload));
    }
    return payload.data;
  }
}
