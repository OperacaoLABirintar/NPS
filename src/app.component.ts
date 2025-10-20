import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

export const AppComponent = Component({
  selector: 'app-root',
  standalone: true, // This is required for bootstrapApplication
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})(class {
  experiences = signal(['Jogos de Tabuleiro', 'Circo']);
  selectedExperience = signal(null);
  
  rating = signal(10);
  reason = signal('');
  feedback = signal('');
  
  submissionState = signal('selecting');

  showReason = computed(() => this.rating() < 10);

  selectExperience(experience) {
    this.selectedExperience.set(experience);
    this.submissionState.set('filling');
  }

  updateRating(event) {
    const value = event.target.value;
    this.rating.set(Number(value));
  }

  submitFeedback() {
    if (this.selectedExperience()) {
      console.log('Feedback Submitted:');
      console.log('Experience:', this.selectedExperience());
      console.log('Rating:', this.rating());
      if (this.showReason()) {
        console.log('Reason:', this.reason());
      }
      console.log('General Feedback:', this.feedback());
      this.submissionState.set('submitted');
    }
  }

  reset() {
    this.selectedExperience.set(null);
    this.rating.set(10);
    this.reason.set('');
    this.feedback.set('');
    this.submissionState.set('selecting');
  }
});
