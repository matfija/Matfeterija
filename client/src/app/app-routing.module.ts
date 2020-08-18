import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { GuestComponent } from './components/guest/guest.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './helpers/auth.guard';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'podesavanja', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'gosti', component: GuestComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
