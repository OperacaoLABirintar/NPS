
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

export const AppComponent = Component({
  selector: 'app-root',
  standalone: true, // This is required for bootstrapApplication
  template: `
<div class="min-h-screen w-full flex items-center justify-center p-4 bg-black bg-opacity-30">
  <div class="bg-[#f4f0e8]/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl w-full text-zinc-800 transform transition-all duration-500">

    <header class="text-center mb-6">
      <svg class="w-16 h-16 mx-auto mb-2 text-[#ffa400]" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="21" cy="21" r="18" />
        <path d="M21,3a18,18,0,0,1,0,36" />
        <path d="M21,39a18,18,0,0,1,0-36" />
        <circle cx="21" cy="21" r="6" />
        <path d="M21,15a6,6,0,0,1,0,12" />
        <path d="M21,27a6,6,0,0,1,0-12" />
        <path d="M15,21a6,6,0,0,1,12,0" />
        <path d="M27,21a6,6,0,0,1-12,0" />
      </svg>
      <h1 class="font-slab text-4xl sm:text-5xl font-bold tracking-wide">
        <span class="text-[#ff595a]">LABI</span><span class="text-[#ffa400]">RINTAR</span>
      </h1>
      <p class="text-zinc-600 mt-1">Lugar de Fazer e Ser</p>
    </header>

    @switch (submissionState()) {
      @case ('selecting') {
        <div class="text-center animate-fade-in">
          <h2 class="text-xl font-bold text-zinc-700 mb-4">Formulário Diagnóstico</h2>
          <p class="mb-6 text-zinc-600">Por favor, selecione a experiência que deseja avaliar.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            @for (exp of experiences(); track exp) {
              <button (click)="selectExperience(exp)" class="w-full sm:w-auto text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                {{ exp }}
              </button>
            }
          </div>
        </div>
      }

      @case ('filling') {
        <div class="space-y-6 animate-fade-in">
          <h2 class="text-center text-xl font-bold text-zinc-700">Avaliação da Experiência: <span class="text-[#ff595a]">{{ selectedExperience() }}</span></h2>
          
          <div class="space-y-2">
            <label for="nps-slider" class="block font-bold text-zinc-700">De 0 a 10, quanto você recomendaria esta experiência?</label>
            <div class="flex items-center gap-4">
              <input id="nps-slider" type="range" min="0" max="10" [value]="rating()" (input)="updateRating($event)" class="w-full h-2 rounded-lg appearance-none cursor-pointer" />
              <span class="font-slab text-2xl font-bold text-[#ffa400] w-10 text-center">{{ rating() }}</span>
            </div>
          </div>
          
          @if (showReason()) {
            <div class="space-y-2 animate-fade-in">
              <label for="reason" class="block font-bold text-zinc-700">Por que não 10?</label>
              <textarea id="reason" rows="3" [value]="reason()" (input)="reason.set($any($event.target).value)" class="w-full p-3 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa400] focus:border-[#ffa400] transition"></textarea>
            </div>
          }

          <div class="space-y-2">
            <label for="feedback" class="block font-bold text-zinc-700">
              Deixe aqui outras impressões e percepções sobre essa vivência.
              <span class="font-normal text-sm text-zinc-500 block">(Opcional: O que você viu, sentiu ou aprendeu junto com as crianças?)</span>
            </label>
            <textarea id="feedback" rows="4" [value]="feedback()" (input)="feedback.set($any($event.target).value)" class="w-full p-3 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa400] focus:border-[#ffa400] transition"></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button (click)="submitFeedback()" class="text-white font-bold py-3 px-8 rounded-lg bg-[#ffa400] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Enviar Avaliação
            </button>
          </div>
        </div>
      }

      @case ('submitted') {
        <div class="text-center space-y-6 animate-fade-in py-8">
          <h2 class="font-slab text-3xl font-bold text-[#ff595a]">Obrigado!</h2>
          <p class="text-lg text-zinc-700">Seu feedback foi recebido com sucesso e é muito valioso para nós.</p>
          <button (click)="reset()" class="mt-4 text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Fazer Outra Avaliação
          </button>
        </div>
      }
    }
  </div>
</div>
  `,
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
