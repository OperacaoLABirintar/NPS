import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  experiences = signal(['Jogos de Tabuleiro', 'Circo']);
  selectedExperience = signal<string | null>(null);
  
  rating = signal(10);
  reason = signal('');
  feedback = signal('');
  
  submissionState = signal<'selecting' | 'filling' | 'submitted'>('selecting');

  showReason = computed(() => this.rating() < 10);

  selectExperience(experience: string): void {
    this.selectedExperience.set(experience);
    this.submissionState.set('filling');
  }

  updateRating(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rating.set(Number(value));
  }

  submitFeedback(): void {
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

  reset(): void {
    this.selectedExperience.set(null);
    this.rating.set(10);
    this.reason.set('');
    this.feedback.set('');
    this.submissionState.set('selecting');
  }
}
