import { ComponentFixture, TestBed } from '@angular/core/testing';
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
