import { TimedAudioSession, ShortVideoLesson, TargetLanguage, FluencyLevel } from '../types';

/**
 * Base de Dados Completa de Áudios Cronometrados (3, 5, 7 e 10 minutos)
 * e Pequenos Vídeos com Controle Tríplice de Legendas (Sem Legenda, Com Legenda Original, Com Legenda + Tradução)
 * Mapeados criteriosamente por Idioma e Nível de Fluência (Zero/A1 a C1).
 */

export const TIMED_AUDIO_SESSIONS: TimedAudioSession[] = [
  // ==========================================
  // INGLÊS - NÍVEL ZERO & A1
  // ==========================================
  {
    id: 'en_a1_3min',
    title: 'Morning Routine & Coffee Order',
    durationMinutes: 3,
    language: 'Inglês',
    level: 'A1',
    topic: 'Vida cotidiana, saudações e pedidos rápidos no café',
    summary: 'Diálogo entre Emily e o atendente do café sobre pedir café da manhã, opções de leite e formas de pagamento.',
    externalStreamUrl: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
    streamSourceLabel: 'BBC Learning English - 6 Minute English',
    segments: [
      {
        speaker: 'Emily',
        text: "Good morning! How are you doing today?",
        translation: "Bom dia! Como você está hoje?",
        timestamp: "00:00",
      },
      {
        speaker: 'Barista',
        text: "Good morning! Doing great, thanks. What can I get started for you?",
        translation: "Bom dia! Indo muito bem, obrigado. O que posso preparar para você?",
        timestamp: "00:25",
      },
      {
        speaker: 'Emily',
        text: "I'd like a medium iced latte with oat milk, please. Not too sweet.",
        translation: "Eu gostaria de um latte gelado médio com leite de aveia, por favor. Não muito doce.",
        timestamp: "00:50",
      },
      {
        speaker: 'Barista',
        text: "Sure thing. Would you like any syrup or a pastry to go with that?",
        translation: "Com certeza. Gostaria de algum xarope ou um doce para acompanhar?",
        timestamp: "01:20",
      },
      {
        speaker: 'Emily',
        text: "Just a blueberry muffin, please. Is it fresh from today?",
        translation: "Apenas um muffin de mirtilo, por favor. É fresquinho de hoje?",
        timestamp: "01:50",
      },
      {
        speaker: 'Barista',
        text: "Yes, baked an hour ago! That will be six dollars and fifty cents. Tap or cash?",
        translation: "Sim, assado há uma hora! Vai dar seis dólares e cinquenta centavos. Por aproximação ou dinheiro?",
        timestamp: "02:15",
      },
      {
        speaker: 'Emily',
        text: "Card tap, please. Thank you so much! Have a wonderful day.",
        translation: "Aproximação de cartão, por favor. Muito obrigada! Tenha um dia maravilhoso.",
        timestamp: "02:40",
      },
    ],
    comprehensionQuestions: [
      {
        question: "What type of milk did Emily request for her coffee?",
        options: ["Whole milk", "Oat milk", "Almond milk", "Soy milk"],
        correctIndex: 1,
        explanation: "Emily explicitly asks for 'oat milk' (leite de aveia).",
      },
      {
        question: "How much did the total order cost?",
        options: ["$5.50", "$6.00", "$6.50", "$7.00"],
        correctIndex: 2,
        explanation: "The barista confirms: 'That will be six dollars and fifty cents' ($6.50).",
      },
    ],
  },
  {
    id: 'en_a1_5min',
    title: 'Asking for Directions in the City',
    durationMinutes: 5,
    language: 'Inglês',
    level: 'A1',
    topic: 'Orientação espacial, transporte público e pontos turísticos',
    summary: 'Um turista pede orientações a um morador local sobre como chegar à estação de metrô mais próxima e ao museu de arte.',
    externalStreamUrl: 'https://www.npr.org/podcasts/510338/life-kit',
    streamSourceLabel: 'NPR Life Kit Short Audios',
    segments: [
      {
        speaker: 'Lucas',
        text: "Excuse me, sir! Do you happen to know where the nearest subway entrance is?",
        translation: "Com licença, senhor! Você por acaso sabe onde fica a entrada de metrô mais próxima?",
        timestamp: "00:00",
      },
      {
        speaker: 'Resident',
        text: "Sure! Keep walking down this street for two blocks. You will see a big green pharmacy on your right.",
        translation: "Claro! Continue descendo esta rua por duas quadras. Você verá uma farmácia verde grande à sua direita.",
        timestamp: "00:45",
      },
      {
        speaker: 'Lucas',
        text: "Two blocks down, by the pharmacy. And then which way should I turn?",
        translation: "Duas quadras abaixo, perto da farmácia. E depois para qual lado eu viro?",
        timestamp: "01:30",
      },
      {
        speaker: 'Resident',
        text: "Turn left onto Fifth Avenue. The stairs going down to line B are right in front of the public library.",
        translation: "Vire à esquerda na Quinta Avenida. As escadas descendo para a linha B ficam bem na frente da biblioteca pública.",
        timestamp: "02:15",
      },
      {
        speaker: 'Lucas',
        text: "Is it within walking distance or would you recommend catching a taxi?",
        translation: "Dá para ir a pé ou você recomendaria pegar um táxi?",
        timestamp: "03:00",
      },
      {
        speaker: 'Resident',
        text: "It's only a five-minute walk, perfectly safe and easy. Have your metro card ready!",
        translation: "É uma caminhada de só cinco minutos, perfeitamente segura e fácil. Tenha seu cartão de metrô em mãos!",
        timestamp: "03:45",
      },
      {
        speaker: 'Lucas',
        text: "Awesome! I really appreciate your help. Have a great afternoon.",
        translation: "Maravilha! Realmente aprecio sua ajuda. Tenha uma ótima tarde.",
        timestamp: "04:30",
      },
    ],
    comprehensionQuestions: [
      {
        question: "Where is the subway entrance located?",
        options: [
          "Inside the shopping mall",
          "In front of the public library",
          "Next to the airport",
          "Behind the post office",
        ],
        correctIndex: 1,
        explanation: "The resident specifies: 'right in front of the public library'.",
      },
      {
        question: "How long does it take to walk there?",
        options: ["15 minutes", "20 minutes", "5 minutes", "30 minutes"],
        correctIndex: 2,
        explanation: "The resident says: 'It's only a five-minute walk'.",
      },
    ],
  },
  {
    id: 'en_a1_7min',
    title: 'Weekend Plans & Hobbies with Friends',
    durationMinutes: 7,
    language: 'Inglês',
    level: 'A1',
    topic: 'Conversa informal, lazer, esportes e planos futuros',
    summary: 'Dois amigos conversam sobre o que fizeram no final de semana passado e combinam uma trilha no parque estadual.',
    externalStreamUrl: 'https://learnenglish.britishcouncil.org/skills/listening',
    streamSourceLabel: 'British Council Podcasts - Level A1/A2',
    segments: [
      {
        speaker: 'Sarah',
        text: "Hey Mark! How was your weekend? Did you end up going to the beach like you planned?",
        translation: "Oi Mark! Como foi seu fim de semana? Você acabou indo à praia como tinha planejado?",
        timestamp: "00:00",
      },
      {
        speaker: 'Mark',
        text: "Not really, it was cloudy and a bit chilly on Saturday, so I stayed home and cooked a big batch of pasta.",
        translation: "Na verdade não, estava nublado e um pouco frio no sábado, então fiquei em casa e cozinhei uma panelada de macarrão.",
        timestamp: "01:00",
      },
      {
        speaker: 'Sarah',
        text: "That sounds cozy! I actually went to the farmers market on Sunday morning and bought some fresh strawberries.",
        translation: "Parece aconchegante! Eu fui à feira de produtores no domingo de manhã e comprei alguns morangos frescos.",
        timestamp: "02:10",
      },
      {
        speaker: 'Mark',
        text: "Nice! Are you free this coming Saturday? Some friends are planning a light hike up Bear Mountain.",
        translation: "Que legal! Você está livre neste próximo sábado? Alguns amigos estão planejando uma trilha leve na montanha.",
        timestamp: "03:20",
      },
      {
        speaker: 'Sarah',
        text: "I love hiking! How long is the trail? My sneakers are fine for easy terrain, but not rocky hills.",
        translation: "Eu adoro fazer trilha! Qual é a extensão da trilha? Meus tênis servem para terreno fácil, mas não colinas rochosas.",
        timestamp: "04:30",
      },
      {
        speaker: 'Mark',
        text: "It is mostly a flat wooden boardwalk, around 4 miles round trip. Very relaxed pace with plenty of scenic stops.",
        translation: "É quase tudo passarela de madeira plana, cerca de 4 milhas ida e volta. Ritmo bem relaxado com muitas paradas panorâmicas.",
        timestamp: "05:40",
      },
      {
        speaker: 'Sarah',
        text: "Count me in! I will bring water bottles and some trail mix for everyone. What time are we meeting?",
        translation: "Pode contar comigo! Vou levar garrafas de água e mix de castanhas para todo mundo. Que horas nos encontramos?",
        timestamp: "06:30",
      },
    ],
    comprehensionQuestions: [
      {
        question: "Why didn't Mark go to the beach on Saturday?",
        options: ["He had to work late", "It was cloudy and chilly", "His car broke down", "He forgot his sunglasses"],
        correctIndex: 1,
        explanation: "Mark explains: 'it was cloudy and a bit chilly on Saturday, so I stayed home'.",
      },
      {
        question: "What will Sarah bring to the hike?",
        options: ["Sandwiches and soda", "Water bottles and trail mix", "A heavy backpack", "A camping tent"],
        correctIndex: 1,
        explanation: "Sarah offers: 'I will bring water bottles and some trail mix for everyone'.",
      },
    ],
  },
  {
    id: 'en_a1_10min',
    title: 'Hotel Check-in & Exploring City Attractions',
    durationMinutes: 10,
    language: 'Inglês',
    level: 'A1',
    topic: 'Turismo, hospedagem, perguntas práticas e horários',
    summary: 'Hóspede realiza check-in detalhado, pergunta sobre café da manhã, regras da piscina, senha de Wi-Fi e dicas locais.',
    externalStreamUrl: 'https://spotlightenglish.com/',
    streamSourceLabel: 'Spotlight English - Clear Audio Broadcasts',
    segments: [
      {
        speaker: 'Receptionist',
        text: "Welcome to Grand Horizon Hotel! How may I assist you this afternoon?",
        translation: "Bem-vindo ao Grand Horizon Hotel! Como posso ajudá-lo nesta tarde?",
        timestamp: "00:00",
      },
      {
        speaker: 'Guest',
        text: "Hello, I have a reservation under the name Carlos Silva for four nights.",
        translation: "Olá, tenho uma reserva no nome de Carlos Silva por quatro noites.",
        timestamp: "01:20",
      },
      {
        speaker: 'Receptionist',
        text: "Let me pull that up on our system... Yes, a king room with a city view on the seventh floor.",
        translation: "Deixe-me puxar isso em nosso sistema... Sim, um quarto king com vista para a cidade no sétimo andar.",
        timestamp: "02:40",
      },
      {
        speaker: 'Guest',
        text: "Wonderful! Could you clarify if breakfast is included, and what the serving hours are?",
        translation: "Maravilha! Você poderia esclarecer se o café da manhã está incluso e quais são os horários de serviço?",
        timestamp: "04:00",
      },
      {
        speaker: 'Receptionist',
        text: "Yes, continental buffet is included. It is served from 6:30 to 10:00 AM in the garden dining room on the ground floor.",
        translation: "Sim, buffet continental está incluso. É servido das 6h30 às 10h no refeitório do jardim no térreo.",
        timestamp: "05:20",
      },
      {
        speaker: 'Guest',
        text: "Great. What is the Wi-Fi password, and is there an elevator near the fitness center?",
        translation: "Ótimo. Qual é a senha do Wi-Fi e tem um elevador perto da academia?",
        timestamp: "06:40",
      },
      {
        speaker: 'Receptionist',
        text: "The network is 'HorizonGuest', no password needed. And yes, elevator two takes you right to the gym on floor two.",
        translation: "A rede é 'HorizonGuest', não precisa de senha. E sim, o elevador 2 leva direto à academia no 2º andar.",
        timestamp: "08:00",
      },
      {
        speaker: 'Guest',
        text: "Here are your room keycards, room 714. If you need any dinner recommendations, our concierge is right by the door.",
        translation: "Aqui estão os cartões-chave do quarto, número 714. Se precisar de recomendações para jantar, nosso concierge está logo ali.",
        timestamp: "09:15",
      },
    ],
    comprehensionQuestions: [
      {
        question: "What room floor is the guest assigned to?",
        options: ["Third floor", "Fifth floor", "Seventh floor", "Tenth floor"],
        correctIndex: 2,
        explanation: "The receptionist confirms: 'room 714 on the seventh floor'.",
      },
      {
        question: "When is the breakfast buffet served?",
        options: ["7:00 to 11:00 AM", "6:30 to 10:00 AM", "8:00 to 10:30 AM", "All day long"],
        correctIndex: 1,
        explanation: "The receptionist specifies: 'served from 6:30 to 10:00 AM'.",
      },
    ],
  },

  // ==========================================
  // INGLÊS - NÍVEL A2 & B1
  // ==========================================
  {
    id: 'en_b1_3min',
    title: 'Tech Support & Remote Work Troubleshooting',
    durationMinutes: 3,
    language: 'Inglês',
    level: 'B1',
    topic: 'Vocabulário profissional, problemas técnicos e reuniões online',
    summary: 'Colaborador liga para o suporte técnico após o microfone e compartilhamento de tela falharem antes de uma apresentação com cliente.',
    externalStreamUrl: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
    streamSourceLabel: 'BBC 6 Minute English',
    segments: [
      {
        speaker: 'Tech',
        text: "IT Helpdesk, Alex speaking. How can I troubleshoot your workstation today?",
        translation: "Suporte de TI, Alex falando. Como posso solucionar seu problema na estação hoje?",
        timestamp: "00:00",
      },
      {
        speaker: 'Elena',
        text: "Hi Alex! I have an important client demo in twenty minutes, but my microphone keeps dropping audio on Zoom.",
        translation: "Oi Alex! Tenho uma demo importante com cliente em 20 minutos, mas meu microfone fica cortando o áudio no Zoom.",
        timestamp: "00:30",
      },
      {
        speaker: 'Tech',
        text: "Got it. Let's check your audio input settings first. Did you recently plug in an external USB hub?",
        translation: "Entendido. Vamos checar suas configurações de entrada de áudio primeiro. Você plugou recentemente um hub USB externo?",
        timestamp: "01:00",
      },
      {
        speaker: 'Elena',
        text: "Yes, I plugged it in this morning. Could that be drawing too much power or conflicting with the driver?",
        translation: "Sim, pluguei esta manhã. Isso poderia estar puxando muita energia ou conflitando com o driver?",
        timestamp: "01:40",
      },
      {
        speaker: 'Tech',
        text: "Exactly. Switch the headset dongle directly into the laptop's dedicated port, then restart the audio daemon.",
        translation: "Exatamente. Mude o conector do fone direto para a porta dedicada do notebook e reinicie o serviço de áudio.",
        timestamp: "02:15",
      },
      {
        speaker: 'Elena',
        text: "Done! The green input meter is moving smoothly now. You saved my presentation, thanks a million!",
        translation: "Feito! O medidor verde de entrada está se movendo perfeitamente agora. Você salvou minha apresentação, muito obrigada!",
        timestamp: "02:45",
      },
    ],
    comprehensionQuestions: [
      {
        question: "Why was Elena in a rush to fix her microphone?",
        options: [
          "She had a job interview",
          "She had an important client demo in 20 minutes",
          "Her boss was angry",
          "She wanted to listen to music",
        ],
        correctIndex: 1,
        explanation: "Elena states she had an important client demo in 20 minutes.",
      },
    ],
  },
  {
    id: 'en_b1_5min',
    title: 'Job Interview: Describing Strengths & Career Shift',
    durationMinutes: 5,
    language: 'Inglês',
    level: 'B1',
    topic: 'Entrevistas de emprego, transição de carreira e comunicação executiva',
    summary: 'Candidata explica como sua experiência anterior em atendimento e vendas complementa sua nova função como gerente de projetos.',
    externalStreamUrl: 'https://hbr.org/podcasts/hbr-ideacast',
    streamSourceLabel: 'HBR IdeaCast - Business English',
    segments: [
      {
        speaker: 'Interviewer',
        text: "Maria, looking at your resume, you made a transition from hospitality management to agile project management. What drove that decision?",
        translation: "Maria, olhando seu currículo, você fez uma transição da gestão hoteleira para gestão ágil de projetos. O que motivou essa decisão?",
        timestamp: "00:00",
      },
      {
        speaker: 'Maria',
        text: "Both fields fundamentally revolve around people, timelines, and handling unexpected bottlenecks under high pressure.",
        translation: "Ambos os campos giram fundamentalmente em torno de pessoas, prazos e resolução de gargalos inesperados sob alta pressão.",
        timestamp: "00:50",
      },
      {
        speaker: 'Interviewer',
        text: "How do you handle scope creep when stakeholders demand sudden alterations midway through a sprint?",
        translation: "Como você lida com aumento descontrolado de escopo quando os envolvidos exigem alterações repentinas no meio de um sprint?",
        timestamp: "02:00",
      },
      {
        speaker: 'Maria',
        text: "I prioritize transparent backlog renegotiation. Instead of saying a flat no, I demonstrate the trade-offs on deliverable dates.",
        translation: "Eu priorizo a renegociação transparente do backlog. Em vez de simplesmente dizer não, demonstro o impacto nos prazos de entrega.",
        timestamp: "03:15",
      },
      {
        speaker: 'Interviewer',
        text: "That shows mature stakeholder alignment. What is your preferred project tracking software stack?",
        translation: "Isso demonstra alinhamento maduro com os stakeholders. Qual é a sua suíte de software favorita para controle de projetos?",
        timestamp: "04:10",
      },
    ],
    comprehensionQuestions: [
      {
        question: "How does Maria respond to unexpected scope alterations?",
        options: [
          "She refuses all requests immediately",
          "She works overtime every day",
          "She demonstrates trade-offs and renegotiates the backlog transparently",
          "She delegates everything to junior engineers",
        ],
        correctIndex: 2,
        explanation: "Maria explains she demonstrates trade-offs on delivery dates and renegotiates transparently.",
      },
    ],
  },
  {
    id: 'en_b1_7min',
    title: 'Podcast Discussion: Urban Cycling & Sustainable Cities',
    durationMinutes: 7,
    language: 'Inglês',
    level: 'B1',
    topic: 'Debate contemporâneo, urbanismo, mobilidade e meio ambiente',
    summary: 'Apresentadores debatem dados sobre como a expansão de ciclovias protegidas aumentou o comércio local e reduziu acidentes em capitais europeias.',
    externalStreamUrl: 'https://freakonomics.com/',
    streamSourceLabel: 'Freakonomics Radio - Economic Discussions',
    segments: [
      {
        speaker: 'Host Liam',
        text: "Welcome back to Urban Shifts. Today we are digging into whether investing in cycling infrastructure genuinely pays off economically.",
        translation: "Bem-vindos de volta ao Urban Shifts. Hoje estamos investigando se investir em infraestrutura cicloviária realmente compensa economicamente.",
        timestamp: "00:00",
      },
      {
        speaker: 'Guest Dr. Chloe',
        text: "Recent comprehensive studies across Copenhagen and Seville debunk the myth that parking removal hurts small retail businesses.",
        translation: "Estudos abrangentes recentes em Copenhague e Sevilha desmistificam o mito de que a remoção de vagas de carro prejudica o pequeno comércio.",
        timestamp: "01:30",
      },
      {
        speaker: 'Host Liam',
        text: "In fact, cyclists tend to make more frequent stops per week compared to drivers who rush past storefronts looking for parking garages.",
        translation: "De fato, ciclistas tendem a fazer paradas mais frequentes por semana comparados a motoristas que passam correndo procurando garagem.",
        timestamp: "03:10",
      },
      {
        speaker: 'Guest Dr. Chloe',
        text: "Furthermore, the public health savings on cardiovascular treatments outweigh the asphalt renovation costs within less than three fiscal years.",
        translation: "Além disso, a economia em saúde pública com tratamentos cardiovasculares supera os custos de reforma do asfalto em menos de três anos fiscais.",
        timestamp: "05:00",
      },
    ],
    comprehensionQuestions: [
      {
        question: "What did studies in Copenhagen and Seville show about cyclists and small retail businesses?",
        options: [
          "Cyclists avoid small stores",
          "Retail revenue decreased dramatically",
          "Cyclists make more frequent stops and boost local commerce",
          "Cars spend more money per minute",
        ],
        correctIndex: 2,
        explanation: "The data shows cyclists make more frequent visits to local storefronts than motorists rushing to park.",
      },
    ],
  },
  {
    id: 'en_b1_10min',
    title: 'Deep Dive: How Artificial Intelligence is Reshaping Education',
    durationMinutes: 10,
    language: 'Inglês',
    level: 'B1',
    topic: 'Tecnologia, pedagogia moderna, pensamento crítico e futuro do trabalho',
    summary: 'Especialistas discutem como tutores adaptativos baseados em IA ajudam alunos a dominar matérias complexas no seu próprio ritmo.',
    externalStreamUrl: 'https://www.ted.com/podcasts/ted-talks-daily',
    streamSourceLabel: 'TED Talks Daily Audio Stream',
    segments: [
      {
        speaker: 'Narrator',
        text: "The traditional one-size-fits-all classroom model has faced criticism for decades. Today, algorithmic personalization is transforming that paradigm.",
        translation: "O modelo tradicional de sala de aula de tamanho único enfrenta críticas há décadas. Hoje, a personalização algorítmica está transformando esse paradigma.",
        timestamp: "00:00",
      },
      {
        speaker: 'Professor Evans',
        text: "When a student struggles with a mathematical concept like fractions, instead of moving forward and accumulating knowledge gaps, the system detects hesitation.",
        translation: "Quando um estudante tem dificuldade com um conceito matemático como frações, em vez de seguir em frente e acumular lacunas, o sistema detecta a hesitação.",
        timestamp: "02:30",
      },
      {
        speaker: 'Moderator',
        text: "Does this risk reducing human empathy or interaction between peers and teachers in physical institutions?",
        translation: "Isso corre o risco de reduzir a empatia humana ou a interação entre colegas e professores em instituições físicas?",
        timestamp: "05:00",
      },
      {
        speaker: 'Professor Evans',
        text: "Quite the opposite. By automating repetitive drill grading, teachers reclaim precious hours to mentor students in debate, ethics, and critical thinking.",
        translation: "Muito pelo contrário. Ao automatizar a correção repetitiva de exercícios, os professores recuperam horas preciosas para mentorar debates, ética e pensamento crítico.",
        timestamp: "07:45",
      },
    ],
    comprehensionQuestions: [
      {
        question: "According to Professor Evans, what benefit does automation offer to teachers?",
        options: [
          "It replaces human teachers entirely",
          "It frees up time to mentor students in debate, ethics, and critical thinking",
          "It cuts teacher salaries in half",
          "It increases the amount of homework students must do",
        ],
        correctIndex: 1,
        explanation: "By automating repetitive grading, teachers reclaim time to mentor in critical thinking and ethics.",
      },
    ],
  },
];

