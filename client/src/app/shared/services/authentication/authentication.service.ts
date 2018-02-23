import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  private saveToken = (token: string): void => {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken = (): string => {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  // TODO: Add error handling
  private userRequest = (method: 'post' | 'get', type: 'user/login' | 'user/register' | 'user/profile',
                         user?: TokenPayload): Observable<any> => {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }

    // noinspection TypescriptExplicitMemberType
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }));
    return request;
  }

  public logout = (): void => {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn = (): boolean => {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register = (user: TokenPayload): Observable<any> => this.userRequest('post', 'user/register', user);

  public login = (user: TokenPayload): Observable<any> => this.userRequest('post', 'user/login', user);

  public profile = (): Observable<any> => this.userRequest('get', 'user/profile');
}
