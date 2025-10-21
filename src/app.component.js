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
<div class="h-screen w-full flex flex-col overflow-hidden">
  <header class="h-28 flex-shrink-0"></header>
  <main class="flex-grow w-full flex items-center justify-center p-4 min-h-0">
    <div class="bg-[#f4f0e8]/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl w-full text-zinc-800 transform transition-all duration-500 flex flex-col max-h-full">
      @switch (submissionState()) {
        @case ('selecting') {
          <div class="text-center animate-fade-in flex flex-col flex-grow min-h-0">
            <div class="flex-shrink-0">
              <h2 class="text-xl font-bold text-zinc-700 mb-4">Avaliação de Experiência</h2>
            </div>

            @if (isLoading()) {
              <div class="flex-grow flex flex-col justify-center items-center py-8">
                 <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffa400]"></div>
                 <p class="text-zinc-600 mt-4">Carregando experiências...</p>
              </div>
            } @else if (error()) {
              <div class="text-left text-red-800 bg-red-100 p-4 rounded-lg">
                <p class="font-bold mb-2">Ocorreu um erro:</p>
                <pre class="whitespace-pre-wrap break-words text-sm">{{ error() }}</pre>
              </div>
            } @else if (experiences().length === 0) {
              <div class="text-center text-zinc-600 bg-yellow-100 p-4 rounded-lg">
                @if (rawExperiencesCount() === 0) {
                  <p class="font-bold">Nenhuma experiência encontrada na planilha.</p>
                  <p class="text-sm mt-1">Por favor, verifique se a planilha "Events" contém dados e se as datas na coluna "EventDate" são válidas.</p>
                } @else if (rawExperiencesCount() !== null) {
                  <p class="font-bold">Nenhuma experiência recente para avaliação.</p>
                  <p class="text-sm mt-1">Encontramos {{ rawExperiencesCount() }} experiências, mas o aplicativo mostra apenas eventos que já aconteceram ou que ocorrerão nos próximos 7 dias. Verifique as datas na sua planilha.</p>
                }
              </div>
            } @else {
               <div class="flex flex-col flex-grow min-h-0">
                <p class="mb-6 text-zinc-600 flex-shrink-0">Por favor, selecione a experiência que deseja avaliar.</p>
                <div class="overflow-y-auto overflow-x-hidden flex-grow pr-4 pt-1">
                    <div class="flex flex-col gap-4">
                      @for (exp of experiences(); track exp.name) {
                        <button (click)="selectExperience(exp)" class="w-full text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-left">
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
          <div class="space-y-6 animate-fade-in flex-grow min-h-0 overflow-y-auto overflow-x-hidden pr-4">
            <h2 class="text-center text-xl font-bold text-zinc-700">Avaliação da Experiência: <span class="text-[#ff595a]">{{ selectedExperience()?.name }}</span></h2>
            
            <div class="space-y-2">
              <label for="nps-slider" class="block font-bold text-zinc-700">De 0 a 10, quanto você recomendaria a experiência vivenciada?</label>
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
              </label>
              <textarea id="feedback" rows="4" [value]="feedback()" (input)="feedback.set($any($event.target).value)" class="w-full p-3 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa400] focus:border-[#ffa400] transition"></textarea>
            </div>

            @if (submissionError()) {
              <div class="text-red-800 bg-red-100 p-3 rounded-lg text-center animate-fade-in">
                <p>{{ submissionError() }}</p>
              </div>
            }

            @if (submissionDebugInfo(); as debug) {
              <div class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm animate-fade-in">
                <h4 class="font-bold text-zinc-700 mb-2">Informações de Debug (Teste Crítico)</h4>
                
                <div class="mb-2">
                  <p class="font-semibold">1. Dados Enviados para a Planilha:</p>
                  <pre class="bg-white p-2 mt-1 rounded text-xs whitespace-pre-wrap break-all">{{ jsonStringify(debug.payloadSent) }}</pre>
                </div>

                @if(debug.errorReceived) {
                  <div>
                    <p class="font-semibold">2. Resposta de Erro Recebida:</p>
                    <pre class="bg-white p-2 mt-1 rounded text-xs whitespace-pre-wrap break-all">{{ jsonStringify(debug.errorReceived) }}</pre>
                    <p class="mt-2 text-xs text-zinc-600">
                      <strong>Possíveis causas:</strong><br>
                      - <strong>CORS:</strong> Se 'status' for 0, é quase certeza um erro de Cross-Origin. A mudança que fiz para enviar 'text/plain' deve resolver isso. Se persistir, verifique a implantação do seu script (precisa permitir acesso anônimo).<br>
                      - <strong>Erro no Script:</strong> Se 'errorBody' contiver uma mensagem de erro, verifique o código do seu Google Apps Script.<br>
                      - <strong>Permissões:</strong> Verifique se a planilha e o script têm as permissões corretas para serem acessados e modificados pela web.
                    </p>
                  </div>
                }
              </div>
            }

            <div class="flex justify-end pt-4">
              <button (click)="submitFeedback()" [disabled]="isSubmitting()" class="text-white font-bold py-3 px-8 rounded-lg bg-[#ffa400] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                @if (isSubmitting()) {
                  <span class="flex items-center justify-center">
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
           <div class="flex-grow flex flex-col justify-center items-center">
            <div class="text-center space-y-6 animate-fade-in py-8">
              <h2 class="font-slab text-3xl font-bold text-[#ff595a]">Obrigado!</h2>
              <p class="text-lg text-zinc-700">Seu feedback foi recebido com sucesso e é muito valioso para nós.</p>
              <button (click)="reset()" class="mt-4 text-white font-bold py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                Fazer Outra Avaliação
              </button>
            </div>
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

  experiences = signal([]);
  rawExperiencesCount = signal(null);
  selectedExperience = signal(null);
  
  rating = signal(10);
  reason = signal('');
  feedback = signal('');
  
  submissionState = signal('selecting'); // 'selecting', 'filling', 'submitted'
  isLoading = signal(true);
  isSubmitting = signal(false);
  error = signal('');
  submissionError = signal('');
  submissionDebugInfo = signal(null);

  showReason = computed(() => this.rating() < 10);

  jsonStringify = (obj) => JSON.stringify(obj, null, 2);

  ngOnInit() {
    this.fetchExperiences();
  }

  fetchExperiences() {
    this.isLoading.set(true);
    this.error.set('');
    this.rawExperiencesCount.set(null);
    this.httpClient.get(SCRIPT_URL, { responseType: 'text' })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (responseText) => {
          try {
            const response = JSON.parse(responseText);
            
            if (response.error) {
              throw new Error(`Error from script: ${response.error}`);
            }

            if (!response || !Array.isArray(response.data)) {
               throw new Error("Invalid response structure: 'data' array not found.");
            }
            
            this.rawExperiencesCount.set(response.data.length);

            const today = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(today.getDate() + 7);

            const relevantExperiences = response.data
              .map(exp => ({...exp, dateObj: new Date(exp.date + 'T00:00:00')}))
              .filter(exp => exp.dateObj instanceof Date && !isNaN(exp.dateObj) && exp.dateObj <= sevenDaysFromNow)
              .sort((a, b) => b.dateObj - a.dateObj);
            
            this.experiences.set(relevantExperiences);
          } catch (e) {
            const shortResponse = responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '');
            this.error.set(`O servidor enviou uma resposta inesperada que não é um JSON válido. Verifique as permissões e o código do seu script.\n\nResposta recebida:\n"${shortResponse}"`);
          }
        },
        error: (err) => {
          this.error.set(`Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou se a URL do script está correta. \n\nDetalhes técnicos: ${err.name} - ${err.statusText}`);
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
      this.submissionError.set('');
      this.submissionDebugInfo.set(null);

      const payload = {
        experience: this.selectedExperience().name,
        rating: this.rating(),
        reason: this.showReason() ? this.reason() : '',
        feedback: this.feedback(),
      };

      const debugInfo = {
        payloadSent: payload,
        errorReceived: null
      };

      // To avoid CORS preflight issues with Google Apps Script, we send the data
      // as a string with 'text/plain' content type. Your script needs to parse it.
      this.httpClient.post(SCRIPT_URL, JSON.stringify(payload), { 
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'text' 
      })
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: (responseText) => {
            try {
              const response = JSON.parse(responseText);
              if (response && response.status === 'success') {
                this.submissionState.set('submitted');
              } else {
                const message = response?.message || 'O servidor retornou um erro, mas a comunicação foi bem sucedida.';
                this.submissionError.set(`Ocorreu um erro no servidor: ${message}`);
                debugInfo.errorReceived = { message: 'Server Logic Error', rawResponse: responseText };
                this.submissionDebugInfo.set(debugInfo);
              }
            } catch (e) {
                this.submissionError.set('Ocorreu um erro: A resposta do servidor não era um JSON válido.');
                debugInfo.errorReceived = { message: 'JSON Parse Error', rawResponse: responseText };
                this.submissionDebugInfo.set(debugInfo);
            }
          },
          error: (err) => {
            this.submissionError.set('Ocorreu um erro de comunicação. Veja os detalhes abaixo e tente novamente.');
            
            debugInfo.errorReceived = {
                message: err.message,
                status: err.status,
                statusText: err.statusText,
                url: err.url,
                errorBody: err.error, // This can be HTML text if it's a CORS error page
            };
            this.submissionDebugInfo.set(debugInfo);
          }
        });
    }
  }

  reset() {
    this.selectedExperience.set(null);
    this.rating.set(10);
    this.reason.set('');
    this.feedback.set('');
    this.submissionError.set('');
    this.submissionDebugInfo.set(null);
    this.submissionState.set('selecting');
    this.fetchExperiences();
  }
});