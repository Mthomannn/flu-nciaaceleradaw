/**
 * Dados Completos dos Treinos de Alta Fluência
 * - Treino de Resposta Rápida (40 Estímulos + 15 Estruturas de Substituição + Teste de 10 Perguntas Inesperadas)
 * - Especialista em Fonética Prática (10 Armadilhas Fonéticas com 5 Palavras cada + Rotina 10min + Entonação + Teste Semanal 15 Frases)
 * - Pensamento Direto no Idioma (4 Etapas: 20 Objetos + 20 Ações + 20 Perguntas + Rotina 10min + 30 Blocos Nativos + Teste 20 Perguntas)
 */

export interface FastDrillItem {
  id: string;
  round: 1 | 2;
  triggerCategory: 'eu quero' | 'eu preciso' | 'eu acho' | 'eu sinto / vou' | 'geral';
  promptQuestion: string;
  promptTranslation: string;
  expectedStructure: string;
  sampleAnswer: string;
}

export const ROUND_1_DRILLS: FastDrillItem[] = [
  // Foco: Eu Quero / Gostaria (I want / I'd like)
  {
    id: 'r1_1',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'What do you want to drink right now?',
    promptTranslation: 'O que você quer beber agora?',
    expectedStructure: 'I want to drink... / I would like...',
    sampleAnswer: 'I want to drink a glass of cold water.',
  },
  {
    id: 'r1_2',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'Where do you want to go this weekend?',
    promptTranslation: 'Onde você quer ir neste fim de semana?',
    expectedStructure: 'I want to go to...',
    sampleAnswer: 'I want to go to the beach with my friends.',
  },
  {
    id: 'r1_3',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'What do you want to eat for dinner tonight?',
    promptTranslation: 'O que você quer comer no jantar hoje?',
    expectedStructure: 'I want to have / eat...',
    sampleAnswer: 'I want to eat a fresh salad and pasta.',
  },
  {
    id: 'r1_4',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'Which country do you want to visit next year?',
    promptTranslation: 'Qual país você quer visitar ano que vem?',
    expectedStructure: 'I want to visit...',
    sampleAnswer: 'I want to visit Canada or Japan.',
  },
  {
    id: 'r1_5',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'Do you want coffee or tea right now?',
    promptTranslation: 'Você quer café ou chá agora?',
    expectedStructure: 'I want [X] please.',
    sampleAnswer: 'I want a hot cup of black coffee, please.',
  },
  {
    id: 'r1_6',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'What movie do you want to watch tonight?',
    promptTranslation: 'Qual filme você quer ver hoje à noite?',
    expectedStructure: 'I want to watch...',
    sampleAnswer: 'I want to watch an action movie or a comedy.',
  },
  {
    id: 'r1_7',
    round: 1,
    triggerCategory: 'eu quero',
    promptQuestion: 'How much time do you want to study today?',
    promptTranslation: 'Quanto tempo você quer estudar hoje?',
    expectedStructure: 'I want to study for...',
    sampleAnswer: 'I want to study for at least 30 minutes.',
  },

  // Foco: Eu Preciso / Tenho que (I need / I have to)
  {
    id: 'r1_8',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What do you need to buy at the supermarket?',
    promptTranslation: 'O que você precisa comprar no mercado?',
    expectedStructure: 'I need to buy...',
    sampleAnswer: 'I need to buy bread, milk, and some eggs.',
  },
  {
    id: 'r1_9',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What time do you need to wake up tomorrow?',
    promptTranslation: 'Que horas você precisa acordar amanhã?',
    expectedStructure: 'I need to wake up at...',
    sampleAnswer: 'I need to wake up at 6:30 in the morning.',
  },
  {
    id: 'r1_10',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'Who do you need to call this afternoon?',
    promptTranslation: 'Quem você precisa ligar hoje à tarde?',
    expectedStructure: 'I need to call...',
    sampleAnswer: 'I need to call my coworker about the project.',
  },
  {
    id: 'r1_11',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What do you need to finish before Friday?',
    promptTranslation: 'O que você precisa terminar antes de sexta?',
    expectedStructure: 'I need to finish...',
    sampleAnswer: 'I need to finish writing this monthly report.',
  },
  {
    id: 'r1_12',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'Where do you need to be at 2 PM?',
    promptTranslation: 'Onde você precisa estar às 14h?',
    expectedStructure: 'I need to be at...',
    sampleAnswer: 'I need to be at the office for a meeting.',
  },
  {
    id: 'r1_13',
    round: 1,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What document do you need to renew soon?',
    promptTranslation: 'Qual documento você precisa renovar em breve?',
    expectedStructure: 'I need to renew my...',
    sampleAnswer: 'I need to renew my passport before travelling.',
  },

  // Foco: Eu Acho / Acredito (I think / I believe / In my opinion)
  {
    id: 'r1_14',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'Do you think it will rain today?',
    promptTranslation: 'Você acha que vai chover hoje?',
    expectedStructure: 'I think it will / I don’t think...',
    sampleAnswer: 'I think it might rain later in the afternoon.',
  },
  {
    id: 'r1_15',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'What do you think about working from home?',
    promptTranslation: 'O que você acha do home office?',
    expectedStructure: 'I think it is very...',
    sampleAnswer: 'I think it is very productive and flexible.',
  },
  {
    id: 'r1_16',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'Which language do you think is the hardest to learn?',
    promptTranslation: 'Qual idioma você acha mais difícil de aprender?',
    expectedStructure: 'I think [Language] is the hardest because...',
    sampleAnswer: 'I think Mandarin Chinese is probably the hardest.',
  },
  {
    id: 'r1_17',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'Do you think reading books is better than watching movies?',
    promptTranslation: 'Você acha ler livros melhor do que ver filmes?',
    expectedStructure: 'I think reading is... because...',
    sampleAnswer: 'I think books are better because they have more detail.',
  },
  {
    id: 'r1_18',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'How long do you think it takes to speak fluent English?',
    promptTranslation: 'Quanto tempo você acha que leva para falar inglês fluente?',
    expectedStructure: 'I think it takes about...',
    sampleAnswer: 'I think it takes about 6 to 12 months with daily practice.',
  },
  {
    id: 'r1_19',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'Do you think exercise in the morning gives more energy?',
    promptTranslation: 'Você acha que exercício de manhã dá mais energia?',
    expectedStructure: 'Yes, I definitely think so because...',
    sampleAnswer: 'Yes, I think it gives you energy for the entire day.',
  },
  {
    id: 'r1_20',
    round: 1,
    triggerCategory: 'eu acho',
    promptQuestion: 'What do you think is the key to happiness?',
    promptTranslation: 'O que você acha que é o segredo da felicidade?',
    expectedStructure: 'I believe the key is...',
    sampleAnswer: 'I believe the key is good health and strong relationships.',
  },
];

