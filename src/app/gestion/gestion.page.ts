import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';             // Importa módulos de Ionic para usar sus componentes y funcionalidades
import { FormsModule, NgForm } from '@angular/forms';       // Importa módulos para la manipulación y validación de formularios en Angular
import { CommonModule } from '@angular/common';             // Importa directivas comunes de Angular (como *ngIf, *ngFor, etc.)
import { CitasService, Cita } from '../services/citas.service'; // Importa el servicio de citas y la interfaz Cita que define la estructura de las citas

// Definición del componente mediante el decorador @Component
@Component({
  selector: 'app-gestion',                              // Selector para usar este componente (<app-gestion>) en otros templates
  templateUrl: './gestion.page.html',                   // Ruta del template HTML que define la vista de esta página
  styleUrls: ['./gestion.page.scss'],                   // Archivo SCSS que contiene los estilos específicos del componente
  standalone: true,                                   // Indica que este componente es independiente y no necesita estar declarado en un módulo específico
  imports: [IonicModule, FormsModule, CommonModule]      // Lista de módulos que se utilizan en la plantilla del componente
})
export class GestionPage {
  // Propiedad que almacena el listado de citas. Se inicializa como un arreglo vacío.
  citas: Cita[] = [];
  
  // Variables que se enlazan con los campos del formulario para agregar una nueva cita.
  // 'nuevaFrase' almacenará el texto de la cita y 'nuevoAutor' el nombre del autor.
  nuevaFrase: string = '';
  nuevoAutor: string = '';

  // Se inyecta el servicio de citas para poder usar sus métodos dentro de este componente.
  constructor(private citasService: CitasService) {}

  // Método del ciclo de vida ngOnInit que se ejecuta al inicializar el componente.
  // Se utiliza para cargar la lista de citas desde el servicio cuando la página se renderiza.
  async ngOnInit() {
    await this.cargarCitas();
  }

  // Función asíncrona para cargar las citas almacenadas utilizando el CitasService.
  async cargarCitas() {
    this.citas = await this.citasService.obtenerCitas();
  }

  // Función para eliminar una cita.
  // Recibe la cita a eliminar como parámetro, llama al servicio para realizar la eliminación y recarga la lista.
  async eliminarCita(cita: Cita) {
    await this.citasService.eliminarCita(cita);
    await this.cargarCitas();
  }

  // Función para agregar una nueva cita.
  // Se invoca al enviar el formulario de Angular (NgForm).
  async agregarCita(form: NgForm) {
    // Se verifica que el formulario sea válido según las validaciones definidas en la vista.
    if (form.valid) {
      // Se utiliza el servicio para agregar la nueva cita con los valores ingresados
      await this.citasService.agregarCita(this.nuevaFrase, this.nuevoAutor);
      // Tras agregar la cita, se recarga la lista para actualizar la vista.
      await this.cargarCitas();
      // Se reinician las variables que están enlazadas a los campos del formulario para limpiar la entrada.
      this.nuevaFrase = '';
      this.nuevoAutor = '';
      // Se resetea el formulario, limpiando sus estados de validación y valores.
      form.resetForm();
    }
  }
}
