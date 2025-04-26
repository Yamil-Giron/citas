import { Routes } from '@angular/router';

// Definición de las rutas de la aplicación.
// Se utiliza Lazy Loading para cargar los componentes de forma perezosa,
// lo que mejora el rendimiento al cargar solo lo necesario en cada momento.
export const routes: Routes = [
  // Ruta raíz: cuando se accede a la ruta vacía, se redirige a '/inicio'
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  
  // Ruta '/inicio': se carga de forma perezosa el componente InicioPage usando la función loadComponent.
  // La importación dinámica "import(...)" permite que el módulo solo se descargue cuando se accede a esta ruta.
  { path: 'inicio', loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage) },
  
  // Ruta '/gestion': carga de forma perezosa el componente GestionPage.
  { path: 'gestion', loadComponent: () => import('./gestion/gestion.page').then(m => m.GestionPage) },
  
  // Ruta '/configuracion': carga de forma perezosa el componente ConfiguracionPage.
  { path: 'configuracion', loadComponent: () => import('./configuracion/configuracion.page').then(m => m.ConfiguracionPage) }
];