export const ROUND_2_DRILLS: FastDrillItem[] = [
  // Rodada 2: Estímulos em novos contextos comunicativos (20 estímulos variados)
  {
    id: 'r2_1',
    round: 2,
    triggerCategory: 'eu quero',
    promptQuestion: 'Would you like to try something new for lunch today?',
    promptTranslation: 'Gostaria de experimentar algo novo no almoço hoje?',
    expectedStructure: "I'd love to try... / I prefer to...",
    sampleAnswer: "I'd love to try that new Mexican restaurant downtown.",
  },
  {
    id: 'r2_2',
    round: 2,
    triggerCategory: 'eu quero',
    promptQuestion: 'How would you like to spend your next vacation?',
    promptTranslation: 'Como gostaria de passar suas próximas férias?',
    expectedStructure: 'I would like to spend it relaxing on...',
    sampleAnswer: 'I would like to relax at a quiet mountain cabin.',
  },
  {
    id: 'r2_3',
    round: 2,
    triggerCategory: 'eu quero',
    promptQuestion: 'Do you want to practice your speaking right now?',
    promptTranslation: 'Você quer praticar sua fala agora mesmo?',
    expectedStructure: 'Yes, I definitely want to practice!',
    sampleAnswer: 'Yes, I want to practice right now for 10 minutes.',
  },
  {
    id: 'r2_4',
    round: 2,
    triggerCategory: 'eu quero',
    promptQuestion: 'What skill do you want to master this year?',
    promptTranslation: 'Qual habilidade você quer dominar este ano?',
    expectedStructure: 'I want to master...',
    sampleAnswer: 'I want to master public speaking in English.',
  },
  {
    id: 'r2_5',
    round: 2,
    triggerCategory: 'eu quero',
    promptQuestion: 'Do you want to go out tonight or stay in?',
    promptTranslation: 'Você quer sair hoje à noite ou ficar em casa?',
    expectedStructure: 'I want to stay in and...',
    sampleAnswer: 'I want to stay home, order pizza, and rest.',
  },

  {
    id: 'r2_6',
    round: 2,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What do you have to do as soon as you get home?',
    promptTranslation: 'O que você tem que fazer assim que chegar em casa?',
    expectedStructure: 'I have to take a shower and...',
    sampleAnswer: 'I have to feed my dog and prepare dinner.',
  },
  {
    id: 'r2_7',
    round: 2,
    triggerCategory: 'eu preciso',
    promptQuestion: 'Do you need to improve your grammar or your listening more?',
    promptTranslation: 'Você precisa melhorar mais sua gramática ou sua escuta?',
    expectedStructure: 'I definitely need to improve my... more.',
    sampleAnswer: 'I definitely need to improve my listening comprehension.',
  },
  {
    id: 'r2_8',
    round: 2,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What equipment do you need for your workout?',
    promptTranslation: 'Que equipamento você precisa para o seu treino?',
    expectedStructure: 'I just need comfortable shoes and...',
    sampleAnswer: 'I just need running shoes and a bottle of water.',
  },
  {
    id: 'r2_9',
    round: 2,
    triggerCategory: 'eu preciso',
    promptQuestion: 'How many hours of sleep do you need to feel well?',
    promptTranslation: 'De quantas horas de sono você precisa para se sentir bem?',
    expectedStructure: 'I need at least [X] hours to feel rested.',
    sampleAnswer: 'I need at least 7 to 8 hours of good sleep.',
  },
  {
    id: 'r2_10',
    round: 2,
    triggerCategory: 'eu preciso',
    promptQuestion: 'What do you need to pack for a short weekend trip?',
    promptTranslation: 'O que você precisa colocar na mala para uma viagem curta?',
    expectedStructure: 'I only need a small backpack with...',
    sampleAnswer: 'I need two shirts, my phone charger, and a jacket.',
  },

  {
    id: 'r2_11',
    round: 2,
    triggerCategory: 'eu acho',
    promptQuestion: 'In your opinion, is public transport reliable in your city?',
    promptTranslation: 'Na sua opinião, o transporte público é confiável na sua cidade?',
    expectedStructure: 'In my opinion, it is / it is not...',
    sampleAnswer: 'In my opinion, the subway is fast, but buses are crowded.',
  },
  {
    id: 'r2_12',
    round: 2,
    triggerCategory: 'eu acho',
    promptQuestion: 'Do you think electric cars are the future of transport?',
    promptTranslation: 'Você acha que carros elétricos são o futuro do transporte?',
    expectedStructure: 'I think they definitely are because...',
    sampleAnswer: 'I think they are, but we need better charging networks.',
  },
  {
    id: 'r2_13',
    round: 2,
    triggerCategory: 'eu acho',
    promptQuestion: 'What do you think is better: cooking or ordering takeout?',
    promptTranslation: 'O que você acha melhor: cozinhar ou pedir comida?',
    expectedStructure: 'I think cooking is healthier, although...',
    sampleAnswer: 'I think home cooking is much healthier and cheaper.',
  },
  {
    id: 'r2_14',
    round: 2,
    triggerCategory: 'eu acho',
    promptQuestion: 'Do you think social media brings people closer or divides them?',
    promptTranslation: 'Você acha que as redes aproximam ou dividem as pessoas?',
    expectedStructure: 'I believe it depends, but mostly...',
    sampleAnswer: 'I believe they connect people, but also cause distractions.',
  },
  {
    id: 'r2_15',
    round: 2,
    triggerCategory: 'eu acho',
    promptQuestion: 'How do you feel about waking up early at 5 AM?',
    promptTranslation: 'O que você acha de acordar cedo às 5h da manhã?',
    expectedStructure: 'I think it is very hard, but...',
    sampleAnswer: 'I think it is painful at first, but gives you extra quiet time.',
  },

  // Situações de sobrevivência e ação instantânea
  {
    id: 'r2_16',
    round: 2,
    triggerCategory: 'eu sinto / vou',
    promptQuestion: 'Excuse me, how can I get to the nearest metro station?',
    promptTranslation: 'Com licença, como chego ao metrô mais próximo?',
    expectedStructure: 'You just need to walk straight and turn...',
    sampleAnswer: 'Walk straight two blocks and turn left at the corner.',
  },
  {
    id: 'r2_17',
    round: 2,
    triggerCategory: 'eu sinto / vou',
    promptQuestion: 'Can you help me carry this heavy box, please?',
    promptTranslation: 'Você pode me ajudar a carregar esta caixa pesada?',
    expectedStructure: 'Sure, let me help you with that!',
    sampleAnswer: 'Sure, I got it! Where do you want to put it?',
  },
  {
    id: 'r2_18',
    round: 2,
    triggerCategory: 'eu sinto / vou',
    promptQuestion: 'Why were you late for the meeting today?',
    promptTranslation: 'Por que você se atrasou para a reunião hoje?',
    expectedStructure: 'Sorry, I got stuck in traffic because...',
    sampleAnswer: 'Sorry! The highway was blocked because of an accident.',
  },
  {
    id: 'r2_19',
    round: 2,
    triggerCategory: 'eu sinto / vou',
    promptQuestion: 'Could you please repeat that more slowly?',
    promptTranslation: 'Você poderia repetir isso mais devagar?',
    expectedStructure: 'Of course! What I said was...',
    sampleAnswer: 'Of course! I was asking if you are ready to order.',
  },
  {
    id: 'r2_20',
    round: 2,
    triggerCategory: 'eu sinto / vou',
    promptQuestion: 'What are your plans for tomorrow morning?',
    promptTranslation: 'Quais são seus planos para amanhã de manhã?',
    expectedStructure: 'Tomorrow morning I am planning to...',
    sampleAnswer: 'Tomorrow morning I am hitting the gym and studying English.',
  },
];

export interface FifteenStructure {
  id: string;
  number: number;
  pattern: string;
  patternTranslation: string;
  nativeTrigger: string;
  variations: {
    slotTarget: string;
    replacement: string;
    fullSentence: string;
    translation: string;
  }[];
}

