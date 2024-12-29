import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-summary',
  templateUrl: './lead-summary.component.html',
  styleUrl: './lead-summary.component.css'
})
export class LeadSummaryComponent {

    constructor(private leadService: LeadService,
        private dialog: MatDialog,
        private router: Router
    ) {

    }

    leadSummary = []

    ngOnInit() {

    }

}

