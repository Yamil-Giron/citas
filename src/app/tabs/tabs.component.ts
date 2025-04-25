import { Component, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonRouterOutlet, IonIcon, IonTabButton, IonLabel } from "@ionic/angular/standalone";
import{IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  standalone: true,
  imports:[IonTabs, IonTabBar, IonRouterOutlet, IonIcon, IonTabButton, IonLabel, IonicModule],
})
export class TabsComponent {}
