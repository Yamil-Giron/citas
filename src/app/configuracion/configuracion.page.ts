import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ConfiguracionPage {
  borrarCitasInicio = false;

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
