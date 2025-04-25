import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonList, IonContent, IonItem, IonLabel, IonButton, IonInput, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CitasService } from '../services/citas.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  imports: [IonToolbar, IonTitle, IonInput, IonButton, IonLabel, IonItem, IonContent, IonList, IonHeader, FormsModule, CommonModule]
})
export class GestionPage {
  citas: { frase: string; autor: string }[] = [];
  nuevaFrase: string = '';  // Agregando esta propiedad
  nuevoAutor: string = '';  // También agregamos esta

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    this.citas = this.citasService.obtenerCitas();
  }

  eliminarCita(index: number) {
    this.citasService.eliminarCita(index);
    this.citas = this.citasService.obtenerCitas(); // Refrescar lista
  }

  agregarCita() {
    if (this.nuevaFrase.trim() && this.nuevoAutor.trim()) { // Validar que no esté vacío
      this.citasService.agregarCita(this.nuevaFrase, this.nuevoAutor);
      this.citas = this.citasService.obtenerCitas();
      this.nuevaFrase = '';  // Limpiar el campo después de agregar
      this.nuevoAutor = '';  // Limpiar también
    }
  }
}