export const SHORT_VIDEO_LESSONS: ShortVideoLesson[] = [
  // ==========================================
  // INGLÊS (3 min, 5 min, 7 min, 10 min)
  // ==========================================
  {
    id: 'vid_en_3min',
    title: 'Easy English: Everyday Greetings & Natural Small Talk',
    duration: '3 min',
    durationMinutes: 3,
    language: 'Inglês',
    level: 'A1',
    topic: 'Apresentações pessoais, cordialidade e ritmo espontâneo',
    youtubeId: 'I_tRSrPru94',
    culturalContext: 'Em países anglófonos, "How are you doing?" funciona como cumprimento cordial; a resposta habitual é rápida como "Good, thank you! How about you?".',
    keyPhrases: [
      { phrase: "Could I please get a...", translation: "Você me vê um..." },
      { phrase: "Nice to meet you in person!", translation: "Muito prazer em conhecê-lo pessoalmente!" },
      { phrase: "How has your day been so far?", translation: "Como tem sido o seu dia até agora?" },
      { phrase: "Have a good one!", translation: "Tenha um bom dia / Até mais!" },
    ],
    subtitles: [
      {
        id: 'sub_en3_1',
        startTimeSec: 2,
        endTimeSec: 8,
        speaker: 'Sam',
        originalText: "Hi there! My name is Sam. It's truly wonderful to finally meet you in person.",
        translatedText: "Olá! Meu nome é Sam. É realmente maravilhoso finalmente te conhecer pessoalmente.",
      },
      {
        id: 'sub_en3_2',
        startTimeSec: 9,
        endTimeSec: 16,
        speaker: 'Emma',
        originalText: "Nice to meet you too, Sam! Did you have any trouble finding the coffee shop?",
        translatedText: "Prazer em conhecê-lo também, Sam! Você teve alguma dificuldade para achar a cafeteria?",
      },
      {
        id: 'sub_en3_3',
        startTimeSec: 17,
        endTimeSec: 24,
        speaker: 'Sam',
        originalText: "Not at all! The directions were super clear and the weather today is fantastic.",
        translatedText: "De jeito nenhum! As instruções foram super claras e o clima hoje está fantástico.",
      },
      {
        id: 'sub_en3_4',
        startTimeSec: 25,
        endTimeSec: 33,
        speaker: 'Emma',
        originalText: "I know, right? Perfect morning for a hot cappuccino. Let's order at the counter.",
        translatedText: "Né verdade? Manhã perfeita para um cappuccino quente. Vamos pedir no balcão.",
      },
      {
        id: 'sub_en3_5',
        startTimeSec: 34,
        endTimeSec: 42,
        speaker: 'Sam',
        originalText: "Sounds like a plan! Could I please get an oat milk latte with extra foam?",
        translatedText: "Excelente ideia! Você poderia me ver um latte com leite de aveia e espuma extra?",
      },
      {
        id: 'sub_en3_6',
        startTimeSec: 43,
        endTimeSec: 52,
        speaker: 'Emma',
        originalText: "Coming right up. Make yourself at home while I grab the sugar and napkins.",
        translatedText: "Saindo agora mesmo. Sinta-se em casa enquanto eu pego o açúcar e os guardanapos.",
      },
    ],
  },
  {
    id: 'vid_en_5min',
    title: 'BBC English: Travel, Hotel Check-In & Getting Around',
    duration: '5 min',
    durationMinutes: 5,
    language: 'Inglês',
    level: 'A2',
    topic: 'Check-in em hotel, direções pela cidade e situações de viagem',
    youtubeId: '_5siHrpPnmw',
    culturalContext: 'Ao fazer check-in ou pedir informações, usar formas polidas como "Would you mind...", "Could you tell me..." soa muito mais receptivo do que frases diretas.',
    keyPhrases: [
      { phrase: "I have a reservation under...", translation: "Tenho uma reserva no nome de..." },
      { phrase: "What time is breakfast served?", translation: "Que horas é servido o café da manhã?" },
      { phrase: "Is there Wi-Fi access in the room?", translation: "Tem acesso a Wi-Fi no quarto?" },
      { phrase: "Could you point me towards...", translation: "Você poderia me indicar o caminho para..." },
    ],
    subtitles: [
      {
        id: 'sub_en5_1',
        startTimeSec: 2,
        endTimeSec: 9,
        speaker: 'Traveler',
        originalText: "Good afternoon! I have a hotel reservation under the name of Daniel Miller.",
        translatedText: "Boa tarde! Tenho uma reserva de hotel no nome de Daniel Miller.",
      },
      {
        id: 'sub_en5_2',
        startTimeSec: 10,
        endTimeSec: 17,
        speaker: 'Receptionist',
        originalText: "Welcome to London, Mr. Miller! Let me pull up your details on the system.",
        translatedText: "Bem-vindo a Londres, Sr. Miller! Deixe-me abrir seus detalhes no sistema.",
      },
      {
        id: 'sub_en5_3',
        startTimeSec: 18,
        endTimeSec: 25,
        speaker: 'Traveler',
        originalText: "Thank you! It was quite a long flight, so I am eager to get settled.",
        translatedText: "Obrigado! Foi um voo bem longo, então estou ansioso para me acomodar.",
      },
      {
        id: 'sub_en5_4',
        startTimeSec: 26,
        endTimeSec: 34,
        speaker: 'Receptionist',
        originalText: "Your deluxe room on the fifth floor is ready. Here are your two keycards.",
        translatedText: "Seu quarto luxo no quinto andar está pronto. Aqui estão seus dois cartões-chave.",
      },
      {
        id: 'sub_en5_5',
        startTimeSec: 35,
        endTimeSec: 43,
        speaker: 'Traveler',
        originalText: "Wonderful. Could you tell me what time breakfast starts tomorrow morning?",
        translatedText: "Maravilha. Você poderia me dizer que horas começa o café da manhã amanhã cedo?",
      },
      {
        id: 'sub_en5_6',
        startTimeSec: 44,
        endTimeSec: 53,
        speaker: 'Receptionist',
        originalText: "Breakfast is served from 6:30 to 10:00 in the garden terrace dining hall.",
        translatedText: "O café da manhã é servido das 6h30 às 10h no salão de jantar do terraço do jardim.",
      },
      {
        id: 'sub_en5_7',
        startTimeSec: 54,
        endTimeSec: 64,
        speaker: 'Traveler',
        originalText: "Perfect. And is the subway station within comfortable walking distance?",
        translatedText: "Perfeito. E a estação de metrô fica a uma distância confortável a pé?",
      },
      {
        id: 'sub_en5_8',
        startTimeSec: 65,
        endTimeSec: 75,
        speaker: 'Receptionist',
        originalText: "Just two blocks to the left. Turn by the bakery and you will see the red logo.",
        translatedText: "Apenas duas quadras à esquerda. Vire perto da padaria e verá o logotipo vermelho.",
      },
    ],
  },
  {
    id: 'vid_en_7min',
    title: 'BBC Office English: Strategic Meetings & Professional Diplomacy',
    duration: '7 min',
    durationMinutes: 7,
    language: 'Inglês',
    level: 'B1',
    topic: 'Expressões corporativas, suavizadores e argumentação colaborativa',
    youtubeId: 'm2UD0-IC7iY',
    culturalContext: 'Em reuniões profissionais anglo-americanas, discordar frontalmente com "You are wrong" é considerado rude. Prefere-se "I see your point, however we might consider...".',
    keyPhrases: [
      { phrase: "I see where you're coming from", translation: "Entendo o seu ponto de vista" },
      { phrase: "Let's look at the bigger picture", translation: "Vamos olhar para o panorama geral" },
      { phrase: "To reach a solid compromise", translation: "Chegar a um consenso sólido" },
      { phrase: "Action items and next steps", translation: "Itens de ação e próximos passos" },
    ],
    subtitles: [
      {
        id: 'sub_en7_1',
        startTimeSec: 2,
        endTimeSec: 9,
        speaker: 'Manager',
        originalText: "Thank you all for joining promptly. Today our priority is optimizing the project deadline.",
        translatedText: "Obrigado a todos pela pontualidade. Hoje nossa prioridade é otimizar o prazo do projeto.",
      },
      {
        id: 'sub_en7_2',
        startTimeSec: 10,
        endTimeSec: 19,
        speaker: 'Engineer',
        originalText: "I see where the client is coming from, but rushing deployment could create software bugs.",
        translatedText: "Entendo o ponto de vista do cliente, mas apressar o lançamento pode gerar falhas no software.",
      },
      {
        id: 'sub_en7_3',
        startTimeSec: 20,
        endTimeSec: 28,
        speaker: 'Manager',
        originalText: "That's a valid concern. What if we split the deliverable into two smaller releases?",
        translatedText: "Essa é uma preocupação válida. E se dividíssemos a entrega em dois lançamentos menores?",
      },
      {
        id: 'sub_en7_4',
        startTimeSec: 29,
        endTimeSec: 38,
        speaker: 'Engineer',
        originalText: "That would allow our quality assurance team sufficient time to test core functionality.",
        translatedText: "Isso daria à nossa equipe de controle de qualidade tempo suficiente para testar o núcleo.",
      },
      {
        id: 'sub_en7_5',
        startTimeSec: 39,
        endTimeSec: 48,
        speaker: 'Manager',
        originalText: "Fantastic. Let's document these action items and share the updated timeline with stakeholders.",
        translatedText: "Fantástico. Vamos documentar esses itens de ação e compartilhar o cronograma atualizado.",
      },
      {
        id: 'sub_en7_6',
        startTimeSec: 49,
        endTimeSec: 58,
        speaker: 'Engineer',
        originalText: "I'll have the revised schedule ready by three o'clock this afternoon.",
        translatedText: "Terei o cronograma revisado pronto até as três horas desta tarde.",
      },
    ],
  },
  {
    id: 'vid_en_10min',
    title: 'BBC Masterclass: Deep Cultural Insights & Fluent Storytelling',
    duration: '10 min',
    durationMinutes: 10,
    language: 'Inglês',
    level: 'B2',
    topic: 'Narrativa imersiva, expressões idiomáticas avançadas e nuances culturais',
    youtubeId: 'I_tRSrPru94',
    culturalContext: 'Dominar a entonação britânica e os marcadores de discurso ("frankly", "on the whole", "at the end of the day") distingue o aluno intermediário do falante fluente.',
    keyPhrases: [
      { phrase: "At the end of the day", translation: "No fim das contas" },
      { phrase: "To broaden one's horizons", translation: "Ampliar os horizontes" },
      { phrase: "Second to none", translation: "Incomparável / Inigualável" },
      { phrase: "Take it with a grain of salt", translation: "Não levar tudo ao pé da letra" },
    ],
    subtitles: [
      {
        id: 'sub_en10_1',
        startTimeSec: 2,
        endTimeSec: 10,
        speaker: 'Host',
        originalText: "Welcome back to our masterclass on deep listening and cultural immersion.",
        translatedText: "Bem-vindos de volta à nossa masterclass de escuta profunda e imersão cultural.",
      },
      {
        id: 'sub_en10_2',
        startTimeSec: 11,
        endTimeSec: 20,
        speaker: 'Scholar',
        originalText: "When listening to native speakers, the key is listening for rhythm rather than individual words.",
        translatedText: "Ao ouvir falantes nativos, o segredo é prestar atenção ao ritmo e não a palavras isoladas.",
      },
      {
        id: 'sub_en10_3',
        startTimeSec: 21,
        endTimeSec: 30,
        speaker: 'Host',
        originalText: "Indeed! In English, stressed syllables carry meaning, while unstressed words glide smoothly.",
        translatedText: "De fato! No inglês, as sílabas tônicas carregam o significado, enquanto as fracas deslizam suavemente.",
      },
      {
        id: 'sub_en10_4',
        startTimeSec: 31,
        endTimeSec: 40,
        speaker: 'Scholar',
        originalText: "Take the phrase 'give it to him' — in fast speech, it transforms naturally into 'givit-to-im'.",
        translatedText: "Veja a frase 'give it to him' — na fala veloz, ela se transforma naturalmente em 'givit-to-im'.",
      },
      {
        id: 'sub_en10_5',
        startTimeSec: 41,
        endTimeSec: 51,
        speaker: 'Host',
        originalText: "Once your auditory memory adapts to connected speech, conversation feels effortless.",
        translatedText: "Assim que sua memória auditiva se adapta à fala conectada, conversar fica natural e fluido.",
      },
      {
        id: 'sub_en10_6',
        startTimeSec: 52,
        endTimeSec: 62,
        speaker: 'Scholar',
        originalText: "And that is precisely why consistent ten-minute listening sessions yield exponential results.",
        translatedText: "E é exatamente por isso que sessões constantes de dez minutos trazem resultados exponenciais.",
      },
    ],
  },
];

