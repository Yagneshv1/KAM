import { Component } from '@angular/core';
import { ProgressSpinnerService } from './progress-spinner.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css'],
})
export class ProgressSpinnerComponent {
  public isLoading = false;

  constructor(private progressSpinnerService: ProgressSpinnerService) {
    this.progressSpinnerService
      .getIsLoadingObserver()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }
}
