import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsComponent, // Asegúrate de que `TabsComponent` está correctamente definido
    children: [
      { path: 'inicio', loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
      { path: 'gestion', loadComponent: () => import('./gestion/gestion.page').then(m => m.GestionPage) },
      { path: 'configuracion', loadComponent: () => import('./configuracion/configuracion.page').then(m => m.ConfiguracionPage) },
    ]
  }
];


