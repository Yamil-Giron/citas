import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private citas = [
    { frase: "La vida es aquello que pasa mientras estás ocupado haciendo otros planes.", autor: "John Lennon" },
    { frase: "El éxito es aprender a ir de fracaso en fracaso sin desesperarse.", autor: "Winston Churchill" },
  ];

  obtenerCitaAleatoria() {
    const indice = Math.floor(Math.random() * this.citas.length);
    return this.citas[indice];
  }

  obtenerCitas() {
    return this.citas;
  }

  agregarCita(frase: string, autor: string) {
    this.citas.push({ frase, autor });
  }

  eliminarCita(index: number) {
    this.citas.splice(index, 1);
  }
}
