import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Importa solo RouterModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule] // No se usa RouterModule.forRoot, sino solo RouterModule
})
export class AppComponent {}
