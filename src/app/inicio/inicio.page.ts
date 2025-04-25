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

  constructor(private citasService: CitasService) {}

  async ngOnInit() {
    await this.cargarNuevaCita();
  }

  async cargarNuevaCita() {
    // Consultamos la configuración
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    const borrarAutomatico = value ? JSON.parse(value) : false;
    
    // Si está activado y hay una cita mostrada, la eliminamos de la DB
    if (borrarAutomatico && this.cita && this.cita.id != null) {
      await this.citasService.eliminarCita(this.cita);
    }
    // Obtenemos una cita aleatoria; por ejemplo, podemos seleccionar la primera de la lista
    const todasCitas = await this.citasService.obtenerCitas();
    this.cita = todasCitas.length ? todasCitas[0] : null;
  }
}
