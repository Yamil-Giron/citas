import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TabsPage, // Crea un componente `TabsPage`
    children: [
      { path: 'inicio', loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
      { path: 'gestion', loadComponent: () => import('./gestion/gestion.page').then(m => m.GestionPage) },
      { path: 'configuracion', loadComponent: () => import('./configuracion/configuracion.page').then(m => m.ConfiguracionPage) },
    ]
  }
];
