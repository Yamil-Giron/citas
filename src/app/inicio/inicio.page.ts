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
  async cargarNuevaCita() {
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    const borrarAutomatico = value ? JSON.parse(value) : false;
    console.log('[InicioPage] Configuración borrarCitasInicio:', borrarAutomatico);

    if (borrarAutomatico && this.cita && this.cita.id != null) {
      console.log('[InicioPage] Eliminando cita actual:', this.cita);
      await this.citasService.eliminarCita(this.cita);
    }
  
    const todasCitas = await this.citasService.obtenerCitas();
    console.log('[InicioPage] Citas obtenidas:', todasCitas);
    
    if (todasCitas.length === 0) {
      this.cita = null;
      console.log('[InicioPage] No quedan citas para mostrar.');
    } else {
      if (borrarAutomatico) {
        this.cita = todasCitas[0];
      } else {
        if (this.cita) {
          const currentIndex = todasCitas.findIndex(c => c.id === this.cita?.id);
          let newIndex = currentIndex + 1;
          if (newIndex >= todasCitas.length) {
            newIndex = 0;
          }
          this.cita = todasCitas[newIndex];
        } else {
          this.cita = todasCitas[0];
        }
      }
      console.log('[InicioPage] Nueva cita cargada:', this.cita);
    }
  }

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
