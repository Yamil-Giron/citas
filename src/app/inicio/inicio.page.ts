import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CitasService, Cita } from '../services/citas.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class InicioPage implements OnInit {
  cita: Cita | null = null;
  consultaResultados: Cita[] = [];

  constructor(private citasService: CitasService) {}

  async ngOnInit() {
    await this.cargarNuevaCita();
  }

  // Método para cargar una nueva cita
  async cargarNuevaCita() {
    // Leemos la configuración para determinar si se debe borrar la cita mostrada
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    const borrarAutomatico = value ? JSON.parse(value) : false;
    console.log('[InicioPage] Configuración borrarCitasInicio:', borrarAutomatico);
    
    // Si está activado borrar y hay una cita actual, la eliminamos
    if (borrarAutomatico && this.cita && this.cita.id != null) {
      console.log('[InicioPage] Eliminando cita actual:', this.cita);
      await this.citasService.eliminarCita(this.cita);
    }
  
    // Obtenemos todas las citas almacenadas
    const todasCitas = await this.citasService.obtenerCitas();
    console.log('[InicioPage] Citas obtenidas:', todasCitas);
    
    if (todasCitas.length === 0) {
      this.cita = null;
      console.log('[InicioPage] No quedan citas para mostrar.');
    } else {
      if (borrarAutomatico) {
        // Si se ha borrado la actual, mostramos la primera de la lista (que es diferente)
        this.cita = todasCitas[0];
      } else {
        // Si no se está borrando, se busca el índice de la cita actual y se pasa a la siguiente
        if (this.cita) {
          const currentIndex = todasCitas.findIndex(c => c.id === this.cita?.id);
          let newIndex = currentIndex + 1;
          // Si llegamos al final se cicla al inicio
          if (newIndex >= todasCitas.length) {
            newIndex = 0;
          }
          this.cita = todasCitas[newIndex];
        } else {
          // Si no hay una cita actualmente, asignamos la primera
          this.cita = todasCitas[0];
        }
      }
      console.log('[InicioPage] Nueva cita cargada:', this.cita);
    }
  }

  // Método para consultar y mostrar todas las citas en pantalla.
  async consultarDatos() {
    try {
      const resultado: Cita[] = await this.citasService.obtenerCitas();
      this.consultaResultados = resultado || [];
      console.log("Consulta realizada. Resultados:", this.consultaResultados);
    } catch (error) {
      console.error("Error en consulta:", error);
    }
  }
}