export const FIFTEEN_SUBSTITUTION_STRUCTURES: FifteenStructure[] = [
  {
    id: 'struct_1',
    number: 1,
    pattern: 'I would like to [action] because [reason].',
    patternTranslation: 'Eu gostaria de [ação] porque [motivo].',
    nativeTrigger: 'Expressar intenção e desejo educado',
    variations: [
      {
        slotTarget: 'book a table / celebrating an anniversary',
        replacement: 'reservar uma mesa / celebrando aniversário',
        fullSentence: 'I would like to book a table because we are celebrating an anniversary.',
        translation: 'Gostaria de reservar uma mesa porque estamos comemorando um aniversário.',
      },
      {
        slotTarget: 'improve my speaking / need it for work',
        replacement: 'melhorar minha fala / preciso para o trabalho',
        fullSentence: 'I would like to improve my speaking because I need it for my new job.',
        translation: 'Gostaria de melhorar minha fala porque preciso para meu novo trabalho.',
      },
      {
        slotTarget: 'leave a bit earlier / have a doctor appointment',
        replacement: 'sair um pouco mais cedo / tenho consulta médica',
        fullSentence: 'I would like to leave a bit earlier because I have a doctor appointment.',
        translation: 'Gostaria de sair um pouco mais cedo porque tenho médico.',
      },
    ],
  },
  {
    id: 'struct_2',
    number: 2,
    pattern: 'I need to make sure [clause].',
    patternTranslation: 'Eu preciso me certificar de que [fato].',
    nativeTrigger: 'Conferir checagens e responsabilidades',
    variations: [
      {
        slotTarget: 'the doors are locked',
        replacement: 'as portas estão trancadas',
        fullSentence: 'I need to make sure the doors are properly locked.',
        translation: 'Preciso ter certeza de que as portas estão bem trancadas.',
      },
      {
        slotTarget: 'I have my passport with me',
        replacement: 'estou com meu passaporte',
        fullSentence: 'I need to make sure I have my passport before leaving.',
        translation: 'Preciso ter certeza de que estou com meu passaporte antes de sair.',
      },
      {
        slotTarget: 'everyone received the email',
        replacement: 'todos receberam o e-mail',
        fullSentence: 'I need to make sure everyone received the updated email.',
        translation: 'Preciso garantir que todos receberam o e-mail atualizado.',
      },
    ],
  },
  {
    id: 'struct_3',
    number: 3,
    pattern: 'I think it is better to [action] rather than [alternative].',
    patternTranslation: 'Eu acho melhor [fazer X] do que [fazer Y].',
    nativeTrigger: 'Dar opinião e sugerir alternativas com diplomacia',
    variations: [
      {
        slotTarget: 'take a cab / wait for the bus',
        replacement: 'pegar um táxi / esperar pelo ônibus',
        fullSentence: 'I think it is better to take a cab rather than wait for the late bus.',
        translation: 'Acho melhor pegar um táxi do que esperar pelo ônibus atrasado.',
      },
      {
        slotTarget: 'ask for clarification / guess the answer',
        replacement: 'pedir esclarecimento / adivinhar a resposta',
        fullSentence: 'I think it is better to ask for clarification rather than guess.',
        translation: 'Acho melhor pedir esclarecimento do que ficar adivinhando.',
      },
      {
        slotTarget: 'prepare in advance / rush at the end',
        replacement: 'preparar com antecedência / correr no fim',
        fullSentence: 'I think it is better to prepare in advance rather than rush at the end.',
        translation: 'Acho melhor se preparar com antecedência do que correr no final.',
      },
    ],
  },
  {
    id: 'struct_4',
    number: 4,
    pattern: 'Could you please let me know when [event happens]?',
    patternTranslation: 'Você poderia por favor me avisar quando [evento ocorrer]?',
    nativeTrigger: 'Pedir informação e acompanhamento sem soar invasivo',
    variations: [
      {
        slotTarget: 'the flight is ready to board',
        replacement: 'o voo estiver pronto para embarque',
        fullSentence: 'Could you please let me know when the flight is ready to board?',
        translation: 'Você poderia me avisar quando o voo estiver pronto para embarque?',
      },
      {
        slotTarget: 'the doctor is available',
        replacement: 'o médico estiver disponível',
        fullSentence: 'Could you please let me know when the doctor is available to see me?',
        translation: 'Você poderia me avisar quando o médico estiver disponível para me atender?',
      },
      {
        slotTarget: 'you finish reviewing this draft',
        replacement: 'você terminar de revisar o rascunho',
        fullSentence: 'Could you please let me know when you finish reviewing this draft?',
        translation: 'Poderia me avisar quando terminar de revisar este rascunho?',
      },
    ],
  },
  {
    id: 'struct_5',
    number: 5,
    pattern: 'I am looking for [item/place], do you know where it is?',
    patternTranslation: 'Estou procurando por [item/lugar], você sabe onde fica?',
    nativeTrigger: 'Localização e compras imediatas',
    variations: [
      {
        slotTarget: 'the nearest pharmacy',
        replacement: 'a farmácia mais próxima',
        fullSentence: 'I am looking for the nearest pharmacy, do you know where it is?',
        translation: 'Estou procurando a farmácia mais próxima, sabe onde fica?',
      },
      {
        slotTarget: 'restrooms',
        replacement: 'os banheiros',
        fullSentence: 'I am looking for the restrooms, do you know where they are?',
        translation: 'Estou procurando os banheiros, sabe onde ficam?',
      },
      {
        slotTarget: 'gate number twenty-four',
        replacement: 'o portão número vinte e quatro',
        fullSentence: 'I am looking for gate number twenty-four, do you know where it is?',
        translation: 'Estou procurando o portão vinte e quatro, sabe onde fica?',
      },
    ],
  },
  {
    id: 'struct_6',
    number: 6,
    pattern: 'Have you ever had the chance to [experience]?',
    patternTranslation: 'Você já teve a chance de [vivenciar algo]?',
    nativeTrigger: 'Puxar assunto natural e conversação social',
    variations: [
      {
        slotTarget: 'visit New York during Christmas',
        replacement: 'visitar Nova York no Natal',
        fullSentence: 'Have you ever had the chance to visit New York during Christmas?',
        translation: 'Você já teve a chance de visitar Nova York no Natal?',
      },
      {
        slotTarget: 'work with an international team',
        replacement: 'trabalhar com equipe internacional',
        fullSentence: 'Have you ever had the chance to work with an international team?',
        translation: 'Você já teve a chance de trabalhar com uma equipe internacional?',
      },
      {
        slotTarget: 'taste authentic Japanese sushi',
        replacement: 'provar sushi japonês autêntico',
        fullSentence: 'Have you ever had the chance to taste authentic Japanese sushi?',
        translation: 'Você já teve a chance de provar sushi japonês autêntico?',
      },
    ],
  },
  {
    id: 'struct_7',
    number: 7,
    pattern: 'How long does it usually take to [action]?',
    patternTranslation: 'Quanto tempo costuma levar para [fazer algo]?',
    nativeTrigger: 'Planejamento de tempo e deslocamento',
    variations: [
      {
        slotTarget: 'get to the airport by subway',
        replacement: 'chegar ao aeroporto de metrô',
        fullSentence: 'How long does it usually take to get to the airport by subway?',
        translation: 'Quanto tempo costuma levar para chegar ao aeroporto de metrô?',
      },
      {
        slotTarget: 'receive a visa approval',
        replacement: 'receber a aprovação do visto',
        fullSentence: 'How long does it usually take to receive a visa approval?',
        translation: 'Quanto tempo costuma levar para receber a aprovação do visto?',
      },
      {
        slotTarget: 'recover from jet lag',
        replacement: 'se recuperar do fuso horário (jet lag)',
        fullSentence: 'How long does it usually take to recover from jet lag?',
        translation: 'Quanto tempo costuma levar para se recuperar do fuso horário?',
      },
    ],
  },
  {
    id: 'struct_8',
    number: 8,
    pattern: 'It seems to me that [observation].',
    patternTranslation: 'Me parece que / Pelo que vejo, [observação].',
    nativeTrigger: 'Expressar nuance sem soar dogmático',
    variations: [
      {
        slotTarget: 'they are running out of time',
        replacement: 'eles estão ficando sem tempo',
        fullSentence: 'It seems to me that they are running out of time for this launch.',
        translation: 'Me parece que eles estão ficando sem tempo para este lançamento.',
      },
      {
        slotTarget: 'this solution is much simpler',
        replacement: 'esta solução é muito mais simples',
        fullSentence: 'It seems to me that this solution is much simpler and cheaper.',
        translation: 'Me parece que esta solução é bem mais simples e barata.',
      },
      {
        slotTarget: 'the weather is about to change',
        replacement: 'o tempo está prestes a mudar',
        fullSentence: 'It seems to me that the weather is about to turn cold.',
        translation: 'Me parece que o tempo está prestes a esfriar.',
      },
    ],
  },
  {
    id: 'struct_9',
    number: 9,
    pattern: 'Would you mind if I [did something]?',
    patternTranslation: 'Você se importaria se eu [fizesse algo]?',
    nativeTrigger: 'Pedir permissão com máxima elegância nativa',
    variations: [
      {
        slotTarget: 'opened the window for fresh air',
        replacement: 'abrisse a janela para entrar ar fresco',
        fullSentence: 'Would you mind if I opened the window for some fresh air?',
        translation: 'Você se importaria se eu abrisse a janela para entrar um ar fresco?',
      },
      {
        slotTarget: 'took a quick five-minute break',
        replacement: 'fizesse uma pausa rápida de 5 minutos',
        fullSentence: 'Would you mind if I took a quick five-minute break?',
        translation: 'Você se importaria se eu fizesse uma pausa rápida de 5 minutos?',
      },
      {
        slotTarget: 'recorded our practice session',
        replacement: 'gravasse nossa sessão de prática',
        fullSentence: 'Would you mind if I recorded our practice session for review?',
        translation: 'Você se importaria se eu gravasse nossa prática para revisar depois?',
      },
    ],
  },
  {
    id: 'struct_10',
    number: 10,
    pattern: 'As far as I know, [statement].',
    patternTranslation: 'Até onde eu sei / Pelo que sei, [afirmação].',
    nativeTrigger: 'Inserir ponderação natural ao dar respostas',
    variations: [
      {
        slotTarget: 'the store is open until nine PM',
        replacement: 'a loja fica aberta até às 21h',
        fullSentence: 'As far as I know, the store stays open until nine PM.',
        translation: 'Até onde eu sei, a loja fica aberta até às 21h.',
      },
      {
        slotTarget: 'the deadline has not changed',
        replacement: 'o prazo não mudou',
        fullSentence: 'As far as I know, the deadline has not changed yet.',
        translation: 'Até onde eu sei, o prazo final não mudou ainda.',
      },
      {
        slotTarget: 'there are no additional fees',
        replacement: 'não há taxas adicionais',
        fullSentence: 'As far as I know, there are no additional hidden fees.',
        translation: 'Até onde eu sei, não há nenhuma taxa extra escondida.',
      },
    ],
  },
  {
    id: 'struct_11',
    number: 11,
    pattern: 'I am not sure if [condition], but [compromise].',
    patternTranslation: 'Não tenho certeza se [condição], mas [solução parcial].',
    nativeTrigger: 'Responder quando você não sabe 100% da resposta',
    variations: [
      {
        slotTarget: 'they are still serving breakfast / I can check with the waiter',
        replacement: 'ainda estão servindo café / posso checar com o garçom',
        fullSentence: "I am not sure if they are still serving breakfast, but I can check with the waiter.",
        translation: 'Não tenho certeza se ainda servem café, mas posso checar com o garçom.',
      },
      {
        slotTarget: 'the bus goes all the way / I can look at the map',
        replacement: 'o ônibus vai até o final / posso olhar o mapa',
        fullSentence: "I am not sure if the bus goes all the way, but I can check the transit map.",
        translation: 'Não tenho certeza se o ônibus vai até lá, mas posso conferir no mapa.',
      },
      {
        slotTarget: 'he is in the office today / I will text him right away',
        replacement: 'ele está no escritório hoje / vou mandar mensagem logo',
        fullSentence: "I am not sure if he is in the office today, but I will send him a text right now.",
        translation: 'Não tenho certeza se ele está no escritório hoje, mas vou mandar mensagem já.',
      },
    ],
  },
  {
    id: 'struct_12',
    number: 12,
    pattern: 'What I mean is that [clarification].',
    patternTranslation: 'O que quero dizer é que [esclarecimento].',
    nativeTrigger: 'Corrigir e reformular seu próprio raciocínio em tempo real',
    variations: [
      {
        slotTarget: 'we should focus on high-frequency vocabulary first',
        replacement: 'devemos focar em vocabulário de alta frequência primeiro',
        fullSentence: 'What I mean is that we should focus on high-frequency words first.',
        translation: 'O que quero dizer é que devemos focar nas palavras de alta frequência primeiro.',
      },
      {
        slotTarget: 'we do not have to finish everything today',
        replacement: 'não precisamos terminar tudo hoje',
        fullSentence: 'What I mean is that we do not have to rush and finish everything today.',
        translation: 'O que quero dizer é que não precisamos ter pressa e terminar tudo hoje.',
      },
      {
        slotTarget: 'the problem is not the price, it is the delivery time',
        replacement: 'o problema não é o preço, é o prazo de entrega',
        fullSentence: 'What I mean is that the issue is not the price, but the delivery timeline.',
        translation: 'O que quero dizer é que a questão não é o preço, mas o prazo de entrega.',
      },
    ],
  },
  {
    id: 'struct_13',
    number: 13,
    pattern: 'I used to [past habit], but now I [present habit].',
    patternTranslation: 'Eu costumava [hábito passado], mas agora eu [hábito presente].',
    nativeTrigger: 'Contar histórias e contrastar presente e passado',
    variations: [
      {
        slotTarget: 'translate every word in my head / think in English chunks',
        replacement: 'traduzir cada palavra na cabeça / penso em blocos de inglês',
        fullSentence: 'I used to translate every word in my head, but now I think in English chunks.',
        translation: 'Eu costumava traduzir tudo na cabeça, mas agora penso em blocos de inglês.',
      },
      {
        slotTarget: 'drink soda every day / drink only sparkling water',
        replacement: 'beber refrigerante todo dia / bebo só água com gás',
        fullSentence: 'I used to drink soda every day, but now I stick to sparkling water.',
        translation: 'Eu costumava beber refrigerante todo dia, mas agora fico só na água com gás.',
      },
      {
        slotTarget: 'wake up late / wake up at six AM to study',
        replacement: 'acordar tarde / acordo às 6h para estudar',
        fullSentence: 'I used to wake up late, but now I wake up at six to get things done.',
        translation: 'Eu costumava acordar tarde, mas agora acordo às 6h para adiantar as coisas.',
      },
    ],
  },
  {
    id: 'struct_14',
    number: 14,
    pattern: 'How about we [suggestion] instead?',
    patternTranslation: 'Que tal nós [sugestão] em vez disso?',
    nativeTrigger: 'Fazer propostas dinâmicas em grupo ou com amigos',
    variations: [
      {
        slotTarget: 'grab a quick bite across the street',
        replacement: 'fazer um lanche rápido do outro lado da rua',
        fullSentence: 'How about we grab a quick bite across the street instead?',
        translation: 'Que tal fazermos um lanche rápido do outro lado da rua em vez disso?',
      },
      {
        slotTarget: 'reschedule our meeting for tomorrow morning',
        replacement: 'remarcar nossa reunião para amanhã de manhã',
        fullSentence: 'How about we reschedule our meeting for tomorrow morning instead?',
        translation: 'Que tal remarcarmos nossa reunião para amanhã de manhã em vez disso?',
      },
      {
        slotTarget: 'take a short walk to clear our heads',
        replacement: 'dar uma caminhada rápida para arejar a cabeça',
        fullSentence: 'How about we take a short walk to clear our heads instead?',
        translation: 'Que tal darmos uma caminhada curta para arejar a cabeça em vez disso?',
      },
    ],
  },
  {
    id: 'struct_15',
    number: 15,
    pattern: 'There is no point in [wasting effort] when [reality].',
    patternTranslation: 'Não faz sentido / Não vale a pena [esforço inútil] quando [realidade].',
    nativeTrigger: 'Expressar sabedoria prática e tomada de decisão racional',
    variations: [
      {
        slotTarget: 'memorizing grammar tables / you can learn through real conversation',
        replacement: 'decorar tabelas gramaticais / você pode aprender com conversação real',
        fullSentence: 'There is no point in memorizing grammar tables when you can learn through real dialogue.',
        translation: 'Não faz sentido decorar tabelas gramaticais quando você pode aprender com diálogos reais.',
      },
      {
        slotTarget: 'worrying about mistakes / native speakers understand you anyway',
        replacement: 'se preocupar com erros / nativos entendem você mesmo assim',
        fullSentence: 'There is no point in worrying about minor mistakes when native speakers understand you.',
        translation: 'Não vale a pena se preocupar com pequenos erros quando os nativos entendem você perfeitamente.',
      },
      {
        slotTarget: 'waiting in this long line / we can order online',
        replacement: 'esperar nesta fila imensa / podemos pedir online',
        fullSentence: 'There is no point in waiting in this long line when we can order online in seconds.',
        translation: 'Não faz sentido esperar nessa fila enorme quando podemos pedir online em segundos.',
      },
    ],
  },
];

