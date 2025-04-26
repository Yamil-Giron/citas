import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';  
import { CommonModule } from '@angular/common';
// Se importan el servicio de citas (CitasService) y la interfaz Cita, que define la estructura de una cita.
import { CitasService, Cita } from '../services/citas.service';
// Se importa Capacitor Preferences para gestionar la persistencia de configuraciones.
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-inicio',                      // Selector para incluir este componente en otros templates.
  templateUrl: './inicio.page.html',             // Archivo HTML que define la vista de la página.
  standalone: true,                            // Define el componente como independiente sin necesidad de un módulo extra.
  imports: [IonicModule, CommonModule]           // Módulos utilizados en la plantilla para directivas y componentes.
})
export class InicioPage implements OnInit {     // La clase implementa el hook OnInit para ejecutar lógica al iniciar.
  // Variable que almacena la cita actual a mostrar; puede ser de tipo Cita o null.
  cita: Cita | null = null;
  
  // Arreglo que contiene los resultados obtenidos al consultar todas las citas.
  consultaResultados: Cita[] = [];

  // Constructor con inyección del servicio CitasService,
  // lo que permite usar sus métodos para obtener y eliminar citas.
  constructor(private citasService: CitasService) {}

  // Hook del ciclo de vida de Angular que se ejecuta al iniciar el componente.
  // Se utiliza para cargar la cita inicial.
  async ngOnInit() {
    await this.cargarNuevaCita();
  }
  
  // Método para cargar una nueva cita basado en la configuración y la lista de citas almacenadas.
  async cargarNuevaCita() {
    // Se obtiene la configuración de borrado de citas automáticas.
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    // Se parsea el valor obtenido; por defecto es false si no existe.
    const borrarAutomatico = value ? JSON.parse(value) : false;
    console.log('[InicioPage] Configuración borrarCitasInicio:', borrarAutomatico);

    // Si el borrado automático está activado y existe una cita actual con id,
    // se procede a eliminarla.
    if (borrarAutomatico && this.cita && this.cita.id != null) {
      console.log('[InicioPage] Eliminando cita actual:', this.cita);
      await this.citasService.eliminarCita(this.cita);
    }
    
    // Se obtienen todas las citas disponibles mediante el servicio.
    const todasCitas = await this.citasService.obtenerCitas();
    console.log('[InicioPage] Citas obtenidas:', todasCitas);
    
    // Si no hay citas, se asigna null a la variable 'cita' y se notifica en consola.
    if (todasCitas.length === 0) {
      this.cita = null;
      console.log('[InicioPage] No quedan citas para mostrar.');
    } else {
      // Si el borrado automático está activado, se utiliza la primera cita disponible.
      if (borrarAutomatico) {
        this.cita = todasCitas[0];
      } else {
        // Si ya hay una cita mostrada, se busca su posición en el listado.
        if (this.cita) {
          const currentIndex = todasCitas.findIndex(c => c.id === this.cita?.id);
          let newIndex = currentIndex + 1; // Se prepara el índice para la siguiente cita.
          // Si el índice sobrepasa el número de citas, se reinicia al comienzo de la lista.
          if (newIndex >= todasCitas.length) {
            newIndex = 0;
          }
          // Se asigna la siguiente cita encontrada a 'cita'.
          this.cita = todasCitas[newIndex];
        } else {
          // Si no hay una cita actual, se toma la primera del arreglo.
          this.cita = todasCitas[0];
        }
      }
      console.log('[InicioPage] Nueva cita cargada:', this.cita);
    }
  }

  // Método para consultar todos los datos de las citas almacenadas.
  // Los resultados se asignan a la variable 'consultaResultados'.
  async consultarDatos() {
    try {
      // Se obtienen las citas usando el método del servicio.
      const resultado: Cita[] = await this.citasService.obtenerCitas();
      // Se actualiza la variable con el resultado obtenido (o se asigna un arreglo vacío si es nulo).
      this.consultaResultados = resultado || [];
      console.log("Consulta realizada. Resultados:", this.consultaResultados);
    } catch (error) {
      // En caso de error, se muestra un mensaje en consola.
      console.error("Error en consulta:", error);
    }
  }
}
