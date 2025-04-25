import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../services/citas.service';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  standalone: true,
  imports: [IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonTitle, IonToolbar, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class InicioPage {
  cita: { frase: string; autor: string } = { frase: '', autor: '' };;

  constructor(private citasService: CitasService) {
    this.cargarNuevaCita();
  }

  cargarNuevaCita() {
    this.cita = this.citasService.obtenerCitaAleatoria();
  }
}