export interface UnexpectedTestQuestion {
  id: string;
  number: number;
  question: string;
  questionTranslation: string;
  surpriseContext: string;
  idealResponseStructure: string;
  sampleNaturalAnswer: string;
  evaluationCriteria: {
    speedScoreSec: number; // < 5s
    clarityTip: string;
    essentialGrammar: string;
    vocabularyVariety: string;
  };
}

export const UNEXPECTED_QUESTIONS_TEST: UnexpectedTestQuestion[] = [
  {
    id: 'uq_1',
    number: 1,
    question: 'If you suddenly found 1,000 dollars on the street right now, what would you do?',
    questionTranslation: 'Se você encontrasse 1.000 dólares na rua agora, o que faria?',
    surpriseContext: 'Hipotético imediato e moral rápida',
    idealResponseStructure: 'If I found that money, I would probably...',
    sampleNaturalAnswer: 'If I found that money, I would look around for the owner, and if nobody claimed it, I would save it for my next trip.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Conecte "found that" como "foun-that", sem soltar o som de /d/ bruscamente.',
      essentialGrammar: 'Segundo condicional: "If I found... I would..." sem misturar tempos.',
      vocabularyVariety: 'Uso de verbos de ação como claim, save, deposit, hand over.',
    },
  },
  {
    id: 'uq_2',
    number: 2,
    question: 'Why are you wearing those shoes today?',
    questionTranslation: 'Por que você está usando esses sapatos hoje?',
    surpriseContext: 'Pergunta inesperada e hiper-específica do momento presente',
    idealResponseStructure: 'I am wearing them because they are very comfortable and...',
    sampleNaturalAnswer: 'I picked these sneakers today because they are super comfortable and I have to walk a lot around the city.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Pronuncie "shoes" com som de /z/ sonoro no final, não som de /s/.',
      essentialGrammar: 'Present Continuous (I am wearing / I chose) para justificar a escolha.',
      vocabularyVariety: 'Termos descritivos: comfortable, casual, stylish, waterproof, sneakers.',
    },
  },
  {
    id: 'uq_3',
    number: 3,
    question: 'Quick! Tell me three things that are currently inside your refrigerator.',
    questionTranslation: 'Rápido! Me diga três coisas que estão na sua geladeira agora.',
    surpriseContext: 'Velocidade de evocação lexical sem tradução',
    idealResponseStructure: 'Right now, there is... and some...',
    sampleNaturalAnswer: 'Inside my fridge right now there is cold milk, some cheddar cheese, and a bottle of white wine.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Entonação suspensa nas duas primeiras palavras e descendente na última.',
      essentialGrammar: 'Uso correto de "there is" / "there are" com substantivos contáveis e incontáveis.',
      vocabularyVariety: 'Substantivos de alimentos sem hesitação ou som de "éeehh".',
    },
  },
  {
    id: 'uq_4',
    number: 4,
    question: 'Excuse me, you just spilled coffee on my laptop! What do you have to say?',
    questionTranslation: 'Com licença, você acabou de derramar café no meu laptop! O que você tem a dizer?',
    surpriseContext: 'Situação de constrangimento e pedido de desculpas urgente',
    idealResponseStructure: 'Oh my goodness, I am so sorry! Let me grab some napkins right now...',
    sampleNaturalAnswer: 'Oh, I am terribly sorry! It was an accident! Let me help you dry it right now with these napkins.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Entonação enfática de surpresa e remorso sincero.',
      essentialGrammar: 'Imperativo cooperativo imediato: "Let me help...", "I will pay for..."',
      vocabularyVariety: 'Termos de reparação: terribly sorry, accident, dry it off, replace it.',
    },
  },
  {
    id: 'uq_5',
    number: 5,
    question: 'What is the most boring thing you had to do this past week?',
    questionTranslation: 'Qual foi a coisa mais entediante que você teve que fazer na última semana?',
    surpriseContext: 'Evocação do passado com julgamento de valor',
    idealResponseStructure: 'The most boring thing was definitely having to...',
    sampleNaturalAnswer: 'The most boring task was organizing a massive Excel spreadsheet for work with hundreds of rows.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Pronuncie "boring" sem colocar "i" no /ŋ/ final.',
      essentialGrammar: 'Passado simples e gerúndio sujeito: "The most boring thing was filing / cleaning..."',
      vocabularyVariety: 'Uso de sinônimos de tédio: tedious, repetitive, exhausting, dull.',
    },
  },
  {
    id: 'uq_6',
    number: 6,
    question: 'If you had to survive on a deserted island with just one person, who would it be?',
    questionTranslation: 'Se você tivesse que sobreviver numa ilha deserta com apenas uma pessoa, quem seria?',
    surpriseContext: 'Dilema hipotético pessoal e justificativa rápida',
    idealResponseStructure: 'I would definitely pick my [person] because he/she is...',
    sampleNaturalAnswer: 'I would choose my best friend because he is calm under pressure and knows how to cook anything.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Não fale "es-island" com som de S mudo; island soa /ˈaɪ.lənd/.',
      essentialGrammar: 'Uso fluido de "would choose / would pick" com oração causal "because".',
      vocabularyVariety: 'Qualidades pessoais: practical, resourceful, calm under pressure.',
    },
  },
  {
    id: 'uq_7',
    number: 7,
    question: 'What will you do if your internet goes down for the rest of today?',
    questionTranslation: 'O que você vai fazer se sua internet cair pelo resto do dia hoje?',
    surpriseContext: 'Plano B para imprevistos modernos',
    idealResponseStructure: 'If my internet goes down, I will simply...',
    sampleNaturalAnswer: 'If the connection drops, I will take advantage of the quiet time to read a physical book and go for a run.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Flap T em "internet" (/ˈɪn.t̬ɚ.net/) ou elisão do t: "innernet".',
      essentialGrammar: 'Primeiro condicional: "If it goes down (presente), I will (futuro)".',
      vocabularyVariety: 'Expressões idiomáticas: take advantage of, unplug, go offline, unwind.',
    },
  },
  {
    id: 'uq_8',
    number: 8,
    question: 'Can you describe your morning in exactly three adjectives?',
    questionTranslation: 'Você consegue descrever sua manhã em exatamente três adjetivos?',
    surpriseContext: 'Restrição léxica estrita sob pressão de tempo',
    idealResponseStructure: 'My morning was [adj 1], [adj 2], and definitely [adj 3].',
    sampleNaturalAnswer: 'My morning was hectic, productive, and surprisingly sunny.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Ritmo ternário limpo com pausas curtas entre os adjetivos.',
      essentialGrammar: 'Concordância adjetival sem artigos desnecessários.',
      vocabularyVariety: 'Evitar o genérico "good/bad" e usar "hectic", "chilly", "refreshing", "sluggish".',
    },
  },
  {
    id: 'uq_9',
    number: 9,
    question: 'What would you say to your boss if you realized you completely forgot an urgent deadline?',
    questionTranslation: 'O que você diria ao seu chefe se percebesse que esqueceu totalmente um prazo urgente?',
    surpriseContext: 'Comunicação corporativa de crise e transparência',
    idealResponseStructure: 'I would be honest, apologize, and say that I am fixing it right now...',
    sampleNaturalAnswer: 'I would walk into their office and say: "I take full responsibility for missing this deadline, and I am finalizing it right now to deliver by noon."',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Tom profissional, firme e sem hesitações trêmulas.',
      essentialGrammar: 'Discurso direto ou reportado com modais de responsabilidade.',
      vocabularyVariety: 'Jargão corporativo natural: take full responsibility, prioritize, deliver by.',
    },
  },
  {
    id: 'uq_10',
    number: 10,
    question: 'Why should someone hire you or partner with you in five words or fewer?',
    questionTranslation: 'Por que alguém deveria contratar você ou ser seu parceiro em cinco palavras ou menos?',
    surpriseContext: 'Elevator pitch ultra-condensado de 5 palavras',
    idealResponseStructure: 'Five words: [Word 1], [Word 2], [Word 3], [Word 4], [Word 5].',
    sampleNaturalAnswer: 'Consistent, disciplined, creative, and trustworthy.',
    evaluationCriteria: {
      speedScoreSec: 5,
      clarityTip: 'Articulação clara e convicta de cada termo.',
      essentialGrammar: 'Uso de substantivos ou adjetivos de alto impacto sem enrolação.',
      vocabularyVariety: 'Adjetivos de alto valor: reliable, results-driven, adaptable, disciplined.',
    },
  },
];

// ==========================================
// 2. ESPECIALISTA EM FONÉTICA PRÁTICA (10 ERROS + ROTINA 10 MIN + ENTONAÇÃO + TESTE 15 FRASES)
// ==========================================

export interface DetailedPhoneticError {
  id: string;
  number: number;
  name: string;
  targetSoundIpa: string;
  brazilianTendency: string;
  nativeCorrection: string;
  mouthAnatomyGuide: string;
  wrongExample: string;
  correctExample: string;
  practiceWords: string[];
}

