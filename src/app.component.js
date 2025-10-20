

import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

// !!! IMPORTANTE !!!
// Substitua a string abaixo pela URL do seu Web App gerado pelo Google Apps Script.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWylZNUo8lPU-3oBJfYTx7bUALIBjs0G28iKX-yA5lMM4x-bURDGimSCIC_O_ASPUY/exec';

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
          @if (isLoading()) {
            <div class="flex justify-center items-center py-8">
               <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffa400]"></div>
            </div>
            <p class="text-zinc-600">Carregando experiências...</p>
          } @else if (error()) {
            <div class="text-center text-red-600 bg-red-100 p-4 rounded-lg">
              <p>{{ error() }}</p>
            </div>
          } @else if (experiences().length === 0) {
            <div class="text-center text-zinc-600 bg-yellow-100 p-4 rounded-lg">
              <p>Nenhuma experiência disponível para avaliação no momento.</p>
            </div>
          } @else {
            <p class="mb-6 text-zinc-600">Por favor, selecione a experiência que deseja avaliar.</p>
            <div class="flex flex-col gap-4 justify-center">
              @for (exp of experiences(); track exp.name) {
                <button (click)="selectExperience(exp)" class="w-full text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-left">
                  <span class="font-bold">{{ exp.name }}</span>
                  <span class="block text-xs font-normal opacity-90">{{ formatDate(exp.dateObj) }}</span>
                </button>
              }
            </div>
          }
        </div>
      }

      @case ('filling') {
        <div class="space-y-6 animate-fade-in">
          <h2 class="text-center text-xl font-bold text-zinc-700">Avaliação da Experiência: <span class="text-[#ff595a]">{{ selectedExperience()?.name }}</span></h2>
          
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
            <button (click)="submitFeedback()" [disabled]="isSubmitting()" class="text-white font-bold py-3 px-8 rounded-lg bg-[#ffa400] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
              @if (isSubmitting()) {
                <span class="flex items-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </span>
              } @else {
                <span>Enviar Avaliação</span>
              }
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
  httpClient = inject(HttpClient);

  experiences = signal([]);
  selectedExperience = signal(null);
  
  rating = signal(10);
  reason = signal('');
  feedback = signal('');
  
  submissionState = signal('selecting'); // 'selecting', 'filling', 'submitted'
  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal('');

  showReason = computed(() => this.rating() < 10);

  ngOnInit() {
    this.fetchExperiences();
  }

  fetchExperiences() {
    this.isLoading.set(true);
    this.error.set('');
    this.httpClient.get(SCRIPT_URL)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (!response || !response.data) {
             throw new Error("Invalid response structure");
          }
          const today = new Date();
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);

          const relevantExperiences = response.data
            .map(exp => ({...exp, dateObj: new Date(exp.date.replace(/-/g, '/'))}))
            .filter(exp => exp.dateObj <= sevenDaysFromNow) // Mostra eventos passados e dos próximos 7 dias
            .sort((a, b) => b.dateObj - a.dateObj); // Ordena pelos mais recentes primeiro
          
          this.experiences.set(relevantExperiences);
        },
        error: (err) => {
          console.error('Failed to fetch experiences', err);
          this.error.set('Não foi possível carregar as experiências. Verifique a URL do Script e a configuração da planilha.');
        }
      });
  }

  formatDate(dateObj) {
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  selectExperience(experience) {
    this.selectedExperience.set(experience);
    this.submissionState.set('filling');
  }

  updateRating(event) {
    const value = event.target.value;
    this.rating.set(Number(value));
  }

  submitFeedback() {
    if (this.selectedExperience() && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const payload = {
        experience: this.selectedExperience().name,
        rating: this.rating(),
        reason: this.showReason() ? this.reason() : '',
        feedback: this.feedback(),
      };

      this.httpClient.post(SCRIPT_URL, payload)
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: () => {
            this.submissionState.set('submitted');
          },
          error: (err) => {
            console.error('Failed to submit feedback', err);
            alert('Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.');
          }
        });
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