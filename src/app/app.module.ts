import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StorageService } from './providers/storageService/storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParameterService } from './providers/parameterService/parameter.service';
import { DataService } from './providers/dataService/data.service';
import { AxService } from './providers/axservice/ax.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Events } from './providers/events/event.service';
import { Camera } from '@ionic-native/Camera/ngx';
import { PendingChangesGuard } from './providers/pending-changes.guard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AlertService } from './providers/alert.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      hardwareBackButton: false
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
  
  ],
  providers: [
    File,
    PendingChangesGuard,
    AppVersion,
    FileOpener,
    StatusBar,
    SplashScreen,
    StorageService,
    ParameterService,
    DataService,
    Camera,
    AxService,
    AlertService,
    Events,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
