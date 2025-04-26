import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';     // Importa componentes y módulos de Ionic
import { CommonModule } from '@angular/common';     // Proporciona directivas comunes (por ejemplo, *ngIf, *ngFor)
import { FormsModule } from '@angular/forms';       // Permite el uso del binding de formularios (ngModel, etc.)
import { Preferences } from '@capacitor/preferences'; // Importa el módulo de Capacitor para gestionar preferencias o configuraciones

// Decorador @Component que define la metadata del componente
@Component({
  selector: 'app-configuracion',              // Nombre del selector para usar este componente en templates
  templateUrl: './configuracion.page.html',     // Ruta del archivo HTML que define la vista del componente
  styleUrls: ['./configuracion.page.scss'],     // Archivo(s) de estilos asociados al componente
  standalone: true,                             // Indica que el componente es independiente y no requiere formar parte de un módulo específico
  imports: [IonicModule, CommonModule, FormsModule] // Módulos que se utilizarán en la plantilla del componente
})
export class ConfiguracionPage {
  // Variable que guarda el estado del toggle para borrar citas automáticamente.
  // Se inicializa en false por defecto.
  borrarCitasInicio = false;

  // Hook de ciclo de vida de Angular que se ejecuta al inicializar el componente.
  // Se usa async/await para cargar la configuración de manera asíncrona.
  async ngOnInit() {
    await this.cargarConfiguracion(); // Llama a la función para cargar la configuración guardada
  }

  // Función para guardar la configuración del toggle utilizando Capacitor Preferences.
  async guardarConfiguracion() {
    // Se guarda la configuración asociada a la clave 'borrarCitasInicio'
    // El valor se convierte a cadena JSON para su almacenamiento.
    await Preferences.set({
      key: 'borrarCitasInicio',
      value: JSON.stringify(this.borrarCitasInicio)
    });
  }
  
  // Función para cargar la configuración guardada en las preferencias.
  async cargarConfiguracion() {
    // Se obtiene el valor asociado a la clave 'borrarCitasInicio'
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    // Si se encontró un valor (no es null), se parsea el JSON a su tipo original (booleano)
    // y se asigna a la variable 'borrarCitasInicio'
    if (value !== null) {
      this.borrarCitasInicio = JSON.parse(value);
    }
  }
}
