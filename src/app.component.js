/**
 * =============================================================================
 * DOCUMENTAÇÃO DO BACKEND (GOOGLE SHEETS & APPS SCRIPT)
 * =============================================================================
 * 
 * Este arquivo Angular interage com um backend implementado utilizando
 * Google Sheets como banco de dados e Google Apps Script como API.
 * 
 * -----------------------------------------------------------------------------
 * ESTRUTURA DA PLANILHA (GOOGLE SHEETS)
 * -----------------------------------------------------------------------------
 * 
 * A planilha deve conter duas abas com os nomes e colunas exatas abaixo:
 * 
 * 1. Aba: `Experiences`
 *    - Propósito: Listar as experiências que aparecerão no formulário.
 *    - Colunas:
 *      - A: `PK` (string) - Uma chave primária única para cada linha de experiência.
 *      - B: `ExperienceName` (string) - O nome da experiência.
 *      - C: `ExperienceDate` (date) - A data da experiência no formato AAAA-MM-DD.
 *      - D: `ParentExperience` (string, opcional) - Se for uma sub-experiência,
 *           coloque aqui o `PK` da experiência principal. Deixe em branco se for
 *           um evento principal.
 *      - E: `Closed` (boolean) - Um checkbox. Se marcado (`TRUE`), a experiência
 *           não será carregada no aplicativo.
 * 
 * 2. Aba: `Feedback`
 *    - Propósito: Armazenar os feedbacks enviados pelo formulário.
 *    - Colunas:
 *      - A: `Timestamp` (datetime) - Data e hora do envio (preenchido automaticamente).
 *      - B: `Experience` (string) - Nome da experiência/sub-experiência avaliada.
 *      - C: `Rating` (number) - A nota de 0 a 10.
 *      - D: `Reason` (string) - O motivo para a nota (se não for 10).
 *      - E: `Feedback` (string) - O feedback qualitativo.
 *      - F: `Classificação` (string) - (Opcional, pode ser usado para análises posteriores, como NPS).
 * 
 * -----------------------------------------------------------------------------
 * CÓDIGO DO GOOGLE APPS SCRIPT (GAS)
 * -----------------------------------------------------------------------------
 * 
 * Este é o código que deve ser colado no editor de scripts do Google Sheets
 * e implantado como um Aplicativo Web.
 * 
 * ```javascript
 * // Nomes exatos das abas da sua planilha
 * const EXPERIENCES_SHEET_NAME = 'Experiences';
 * const FEEDBACK_SHEET_NAME = 'Feedback';
 * 
 * // Função para buscar uma aba pelo nome de forma segura
 * function getSheet(sheetName) {
 *   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
 *   const sheet = spreadsheet.getSheetByName(sheetName);
 *   if (!sheet) {
 *     throw new Error(`Sheet with name "${sheetName}" not found.`);
 *   }
 *   return sheet;
 * }
 * 
 * // Função executada quando o app faz uma requisição GET (para carregar dados)
 * function doGet(e) {
 *   try {
 *     const sheet = getSheet(EXPERIENCES_SHEET_NAME);
 *     const data = sheet.getDataRange().getValues();
 *     const headers = data.shift(); // Remove o cabeçalho
 *     
 *     const pkIndex = headers.indexOf('PK');
 *     const nameIndex = headers.indexOf('ExperienceName');
 *     const dateIndex = headers.indexOf('ExperienceDate');
 *     const parentPkIndex = headers.indexOf('ParentExperience');
 *     const closedIndex = headers.indexOf('Closed');
 * 
 *     if (pkIndex === -1 || nameIndex === -1 || dateIndex === -1 || parentPkIndex === -1 || closedIndex === -1) {
 *       throw new Error("Columns 'PK', 'ExperienceName', 'ExperienceDate', 'ParentExperience', or 'Closed' not found in 'Experiences' sheet.");
 *     }
 * 
 *     const experiencesMap = {};
 *     const rootExperiences = [];
 * 
 *     data.forEach(row => {
 *       const isClosed = row[closedIndex] === true; // Checkbox é lido como booleano
 *       if (isClosed) return; // Pula a linha se a experiência estiver fechada
 * 
 *       const pk = row[pkIndex];
 *       const name = row[nameIndex];
 *       const date = row[dateIndex] ? new Date(row[dateIndex]).toISOString().split('T')[0] : null;
 *       const parentPk = row[parentPkIndex];
 *       
 *       if (!pk || !name || !date) return; // Pula linhas sem PK, nome ou data
 * 
 *       experiencesMap[pk] = {
 *         pk: pk,
 *         name: name,
 *         date: date,
 *         parentPk: parentPk,
 *         subExperiences: []
 *       };
 *     });
 * 
 *     Object.values(experiencesMap).forEach(exp => {
 *       if (exp.parentPk && experiencesMap[exp.parentPk]) {
 *         // É uma sub-experiência, anexa ao pai
 *         experiencesMap[exp.parentPk].subExperiences.push({ pk: exp.pk, name: exp.name, date: exp.date });
 *       } else {
 *         // É uma experiência principal (raiz)
 *         rootExperiences.push(exp);
 *       }
 *     });
 * 
 *     // Limpa a resposta final para não incluir a propriedade 'parentPk'
 *     const finalResponseData = rootExperiences.map(exp => ({
 *       pk: exp.pk,
 *       name: exp.name,
 *       date: exp.date,
 *       subExperiences: exp.subExperiences
 *     }));
 * 
 *     const response = { data: finalResponseData };
 *     
 *     return ContentService
 *       .createTextOutput(JSON.stringify(response))
 *       .setMimeType(ContentService.MimeType.JSON);
 * 
 *   } catch (error) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ error: error.message }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * 
 * // Função executada quando o app faz uma requisição POST (para enviar dados)
 * function doPost(e) {
 *   try {
 *     const feedbackSheet = getSheet(FEEDBACK_SHEET_NAME);
 *     const data = JSON.parse(e.postData.contents);
 * 
 *     const timestamp = new Date();
 *     const experience = data.experience || '';
 *     const rating = data.rating;
 *     const reason = data.reason || '';
 *     const feedback = data.feedback || '';
 * 
 *     const aValues = feedbackSheet.getRange("A:A").getValues();
 *     let lastRowWithContent = 0; 
 *     for (let i = aValues.length - 1; i >= 0; i--) {
 *       if (aValues[i][0] && String(aValues[i][0]).trim() !== '') {
 *         lastRowWithContent = i + 1;
 *         break;
 *       }
 *     }
 *     
 *     if (lastRowWithContent === 0) {
 *         const headers = ["Timestamp", "Experience", "Rating", "Reason", "Feedback", "Classificação"];
 *         if(feedbackSheet.getLastRow() === 0) {
 *            feedbackSheet.appendRow(headers);
 *            lastRowWithContent = 1;
 *         }
 *     }
 * 
 *     const newRowData = [timestamp, experience, rating, reason, feedback];
 *     feedbackSheet.getRange(lastRowWithContent + 1, 1, 1, newRowData.length).setValues([newRowData]);
 * 
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ "status": "success", "message": "Feedback received" }))
 *       .setMimeType(ContentService.MimeType.JSON);
 * 
 *   } catch (error) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ```
 * =============================================================================
 */

