import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { GuestComponent } from './components/guest/guest.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthGuard } from './helper.services/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { PostPageComponent } from './components/post-page/post-page.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'podesavanja', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'profil/:alas', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'objava/:id', component: PostPageComponent, canActivate: [AuthGuard]},
  { path: 'gosti', component: GuestComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
