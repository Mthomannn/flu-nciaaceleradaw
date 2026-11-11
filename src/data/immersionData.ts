import { TargetLanguage, FluencyLevel, ImmersionBlock } from '../types';

export function getImmersionScheduleFor(language: TargetLanguage, level: FluencyLevel): ImmersionBlock[] {
  if (language === 'Inglês') {
    switch (level) {
      case 'Zero':
        return [
          {
            id: 'im_z_1',
            timeSlot: '07:15 - 07:30 (Manhã)',
            periodName: 'Despertar com Primeiros Sons',
            inputTask: 'Ouvir 10 minutos de saudações básicas, números e sons do alfabeto em velocidade suave.',
            outputTask: 'Dizer em voz alta no espelho: "Hello! My name is [Seu Nome]. Nice to meet you." 3 vezes.',
            microVocabTask: 'Memorizar a frase de sobrevivência: "Could you speak slowly, please?".',
            durationMinutes: 15,
            completed: false,
          },
          {
            id: 'im_z_2',
            timeSlot: '08:30 - 08:50 (Deslocamento / Trânsito)',
            periodName: 'Identificação de Objetos Reais (Sem Traduzir)',
            inputTask: 'Áudio curto com nomes de objetos cotidianos (car, street, coffee, bag, phone).',
            outputTask: 'Apontar para 5 coisas que você vê no trajeto e falar a palavra em inglês sem passar pelo português.',
            microVocabTask: 'Fixar 3 substantivos imediatos: "door", "water", "phone".',
            durationMinutes: 15,
            completed: false,
          },
          {
            id: 'im_z_3',
            timeSlot: '12:30 - 12:45 (Micro-pausa de Almoço)',
            periodName: 'Simulação de Pedido & Restaurante',
            inputTask: 'Assistir a um clipe curto de 3 minutos de alguém fazendo um pedido em uma lanchonete.',
            outputTask: 'Praticar em voz alta: "A coffee, please" e "How much is this?".',
            microVocabTask: 'Aprender o coringa de cortesia: "I would like...".',
            durationMinutes: 15,
            completed: false,
          },
          {
            id: 'im_z_4',
            timeSlot: '18:30 - 18:50 (Fim de Tarde / Casa)',
            periodName: 'Repetição Espelhada & Respiração',
            inputTask: 'Ouvir 5 frases do Nível Zero no app em velocidade reduzida (0.9x).',
            outputTask: 'Fazer Shadowing sussurrado repetindo 3 vezes cada frase copiando exatamente a respiração do locutor.',
            microVocabTask: 'Fixar "Where is the bathroom?" e "Thank you very much".',
            durationMinutes: 20,
            completed: false,
          },
          {
            id: 'im_z_5',
            timeSlot: '21:30 - 21:45 (Antes de Dormir)',
            periodName: 'Descompressão Sem Ansiedade',
            inputTask: 'Ouvir uma narração curta e calma em inglês para acostumar o ouvido aos sons noturnos.',
            outputTask: 'Falar para si mesmo as 3 palavras mais fáceis que aprendeu hoje antes de desligar a luz.',
            microVocabTask: 'Fixar "Good morning" e "Good night".',
            durationMinutes: 15,
            completed: false,
          },
        ];

      case 'A1':
        return [
          {
            id: 'im_a1_1',
            timeSlot: '07:15 - 07:35 (Manhã)',
            periodName: 'Input Auditivo & Rotina Matinal',
            inputTask: 'Ouvir 1 episódio de micro-podcast (5-7 min) de rotinas diárias com áudio nativo a 1.0x.',
            outputTask: 'Falar 3 ações que vai fazer na manhã: "I am having coffee, then taking a shower, then leaving."',
            microVocabTask: 'Revisar 5 verbos de ação rápida (wake up, grab, leave, arrive, start).',
            durationMinutes: 20,
            completed: false,
          },
          {
            id: 'im_a1_2',
            timeSlot: '08:30 - 09:00 (Deslocamento / Trânsito)',
            periodName: 'Shadowing no Carro / Transporte',
            inputTask: 'Áudio com 10 diálogos práticos em loop (compras, direções, pedidos).',
            outputTask: 'Repetir imediatamente cada fala logo após o locutor (Shadowing a 1.0x).',
            microVocabTask: 'Identificar as reduções de fala conectada: "gonna", "wanna", "hafta".',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_a1_3',
            timeSlot: '12:30 - 12:50 (Almoço)',
            periodName: 'Input Visual em Inglês Real',
            inputTask: 'Assistir a 1 vídeo curto do YouTube (receita, vlog curto de 3 a 5 min) com legenda em inglês.',
            outputTask: 'Sem pausar, resumir mentalmente 2 ideias centrais.',
            microVocabTask: 'Anotar 2 palavras desconhecidas deduzidas pelo contexto visual.',
            durationMinutes: 20,
            completed: false,
          },
          {
            id: 'im_a1_4',
            timeSlot: '18:30 - 19:00 (Fim de Tarde / Academia)',
            periodName: 'Narração de Ações em Tempo Real',
            inputTask: 'Ouvir playlist de músicas em inglês com a letra na tela ou podcast informal.',
            outputTask: 'Narrar em voz alta ou mentalmente suas próprias ações por 5 minutos ("Now I am cooking dinner...").',
            microVocabTask: 'Usar "need to", "want to" e "have to" com naturalidade.',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_a1_5',
            timeSlot: '21:30 - 21:50 (Noite / Cama)',
            periodName: 'Consolidação de Memória & Áudio Noturno',
            inputTask: 'Ouvir 1 história para dormir (Sleep Story) ou diálogo relaxante em inglês.',
            outputTask: 'Gravar um áudio de 30 segundos no celular falando em inglês como foi seu dia.',
            microVocabTask: 'Revisar os 5 cartões de vocabulário do dia antes de adormecer.',
            durationMinutes: 20,
            completed: false,
          },
        ];

      case 'A2':
        return [
          {
            id: 'im_a2_1',
            timeSlot: '07:00 - 07:25 (Manhã)',
            periodName: 'Notícias Rápidas & Previsão do Tempo',
            inputTask: 'Ouvir 10 minutos de podcast de notícias em ritmo moderado (BBC 6 Minute English ou similar).',
            outputTask: 'Comentar a notícia mais interessante em voz alta com pelo menos 3 frases.',
            microVocabTask: 'Fixar conectivos causais: "because", "since", "so".',
            durationMinutes: 25,
            completed: false,
          },
          {
            id: 'im_a2_2',
            timeSlot: '08:15 - 08:45 (Deslocamento)',
            periodName: 'Treino de Conexões da Fala e Reduções',
            inputTask: 'Ouvir diálogos com Connected Speech (Flap T, Glottal Stop, elisões de consoantes).',
            outputTask: 'Imitar as junções de palavras em voz alta sem separar as sílabas mecanicamente.',
            microVocabTask: 'Identificar a fusão de "would you" [wʊdʒu] e "did you" [dɪdʒu].',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_a2_3',
            timeSlot: '12:30 - 13:00 (Almoço)',
            periodName: 'Consumo de Conteúdo de Interesse Pessoal',
            inputTask: 'Assistir a um tutorial ou entrevista de 7 minutos de um tema que você ama 100% em inglês.',
            outputTask: 'Explicar o conceito para você mesmo sem usar nenhuma palavra em português.',
            microVocabTask: 'Capturar 3 phrasal verbs usados espontaneamente pelo apresentador.',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_a2_4',
            timeSlot: '18:45 - 19:15 (Pós-Trabalho)',
            periodName: 'Treino de Drills de Substituição Rápida',
            inputTask: 'Abrir o app no módulo de Resposta Rápida e praticar 5 cartões com timer de 5s.',
            outputTask: 'Falar as variações imediatamente sem planejar gramática.',
            microVocabTask: 'Dominar estruturas de contraste: "even though", "however", "instead of".',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_a2_5',
            timeSlot: '21:30 - 21:55 (Antes de Dormir)',
            periodName: 'Diário Falado & Fechamento',
            inputTask: 'Ouvir um conto narrado em inglês por 10 minutos com foco na entonação emocional.',
            outputTask: 'Gravar 1 minuto de áudio relatando os 3 maiores aprendizados do seu dia.',
            microVocabTask: 'Revisar os cartões de vocabulário marcados como "aprendendo".',
            durationMinutes: 25,
            completed: false,
          },
        ];

      case 'B1':
        return [
          {
            id: 'im_b1_1',
            timeSlot: '06:45 - 07:15 (Manhã)',
            periodName: 'Imersão em Opiniões & Debates',
            inputTask: 'Ouvir podcast de análise de cultura, negócios ou tecnologia em inglês nativo sem adaptação.',
            outputTask: 'Expressar sua concordância ou discordância em voz alta com argumentos estruturados.',
            microVocabTask: 'Usar "from my perspective", "on the other hand", "to be honest".',
            durationMinutes: 30,
            completed: false,
          },
          {
            id: 'im_b1_2',
            timeSlot: '08:00 - 08:40 (Deslocamento)',
            periodName: 'Shadowing Avançado em Velocidade Real (1.15x)',
            inputTask: 'Áudio de entrevista informal e espontânea com sobreposições e risadas.',
            outputTask: 'Acompanhar a prosódia, o ritmo e as pausas dramáticas do falante nativo.',
            microVocabTask: 'Eliminar vícios de hesitação ("ééé", "tipo") substituindo por pausas silenciosas ou fillers nativos.',
            durationMinutes: 40,
            completed: false,
          },
          {
            id: 'im_b1_3',
            timeSlot: '12:30 - 13:05 (Almoço)',
            periodName: 'Leitura Rápida de Artigo & Síntese Oral',
            inputTask: 'Ler um artigo de jornal (NYTimes, BBC, Medium) em 10 minutos.',
            outputTask: 'Fazer um resumo executivo falado de 2 minutos gravado no celular.',
            microVocabTask: 'Incorporar 3 adjetivos precisos e collocations corporativas.',
            durationMinutes: 35,
            completed: false,
          },
          {
            id: 'im_b1_4',
            timeSlot: '18:30 - 19:10 (Fim de Tarde)',
            periodName: 'Simulação de Conversação & Reunião',
            inputTask: 'Executar o Treino de 10 Perguntas Inesperadas no app com limite estrito de 5s.',
            outputTask: 'Responder com convicção e clareza de dicção.',
            microVocabTask: 'Treinar as armadilhas fonéticas de pares mínimos (sheep/ship, beach/bitch).',
            durationMinutes: 40,
            completed: false,
          },
          {
            id: 'im_b1_5',
            timeSlot: '21:30 - 22:00 (Noite)',
            periodName: 'Monólogo de Resolução de Problemas',
            inputTask: 'Assistir a um stand-up comedy curto ou TED Talk com humor sarcástico.',
            outputTask: 'Narrar um imprevisto recente do trabalho e como você o solucionou com profissionalismo.',
            microVocabTask: 'Consolidar expressões idiomáticas do dia no banco de vocabulário.',
            durationMinutes: 30,
            completed: false,
          },
        ];

      case 'B2':
      case 'C1':
        return [
          {
            id: 'im_adv_1',
            timeSlot: '06:30 - 07:10 (Manhã)',
            periodName: 'Briefing Executivo & Geopolítica Global',
            inputTask: 'Ouvir podcasts de alto calibre analítico (The Economist, FT, NPR NewsHour).',
            outputTask: 'Elaborar um contraponto crítico oral com vocabulário formal de liderança.',
            microVocabTask: 'Internalizar metáforas e termos abstratos de tomada de decisão.',
            durationMinutes: 40,
            completed: false,
          },
          {
            id: 'im_adv_2',
            timeSlot: '08:00 - 08:45 (Deslocamento)',
            periodName: 'Prosódia de Alto Impacto & Shadowing Retórico',
            inputTask: 'Discursos de grandes oradores, debates acadêmicos ou conferências com fala rápida (1.2x).',
            outputTask: 'Reproduzir as modulações tônicas de ênfase, persuasão e autoridade vocal.',
            microVocabTask: 'Perfeição em ligações fonéticas sutis e ritmo silábico sem sotaque perceptível.',
            durationMinutes: 45,
            completed: false,
          },
          {
            id: 'im_adv_3',
            timeSlot: '12:30 - 13:15 (Almoço)',
            periodName: 'Imersão Profissional & Escrita Espontânea',
            inputTask: 'Ler whitepapers, relatórios de pesquisa ou análises profundas de mercado.',
            outputTask: 'Gravar mensagem de áudio articulando uma tese de 3 minutos sem rascunho.',
            microVocabTask: 'Refinar nuances de polidez diplomática e ironia fina.',
            durationMinutes: 45,
            completed: false,
          },
          {
            id: 'im_adv_4',
            timeSlot: '18:30 - 19:15 (Fim de Tarde)',
            periodName: 'Debate Hipotético & Pensamento Estratégico',
            inputTask: 'Treinar as 20 perguntas diretas do app no modo cronômetro relâmpago.',
            outputTask: 'Discorrer sobre dilemas éticos, cenários futuros e filosofia prática.',
            microVocabTask: 'Uso espontâneo do subjuntivo e estruturas inversas de ênfase ("Not only did...").',
            durationMinutes: 45,
            completed: false,
          },
          {
            id: 'im_adv_5',
            timeSlot: '21:30 - 22:00 (Noite)',
            periodName: 'Reflexão Filosófica & Leitura Literária',
            inputTask: 'Ler poesia, ficção contemporânea ou ensaios biográficos em inglês autêntico.',
            outputTask: 'Conduzir a narrativa mental final de 10 minutos exclusivamente em inglês.',
            microVocabTask: 'Revisão final de expressões nativas sofisticadas.',
            durationMinutes: 30,
            completed: false,
          },
        ];
      default:
        return [
          {
            id: 'im_def_1',
            timeSlot: '07:15 - 07:35 (Manhã)',
            periodName: 'Input Auditivo & Rotina Matinal',
            inputTask: 'Ouvir 1 episódio de micro-podcast (5-7 min) de rotinas diárias com áudio nativo a 1.0x.',
            outputTask: 'Falar 3 ações que vai fazer na manhã: "I am having coffee, then taking a shower, then leaving."',
            microVocabTask: 'Revisar 5 verbos de ação rápida (wake up, grab, leave, arrive, start).',
            durationMinutes: 20,
            completed: false,
          },
        ];
    }
  }

  return [];
}