export const TEN_PHONETIC_ERRORS_PORTUGUESE_ENGLISH: DetailedPhoneticError[] = [
  {
    id: 'pe_1',
    number: 1,
    name: 'O "i" de apoio no final das consoantes mudas (/t/, /d/, /k/, /p/)',
    targetSoundIpa: 'Consoantes oclusivas finais secas [t̚, d̚, k̚, p̚]',
    brazilianTendency: 'Adicionar uma vogal /i/ inexistente no final (ex: "Like-i", "Facebook-i", "Bad-i", "Hot-i").',
    nativeCorrection: 'Corte o ar bruscamente fechando os lábios ou a língua sem soltar som de vogal.',
    mouthAnatomyGuide: 'Para /t/ ou /d/, encoste a ponta da língua nos alvéolos superiores e segure o ar. Não abra a boca para emitir voz.',
    wrongExample: '"I like-ee this book-ee"',
    correctExample: '"I like [laɪk] this book [bʊk]" (final seco e abrupto)',
    practiceWords: ['Stop', 'Night', 'Work', 'Good', 'Job'],
  },
  {
    id: 'pe_2',
    number: 2,
    name: 'Confusão entre Vogal Longa e Curta (/iː/ vs /ɪ/)',
    targetSoundIpa: 'Sheep [ʃiːp] vs Ship [ʃɪp] | Beach [biːtʃ] vs Bitch [bɪtʃ]',
    brazilianTendency: 'Pronunciar ambas com o "i" longo e tenso do português, provocando constrangimento social grave.',
    nativeCorrection: 'No /ɪ/ curto, relaxe a boca como se fosse emitir um som entre "i" e "ê". É frouxo e rápido.',
    mouthAnatomyGuide: 'Para /iː/ (tenso): faça um sorriso esticado com a língua alta. Para /ɪ/ (relaxado): solte o maxilar cerca de 1cm, língua neutra.',
    wrongExample: '"I want to go to the bitch" (trocando Beach por Bitch)',
    correctExample: '"I want to go to the beach" [biːtʃ] (sorriso prolongado)',
    practiceWords: ['Sit / Seat', 'Hit / Heat', 'Live / Leave', 'Fit / Feet', 'Ship / Sheep'],
  },
  {
    id: 'pe_3',
    number: 3,
    name: 'O "TH" Interdental Surdo /θ/ e Sonoro /ð/',
    targetSoundIpa: 'Think [θɪŋk] vs That [ðæt]',
    brazilianTendency: 'Substituir por F, S, T ou D (ex: "fink" em vez de "think", ou "dat" em vez de "that").',
    nativeCorrection: 'Coloque a ponta da língua levemente entre os dentes incisivos frontais e sopre o ar.',
    mouthAnatomyGuide: 'A língua deve ficar visível no espelho tocando os dentes de cima. No /θ/ sai só ar; no /ð/ as cordas vocais vibram.',
    wrongExample: '"I fink dat is good" (com F e D)',
    correctExample: '"I think [θɪŋk] that [ðæt] is good"',
    practiceWords: ['Think', 'Thank', 'Through', 'This', 'Breathe'],
  },
  {
    id: 'pe_4',
    number: 4,
    name: 'O "R" Retroflexo Americano vs "R" Aspirado Brasileiro (/ɹ/ vs /h/)',
    targetSoundIpa: 'Red [ɹɛd] vs Head [hɛd]',
    brazilianTendency: 'Pronunciar o "R" inicial em inglês com o som da garganta do português de "rua", soando como o "H" inglês.',
    nativeCorrection: 'O "R" do inglês americano dobra a ponta da língua para trás em direção ao céu da boca sem encostar em nada.',
    mouthAnatomyGuide: 'Curve as bordas da língua contra os molares superiores e a ponta virada para trás. Os lábios se projetam um pouco para a frente.',
    wrongExample: '"Red" soando como "Head" (cabeça)',
    correctExample: '"Red" [ɹɛd] (língua curva) vs "Head" [hɛd] (sopro na garganta)',
    practiceWords: ['Right', 'Road', 'Really', 'Run', 'Friend'],
  },
  {
    id: 'pe_5',
    number: 5,
    name: 'O "Dark L" (L Velarizado Final) vs som de "U" (/ɫ/ vs /w/)',
    targetSoundIpa: 'Milk [mɪɫk], Feel [fiːɫ], People [ˈpiːpɫ]',
    brazilianTendency: 'Transformar todo "L" no fim de sílaba em "U" (ex: "Miu-ke", "Fiu", "Pípou").',
    nativeCorrection: 'O fundo da língua se eleva em direção ao palato mole enquanto a ponta encosta atrás dos dentes da frente.',
    mouthAnatomyGuide: 'Mantenha a ponta da língua colada no céu da boca enquanto emite o som, bloqueando o fechamento labial de "U".',
    wrongExample: '"Brasil" falado como "Brasiu"',
    correctExample: '"Brazil" com o L tocando o palato no final',
    practiceWords: ['Milk', 'Feel', 'Call', 'Help', 'People'],
  },
  {
    id: 'pe_6',
    number: 6,
    name: 'Pronúncia do "-ED" dos Verbos Regulares no Passado (/t/, /d/, /ɪd/)',
    targetSoundIpa: 'Worked [wɜːrkt] (som de T) vs Wanted [ˈwɑːntɪd] (som de ID)',
    brazilianTendency: 'Ler a letra "E" em todos os verbos e adicionar "ed-i" (ex: "Uór-quê-di", "Iú-zê-di").',
    nativeCorrection: 'Em 85% dos verbos, a letra "e" é muda e você pronuncia apenas o som de /t/ ou /d/ grudado.',
    mouthAnatomyGuide: 'Apenas após sons de T ou D (ex: wanted, needed) você adiciona a sílaba extra /ɪd/. Nos demais, a vogal desaparece.',
    wrongExample: '"I work-ed yesterday" (duas sílabas com E pronunciado)',
    correctExample: '"I worked" [wɜːrkt] (uma única sílaba terminando em T)',
    practiceWords: ['Stopped', 'Looked', 'Played', 'Loved', 'Decided'],
  },
  {
    id: 'pe_7',
    number: 7,
    name: 'O "E" Fantasma no Encontro Consonantal com "S" inicial',
    targetSoundIpa: 'Speak [spiːk], School [skuːl], Student [ˈstuːdənt]',
    brazilianTendency: 'Adicionar um "E" de apoio no início da palavra (ex: "Es-peak", "Es-chool", "Es-tudent").',
    nativeCorrection: 'Comece diretamente com o som de chiado de cobra "Sssss", sem emitir nenhuma vogal antes.',
    mouthAnatomyGuide: 'Dentes fechados, solte ar pelo centro da língua em "ssss" e só então posicione os lábios para a consoante seguinte.',
    wrongExample: '"I go to the eschool" (com E antes)',
    correctExample: '"I go to school" [skuːl] (início imediato no s)',
    practiceWords: ['Start', 'Speak', 'Special', 'Street', 'Smile'],
  },
  {
    id: 'pe_8',
    number: 8,
    name: 'A Vogal Aberta /æ/ de "Cat", "Bad", "Apple"',
    targetSoundIpa: 'Cat [kæt], Bad [bæd], Man [mæn]',
    brazilianTendency: 'Substituir pela vogal fechada /ɛ/ de "pêlo" ou pelo /a/ recuado do português.',
    nativeCorrection: 'Abra a mandíbula para baixo enquanto estica os cantos da boca para os lados, como um híbrido entre A e E.',
    mouthAnatomyGuide: 'A língua fica baixa e empurrada para a frente contra os dentes inferiores, e a boca bem aberta verticalmente.',
    wrongExample: '"Bed" (cama) pronunciado no lugar de "Bad" (ruim)',
    correctExample: '"Bad" [bæd] com abertura mandibular ampla',
    practiceWords: ['Apple', 'Black', 'Cat', 'Fact', 'Family'],
  },
  {
    id: 'pe_9',
    number: 9,
    name: 'Confusão entre /v/ e /w/ ou /b/',
    targetSoundIpa: 'Very [ˈvɛɹi] vs Water [ˈwɑːt̬ɚ]',
    brazilianTendency: 'Inverter a articulação labiodental de /v/ com o arredondamento de lábios de /w/.',
    nativeCorrection: 'No /v/, os dentes superiores mordem o lábio inferior. No /w/, os lábios fazem um bico sem nenhum toque de dentes.',
    mouthAnatomyGuide: 'Dentes incisivos superiores encostando no lábio de baixo para /v/. Bico fechado de assobio para /w/.',
    wrongExample: '"Wery good" ou "Bery good"',
    correctExample: '"Very good" [ˈvɛɹi ɡʊd]',
    practiceWords: ['Voice', 'Water', 'Every', 'Week', 'World'],
  },
  {
    id: 'pe_10',
    number: 10,
    name: 'Ritmo Silábico vs Ritmo Acentual & O Schwa (/ə/)',
    targetSoundIpa: 'Banana [bəˈnæn.ə], Problem [ˈprɑː.bləm]',
    brazilianTendency: 'Falar todas as sílabas com a mesma duração e nitidez (ritmo metronômico do português).',
    nativeCorrection: 'O inglês é "stress-timed": sílabas tônicas são longas e claras; sílabas átonas são reduzidas para o som neutro Schwa /ə/.',
    mouthAnatomyGuide: 'Relaxe completamente a mandíbula e língua para o /ə/. É o som mais preguiçoso e curto do idioma.',
    wrongExample: '"In-for-ma-tion" com todas as quatro sílabas perfeitamente articuladas',
    correctExample: '"In-fer-mei-shən" reduzindo as sílabas átonas',
    practiceWords: ['About', 'Computer', 'Today', 'Present', 'Together'],
  },
];

export interface DailyPhoneticRoutineStep {
  minutes: string;
  focusTitle: string;
  drillType: string;
  instructions: string;
  practiceLines: { phrase: string; phoneticTarget: string }[];
}