import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

// !!! AÇÃO NECESSÁRIA !!!
// Substitua a URL abaixo pela nova URL do seu App da Web implantado.
const NEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxjxeHpXL8nUtVpYLRDWS0sR2930Z3jFhF7Zpmnc79WKcS_RRoqSKcSSoTX88_ZSDe-ow/exec';

export const AppComponent = Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
<div class="h-screen w-full flex flex-col overflow-hidden">
  <header class="h-28 flex-shrink-0"></header>
  <main class="flex-grow w-full flex items-center justify-center p-4 min-h-0">
    <div class="bg-[#f4f0e8]/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl w-full text-zinc-800 transform transition-all duration-500 flex flex-col max-h-full">
      
      <header class="mb-6 flex-shrink-0 relative">
        <!-- Header content removed -->
      </header>

    @switch (submissionState()) {
      @case ('selectingParent') {
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
                  @for (exp of experiences(); track exp.pk) {
                    <button (click)="prepareEvaluationGroup(exp)" class="w-full text-white py-3 px-6 rounded-lg bg-[#ff595a] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-left">
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

      @case ('confirmingGroup') {
        <div class="animate-fade-in flex flex-col flex-grow min-h-0">
          <div class="flex-shrink-0 relative mb-4">
              <h2 class="text-center text-xl font-bold text-zinc-700">Avaliar Experiências de "{{ evaluationGroup().parent.name }}"</h2>
          </div>
           <p class="text-center text-zinc-600 mb-4 flex-shrink-0">
            <strong>Atenção:</strong> Avalie apenas as experiências abaixo das quais você participou. <br>Se não participou de nenhuma, pode clicar em "Concluir e Finalizar".
           </p>
          
          <div class="overflow-y-auto overflow-x-hidden flex-grow px-4 pt-1 space-y-3">
            @for (sub of evaluationGroup().children; track sub.pk) {
              <button (click)="startEvaluation(sub)" [disabled]="isEvaluated(sub.pk)"
                class="w-full text-left p-3 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-between"
                [class]="isEvaluated(sub.pk) ? 'bg-green-100 text-green-800 opacity-80 cursor-not-allowed' : 'bg-white/70 hover:bg-white/100 hover:shadow-md transform hover:-translate-y-px'">
                <div>
                  <p class="font-bold text-zinc-800">{{ sub.name }}</p>
                  <p class="text-xs text-zinc-500">{{ formatDate(sub.dateObj) }}</p>
                </div>
                @if(isEvaluated(sub.pk)) {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                }
              </button>
            }
          </div>

          <div class="flex-shrink-0 pt-6 text-center">
            <button (click)="finishEvaluation()" class="text-white font-bold py-3 px-8 rounded-lg bg-[#b2dcd5] hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Concluir e Finalizar
            </button>
          </div>

        </div>
      }

      @case ('filling') {
        <div class="space-y-6 animate-fade-in overflow-y-auto overflow-x-hidden flex-grow px-4">
          <div class="text-center">
              <h2 class="text-xl font-bold text-zinc-700">Avaliação: <span class="text-[#ff595a]">{{ currentExperience().name }}</span></h2>
          </div>
          
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
                <span>Enviar Avaliação</span>
              }
            </button>
          </div>
        </div>
      }

      @case ('submitted') {
        <div class="text-center space-y-6 animate-fade-in py-8 flex-grow flex flex-col justify-center">
          <h2 class="font-slab text-3xl font-bold text-[#ff595a]">Obrigado!</h2>
          <p class="text-lg text-zinc-700">Seu feedback foi recebido com sucesso.</p>
          <p class="text-sm text-zinc-500 mt-4">Você já pode fechar esta janela.</p>
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
  submissionState = signal('selectingParent'); // 'selectingParent', 'filling', 'confirmingGroup', 'submitted'
  evaluationGroup = signal(null);
  currentExperience = signal(null);
  evaluatedPks = signal(new Set());

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
            this.error.set(`Erro retornado pelo servidor: ${response.error}`);
            return;
          }
          if (!response || !Array.isArray(response.data)) {
            this.error.set("A resposta do servidor é inválida ou não contém um array 'data'.");
            return;
          }
          
          const today = new Date();
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);

          const relevantExperiences = response.data
            .map(parent => ({
              ...parent,
              dateObj: new Date(parent.date + 'T00:00:00'),
              subExperiences: (parent.subExperiences || []).map(sub => ({
                ...sub,
                dateObj: new Date(sub.date + 'T00:00:00')
              })).sort((a, b) => a.name.localeCompare(b.name))
            }))
            .filter(exp => exp.dateObj instanceof Date && !isNaN(exp.dateObj) && exp.dateObj <= sevenDaysFromNow)
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
            
          this.experiences.set(relevantExperiences);
        },
        error: (err) => {
          this.error.set(`Falha na conexão com o servidor. Verifique se a URL está correta e se a implantação permite acesso anônimo.\nDetalhes: ${err.message}`);
        }
      });
  }

  isEvaluated(pk) {
    return this.evaluatedPks().has(pk);
  }

  prepareEvaluationGroup(parent) {
    const group = { parent, children: parent.subExperiences || [] };
    this.evaluationGroup.set(group);
    this.startEvaluation(parent);
  }

  startEvaluation(experience) {
      this.currentExperience.set(experience);
      this.resetFormFields();
      this.submissionState.set('filling');
  }

  backToParentSelection() {
    this.evaluationGroup.set(null);
    this.evaluatedPks.set(new Set());
    this.submissionState.set('selectingParent');
  }
  
  updateRating(event) {
    const value = event.target.value;
    this.rating.set(Number(value));
  }

  finishEvaluation() {
    this.submissionState.set('submitted');
  }

  submitFeedback() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.submissionError.set('');

    const payload = {
      experience: this.currentExperience().name,
      rating: this.rating(),
      reason: this.showReason() ? this.reason() : '',
      feedback: this.feedback(),
    };
    
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain;charset=utf-8' });

    this.httpClient.post(NEW_SCRIPT_URL, JSON.stringify(payload), { headers })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            const evaluatedExperience = this.currentExperience();
            this.evaluatedPks.update(pks => new Set(pks).add(evaluatedExperience.pk));
            
            const wasParent = evaluatedExperience.pk === this.evaluationGroup().parent.pk;
            const hasChildren = this.evaluationGroup().children.length > 0;

            if (wasParent) {
              if (hasChildren) {
                this.submissionState.set('confirmingGroup');
              } else {
                this.submissionState.set('submitted');
              }
            } else {
              // It was a child, go back to the list of children
              this.submissionState.set('confirmingGroup');
            }
          } else {
            this.submissionError.set(response.message || 'Ocorreu um erro desconhecido no servidor.');
          }
        },
        error: (err) => {
           this.submissionError.set(`Falha ao enviar. Verifique sua conexão e as permissões do script. Detalhes: ${err.message}`);
        }
      });
  }

  resetFormFields() {
      this.rating.set(10);
      this.reason.set('');
      this.feedback.set('');
      this.submissionError.set('');
  }

  reset() {
    this.currentExperience.set(null);
    this.evaluationGroup.set(null);
    this.evaluatedPks.set(new Set());
    this.resetFormFields();
    this.submissionState.set('selectingParent');
    this.fetchExperiences();
  }

  formatDate(dateObj) {
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
});