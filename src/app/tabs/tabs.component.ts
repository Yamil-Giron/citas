import { Component, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonRouterOutlet, IonIcon, IonTabButton, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports:[IonTabs, IonTabBar, IonRouterOutlet, IonIcon, IonTabButton, IonLabel],
})
export class TabsPage  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
