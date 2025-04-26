import { Component } from '@angular/core';
// Se importa IonicModule para utilizar los componentes y funcionalidades que ofrece Ionic
import { IonicModule } from '@ionic/angular';
// Se importa RouterModule para gestionar la navegación entre componentes.
// Aquí se utiliza solo RouterModule, sin llamadas a RouterModule.forRoot, ya que la configuración
// de rutas se realiza en otro lugar, y este componente solo necesita acceder a sus directivas.
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root', // Selector para identificar este componente en la aplicación (por ejemplo, <app-root>)
  templateUrl: './app.component.html', // Camino al archivo HTML que contiene la plantilla de la vista principal
  standalone: true, // Indica que este componente es independiente y no necesita ser declarado en un módulo adicional
  imports: [IonicModule, RouterModule] // Se importan los módulos IonicModule y RouterModule para que sus directivas y componentes estén disponibles en la plantilla
})
export class AppComponent {
  // Este componente actúa como contenedor principal de la aplicación.
  // Actualmente, no se define lógica adicional en este componente.
}
