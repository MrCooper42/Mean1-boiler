import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';


import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';


@Injectable()
export class ServerHttpInterceptor implements HttpInterceptor {

  constructor(private _transferState: TransferState) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do(event => {
      if (event instanceof HttpResponse) {
        this._transferState.set(makeStateKey(request.url), event.body);
      }
    });
  }

}
