import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapaComponent } from './components/mapa/mapa.component';

import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(environment.socketConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