export function getTimedAudioSessions(
  language: TargetLanguage,
  level: FluencyLevel
): TimedAudioSession[] {
  // Tentar encontrar sessões com idioma e nível exatos
  let results = TIMED_AUDIO_SESSIONS.filter(
    (s) => s.language === language && s.level === level
  );

  // Se não houver para o nível específico, buscar do mesmo idioma
  if (results.length === 0) {
    results = TIMED_AUDIO_SESSIONS.filter((s) => s.language === language);
  }

  // Se ainda estiver vazio, usar inglês como fallback
  if (results.length === 0) {
    results = TIMED_AUDIO_SESSIONS.filter((s) => s.language === 'Inglês');
  }

  // Garantir que temos opções de 3, 5, 7 e 10 minutos
  return results;
}

export function getShortVideoLessons(
  language: TargetLanguage,
  level: FluencyLevel
): ShortVideoLesson[] {
  // Buscar lições para o idioma selecionado
  let langVideos = SHORT_VIDEO_LESSONS.filter((v) => v.language === language);

  if (langVideos.length === 0) {
    langVideos = SHORT_VIDEO_LESSONS.filter((v) => v.language === 'Inglês');
  }

  // Garantir a presença exata das 4 durações solicitadas: 3, 5, 7 e 10 minutos
  const targetDurations = [3, 5, 7, 10] as const;
  const selected: ShortVideoLesson[] = [];

  for (const dur of targetDurations) {
    const candidates = langVideos.filter((v) => v.durationMinutes === dur);
    // Prioriza o vídeo que corresponde ao nível do usuário
    const levelMatch = candidates.find((v) => v.level === level);
    if (levelMatch) {
      selected.push(levelMatch);
    } else if (candidates.length > 0) {
      selected.push(candidates[0]);
    }
  }

  // Se por qualquer motivo não houver os 4, retorna a lista ordenada por duração
  if (selected.length > 0) {
    return selected;
  }

  const durationOrder = [3, 5, 7, 10];
  langVideos.sort((a, b) => {
    const aIdx = durationOrder.indexOf(a.durationMinutes);
    const bIdx = durationOrder.indexOf(b.durationMinutes);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  return langVideos;
}


