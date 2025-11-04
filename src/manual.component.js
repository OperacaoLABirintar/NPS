import { Component, ChangeDetectionStrategy, output } from '@angular/core';

export const ManualComponent = Component({
  selector: 'app-manual',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-[#f4f0e8] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" (click)="$event.stopPropagation()">
        <header class="p-4 border-b border-gray-300/50 flex justify-between items-center flex-shrink-0">
          <h2 class="text-2xl font-slab font-bold text-[#ff595a]">Manual NPS LABirintar</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" aria-label="Fechar manual">
            <span class="text-2xl font-light leading-none">&times;</span>
          </button>
        </header>
        <main class="overflow-y-auto p-6 space-y-4 text-zinc-800">
          <h2 class="text-2xl font-slab font-bold text-[#ff595a] mb-4">MANUAL COMPLETO SOBRE APLICAÇÃO DO NET PROMOTER SCORE (NPS) NA LABIRINTAR</h2>
          <p class="mb-4">Este manual destina-se a orientar a equipe interna da LABirintar, a plataforma Nina, e os agentes do ecossistema, incluindo os Educadores Empreendedores (EEs) e parceiros, sobre a teoria, aplicação e o valor estratégico do Net Promoter Score (NPS) como uma métrica central para Inovação, Estratégia e Excelência no ecossistema [i].</p>

          <h3 class="text-xl font-slab font-bold text-zinc-800 mt-6 mb-3 border-b pb-2">PARTE 1: QUALIFICAÇÃO DA LABIRINTAR: ESTRATÉGIA E OPERAÇÃO DO ECOSSISTEMA</h3>
          <p class="mb-4">A LABirintar é uma startup de inteligência educacional em rede, posicionada entre a ideação e a validação/tração (Product-Market Fit - PMF), focada em validar seu modelo de negócio e expandir suas operações. Não se trata apenas de uma empresa, mas de um ecossistema que transforma o contraturno escolar em um centro de inovação para as escolas, visando aumentar a viabilidade para todos os players.</p>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">1.1. Estratégia e Inovação: O Oceano Azul</h4>
          <p class="mb-4">A LABirintar nasceu com inovação no DNA para criar seu próprio Oceano Azul. Estrategicamente, a empresa busca evitar a competição em mercados saturados ("Oceano Vermelho") e criar um novo espaço de mercado.</p>
          <p class="mb-2">A Estratégia do Oceano Azul da LABirintar é delineada pela Matriz de Avaliação de Valor, que se concentra em:</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Elevar:</strong> A Curadoria Pedagógica e a Geração de Receita para a Escola.</li>
              <li><strong>Criar:</strong> Um Modelo de Empoderamento do Educador que funciona como diferencial e motor de expansão e qualidade. Os EEs são sócios minoritários, com participação acionária por Stock Options e Vesting.</li>
              <li><strong>Reduzir:</strong> A complexidade da Gestão Escolar, integrando todas as facetas do contraturno em uma única solução.</li>
              <li><strong>Eliminar:</strong> A necessidade de a escola buscar, contratar e gerenciar múltiplos fornecedores de atividades.</li>
          </ul>
          <p class="mb-4">Essa estratégia é sustentada por três ativos principais: a curadoria pedagógica, a rede autogerida de Educadores Empreendedores (EEs), e a tecnologia expressa na plataforma de gestão (Nina).</p>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">1.2. Plano Operacional e Excelência</h4>
          <p class="mb-4">A LABirintar opera sob uma cultura lean (enxuta) e de testes rápidos, com desenvolvimento ágil no-code (Bubble) para responder rapidamente às demandas.</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Tecnologia (Nina):</strong> A plataforma Nina é o núcleo operacional que automatiza processos (matrícula, pagamentos, gestão) e funciona como o tecido conectivo para a escala e a inteligência. O objetivo é integrar todo o ecossistema.</li>
              <li><strong>Rede de Educadores (EEs):</strong> Os EEs são o coração do modelo, atuando como empreendedores generativos. Eles são qualificados e treinados por uma Trilha Formativa Contínua.</li>
              <li><strong>Inteligência de Dados:</strong> A empresa busca se posicionar como um instituto de pesquisa aplicada, gerando inteligência sobre o desenvolvimento do aluno e o impacto pedagógico em parceria com o Instituto IDB para Inteligência Preditiva.</li>
          </ul>

          <h3 class="text-xl font-slab font-bold text-zinc-800 mt-6 mb-3 border-b pb-2">PARTE 2: MANUAL COMPLETO DE APLICAÇÃO DO NET PROMOTER SCORE (NPS)</h3>
          <p class="mb-4">O Net Promoter Score (NPS) é uma métrica crucial para a LABirintar, funcionando como um indicador de lealdade e um motor de alocação de talentos.</p>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">2.1. Teoria do NPS: O Único Indicador a Melhorar</h4>
          <p class="mb-4">O NPS é um indicador que representa a satisfação e a lealdade do cliente. É amplamente utilizado porque correlaciona-se com o crescimento e o comportamento real de recomendação do cliente.</p>
          <p class="mb-2">A métrica base-se em uma única pergunta, feita em uma escala de 0 a 10:</p>
          <blockquote class="border-l-4 border-[#ffa400] pl-4 italic my-4 bg-white/50 p-3 rounded-r-lg">
          "Qual a probabilidade de você nos recomendar a um amigo ou colega?"
          </blockquote>
          <p class="mb-4">A resposta a essa questão, considerada o supra-sumo da avaliação por predizer o futuro do negócio, é usada para classificar os clientes em três categorias distintas:</p>
          <div class="overflow-x-auto my-4">
              <table class="min-w-full bg-white border border-gray-300">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="py-2 px-4 border-b text-left">Categoria</th>
                          <th class="py-2 px-4 border-b text-left">Nota (0 a 10)</th>
                          <th class="py-2 px-4 border-b text-left">Comportamento e Significado</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b font-bold text-green-700">Promotores</td>
                          <td class="py-2 px-4 border-b">9 ou 10</td>
                          <td class="py-2 px-4 border-b">Clientes mais entusiastas, com altos índices de recompra e recomendação. São advogados da marca.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b font-bold text-yellow-700">Passivos</td>
                          <td class="py-2 px-4 border-b">7 ou 8</td>
                          <td class="py-2 px-4 border-b">Sentem que receberam o que pagaram, mas não são ativos leais nem agregam valor duradouro.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b font-bold text-red-700">Detratores</td>
                          <td class="py-2 px-4 border-b">0 a 6</td>
                          <td class="py-2 px-4 border-b">Clientes desapontados que prejudicam o crescimento e a reputação da empresa.</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <p class="mb-4">O cálculo do Net Promoter Score (NPS) é feito subtraindo a porcentagem de detratores da porcentagem de promotores.</p>
          <div class="bg-gray-100 p-4 rounded-lg my-4 text-center">
              <code class="text-lg font-mono">NPS = (% Promotores) - (% Detratores)</code>
          </div>
          <p class="mb-4">O NPS resultante varia de -100 a +100. Uma pontuação acima de +50 é geralmente considerada excelente.</p>

          <div class="overflow-x-auto my-4">
              <table class="min-w-full bg-white border border-gray-300">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="py-2 px-4 border-b text-left">Forças do NPS</th>
                          <th class="py-2 px-4 border-b text-left">Críticas e Limitações</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b align-top"><strong>Simplicidade e Intuição:</strong> Fácil de aplicar, fácil de rastrear e entender.</td>
                          <td class="py-2 px-4 border-b align-top"><strong>Generalidade:</strong> Oferece apenas "traços largos," como uma bússola, mas não o "mapa topográfico detalhado" necessário para navegar.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b align-top"><strong>Poder Preditivo:</strong> Correlaciona-se com o crescimento e a lealdade, prevendo o comportamento futuro do cliente.</td>
                          <td class="py-2 px-4 border-b align-top"><strong>Risco de Manipulação:</strong> A vinculação do NPS a bônus de funcionários de linha de frente pode levar a súplicas, subornos ou distorção dos dados.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b align-top"><strong>Métrica Acionável:</strong> Ajuda a identificar segmentos de clientes entusiastas, permitindo que a empresa ajuste o "motor" do produto.</td>
                          <td class="py-2 px-4 border-b align-top"><strong>Latência do Feedback:</strong> O feedback pode chegar tarde demais no processo para permitir uma iteração rápida no produto, resultando em perdas.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b align-top"><strong>Foco Estratégico:</strong> Força a organização a focar em aumentar promotores e reduzir detratores, o que é mais prático do que aumentar médias de satisfação genéricas.</td>
                          <td class="py-2 px-4 border-b align-top"><strong>Ambiguidade:</strong> Pode miscaracterizar promotores ativos como passivos ou detratores, inflando o número de detratores percebidos.</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <h3 class="text-xl font-slab font-bold text-zinc-800 mt-6 mb-3 border-b pb-2">PARTE 3: NPS NA LABIRINTAR: PONTE COM INOVAÇÃO, ESTRATÉGIA E EXCELÊNCIA</h3>
          <p class="mb-4">O NPS é uma ferramenta de Estratégia e Inovação na LABirintar, pois atua na fundação do ecossistema: a qualidade das experiências e o reconhecimento dos Educadores Empreendedores (EEs).</p>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">3.1. NPS e o Sistema de Score do Educador Empreendedor (EE)</h4>
          <p class="mb-4">Na LABirintar, o NPS é crucial para avaliar as experiências oferecidas pelos EEs nas confrarias, eventos e aulas. A pontuação do NPS coletada nessas interações é planejada para alimentar o Sistema de Scoring do EE.</p>
          <p class="mb-4">O Score do EE é o sistema nervoso central do ecossistema de parceiros, um motor de alocação que visa maximizar o sucesso coletivo. O NPS contribui diretamente para o componente de Excelência na rede:</p>

          <div class="overflow-x-auto my-4">
              <table class="min-w-full bg-white border border-gray-300">
                  <thead class="bg-gray-100">
                      <tr>
                          <th class="py-2 px-4 border-b text-left">Componente do Score</th>
                          <th class="py-2 px-4 border-b text-left">Peso</th>
                          <th class="py-2 px-4 border-b text-left">Contribuição do NPS</th>
                          <th class="py-2 px-4 border-b text-left">Propósito Estratégico</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b">Score de Desempenho</td>
                          <td class="py-2 px-4 border-b">30%</td>
                          <td class="py-2 px-4 border-b">Feedback das escolas (NPS) e taxas de renovação/expansão de contratos.</td>
                          <td class="py-2 px-4 border-b">Mede o impacto direto do EE no cliente final e na satisfação da escola, garantindo a eficácia.</td>
                      </tr>
                      <tr class="hover:bg-gray-50">
                          <td class="py-2 px-4 border-b">Score de Competência</td>
                          <td class="py-2 px-4 border-b">40%</td>
                          <td class="py-2 px-4 border-b">(Avaliações de pares, certificações internas).</td>
                          <td class="py-2 px-4 border-b">Mede a qualidade e profundidade da prática pedagógica.</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <p class="mb-2"><strong>Fluxo de Aplicação na LABirintar (Eventos e Experiências):</strong></p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Aplicação do Formulário:</strong> O NPS é usado para medir a satisfação com a qualidade da experiência oferecida. No contexto de eventos e estações (como confrarias ou aulas), a ideia é que os EEs peçam aos participantes para avaliarem suas estações usando QR Codes para facilitar a avaliação da experiência.</li>
              <li><strong>Captura de Dados:</strong> As respostas devem ser conectadas ao sistema Nina para que as pontuações alimentem o sistema de score. Embora o NPS tradicionalmente não seja pessoal e esteja ligado à nota geral do evento, a LABirintar deve adaptá-lo para capturar a satisfação em relação ao EE específico (Educador Promotor) que ofereceu a experiência.</li>
              <li><strong>Reforço do Ecossistema:</strong> O reconhecimento das experiências mais potentes através do NPS e do Score do EE garante que a rede autogerida priorize e recompense a Excelência. Isso incentiva os Educadores Empreendedores a manterem um alto nível de qualidade, fortalecendo a rede como um ativo defensável.</li>
          </ul>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">3.2. NPS como Métrica de Estratégia e Inovação</h4>
          <p class="mb-4">O NPS é um dos KPIs cruciais monitorados pela LABirintar, ao lado de métricas financeiras como o LTV/CAC e o Churn Rate.</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Estratégia e Predição:</strong> O NPS, ao medir a lealdade, serve como um indicador para maximizar a probabilidade de renovações e aumentar o Lifetime Value (LTV) do cliente. Um NPS alto nas escolas e famílias parceiras valida o Product-Market Fit (PMF) e reforça a narrativa de Inovação de Valor da LABirintar.</li>
              <li><strong>Inovação e Qualificação:</strong> A utilização do NPS no processo de vetting (qualificação) de novos EEs e parceiros é recomendada, transformando o processo de aprovação em uma qualificação de mão dupla (avaliando satisfação e match mútuo).</li>
              <li><strong>Excelência e Curadoria:</strong> O NPS apoia a Excelência Pedagógica ao fornecer feedback objetivo sobre a qualidade da entrega, permitindo que a curadoria pedagógica da LABirintar use dados concretos para aprimorar a formação contínua dos EEs.</li>
          </ul>

          <h3 class="text-xl font-slab font-bold text-zinc-800 mt-6 mb-3 border-b pb-2">PARTE 4: MANUAL DO SIMULADOR OPERACIONAL LABIRINTAR</h3>
          <p class="mb-4">O Simulador Operacional é uma ferramenta de Pesquisa Operacional (PO) projetada para oferecer prova quantitativa do valor estratégico da LABirintar, demonstrando a viabilidade financeira para todos os players do ecossistema.</p>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">4.1. Propósito e Visão Estratégica</h4>
          <p class="mb-4">O simulador tem como missão substituir o caos operacional e a ineficiência econômica dos modelos tradicionais por um Sistema Operacional completo para o contraturno escolar.</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Viabilidade para o Ecossistema:</strong> O Simulador cumpre o objetivo de mostrar a viabilidade financeira de cada player (escola, educador, provedor, LABirintar) dentro da operação.</li>
              <li><strong>Prova de Valor:</strong> É a prova de que a LABirintar oferece mais do que aulas, mas sim uma solução otimizada, rentável e pedagogicamente rica.</li>
              <li><strong>Racional de Cálculo:</strong> O simulador não é apenas uma planilha; ele contém um manual que explica seu funcionamento e o racional por trás dos cálculos, incluindo a função objetivo (o que se quer otimizar) e as restrições.</li>
          </ul>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">4.2. Funcionalidade Principal: Transformação de Custos</h4>
          <p class="mb-4">A principal vantagem quantificada pelo Simulador é a transformação de custos fixos da escola em custos variáveis.</p>
          <p class="mb-2">O Simulador permite a comparação entre dois cenários principais:</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Cenário "Fazer" (Do It Yourself):</strong> Simula a escola operando o extracurricular por conta própria. A escola arca com os salários dos educadores como custos fixos, gerando alto risco financeiro. Se as turmas não atingirem o quórum, a escola tem prejuízo.</li>
              <li><strong>Cenário "Comprar" (Parceria LABirintar):</strong> Simula a parceria com a LABirintar, onde o "custo" da escola é um percentual da receita (revenue share), tornando-o um custo variável. O custo só existe se houver receita, e o risco de turmas vazias é transferido para a LABirintar, garantindo que a operação extracurricular não gere prejuízo para a escola.</li>
          </ul>

          <h4 class="text-lg font-slab font-bold text-zinc-700 mt-4 mb-2">4.3. Análises e Saídas (Outputs)</h4>
          <p class="mb-4">O Simulador Operacional organiza a análise em etapas estratégicas:</p>
          <ul class="list-disc list-inside mb-4 pl-4 space-y-1">
              <li><strong>Modelagem de Cenários:</strong> Permite modelar a demanda e otimizar a alocação de recursos (educadores, tempo, espaço).</li>
              <li><strong>Análise da Escola:</strong> Compara as Demonstrações de Resultado do Exercício (DREs) dos cenários "Fazer" e "Comprar", exibindo Margem de Contribuição, Ponto de Equilíbrio e Lucro Líquido para determinar qual é o cenário financeiramente mais vantajoso.</li>
              <li><strong>Saúde do Ecossistema:</strong> Aprofunda a análise do cenário "Comprar", permitindo ajustar os repasses e parâmetros para verificar a sustentabilidade financeira de Educadores, Provedores e LABirintar.</li>
              <li><strong>Relatório Completo:</strong> Gera um relatório detalhado com análise executiva gerada por IA (Nina), DREs comparativas e um glossário de termos financeiros.</li>
          </ul>
          <p class="mb-4">O simulador é essencial para o processo comercial, permitindo que a LABirintar prove quantitativamente aos decisores financeiros (CEO/Diretor Executivo) que a plataforma oferece eficiência operacional e ROI (Retorno sobre o Investimento) ao otimizar ativos e automatizar a gestão.</p>

          <h3 class="text-xl font-slab font-bold text-zinc-800 mt-6 mb-3 border-b pb-2">Conclusão do Manual: A Lógica do Ecossistema</h3>
          <p class="mb-4">O NPS, o Score do EE e o Simulador Operacional atuam em conjunto, formando um ciclo virtuoso auto-reforçado para a LABirintar:</p>
          <p class="mb-4">O Simulador Operacional (Estratégia/Finanças) valida o modelo de negócio, provando a viabilidade e a rentabilidade para a escola (transformando custos fixos em variáveis). Isso atrai escolas e aumenta o volume de alunos. O NPS (Excelência/Inovação) mensura a qualidade e a satisfação gerada pelas experiências dos EEs. Esse feedback alimenta o Score do EE, o que garante que os Educadores mais competentes e com melhor desempenho sejam alocados em mais oportunidades. Esse ciclo assegura que o investimento na formação e capacitação dos EEs resulte em dados mais ricos e em uma Proposta Única de Valor (USP) definitiva, acelerando a aquisição de novas escolas e a dominação do mercado.</p>
          <p class="mb-4">Em essência, se o Simulador Operacional é a calculadora que prova que o negócio é financeiramente inteligente, o NPS é o termômetro que mede se o ecossistema está vivo e se as experiências estão gerando a lealdade necessária para o crescimento sustentável.</p>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})(class {
  close = output();
});