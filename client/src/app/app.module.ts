import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
// angular
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// universal
import { TransferHttpCacheModule } from '@nguniversal/common';
// external
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// app imports
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AboutComponent } from './about/about.component';
import { NewsComponent } from './news/news.component';
import { reducers } from './store/reducers';
import { BrowserHttpInterceptor } from './shared/services/browser-http-interceptor';
import { ApiService } from './shared/services/api.service';
import { AppEffects } from './store/effects';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    AboutComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    BrowserTransferStateModule,
    NgbModule.forRoot(),
    StoreModule.forRoot(reducers),
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TransferHttpCacheModule,
    EffectsModule.forRoot([AppEffects]),
    HttpClientModule,
    StoreDevtoolsModule.instrument()
  ],
  providers: [ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
