import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../services/citas.service';
import { IonHeader, IonContent, IonToolbar, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class InicioPage {
  cita: { frase: string; autor: string };

  constructor(private citasService: CitasService) {
    this.cita = this.citasService.obtenerCitaAleatoria();
  }
}
