import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {GameComponent} from "./game/game.component";
import {StatisticsComponent} from "./statistics/statistics.component";

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'game', component: GameComponent },
  { path: 'statistics', component: StatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
