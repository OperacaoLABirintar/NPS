import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

// !!! AÇÃO NECESSÁRIA !!!
// Substitua a URL abaixo pela nova URL do seu App da Web implantado.
const NEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5WTbwGNUm9LhQ1u_CxEIKGZqWfC31erMU6Fo-npltTM-MtVkn3K89Vw1Eiz1co2qOOw/exec';

export const AppComponent = Component({
  selector: 'app-root',
  standalone: true,
  template: `
<div class="h-screen w-full flex flex-col overflow-hidden">
  <header class="h-28 flex-shrink-0"></header>
  <main class="flex-grow w-full flex items-center justify-center p-4 min-h-0">
    <div class="bg-[#f4f0e8]/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl w-full text-zinc-800 transform transition-all duration-500 flex flex-col max-h-full">

    @switch (submissionState()) {
      @case ('selecting') {
        <div class="text-center animate-fade-in flex flex-col flex-grow min-h-0">
          <div class="flex-shrink-0">
            <h2 class="text-xl font-bold text-zinc-700 mb-4">Avaliação da Experiência</h2>
          </div>

          @if (isLoading()) {
            <div class="flex-grow flex flex-col justify-center items-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffa400]"></div>
                <p class="text-zinc-600 mt-4">Carregando experiências...</p>
            </div>
          } @else if (error()) {
            <div class="text-left text-red-800 bg-red-100 p-4 rounded-lg">
              <p class="font-bold mb-2">Ocorreu um erro ao carregar:</p>
              <pre class="whitespace-pre-wrap break-words text-sm">{{ error() }}</pre>
            </div>
          } @else if (experiences().length === 0) {
            <div class="text-center text-zinc-600 bg-yellow-100 p-4 rounded-lg">
                <p class="font-bold">Nenhuma experiência recente encontrada.</p>
                <p class="text-sm mt-1">Verifique se a planilha "Experiences" tem dados com datas válidas.</p>
            </div>
          } @else {
            <div class="flex flex-col flex-grow min-h-0">
            <p class="mb-6 text-zinc-600 flex-shrink-0">Por favor, selecione a experiência que deseja avaliar.</p>
            <div class="overflow-y-auto overflow-x-hidden flex-grow px-4 pt-1">
                <div class="flex flex-col gap-4">
                  @for (exp of experiences(); track exp.name) {
                    <button (click)="selectExperience(exp.name)" class="w-full text-white py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-left">
                      <span class="font-bold">{{ exp.name }}</span>
                      <span class="block text-xs font-normal opacity-90">{{ formatDate(exp.dateObj) }}</span>
                    </button>
                  }
                </div>
            </div>
          </div>
          }
        </div>
      }

      @case ('filling') {
        <div class="space-y-6 animate-fade-in overflow-y-auto overflow-x-hidden flex-grow px-4">
          <h2 class="text-center text-xl font-bold text-zinc-700">Avaliação: <span class="text-[#ff595a]">{{ selectedExperience() }}</span></h2>
          
          <div class="space-y-2">
            <label for="nps-slider" class="block font-bold text-zinc-700">De 0 a 10, quanto você recomendaria a experiência vivenciada?</label>
            <div class="flex items-center gap-4">
              <input id="nps-slider" type="range" min="0" max="10" [value]="rating()" (input)="updateRating($event)" class="w-full" />
              <span class="font-slab text-2xl font-bold text-[#ffa400] w-10 text-center">{{ rating() }}</span>
            </div>
          </div>
          
          @if (showReason()) {
            <div class="space-y-2 animate-fade-in">
              <label for="reason" class="block font-bold text-zinc-700">Por que não 10?</label>
              <textarea id="reason" rows="3" [value]="reason()" (input)="reason.set($any($event.target).value)" class="w-full p-3 bg-white/60 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa400] focus:border-transparent transition"></textarea>
            </div>
          }

          <div class="space-y-2">
            <label for="feedback" class="block font-bold text-zinc-700">
              Deixe aqui outras impressões sobre essa vivência.
              <span class="font-normal text-sm text-zinc-500 block">(Opcional: O que você viu, sentiu ou aprendeu?)</span>
            </label>
            <textarea id="feedback" rows="4" [value]="feedback()" (input)="feedback.set($any($event.target).value)" class="w-full p-3 bg-white/60 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa400] focus:border-transparent transition"></textarea>
          </div>

          @if(submissionError()) {
            <div class="text-left text-red-800 bg-red-100 p-4 rounded-lg mt-4">
                <p class="font-bold mb-2">Erro ao Enviar:</p>
                <pre class="whitespace-pre-wrap break-words text-sm">{{ submissionError() }}</pre>
            </div>
          }

          <div class="flex justify-end pt-4">
            <button (click)="submitFeedback()" [disabled]="isSubmitting()" class="text-white font-bold py-3 px-8 rounded-lg bg-[#ffa400] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]">
              @if(isSubmitting()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              } @else {
                <span>Enviar</span>
              }
            </button>
          </div>
        </div>
      }

      @case ('submitted') {
        <div class="text-center space-y-6 animate-fade-in py-8 flex-grow flex flex-col justify-center">
          <h2 class="font-slab text-3xl font-bold text-[#ff595a]">Obrigado!</h2>
          <p class="text-lg text-zinc-700">Seu feedback foi recebido com sucesso.</p>
          <button (click)="reset()" class="mt-4 text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Fazer Outra Avaliação
          </button>
        </div>
      }
    }
    </div>
  </main>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})(class {
  httpClient = inject(HttpClient);

  // State for fetching experiences
  experiences = signal([]);
  isLoading = signal(true);
  error = signal('');
  
  // State for form submission
  submissionState = signal('selecting'); // 'selecting', 'filling', 'submitted'
  selectedExperience = signal(null);
  rating = signal(10);
  reason = signal('');
  feedback = signal('');
  isSubmitting = signal(false);
  submissionError = signal('');

  showReason = computed(() => this.rating() < 10);

  ngOnInit() {
    this.fetchExperiences();
  }

  fetchExperiences() {
    if (!NEW_SCRIPT_URL || NEW_SCRIPT_URL === 'COLE_SUA_NOVA_URL_AQUI') {
        this.error.set('A URL do Google Apps Script ainda não foi configurada no arquivo src/app.component.js.');
        this.isLoading.set(false);
        return;
    }
    this.isLoading.set(true);
    this.error.set('');
    this.httpClient.get(NEW_SCRIPT_URL)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.error) {
            throw new Error(response.error);
          }
          if (!response || !Array.isArray(response.data)) {
            throw new Error("A resposta do servidor não contém um array 'data'.");
          }
          
          const today = new Date();
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);

          const relevantExperiences = response.data
            .map(exp => ({...exp, dateObj: new Date(exp.date + 'T00:00:00')}))
            .filter(exp => exp.dateObj instanceof Date && !isNaN(exp.dateObj) && exp.dateObj <= sevenDaysFromNow)
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
            
          this.experiences.set(relevantExperiences);
        },
        error: (err) => {
          this.error.set(`Falha na conexão com o servidor. Verifique se a URL está correta e se a implantação permite acesso anônimo.\nDetalhes: ${err.message}`);
        }
      });
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
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.submissionError.set('');

    const payload = {
      experience: this.selectedExperience(),
      rating: this.rating(),
      reason: this.showReason() ? this.reason() : '',
      feedback: this.feedback(),
    };
    
    // Google Apps Script Web Apps often work better with 'text/plain' to avoid CORS preflight issues
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain;charset=utf-8' });

    this.httpClient.post(NEW_SCRIPT_URL, JSON.stringify(payload), { headers })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.submissionState.set('submitted');
          } else {
            this.submissionError.set(response.message || 'Ocorreu um erro desconhecido no servidor.');
          }
        },
        error: (err) => {
           this.submissionError.set(`Falha ao enviar. Verifique sua conexão e as permissões do script. Detalhes: ${err.message}`);
        }
      });
  }

  reset() {
    this.selectedExperience.set(null);
    this.rating.set(10);
    this.reason.set('');
    this.feedback.set('');
    this.submissionError.set('');
    this.submissionState.set('selecting');
    // Refetch experiences in case the list was updated
    this.fetchExperiences();
  }

  formatDate(dateObj) {
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
});