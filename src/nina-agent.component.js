import { Component, ChangeDetectionStrategy, output, signal, viewChild, afterNextRender } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { NINA_KNOWLEDGE_BASE } from './nina-knowledge-base.js';

// FIX: Combined the Component decorator and class definition into a single statement.
export const NinaAgentComponent = Component({
  selector: 'app-nina-agent',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col animate-fade-in" (click)="$event.stopPropagation()">
        
        <header class="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-cover bg-center shrink-0" style="background-image: url('https://edumoreiragit.github.io/Imagens/Labirintar/IMG_3281.png')"></div>
            <h2 class="text-xl font-slab font-bold text-zinc-800">Converse com a Nina</h2>
          </div>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" aria-label="Fechar chat">
            <span class="text-2xl font-light leading-none">&times;</span>
          </button>
        </header>

        <main #chatContainer class="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
          @for(message of chatHistory(); track $index) {
            <div 
              class="flex animate-fade-in" 
              [class.justify-end]="message.role === 'user'">
              <div 
                class="max-w-[85%] p-3 rounded-xl shadow-sm"
                [class]="message.role === 'user' ? 'bg-gradient-to-br from-[#ff595a] to-[#fd8080] text-white' : 'bg-gray-200 text-zinc-800'"
              >
                <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ message.text }}</p>
              </div>
            </div>
          }
          @if (isLoading()) {
            <div class="flex justify-start">
               <div class="max-w-prose p-3 rounded-lg bg-gray-200 text-zinc-800">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div class="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div class="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                  </div>
               </div>
            </div>
          }
        </main>

        <footer class="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          @if(error()) {
             <div class="text-xs text-red-700 bg-red-100 p-2 rounded-md mb-2">
              {{ error() }}
             </div>
          }
          <form (submit)="sendMessage($event)" class="flex items-center gap-3">
            <textarea 
              rows="1" 
              class="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa400] focus:border-transparent resize-none transition text-sm" 
              placeholder="Digite sua pergunta..."
              [value]="userInput()"
              (input)="userInput.set($any($event.target).value)"
              (keydown.enter)="sendMessage($event)">
            </textarea>
            <button type="submit" [disabled]="isLoading() || !userInput().trim()" class="text-white font-bold py-2 px-4 rounded-lg bg-[#ffa400] hover:bg-opacity-90 transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})(class {
  close = output();
  userInput = signal('');
  chatHistory = signal([
    { role: 'nina', text: 'Olá! Eu sou a Nina, a assistente de IA da LABirintar. Meu conhecimento é baseado no manual de NPS. Como posso ajudar?' }
  ]);
  isLoading = signal(false);
  error = signal('');
  
  chat = null;
  chatContainer = viewChild('chatContainer');

  constructor() {
    afterNextRender(() => {
      this.initializeChat();
      this.scrollToBottom();
    });
  }

  initializeChat() {
    try {
      if (!process.env.API_KEY) {
        throw new Error("A chave de API do Gemini não foi configurada.");
      }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Você é a Nina, uma assistente de IA especialista da LABirintar. Sua única fonte de conhecimento é o documento fornecido abaixo. Responda às perguntas dos usuários baseando-se estritamente neste texto. Não invente informações e não use conhecimento externo. Se a resposta não estiver no texto, diga "Essa informação não está disponível no meu manual de conhecimento.". Seja amigável e profissional. Use formatação como negrito para destacar termos importantes. O documento é: ### ${NINA_KNOWLEDGE_BASE} ###`,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
    } catch(e) {
        this.error.set(`Não foi possível inicializar a IA. Detalhes: ${e.message}`);
        console.error(e);
    }
  }

  async sendMessage(event) {
    if (event) {
        event.preventDefault();
        // Allow Shift+Enter for newlines, but send on Enter
        if (event instanceof KeyboardEvent && event.key === 'Enter' && event.shiftKey) {
            return;
        }
    }
    
    const userMessage = this.userInput().trim();
    if (!userMessage || this.isLoading() || !this.chat) return;

    this.chatHistory.update(history => [...history, { role: 'user', text: userMessage }]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    try {
        const response = await this.chat.sendMessage({ message: userMessage });
        const ninaResponse = response.text;
        this.chatHistory.update(history => [...history, { role: 'nina', text: ninaResponse }]);
    } catch (e) {
        console.error(e);
        this.chatHistory.update(history => [...history, { role: 'nina', text: 'Desculpe, ocorreu um erro ao processar sua solicitação.' }]);
    } finally {
        this.isLoading.set(false);
        this.scrollToBottom();
    }
  }

  scrollToBottom() {
    afterNextRender(() => {
        try {
            const container = this.chatContainer()?.nativeElement;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    });
  }
});