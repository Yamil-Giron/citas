import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitasService, Cita } from '../services/citas.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class GestionPage {
  citas: Cita[] = [];
  nuevaFrase: string = '';
  nuevoAutor: string = '';

  constructor(private citasService: CitasService) {}

  async ngOnInit() {
    await this.cargarCitas();
  }

  async cargarCitas() {
    this.citas = await this.citasService.obtenerCitas();
  }

  async eliminarCita(cita: Cita) {
    await this.citasService.eliminarCita(cita);
    await this.cargarCitas(); // Refrescar la lista luego de eliminar
  }

  async agregarCita(form: NgForm) {
    if (form.valid) {
      await this.citasService.agregarCita(this.nuevaFrase, this.nuevoAutor);
      await this.cargarCitas();
      this.nuevaFrase = '';
      this.nuevoAutor = '';
      form.resetForm();
    }
  }
}
