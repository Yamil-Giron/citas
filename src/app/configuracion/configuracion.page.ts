import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfiguracionPage {
  borrarCitasInicio = false;

  async ngOnInit() {
    await this.cargarConfiguracion();
  }

  async guardarConfiguracion() {
    await Preferences.set({
      key: 'borrarCitasInicio',
      value: JSON.stringify(this.borrarCitasInicio)
    });
  }
  
  async cargarConfiguracion() {
    const { value } = await Preferences.get({ key: 'borrarCitasInicio' });
    if (value !== null) {
      this.borrarCitasInicio = JSON.parse(value);
    }
  }
}
