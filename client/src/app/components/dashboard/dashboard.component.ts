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
 
}