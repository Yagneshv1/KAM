import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
    selector: 'app-session-end-dialog',
    templateUrl: './sessionEndedDialog.component.html',
    styleUrls: ['./sessionEndedDialog.component.css'],
})

export class SessionEndedDialogComponent {

    constructor(private router:Router, 
        private dialogRef: MatDialogRef<SessionEndedDialogComponent>){
        dialogRef.disableClose = true;
    }

    windowReload(){
        window.location.reload();
    }

    redirectToLogin(){
        this.dialogRef.close()
        this.router.navigate(['/login']).then(() => this.windowReload());
    }
}