export const TOP_3_DAILY_ROUTINE_10MIN: DailyPhoneticRoutineStep[] = [
  {
    minutes: '0:00 - 3:00',
    focusTitle: 'Passo 1: Pares Mínimos (/iː/ longo vs /ɪ/ curto)',
    drillType: 'Discriminação e Repetição Ativa',
    instructions: 'Alterne as palavras focando no contraste físico da boca: sorriso tenso no /iː/ e maxilar relaxado no /ɪ/.',
    practiceLines: [
      { phrase: 'Please take a seat [siːt] in the chair.', phoneticTarget: '/iː/ longo e tenso' },
      { phrase: 'Sit [sɪt] down right here.', phoneticTarget: '/ɪ/ curto e relaxado' },
      { phrase: 'We saw a giant sheep [ʃiːp] on the hill.', phoneticTarget: '/iː/ longo' },
      { phrase: 'The ship [ʃɪp] arrived at the port.', phoneticTarget: '/ɪ/ curto' },
      { phrase: 'Do you live [lɪv] here or are you going to leave [liːv]?', phoneticTarget: 'Contraste em uma frase só' },
    ],
  },
  {
    minutes: '3:00 - 6:00',
    focusTitle: 'Passo 2: Corte Seco de Consoantes Finais (Fim do "i" de apoio)',
    drillType: 'Repetição Progressiva com Pausa Abrupta',
    instructions: 'Congele a ponta da língua ou os lábios imediatamente no fim da palavra sem emitir nenhum som de vogal extra.',
    practiceLines: [
      { phrase: 'Stop! [stɑːp̚] Check your email account [əˈkaʊnt̚].', phoneticTarget: 'Corte seco em P e T' },
      { phrase: 'Good [ɡʊd̚] job [dʒɑːb̚] on that project [ˈprɑː.dʒɛkt̚].', phoneticTarget: 'D, B e T mudos' },
      { phrase: 'I like [laɪk̚] reading that book [bʊk̚] at night [naɪt̚].', phoneticTarget: 'K e T sem eco de "i"' },
      { phrase: 'He made [meɪd̚] a great [ɡreɪt̚] point [pɔɪnt̚].', phoneticTarget: 'Trava laríngea suave' },
    ],
  },
  {
    minutes: '6:00 - 8:00',
    focusTitle: 'Passo 3: O Som do "TH" Interdental (/θ/ e /ð/)',
    drillType: 'Shadowing com Foco na Língua entre os Dentes',
    instructions: 'Olhe no espelho ou na câmera do celular e veja a ponta da língua encostando nos dentes da frente ao soprar.',
    practiceLines: [
      { phrase: 'I think [θɪŋk] that [ðæt] this [ðɪs] is the truth [truːθ].', phoneticTarget: 'Alternância entre surdo e sonoro' },
      { phrase: 'Thank [θæŋk] you for your thoughtful [ˈθɔːt.fəl] advice.', phoneticTarget: '/θ/ suave com fluxo de ar' },
      { phrase: 'Breathe [briːð] in through [θruː] your nose.', phoneticTarget: '/ð/ sonoro no verbo' },
    ],
  },
  {
    minutes: '8:00 - 10:00',
    focusTitle: 'Passo 4: Gravação Comparativa com Áudio Nativo',
    drillType: 'Auto-avaliação Acústica',
    instructions: 'Grave a frase mestre no gravador do app, ouça seu áudio e compare imediatamente com o sintetizador nativo.',
    practiceLines: [
      { phrase: 'I definitely think that traveling and meeting people makes a big difference in life.', phoneticTarget: 'Fluência combinada' },
    ],
  },
];

export interface IntonationPattern {
  name: string;
  rule: string;
  exampleSentence: string;
  pitchMovement: string;
  whyItMatters: string;
}

export const INTONATION_PATTERNS: IntonationPattern[] = [
  {
    name: '1. Perguntas de Sim ou Não (Yes/No Questions)',
    rule: 'A melodia da voz SOBE no final da frase.',
    exampleSentence: 'Are you ready to leave now? ↗',
    pitchMovement: 'Ascendente no final',
    whyItMatters: 'Se você descer o tom, soa como uma ordem seca ou afirmação desinteressada.',
  },
  {
    name: '2. Perguntas com Pronomes Interrogativos (Wh- Questions)',
    rule: 'A melodia da voz DESCE no final da frase.',
    exampleSentence: 'Where are you going for dinner tonight? ↘',
    pitchMovement: 'Descendente no final',
    whyItMatters: 'Subir o tom em perguntas "Wh-" faz você soar inseguro ou confuso com a própria pergunta.',
  },
  {
    name: '3. Listas e Elementos em Série (Non-Final Intonation)',
    rule: 'A melodia sobe em cada item da lista e só desce no último item para fechar o pensamento.',
    exampleSentence: 'I bought apples ↗, oranges ↗, bananas ↗, and fresh coffee. ↘',
    pitchMovement: 'Subida contínua com queda conclusiva',
    whyItMatters: 'Sinaliza ao ouvinte que você ainda não terminou de falar, evitando interrupções indesejadas.',
  },
  {
    name: '4. Ênfase Contrastiva (Sentence Stress & Contrast)',
    rule: 'A palavra que traz a informação nova ou contraste recebe tom mais alto, longo e nítido.',
    exampleSentence: 'I wanted the RED car, not the blue one.',
    pitchMovement: 'Pico de frequência na palavra em contraste',
    whyItMatters: 'Em inglês, a ênfase tonal muda o significado inteiro da frase sem precisar mudar a ordem das palavras.',
  },
];

export const WEEKLY_PRONUNCIATION_TEST_15 = [
  { id: 'wpt_1', sentence: 'I think that this little ship is going to leave very soon.', target: 'Contraste TH, Ship vs Leave e som de V' },
  { id: 'wpt_2', sentence: 'He stopped at the bank and asked for help with his account.', target: 'Verbos no passado (-ed como T), corte seco em K e P' },
  { id: 'wpt_3', sentence: 'Could you please sit in that seat next to the window?', target: 'Pares mínimos Sit [ɪ] vs Seat [iː]' },
  { id: 'wpt_4', sentence: 'Water and milk are essential for healthy people.', target: 'Dark L em milk e people, e pronúncia de W' },
  { id: 'wpt_5', sentence: 'She worked hard all night to finish the design.', target: 'Corte de consoante muda em Night, som de -ed em Worked' },
  { id: 'wpt_6', sentence: 'Speak slowly so the students can understand every word.', target: 'Início limpo em S (Speak/Student), sem "e" inicial' },
  { id: 'wpt_7', sentence: 'The black cat sat on the comfortable red bed.', target: 'Vogal aberta /æ/ em Cat/Sat vs vogal /ɛ/ em Bed' },
  { id: 'wpt_8', sentence: 'I really believe that practice makes a big difference.', target: 'R retroflexo em Really/Practice e V em Believe' },
  { id: 'wpt_9', sentence: 'Take a deep breath through your nose and relax your jaw.', target: 'TH surdo em Breath e Through' },
  { id: 'wpt_10', sentence: 'What time does the flight arrive tomorrow morning? ↘', target: 'Entonação descendente de Wh-question' },
  { id: 'wpt_11', sentence: 'Are you sure you locked the front door before leaving? ↗', target: 'Entonação ascendente de Yes/No question' },
  { id: 'wpt_12', sentence: 'He wanted to talk, but decided to wait instead.', target: 'Pronúncia correta de -ed em Wanted e Decided (/ɪd/)' },
  { id: 'wpt_13', sentence: 'I usually have coffee, toast, and fruit for breakfast.', target: 'Entonação de lista (sobe nos itens, desce no final)' },
  { id: 'wpt_14', sentence: 'There is a huge difference between living and just existing.', target: 'Contraste vocálico e ritmo acentual' },
  { id: 'wpt_15', sentence: 'That makes a lot of sense, I couldn’t agree more.', target: 'Ligação nativa de palavras (Flap T em "lot of")' },
];

// ==========================================
// 3. PENSAMENTO DIRETO NO IDIOMA-ALVO (4 ETAPAS + 30 BLOCOS NATIVOS + TESTE 20 PERGUNTAS)
// ==========================================

export const STAGE_1_OBJECTS_20 = [
  { id: 'obj_1', word: 'Coffee mug', category: 'Cozinha / Mesa', visualHint: 'Xícara de café' },
  { id: 'obj_2', word: 'Keys', category: 'Bolso / Saída', visualHint: 'Chaves de casa' },
  { id: 'obj_3', word: 'Headphones', category: 'Tecnologia', visualHint: 'Fones de ouvido' },
  { id: 'obj_4', word: 'Water bottle', category: 'Mesa', visualHint: 'Garrafa de água' },
  { id: 'obj_5', word: 'Laptop charger', category: 'Trabalho', visualHint: 'Carregador de notebook' },
  { id: 'obj_6', word: 'Notebook', category: 'Estudos', visualHint: 'Caderno de anotações' },
  { id: 'obj_7', word: 'Pen', category: 'Estudos', visualHint: 'Caneta esferográfica' },
  { id: 'obj_8', word: 'Door handle', category: 'Casa', visualHint: 'Maçaneta da porta' },
  { id: 'obj_9', word: 'Mirror', category: 'Banheiro', visualHint: 'Espelho' },
  { id: 'obj_10', word: 'Toothbrush', category: 'Banheiro', visualHint: 'Escova de dentes' },
  { id: 'obj_11', word: 'Running shoes', category: 'Quarto', visualHint: 'Tênis de corrida' },
  { id: 'obj_12', word: 'Backpack', category: 'Saída', visualHint: 'Mochila' },
  { id: 'obj_13', word: 'Wallet', category: 'Bolso', visualHint: 'Carteira' },
  { id: 'obj_14', word: 'Light switch', category: 'Parede', visualHint: 'Interruptor de luz' },
  { id: 'obj_15', word: 'Window blinds', category: 'Janela', visualHint: 'Persianas' },
  { id: 'obj_16', word: 'Pillow', category: 'Cama', visualHint: 'Travesseiro' },
  { id: 'obj_17', word: 'Stove', category: 'Cozinha', visualHint: 'Fogão' },
  { id: 'obj_18', word: 'Refrigerator', category: 'Cozinha', visualHint: 'Geladeira' },
  { id: 'obj_19', word: 'Watch', category: 'Pulso', visualHint: 'Relógio de pulso' },
  { id: 'obj_20', word: 'Trash can', category: 'Quarto / Escritório', visualHint: 'Lixeira' },
];

