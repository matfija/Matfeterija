import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { GuestComponent } from './components/guest/guest.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CredentialInterceptor } from './interceptors/credential.interceptor';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ModalComponent } from './components/modal/modal.component';
import { OnlineUsersComponent } from './components/online-users/online-users.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { PostsOptionsComponent } from './components/posts-options/posts-options.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PraceniPipe } from './pipes/praceni.pipe';
import { PoredakPipe } from './pipes/poredak.pipe';
import { UserPipe } from './pipes/user.pipe';
import { PostPipe } from './pipes/post.pipe';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    GuestComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SettingsComponent,
    ModalComponent,
    OnlineUsersComponent,
    PostFormComponent,
    PostViewComponent,
    PostsOptionsComponent,
    ProfileComponent,
    PraceniPipe,
    PoredakPipe,
    UserPipe,
    PostPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CredentialInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
