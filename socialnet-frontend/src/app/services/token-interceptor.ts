import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenSevice: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/jsom'
    };
    const token = this.tokenSevice.getToken();
    if (token) {
      headersConfig['Authorization'] = `bearer ${token}`;
    }
    const _req = req.clone({ setHeaders: headersConfig });
    return next.handle(_req);
  }
}