export const STAGE_2_ACTIONS_SHORT_20 = [
  { id: 'act_1', mentalAction: 'Grabbing my keys.', context: 'Saindo de casa' },
  { id: 'act_2', mentalAction: 'Pouring some hot coffee.', context: 'Cozinha de manhã' },
  { id: 'act_3', mentalAction: 'Locking the front door.', context: 'Segurança' },
  { id: 'act_4', mentalAction: 'Checking my notifications.', context: 'Pegando o celular' },
  { id: 'act_5', mentalAction: 'Sitting down to work.', context: 'Mesa do escritório' },
  { id: 'act_6', mentalAction: 'Taking a sip of water.', context: 'Hidratação' },
  { id: 'act_7', mentalAction: 'Typing an urgent email.', context: 'Trabalho no teclado' },
  { id: 'act_8', mentalAction: 'Turning off the lights.', context: 'Saindo do cômodo' },
  { id: 'act_9', mentalAction: 'Putting on my jacket.', context: 'Esfriou' },
  { id: 'act_10', mentalAction: 'Washing my hands.', context: 'Higiene' },
  { id: 'act_11', mentalAction: 'Opening the window for fresh air.', context: 'Arejar o ambiente' },
  { id: 'act_12', mentalAction: 'Looking for my sunglasses.', context: 'Dia ensolarado' },
  { id: 'act_13', mentalAction: 'Starting the car engine.', context: 'Entrando no carro' },
  { id: 'act_14', mentalAction: 'Waiting for the elevator.', context: 'Hall do prédio' },
  { id: 'act_15', mentalAction: 'Stretching my back and neck.', context: 'Pausa de postura' },
  { id: 'act_16', mentalAction: 'Setting an alarm for tomorrow.', context: 'Antes de dormir' },
  { id: 'act_17', mentalAction: 'Cleaning up the desk.', context: 'Fim do expediente' },
  { id: 'act_18', mentalAction: 'Taking out the trash.', context: 'Tarefa doméstica' },
  { id: 'act_19', mentalAction: 'Brewing green tea.', context: 'Pausa da tarde' },
  { id: 'act_20', mentalAction: 'Unplugging the charger.', context: 'Celular 100%' },
];

export const STAGE_3_SIMPLE_QUESTIONS_20 = [
  { id: 'sq_1', question: 'What are you doing right now?', targetReply: "I'm sitting down practicing English." },
  { id: 'sq_2', question: 'Are you hungry or thirsty?', targetReply: "I'm a little thirsty, I need some water." },
  { id: 'sq_3', question: 'How is the weather outside today?', targetReply: "It's sunny and quite warm outside." },
  { id: 'sq_4', question: 'What time did you have breakfast?', targetReply: "I had breakfast around eight this morning." },
  { id: 'sq_5', question: 'Where are you going this evening?', targetReply: "I'm staying home to rest and read." },
  { id: 'sq_6', question: 'Do you need to buy anything today?', targetReply: "Yes, I need to pick up some groceries." },
  { id: 'sq_7', question: 'How do you feel right now?', targetReply: "I feel energetic and focused." },
  { id: 'sq_8', question: 'What is your favorite day of the week?', targetReply: "Friday is definitely my favorite day." },
  { id: 'sq_9', question: 'Do you prefer tea or coffee?', targetReply: "I prefer coffee with a splash of milk." },
  { id: 'sq_10', question: 'Did you sleep well last night?', targetReply: "Yes, I slept eight hours straight." },
  { id: 'sq_11', question: 'What are you planning to do tomorrow?', targetReply: "I have meetings in the morning and gym later." },
  { id: 'sq_12', question: 'Can you hear any noise right now?', targetReply: "Only the sound of cars outside the window." },
  { id: 'sq_13', question: 'What color is your shirt today?', targetReply: "I'm wearing a plain dark blue shirt." },
  { id: 'sq_14', question: 'Who did you talk to last?', targetReply: "I spoke with my sister on the phone." },
  { id: 'sq_15', question: 'Are you listening to any music?', targetReply: "No, it's completely quiet right now." },
  { id: 'sq_16', question: 'How many glasses of water did you drink today?', targetReply: "I've had about four glasses so far." },
  { id: 'sq_17', question: 'What is on your desk right now?', targetReply: "My laptop, my notebook, and my coffee cup." },
  { id: 'sq_18', question: 'Is your phone on silent or ringing?', targetReply: "It's on silent so I can concentrate." },
  { id: 'sq_19', question: 'What are you looking forward to this week?', targetReply: "I'm looking forward to the weekend trip." },
  { id: 'sq_20', question: 'Are you ready to speak fluently?', targetReply: "Yes, I'm practicing every single day!" },
];

export const STAGE_4_MENTAL_ROUTINE_10MIN = {
  title: 'Protocolo de 10 Minutos de Narração Mental Diária',
  description: 'Conduza uma voz interior contínua narrando seus movimentos reais sem traduzir para o português.',
  blocks: [
    {
      period: 'Minutos 1 a 3: Despertar & Banheiro',
      streamSample: '"Okay, getting out of bed now. It feels a bit cold this morning. Turning on the faucet, brushing my teeth. Looking in the mirror, still looks sleepy. Gotta wash my face with cold water."',
    },
    {
      period: 'Minutos 4 a 6: Cozinha & Café da Manhã',
      streamSample: '"Opening the fridge. Let’s see what we have here. Fresh eggs, whole milk, some butter. Boiling the water for black coffee. Grabbing my favorite mug from the top shelf. The aroma is amazing."',
    },
    {
      period: 'Minutos 7 a 8: Saída & Deslocamento',
      streamSample: '"Grabbing my wallet and phone. Don’t forget the keys on the counter. Locking the front door, twice. Walking down the stairs. The street is pretty busy today. Lots of cars heading downtown."',
    },
    {
      period: 'Minutos 9 a 10: Início do Trabalho / Tarefa',
      streamSample: '"Sitting down at my desk. Opening the laptop. First, let’s clear these urgent messages. Then, I’ll spend thirty minutes on the main project draft. Deep breath, let’s get down to business."',
    },
  ],
};

export interface NativeBlockComparison {
  id: string;
  number: number;
  literalBrazilianMistake: string;
  nativeChunk: string;
  translationMeaning: string;
  whyBraziliansMistakeIt: string;
}

