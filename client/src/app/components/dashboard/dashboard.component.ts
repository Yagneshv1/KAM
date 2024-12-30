import { Component } from '@angular/core';

interface MenuNode {
    name: string;
    children?: MenuNode[];
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
  })
export class DashBoardComponent {
 
  public tabs = [
    { label: 'Lead Manager', routerLink: '/leads' },
    { label: 'Interaction Manager', routerLink: '/interactions' },
    { label: 'Call Planner', routerLink: '/call-planner' },
    { label: 'Performance Manager', routerLink: '/performance-metrics' }
  ];

}