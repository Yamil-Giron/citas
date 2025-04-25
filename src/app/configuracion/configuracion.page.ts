import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfiguracionPage {
  borrarCitasInicio = false;

  ngOnInit() {
    this.cargarConfiguracion();
  }
  guardarConfiguracion() {
    localStorage.setItem('borrarCitasInicio', JSON.stringify(this.borrarCitasInicio));
  }

  cargarConfiguracion() {
    const config = localStorage.getItem('borrarCitasInicio');
    if (config) {
      this.borrarCitasInicio = JSON.parse(config);
    }
  }
}