export const THIRTY_NATIVE_BLOCKS: NativeBlockComparison[] = [
  {
    id: 'nb_1',
    number: 1,
    literalBrazilianMistake: 'I have 28 years',
    nativeChunk: "I'm 28 years old",
    translationMeaning: 'Eu tenho 28 anos',
    whyBraziliansMistakeIt: 'Em inglês, idade é um estado de ser (verbo to be), não uma posse física com o verbo have.',
  },
  {
    id: 'nb_2',
    number: 2,
    literalBrazilianMistake: 'It depends of you',
    nativeChunk: "It depends on you / It's up to you",
    translationMeaning: 'Depende de você',
    whyBraziliansMistakeIt: 'O verbo depend exige preposição "on", ou o bloco idiomático "it’s up to you".',
  },
  {
    id: 'nb_3',
    number: 3,
    literalBrazilianMistake: 'I am agree with you',
    nativeChunk: 'I agree with you',
    translationMeaning: 'Eu concordo com você',
    whyBraziliansMistakeIt: 'Agree já é um verbo de ação; não use o verbo to be junto.',
  },
  {
    id: 'nb_4',
    number: 4,
    literalBrazilianMistake: 'I will drink a coffee',
    nativeChunk: "I'm gonna grab a coffee / have a coffee",
    translationMeaning: 'Vou tomar um café',
    whyBraziliansMistakeIt: 'Nativos quase sempre usam "have" ou "grab" para refeições e bebidas casuais.',
  },
  {
    id: 'nb_5',
    number: 5,
    literalBrazilianMistake: 'Can you explain me this?',
    nativeChunk: 'Can you explain this to me?',
    translationMeaning: 'Você pode me explicar isso?',
    whyBraziliansMistakeIt: 'O verbo explain exige a preposição "to me" após o objeto direto.',
  },
  {
    id: 'nb_6',
    number: 6,
    literalBrazilianMistake: 'I lost the bus',
    nativeChunk: 'I missed the bus',
    translationMeaning: 'Eu perdi o ônibus',
    whyBraziliansMistakeIt: '"Lose" é perder objetos físicos de vista; horários de transporte e eventos usam "miss".',
  },
  {
    id: 'nb_7',
    number: 7,
    literalBrazilianMistake: 'I had a doubt',
    nativeChunk: 'I had a question',
    translationMeaning: 'Eu tinha uma dúvida',
    whyBraziliansMistakeIt: '"Doubt" em inglês significa desconfiança ou ceticismo. Uma dúvida de aula ou estudo é "question".',
  },
  {
    id: 'nb_8',
    number: 8,
    literalBrazilianMistake: 'Take a decision',
    nativeChunk: 'Make a decision',
    translationMeaning: 'Tomar uma decisão',
    whyBraziliansMistakeIt: 'Em inglês, decisões são "feitas" (make), não tomadas (take).',
  },
  {
    id: 'nb_9',
    number: 9,
    literalBrazilianMistake: 'I won a gift',
    nativeChunk: 'I got a present / I received a gift',
    translationMeaning: 'Eu ganhei um presente',
    whyBraziliansMistakeIt: '"Win" só se usa para vitória em jogos, loterias ou competições; presentes se "get" ou "receive".',
  },
  {
    id: 'nb_10',
    number: 10,
    literalBrazilianMistake: 'That has sense',
    nativeChunk: 'That makes sense',
    translationMeaning: 'Isso faz sentido (tem sentido)',
    whyBraziliansMistakeIt: 'Sentido em inglês se "faz" (makes sense), não se "tem".',
  },
  {
    id: 'nb_11',
    number: 11,
    literalBrazilianMistake: 'More good / more bad',
    nativeChunk: 'Better / Worse',
    translationMeaning: 'Mais bom / Mais ruim',
    whyBraziliansMistakeIt: 'Formas comparativas irregulares que o cérebro tenta compor analiticamente.',
  },
  {
    id: 'nb_12',
    number: 12,
    literalBrazilianMistake: 'Close the light',
    nativeChunk: 'Turn off the light',
    translationMeaning: 'Apague a luz (feche a luz)',
    whyBraziliansMistakeIt: 'Lâmpadas e aparelhos eletrônicos se "turn on/off", portas e janelas se "open/close".',
  },
  {
    id: 'nb_13',
    number: 13,
    literalBrazilianMistake: 'Make a party',
    nativeChunk: 'Throw a party / have a party',
    translationMeaning: 'Fazer uma festa',
    whyBraziliansMistakeIt: 'Collocation nativa padrão para festas é "throw a party".',
  },
  {
    id: 'nb_14',
    number: 14,
    literalBrazilianMistake: 'In the internet',
    nativeChunk: 'On the internet / Online',
    translationMeaning: 'Na internet',
    whyBraziliansMistakeIt: 'Meios eletrônicos e digitais exigem a preposição "on", não "in".',
  },
  {
    id: 'nb_15',
    number: 15,
    literalBrazilianMistake: 'I am without money',
    nativeChunk: "I'm broke / I'm short on cash",
    translationMeaning: 'Estou sem dinheiro',
    whyBraziliansMistakeIt: 'Nativos usam expressões idiomáticas como "broke" ou "short on cash".',
  },
  {
    id: 'nb_16',
    number: 16,
    literalBrazilianMistake: 'Pay attention in this',
    nativeChunk: 'Pay attention to this',
    translationMeaning: 'Preste atenção nisso',
    whyBraziliansMistakeIt: 'Atenção em inglês se direciona com a preposição "to".',
  },
  {
    id: 'nb_17',
    number: 17,
    literalBrazilianMistake: 'I will make a visit to him',
    nativeChunk: 'I will visit him / pay him a visit',
    translationMeaning: 'Vou fazer uma visita para ele',
    whyBraziliansMistakeIt: 'O verbo visit é transitivo direto ou usa a expressão "pay a visit".',
  },
  {
    id: 'nb_18',
    number: 18,
    literalBrazilianMistake: 'Is missing two days for my trip',
    nativeChunk: "There are two days left until my trip",
    translationMeaning: 'Faltam dois dias para minha viagem',
    whyBraziliansMistakeIt: 'A estrutura inglesa usa "[amount] left until [event]".',
  },
  {
    id: 'nb_19',
    number: 19,
    literalBrazilianMistake: 'I know him very good',
    nativeChunk: 'I know him very well',
    translationMeaning: 'Eu conheço ele muito bem',
    whyBraziliansMistakeIt: 'Good é adjetivo; o advérbio que modifica verbos de conhecimento é "well".',
  },
  {
    id: 'nb_20',
    number: 20,
    literalBrazilianMistake: 'It is the same thing that...',
    nativeChunk: 'It is the same thing as...',
    translationMeaning: 'É a mesma coisa que...',
    whyBraziliansMistakeIt: 'A correlação comparativa de "same" exige "as", não "that".',
  },
  {
    id: 'nb_21',
    number: 21,
    literalBrazilianMistake: 'People is very nice here',
    nativeChunk: 'People are very nice here',
    translationMeaning: 'As pessoas são muito legais aqui',
    whyBraziliansMistakeIt: 'People é plural em inglês e exige o verbo no plural "are".',
  },
  {
    id: 'nb_22',
    number: 22,
    literalBrazilianMistake: 'I need to make an exercise',
    nativeChunk: 'I need to work out / exercise',
    translationMeaning: 'Preciso fazer exercício',
    whyBraziliansMistakeIt: 'Exercício físico de academia é o phrasal verb "work out".',
  },
  {
    id: 'nb_23',
    number: 23,
    literalBrazilianMistake: 'Give a look at this',
    nativeChunk: 'Take a look at this',
    translationMeaning: 'Dê uma olhada nisso',
    whyBraziliansMistakeIt: 'Collocation natural fixa: "take a look", não give.',
  },
  {
    id: 'nb_24',
    number: 24,
    literalBrazilianMistake: 'She is married with a doctor',
    nativeChunk: 'She is married to a doctor',
    translationMeaning: 'Ela é casada com um médico',
    whyBraziliansMistakeIt: 'Casamento em inglês conecta com a preposição "to".',
  },
  {
    id: 'nb_25',
    number: 25,
    literalBrazilianMistake: 'I arrived in the airport',
    nativeChunk: 'I arrived at the airport',
    translationMeaning: 'Cheguei no aeroporto',
    whyBraziliansMistakeIt: 'Lugares e pontos de referência específicos exigem "at"; cidades e países usam "in".',
  },
  {
    id: 'nb_26',
    number: 26,
    literalBrazilianMistake: 'Never more I will do that',
    nativeChunk: 'I will never do that again',
    translationMeaning: 'Nunca mais vou fazer isso',
    whyBraziliansMistakeIt: '"Nunca mais" se traduz ordenadamente por "never... again".',
  },
  {
    id: 'nb_27',
    number: 27,
    literalBrazilianMistake: 'Ask a question to him',
    nativeChunk: 'Ask him a question',
    translationMeaning: 'Faça uma pergunta a ele',
    whyBraziliansMistakeIt: 'O verbo ask aceita objeto indireto duplo direto sem preposição: "ask him".',
  },
  {
    id: 'nb_28',
    number: 28,
    literalBrazilianMistake: 'I have a job for do',
    nativeChunk: 'I have some work to do',
    translationMeaning: 'Tenho um trabalho para fazer',
    whyBraziliansMistakeIt: 'Job é a vaga/cargo de emprego; a tarefa ou esforço de trabalho é incontável: "work".',
  },
  {
    id: 'nb_29',
    number: 29,
    literalBrazilianMistake: 'Take off your attention',
    nativeChunk: 'Get distracted / Lose focus',
    translationMeaning: 'Tirar a atenção / Se distrair',
    whyBraziliansMistakeIt: 'Nativos usam "lose focus" ou "get distracted".',
  },
  {
    id: 'nb_30',
    number: 30,
    literalBrazilianMistake: 'I am feeling myself tired',
    nativeChunk: 'I feel tired / I am feeling tired',
    translationMeaning: 'Estou me sentindo cansado',
    whyBraziliansMistakeIt: 'O verbo feel dispensa pronome reflexivo (myself) ao descrever sensações e emoções.',
  },
];

export interface DirectThinkingTestQuestion {
  id: string;
  number: number;
  question: string;
  translation: string;
  timeLimitSec: number;
  expectedDirectResponse: string;
}

export const DIRECT_THINKING_TEST_20: DirectThinkingTestQuestion[] = [
  { id: 'dtq_1', number: 1, question: 'What is your immediate reaction when your alarm rings?', translation: 'Qual sua reação imediata quando o alarme toca?', timeLimitSec: 5, expectedDirectResponse: 'I hit snooze or get straight out of bed.' },
  { id: 'dtq_2', number: 2, question: 'What is the very first thing you do after brushing your teeth?', translation: 'Qual a primeira coisa que faz após escovar os dentes?', timeLimitSec: 5, expectedDirectResponse: 'I rinse my mouth and wash my face.' },
  { id: 'dtq_3', number: 3, question: 'If you could eat any meal right now, what would it be?', translation: 'Se pudesse comer qualquer coisa agora, o que seria?', timeLimitSec: 5, expectedDirectResponse: 'A fresh slice of pizza or some grilled salmon.' },
  { id: 'dtq_4', number: 4, question: 'How do you feel when you are stuck in bad traffic?', translation: 'Como se sente quando fica preso no trânsito?', timeLimitSec: 5, expectedDirectResponse: 'I feel impatient, so I put on a podcast.' },
  { id: 'dtq_5', number: 5, question: 'What is sitting immediately to your right side right now?', translation: 'O que está imediatamente ao seu lado direito agora?', timeLimitSec: 5, expectedDirectResponse: 'My coffee mug and a notebook.' },
  { id: 'dtq_6', number: 6, question: 'Do you prefer cloudy rainy days or bright sunny days?', translation: 'Prefere dias chuvosos ou dias ensolarados?', timeLimitSec: 5, expectedDirectResponse: 'I definitely prefer bright sunny mornings.' },
  { id: 'dtq_7', number: 7, question: 'What was the last thing you purchased online?', translation: 'Qual foi a última coisa que comprou online?', timeLimitSec: 5, expectedDirectResponse: 'I bought a new book on language learning.' },
  { id: 'dtq_8', number: 8, question: 'Who is the person you talk to the most every week?', translation: 'Com quem você mais conversa toda semana?', timeLimitSec: 5, expectedDirectResponse: 'My spouse / my best friend / my coworker.' },
  { id: 'dtq_9', number: 9, question: 'What time are you going to sleep tonight?', translation: 'Que horas vai dormir hoje?', timeLimitSec: 5, expectedDirectResponse: 'Around eleven o’clock at night.' },
  { id: 'dtq_10', number: 10, question: 'What do you say when you accidentally bump into someone?', translation: 'O que diz quando esbarra em alguém sem querer?', timeLimitSec: 5, expectedDirectResponse: 'Oh, excuse me! Sorry about that!' },
  { id: 'dtq_11', number: 11, question: 'What is your favorite room in your home and why?', translation: 'Qual cômodo favorito da sua casa e por quê?', timeLimitSec: 5, expectedDirectResponse: 'My bedroom because it is quiet and peaceful.' },
  { id: 'dtq_12', number: 12, question: 'How much water have you drank so far today?', translation: 'Quanta água você bebeu até agora hoje?', timeLimitSec: 5, expectedDirectResponse: 'At least three large glasses.' },
  { id: 'dtq_13', number: 13, question: 'If your computer stopped working right now, what would you do?', translation: 'Se o computador parasse de funcionar agora, o que faria?', timeLimitSec: 5, expectedDirectResponse: 'I would restart it or call tech support.' },
  { id: 'dtq_14', number: 14, question: 'What sound can you hear in the background right this second?', translation: 'Que som ouve ao fundo neste exato segundo?', timeLimitSec: 5, expectedDirectResponse: 'The air conditioner humming softly.' },
  { id: 'dtq_15', number: 15, question: 'What is something you really enjoy doing on Sunday afternoons?', translation: 'O que gosta muito de fazer no domingo à tarde?', timeLimitSec: 5, expectedDirectResponse: 'Relaxing on the couch with a good film.' },
  { id: 'dtq_16', number: 16, question: 'What is one thing you always carry in your pocket or bag?', translation: 'Uma coisa que sempre carrega no bolso ou bolsa?', timeLimitSec: 5, expectedDirectResponse: 'My smartphone and car keys.' },
  { id: 'dtq_17', number: 17, question: 'Do you prefer working early in the morning or late at night?', translation: 'Prefere trabalhar de manhã cedo ou tarde da noite?', timeLimitSec: 5, expectedDirectResponse: 'Early mornings when my mind is fresh.' },
  { id: 'dtq_18', number: 18, question: 'How do you say goodbye to a colleague at the end of the day?', translation: 'Como se despede de um colega no final do dia?', timeLimitSec: 5, expectedDirectResponse: 'Have a good evening, see you tomorrow!' },
  { id: 'dtq_19', number: 19, question: 'What is the color of the wall in front of you?', translation: 'Qual a cor da parede à sua frente?', timeLimitSec: 5, expectedDirectResponse: 'It is an off-white neutral color.' },
  { id: 'dtq_20', number: 20, question: 'Are you thinking in Portuguese or in English right now?', translation: 'Está pensando em português ou em inglês agora?', timeLimitSec: 5, expectedDirectResponse: 'I am responding and thinking directly in English!' },
];
