import {
  TargetLanguage,
  FluencyLevel,
  VocabularyItem,
  ListeningItem,
  FastDrill,
  SubstitutionDrill,
  PronunciationTrap,
  ThinkingStage,
  ImmersionBlock,
} from '../types';
import { getImmersionScheduleFor } from './immersionData';
export { getImmersionScheduleFor } from './immersionData';
import { NATIVE_EXPRESSIONS_BANK } from './nativeExpressionsData';


export interface LevelCurriculum {
  levelTitle: string;
  levelBadge: string;
  expectedOutcome: string;
  estimatedHoursToNext: number;
  vocabItems: VocabularyItem[];
  listeningItems: ListeningItem[];
  fastDrills: FastDrill[];
  substitutionDrills: SubstitutionDrill[];
  pronunciationTraps: PronunciationTrap[];
  thinkingStages: ThinkingStage[];
  immersionSchedule: ImmersionBlock[];
}

export const SUPPORTED_LANGUAGES: { name: TargetLanguage; flag: string; nativeName: string }[] = [
  { name: 'Inglês', flag: '🇺🇸', nativeName: 'English' },
];

export const FLUENCY_LEVELS: { id: FluencyLevel; label: string; desc: string }[] = [
  { id: 'Zero', label: 'Iniciante Zero (0-40h)', desc: 'Primeiros sons, fonética sem vícios e sobrevivência essencial (Fase 1 das 100h)' },
  { id: 'A1', label: 'A1 - Básico Sólido (41-100h)', desc: 'Base inabalável: 300 blocos nativos, reflexo em 5s e diálogos do cotidiano' },
  { id: 'A2', label: 'A2 - Básico Funcional', desc: 'Consegue pedir comida, direções e falar do dia a dia' },
  { id: 'B1', label: 'B1 - Intermediário Autônomo', desc: 'Conversa sem travar sobre temas familiares' },
  { id: 'B2', label: 'B2 - Intermediário Fluente', desc: 'Compreende fala rápida e argumenta espontaneamente' },
  { id: 'C1', label: 'C1 - Fluência Operacional', desc: 'Domínio profissional pleno com nuance e precisão' },
];

// CURRÍCULOS DEDICADOS PARA CADA NÍVEL DE INGLÊS

// CURRÍCULOS DEDICADOS PARA CADA NÍVEL DE INGLÊS

const ENGLISH_ZERO: LevelCurriculum = {
  levelTitle: 'Fundação Absoluta: Primeiros Sons & Sobrevivência Zero (Trilha 100 Horas)',
  levelBadge: 'Nível Zero / Primeiros Passos (40 Horas)',
  expectedOutcome: 'Primeira metade da Trilha de 100 Horas: capacidade de cumprimentar, se apresentar, produzir fonemas sem vícios, pedir socorro comunicativo e dominar os 50 blocos vitais de sobrevivência.',
  estimatedHoursToNext: 40,
  vocabItems: [
    {
      id: 'v_z1',
      wordOrPhrase: 'Hello / Hi, my name is...',
      translation: 'Olá / Oi, meu nome é...',
      phoneticApprox: 'ré-lóu, mai nêim iz',
      category: 'Cumprimentos & Apresentação',
      naturalSentence1: 'Hello! My name is Lucas and I am from Brazil.',
      naturalSentence1Tr: 'Olá! Meu nome é Lucas e sou do Brasil.',
      naturalSentence2: 'Hi, nice to meet you!',
      naturalSentence2Tr: 'Oi, prazer em te conhecer!',
      commonCollocation: 'Hello, my name is',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_z2',
      wordOrPhrase: "I don't understand.",
      translation: 'Eu não entendo / não compreendo.',
      phoneticApprox: 'ai dont ân-der-stænd',
      category: 'Sobrevivência Imediata',
      naturalSentence1: "I'm sorry, I don't understand that.",
      naturalSentence1Tr: 'Desculpe, eu não entendo isso.',
      naturalSentence2: "I don't understand what you said.",
      naturalSentence2Tr: 'Não entendo o que você disse.',
      commonCollocation: "Sorry, I don't understand",
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_z3',
      wordOrPhrase: 'Could you speak slowly, please?',
      translation: 'Você poderia falar devagar, por favor?',
      phoneticApprox: 'cud iu spiik slôu-li, pliiz',
      category: 'Sobrevivência Imediata',
      naturalSentence1: 'Could you speak slowly, please? I am learning English.',
      naturalSentence1Tr: 'Você poderia falar devagar, por favor? Estou aprendendo inglês.',
      naturalSentence2: 'Could you repeat that more slowly?',
      naturalSentence2Tr: 'Você poderia repetir isso mais devagar?',
      commonCollocation: 'speak slowly, please',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_z4',
      wordOrPhrase: 'Where is the bathroom?',
      translation: 'Onde fica o banheiro?',
      phoneticApprox: 'uér iz dê béth-rum',
      category: 'Deslocamento & Emergência',
      naturalSentence1: 'Excuse me, where is the bathroom, please?',
      naturalSentence1Tr: 'Com licença, onde fica o banheiro, por favor?',
      naturalSentence2: 'Where is the exit?',
      naturalSentence2Tr: 'Onde fica a saída?',
      commonCollocation: 'Where is the bathroom / exit',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_z5',
      wordOrPhrase: 'How much is this?',
      translation: 'Quanto custa isto?',
      phoneticApprox: 'ráu mâtch iz diz',
      category: 'Compras & Preços',
      naturalSentence1: 'Excuse me, how much is this bottle of water?',
      naturalSentence1Tr: 'Com licença, quanto custa esta garrafa de água?',
      naturalSentence2: 'How much is the ticket?',
      naturalSentence2Tr: 'Quanto custa o bilhete?',
      commonCollocation: 'How much is this / that',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_z6',
      wordOrPhrase: 'Yes, please / No, thank you.',
      translation: 'Sim, por favor / Não, obrigado(a).',
      phoneticApprox: 'iés pliiz / nôu thæŋk iu',
      category: 'Polidez Básica',
      naturalSentence1: 'Would you like some water? — Yes, please.',
      naturalSentence1Tr: 'Gostaria de um pouco de água? — Sim, por favor.',
      naturalSentence2: 'Do you need a bag? — No, thank you, I have one.',
      naturalSentence2Tr: 'Precisa de sacola? — Não, obrigado, já tenho uma.',
      commonCollocation: 'Yes, please / No, thanks',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
  ],
  listeningItems: [
    {
      id: 'l_z1',
      level: 1,
      spokenAudioText: 'Hello! Nice to meet you. How are you today?',
      translation: 'Olá! Prazer em te conhecer. Como você está hoje?',
      speed: 0.85,
      connectedSpeechBreakdown: '"Nice to meet you" junta o "t" com "y" virando som de "tchu" (Nice to mee-tchoo).',
      reductionFocus: 'Nice to mee-tchoo.',
      shadowingPrompt: 'Fale sorrindo e com calma.',
    },
    {
      id: 'l_z2',
      level: 1,
      spokenAudioText: 'Excuse me, where are you from?',
      translation: 'Com licença, de onde você é?',
      speed: 0.85,
      connectedSpeechBreakdown: '"Where are" se funde suavemente: "Wher-are you from?"',
      reductionFocus: 'Where are you from?',
      shadowingPrompt: 'Repita com entonação descendente de pergunta amigável.',
    },
    {
      id: 'l_z3',
      level: 1,
      spokenAudioText: 'Have a great day and see you later!',
      translation: 'Tenha um ótimo dia e até mais tarde!',
      speed: 0.9,
      connectedSpeechBreakdown: '"Have a" conecta: "Hav-a". "See you" vira "See-ya".',
      reductionFocus: 'Hav-a great day!',
      shadowingPrompt: 'Cadência leve e positiva.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_z1',
      promptQuestion: "What is your name?",
      promptTranslation: 'Qual é o seu nome?',
      suggestedPattern: "My name is [Your Name].",
      sampleNaturalAnswer: "My name is Carlos.",
      timeLimitSec: 5,
    },
    {
      id: 'fd_z2',
      promptQuestion: "Where are you from?",
      promptTranslation: 'De onde você é?',
      suggestedPattern: "I am from [City or Country].",
      sampleNaturalAnswer: "I am from São Paulo, Brazil.",
      timeLimitSec: 5,
    },
    {
      id: 'fd_z3',
      promptQuestion: "How are you today?",
      promptTranslation: 'Como você está hoje?',
      suggestedPattern: "I am good, thank you! And you?",
      sampleNaturalAnswer: "I'm doing well, thank you!",
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_z1',
      basePattern: 'My name is ___ and I live in ___.',
      basePatternTr: 'Meu nome é ___ e eu moro em ___.',
      variations: [
        {
          slot: 'Ana / Curitiba',
          replacement: 'Ana / Curitiba',
          fullSentence: 'My name is Ana and I live in Curitiba.',
          translation: 'Meu nome é Ana e moro em Curitiba.',
        },
        {
          slot: 'Pedro / São Paulo',
          replacement: 'Pedro / São Paulo',
          fullSentence: 'My name is Pedro and I live in São Paulo.',
          translation: 'Meu nome é Pedro e moro em São Paulo.',
        },
      ],
    },
  ],
  pronunciationTraps: [
    {
      id: 'pt_z1',
      name: 'O "H" aspirado (Hello, House, Help) vs som mudo em português',
      targetSound: 'Som de suspiro na garganta /h/',
      whatBraziliansDo: 'Tendem a não pronunciar o H ou transformá-lo em R carioca forte demais.',
      whatYouShouldDo: 'Solte um ar quente e suave da garganta, como se estivesse embaçando um espelho.',
      mouthGuide: 'Boca aberta sem tocar a língua em lugar algum.',
      incorrectExample: 'Falar "Ello" ou "Ouse" (sem som)',
      correctExample: 'Hello [həˈloʊ], House [haʊs]',
      minimalPairs: [
        { wordA: 'Hat', wordB: 'At', meaningA: 'chapéu (com H)', meaningB: 'em/no (sem H)' },
      ],
      practiceWords: ['Hello', 'House', 'Help', 'Hot', 'Happy'],
    },
  ],
  thinkingStages: [
    {
      stageNumber: 1,
      title: 'Etapa 1: Nomeação Imediata de Sobrevivência',
      description: 'Nomeie os 5 itens mais próximos sem pensar na palavra em português.',
      items: [
        {
          id: 'tz1',
          stimulus: 'Garrafa de água',
          promptHint: 'Diga imediatamente:',
          naturalExpression: 'Water bottle',
          whyItMatters: 'Conecta o objeto real ao som sem tradução.',
        },
      ],
    },
  ],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'Zero'),
};

const ENGLISH_A1: LevelCurriculum = {
  levelTitle: 'Fundação & Sobrevivência Ativa 80/20 (Trilha 100 Horas)',
  levelBadge: 'Nível A1 / Essencial Cotidiano (60 Horas)',
  expectedOutcome: 'Consolidação das 100 horas de fundação sólida: expressar necessidades imediatas, pedir comida, comprar produtos, reflexo oral em até 5s e diálogos autônomos.',
  estimatedHoursToNext: 60,
  vocabItems: [
    {
      id: 'v_a1_1',
      wordOrPhrase: 'I need to...',
      translation: 'Eu preciso...',
      phoneticApprox: 'ai niid tu',
      category: 'Ações Imediatas',
      naturalSentence1: 'I need to check my schedule first.',
      naturalSentence1Tr: 'Preciso checar minha agenda primeiro.',
      naturalSentence2: 'I need to make a quick phone call.',
      naturalSentence2Tr: 'Preciso fazer uma ligação rápida.',
      commonCollocation: 'I need to know / go',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_a1_2',
      wordOrPhrase: 'Could you please...?',
      translation: 'Você poderia, por favor...?',
      phoneticApprox: 'cud iu pliiz',
      category: 'Cortesia & Pedidos',
      naturalSentence1: 'Could you please repeat that more slowly?',
      naturalSentence1Tr: 'Você poderia por favor repetir isso mais devagar?',
      naturalSentence2: 'Could you please send me the location?',
      naturalSentence2Tr: 'Você poderia me enviar a localização?',
      commonCollocation: 'Could you please help / tell',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_a1_3',
      wordOrPhrase: "I'm looking for...",
      translation: 'Estou procurando...',
      phoneticApprox: 'aim lúking fór',
      category: 'Deslocamento & Compras',
      naturalSentence1: "I'm looking for the nearest subway station.",
      naturalSentence1Tr: 'Estou procurando a estação de metrô mais próxima.',
      naturalSentence2: "I'm looking for someone who speaks Portuguese.",
      naturalSentence2Tr: 'Estou procurando alguém que fale português.',
      commonCollocation: 'looking for the way / bathroom',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_a1_4',
      wordOrPhrase: 'In my opinion...',
      translation: 'Na minha opinião...',
      phoneticApprox: 'in mai opinian',
      category: 'Expressar Opinião',
      naturalSentence1: 'In my opinion, this is the easiest way.',
      naturalSentence1Tr: 'Na minha opinião, esta é a forma mais fácil.',
      naturalSentence2: 'In my opinion, we should wait a bit.',
      naturalSentence2Tr: 'Na minha opinião, deveríamos esperar um pouco.',
      commonCollocation: 'In my opinion, it makes sense',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_a1_5',
      wordOrPhrase: 'How long does it take?',
      translation: 'Quanto tempo leva?',
      phoneticApprox: 'ráu lóng daz it têik',
      category: 'Tempo & Deslocamento',
      naturalSentence1: 'How long does it take to get downtown?',
      naturalSentence1Tr: 'Quanto tempo leva para chegar ao centro?',
      naturalSentence2: 'How long does it take to finish this?',
      naturalSentence2Tr: 'Quanto tempo leva para terminar isso?',
      commonCollocation: 'How long does it take to walk',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_a1_6',
      wordOrPhrase: "I'd like to have...",
      translation: 'Eu gostaria de pedir/ter...',
      phoneticApprox: 'aid láik tu ræv',
      category: 'Restaurante & Pedidos',
      naturalSentence1: "I'd like to have a black coffee and some water.",
      naturalSentence1Tr: 'Eu gostaria de um café preto e um pouco de água.',
      naturalSentence2: "I'd like to have the check, please.",
      naturalSentence2Tr: 'Eu gostaria da conta, por favor.',
      commonCollocation: "I'd like to have a table for two",
      isEssential50: true,
      masteryStatus: 'dominada',
    },
  ],
  listeningItems: [
    {
      id: 'l_a1_1',
      level: 1,
      spokenAudioText: 'What are you going to do today?',
      translation: 'O que você vai fazer hoje?',
      speed: 1.0,
      connectedSpeechBreakdown: '"What are you" vira "Whatcha" ou "Waddya". "going to" vira "gonna".',
      reductionFocus: 'Whatcha gonna do today?',
      shadowingPrompt: 'Repita com ritmo: [Waddya gonna do today?]',
    },
    {
      id: 'l_a1_2',
      level: 2,
      spokenAudioText: 'I want to grab a cup of coffee.',
      translation: 'Eu quero pegar uma xícara de café.',
      speed: 1.0,
      connectedSpeechBreakdown: '"want to" vira "wanna". "cup of" vira "cup-a".',
      reductionFocus: 'I wanna grab a cuppa coffee.',
      shadowingPrompt: 'Shadowing rápido: Conecte "grab-a" sem pausas.',
    },
    {
      id: 'l_a1_3',
      level: 2,
      spokenAudioText: 'Could you tell him that I called?',
      translation: 'Você poderia dizer a ele que liguei?',
      speed: 1.0,
      connectedSpeechBreakdown: '"Could you" junta o "d" com o "y" formando som de "dj" (cud-joo). O "h" de "him" desaparece ("tell-im").',
      reductionFocus: 'Couldja tell-im that I called?',
      shadowingPrompt: 'Enfatize "called" no final e deslize suavemente no início.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_a1_1',
      promptQuestion: 'Where do you want to go this weekend?',
      promptTranslation: 'Onde você quer ir neste fim de semana?',
      suggestedPattern: 'I want to go to [Place] with [Person].',
      sampleNaturalAnswer: 'I want to go to the beach with my family.',
      timeLimitSec: 5,
    },
    {
      id: 'fd_a1_2',
      promptQuestion: 'What do you need to buy at the supermarket?',
      promptTranslation: 'O que você precisa comprar no supermercado?',
      suggestedPattern: 'I need to buy some [items].',
      sampleNaturalAnswer: 'I need to buy bread, milk, and fresh fruit.',
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_a1_1',
      basePattern: 'I would like to ___ because ___.',
      basePatternTr: 'Eu gostaria de [fazer algo] porque [motivo].',
      variations: [
        {
          slot: 'practice my English / want to travel',
          replacement: 'praticar meu inglês / quero viajar',
          fullSentence: 'I would like to practice my English because I want to travel soon.',
          translation: 'Gostaria de praticar meu inglês porque quero viajar em breve.',
        },
      ],
    },
  ],
  pronunciationTraps: [
    {
      id: 'pt_a1_1',
      name: 'O "i" de apoio no final das palavras',
      targetSound: 'Consoante muda final (/k/, /t/, /d/, /p/)',
      whatBraziliansDo: 'Adicionam som de "i" (ex: "Facebook-i", "like-i", "bad-i").',
      whatYouShouldDo: 'Corte o som bruscamente prendendo a respiração na garganta ou fechando os lábios.',
      mouthGuide: 'Encoste a língua no céu da boca para o /t/ ou /d/ e congele sem soltar voz.',
      incorrectExample: 'Like-ee / Face-book-ee',
      correctExample: 'Like [laɪk] / Facebook [ˈfeɪs.bʊk]',
      minimalPairs: [],
      practiceWords: ['Stop', 'Check', 'Night', 'Good', 'Job'],
    },
  ],
  thinkingStages: [],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'A1'),
};

const ENGLISH_A2: LevelCurriculum = {
  levelTitle: 'Básico Funcional: Viagens, Passado & Autonomia',
  levelBadge: 'Nível A2 / Viagens & Experiências',
  expectedOutcome: 'Contar histórias no passado simples, pedir direções na rua, fazer check-in no aeroporto, descrever planos e resolver imprevistos em hotéis.',
  estimatedHoursToNext: 50,
  vocabItems: [
    {
      id: 'v_a2_1',
      wordOrPhrase: 'I used to...',
      translation: 'Eu costumava / Tinha o hábito de...',
      phoneticApprox: 'ai ius-tu',
      category: 'Hábitos do Passado',
      naturalSentence1: 'I used to live in a small town, but now I live in the capital.',
      naturalSentence1Tr: 'Eu costumava morar numa cidade pequena, mas agora moro na capital.',
      naturalSentence2: 'I used to drink soda, but now I prefer water.',
      naturalSentence2Tr: 'Eu costumava beber refrigerante, mas agora prefiro água.',
      commonCollocation: 'I used to think / live / work',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_a2_2',
      wordOrPhrase: 'Last weekend I went to...',
      translation: 'No fim de semana passado eu fui para...',
      phoneticApprox: 'læst uii-kend ai uent tu',
      category: 'Narrativa no Passado',
      naturalSentence1: 'Last weekend I went to a quiet beach with friends.',
      naturalSentence1Tr: 'No fim de semana passado fui para uma praia tranquila com amigos.',
      naturalSentence2: 'Last weekend I went to visit my parents.',
      naturalSentence2Tr: 'No último fim de semana fui visitar meus pais.',
      commonCollocation: 'Last weekend I had / went',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_a2_3',
      wordOrPhrase: "I'm planning to...",
      translation: 'Estou planejando...',
      phoneticApprox: 'aim plæ-ning tu',
      category: 'Planos & Futuro',
      naturalSentence1: "I'm planning to take a two-week vacation in July.",
      naturalSentence1Tr: 'Estou planejando tirar duas semanas de férias em julho.',
      naturalSentence2: "I'm planning to change my daily routine.",
      naturalSentence2Tr: 'Estou planejando mudar minha rotina diária.',
      commonCollocation: 'planning to visit / stay',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_a2_4',
      wordOrPhrase: 'How do I get to...?',
      translation: 'Como eu chego até...?',
      phoneticApprox: 'ráu du ai get tu',
      category: 'Direções & Viagem',
      naturalSentence1: 'Excuse me, how do I get to terminal two from here?',
      naturalSentence1Tr: 'Com licença, como chego ao terminal dois a partir daqui?',
      naturalSentence2: 'How do I get to the city center by train?',
      naturalSentence2Tr: 'Como chego ao centro da cidade de trem?',
      commonCollocation: 'how do I get to the station / gate',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_a2_5',
      wordOrPhrase: 'It took me about [time] to...',
      translation: 'Levei cerca de [tempo] para...',
      phoneticApprox: 'it tuk mi ə-báut',
      category: 'Tempo & Experiência',
      naturalSentence1: 'It took me about forty minutes to find parking.',
      naturalSentence1Tr: 'Levei cerca de quarenta minutos para encontrar vaga.',
      naturalSentence2: 'It took me about an hour to arrive here.',
      naturalSentence2Tr: 'Levei cerca de uma hora para chegar aqui.',
      commonCollocation: 'it took me an hour / a week',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_a2_6',
      wordOrPhrase: 'By the way...',
      translation: 'A propósito / Por falar nisso...',
      phoneticApprox: 'bai dê uêi',
      category: 'Transição de Conversa',
      naturalSentence1: 'By the way, did you receive the confirmation email?',
      naturalSentence1Tr: 'A propósito, você recebeu o e-mail de confirmação?',
      naturalSentence2: 'By the way, what time is our reservation?',
      naturalSentence2Tr: 'Por falar nisso, que horas é a nossa reserva?',
      commonCollocation: 'By the way, did you know',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
  ],
  listeningItems: [
    {
      id: 'l_a2_1',
      level: 2,
      spokenAudioText: 'Where did you go yesterday afternoon?',
      translation: 'Onde você foi ontem à tarde?',
      speed: 1.0,
      connectedSpeechBreakdown: '"Where did you" conecta em "Where-dja" com som de "dj".',
      reductionFocus: "Where-dja go yesterday?",
      shadowingPrompt: 'Enfatize "yesterday" com ritmo dinâmico.',
    },
    {
      id: 'l_a2_2',
      level: 3,
      spokenAudioText: "I'm gonna be out of town this weekend.",
      translation: 'Eu vou estar fora da cidade neste fim de semana.',
      speed: 1.05,
      connectedSpeechBreakdown: '"out of town" conecta com Flap T virando "ouda-town".',
      reductionFocus: "Out-a-town.",
      shadowingPrompt: 'Conecte as três palavras em um bloco só.',
    },
    {
      id: 'l_a2_3',
      level: 3,
      spokenAudioText: 'Did you get a chance to check your luggage?',
      translation: 'Você teve a chance de despachar sua bagagem?',
      speed: 1.05,
      connectedSpeechBreakdown: '"Did you get a" vira "Didja get-a".',
      reductionFocus: 'Didja get-a chance...',
      shadowingPrompt: 'Entonação de pergunta informal e rápida.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_a2_1',
      promptQuestion: 'What did you do last Saturday night?',
      promptTranslation: 'O que você fez no último sábado à noite?',
      suggestedPattern: 'Last Saturday I [past verb] and then I [past verb].',
      sampleNaturalAnswer: 'Last Saturday I cooked dinner at home and watched a movie.',
      timeLimitSec: 5,
    },
    {
      id: 'fd_a2_2',
      promptQuestion: 'How long did it take you to get ready this morning?',
      promptTranslation: 'Quanto tempo você levou para se arrumar hoje de manhã?',
      suggestedPattern: 'It took me about [minutes] to get ready.',
      sampleNaturalAnswer: 'It took me about twenty-five minutes to shower and eat breakfast.',
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_a2_1',
      basePattern: 'I used to ___, but now I ___.',
      basePatternTr: 'Eu costumava [hábito], mas agora eu [hábito atual].',
      variations: [
        {
          slot: 'wake up late / wake up early',
          replacement: 'acordar tarde / acordo cedo',
          fullSentence: 'I used to wake up late, but now I wake up early to exercise.',
          translation: 'Eu costumava acordar tarde, mas agora acordo cedo para me exercitar.',
        },
      ],
    },
  ],
  pronunciationTraps: [],
  thinkingStages: [],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'A2'),
};

const ENGLISH_B1: LevelCurriculum = {
  levelTitle: 'Intermediário Autônomo: Opinião, Conexão & Histórias',
  levelBadge: 'Nível B1 / Independência Comunicativa',
  expectedOutcome: 'Manter conversas de mais de 15 minutos sem travar, usar conectivos ("although", "on the other hand"), justificar decisões e contornar vocabulário desconhecido.',
  estimatedHoursToNext: 60,
  vocabItems: [
    {
      id: 'v_b1_1',
      wordOrPhrase: 'In my opinion, it makes a lot of sense.',
      translation: 'Na minha opinião, faz muito sentido.',
      phoneticApprox: 'in mai ə-pɪn-jən, it meɪks ə lɑːt əv sɛns',
      category: 'Expressar Opinião',
      naturalSentence1: "In my opinion, it makes a lot of sense to test this first.",
      naturalSentence1Tr: 'Na minha opinião, faz muito sentido testar isso primeiro.',
      naturalSentence2: "Does that make sense to you?",
      naturalSentence2Tr: 'Isso faz sentido para você?',
      commonCollocation: 'makes a lot of sense',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_b1_2',
      wordOrPhrase: 'Even though it was challenging...',
      translation: 'Embora tenha sido desafiador / Apesar de ter sido...',
      phoneticApprox: 'ii-vən ðôu it uaz tchæ-lən-dʒing',
      category: 'Conectivos & Contraste',
      naturalSentence1: 'Even though it was raining, we decided to walk.',
      naturalSentence1Tr: 'Embora estivesse chovendo, decidimos caminhar.',
      naturalSentence2: 'Even though I was tired, I finished the lesson.',
      naturalSentence2Tr: 'Apesar de estar cansado, terminei a lição.',
      commonCollocation: 'Even though it was hard / late',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_b1_3',
      wordOrPhrase: 'On the one hand... on the other hand...',
      translation: 'Por um lado... por outro lado...',
      phoneticApprox: 'ɑːn ðə uʌn hænd... ɑːn ði ʌ-ðər hænd',
      category: 'Ponderação & Debate',
      naturalSentence1: 'On the one hand it is cheaper, but on the other hand it takes longer.',
      naturalSentence1Tr: 'Por um lado é mais barato, mas por outro lado demora mais.',
      naturalSentence2: 'On the one hand I want to rest, on the other hand I need to work.',
      naturalSentence2Tr: 'Por um lado quero descansar, por outro preciso trabalhar.',
      commonCollocation: 'On the other hand',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_b1_4',
      wordOrPhrase: "I couldn't agree more!",
      translation: 'Não poderia concordar mais! / Concordo plenamente!',
      phoneticApprox: 'ai cú-dənt ə-griii móor',
      category: 'Concordância & Afinidade',
      naturalSentence1: "That is exactly right, I couldn't agree more with your point.",
      naturalSentence1Tr: 'Exatamente isso, concordo plenamente com o seu ponto.',
      naturalSentence2: "I couldn't agree more, we need a better solution.",
      naturalSentence2Tr: 'Não poderia concordar mais, precisamos de uma solução melhor.',
      commonCollocation: "I couldn't agree more with you",
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_b1_5',
      wordOrPhrase: 'As a matter of fact...',
      translation: 'Na verdade / De fato...',
      phoneticApprox: 'æz ə mæ-tər əv fækt',
      category: 'Enfatizar Fatos',
      naturalSentence1: 'As a matter of fact, I was just talking about that yesterday.',
      naturalSentence1Tr: 'De fato, eu estava justamente falando sobre isso ontem.',
      naturalSentence2: 'As a matter of fact, we have already started.',
      naturalSentence2Tr: 'Na verdade, nós já começamos.',
      commonCollocation: 'as a matter of fact, yes',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_b1_6',
      wordOrPhrase: "What I'm trying to say is...",
      translation: 'O que estou tentando dizer é...',
      phoneticApprox: 'uát aim trai-ing tu sêi iz',
      category: 'Clarificação de Ideias',
      naturalSentence1: "What I'm trying to say is that quality matters more than speed.",
      naturalSentence1Tr: 'O que estou tentando dizer é que qualidade importa mais que velocidade.',
      naturalSentence2: "What I'm trying to say is we should reconsider.",
      naturalSentence2Tr: 'O que estou tentando dizer é que deveríamos reconsiderar.',
      commonCollocation: 'What I mean is / trying to say',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
  ],
  listeningItems: [
    {
      id: 'l_b1_1',
      level: 3,
      spokenAudioText: 'I should have known about it earlier.',
      translation: 'Eu deveria saber disso antes.',
      speed: 1.05,
      connectedSpeechBreakdown: '"should have" reduz para "shoulda". "about it" tem Flap T: "aboud-it".',
      reductionFocus: 'I shoulda known aboud-it earlier.',
      shadowingPrompt: 'Imite a melodia descendente típica de lamentação em inglês.',
    },
    {
      id: 'l_b1_2',
      level: 4,
      spokenAudioText: 'If I were you, I would have done the exact same thing.',
      translation: 'Se eu fosse você, teria feito exatamente a mesma coisa.',
      speed: 1.1,
      connectedSpeechBreakdown: '"would have" vira "woulda". "exact same" elide o "t".',
      reductionFocus: 'I woulda done the exac-same thing.',
      shadowingPrompt: 'Ritmo rápido sem pausas entre as palavras.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_b1_1',
      promptQuestion: 'What do you think is the biggest advantage of remote work?',
      promptTranslation: 'Qual você acha que é a maior vantagem do trabalho remoto?',
      suggestedPattern: 'In my opinion, the biggest advantage is [X] because [reason].',
      sampleNaturalAnswer: 'In my opinion, the biggest advantage is saving two hours of commute every day.',
      timeLimitSec: 5,
    },
    {
      id: 'fd_b1_2',
      promptQuestion: 'Would you rather live near the beach or in the mountains, and why?',
      promptTranslation: 'Você prefere morar perto da praia ou nas montanhas, e por quê?',
      suggestedPattern: 'I would definitely prefer [X] because it offers [benefit].',
      sampleNaturalAnswer: 'I would definitely prefer the mountains because it is calmer and fresher.',
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_b1_1',
      basePattern: 'Even though ___, I still believe that ___.',
      basePatternTr: 'Embora [fato], eu ainda acredito que [opinião].',
      variations: [
        {
          slot: 'it was difficult / it was worth it',
          replacement: 'foi difícil / valeu a pena',
          fullSentence: 'Even though it was difficult, I still believe that it was completely worth it.',
          translation: 'Embora tenha sido difícil, ainda acredito que valeu totalmente a pena.',
        },
      ],
    },
  ],
  pronunciationTraps: [],
  thinkingStages: [],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'B1'),
};

const ENGLISH_B2: LevelCurriculum = {
  levelTitle: 'Intermediário Fluente: Trabalho, Argumentação & Fala Conectada Rápida',
  levelBadge: 'Nível B2 / Fluência Corporativa & Social',
  expectedOutcome: 'Participar de reuniões e debates com confiança, dominar phrasal verbs corporativos ("touch base", "figure out", "wrap up"), entender nativos em velocidade real 1.0x-1.2x.',
  estimatedHoursToNext: 70,
  vocabItems: [
    {
      id: 'v_b2_1',
      wordOrPhrase: 'To touch base on...',
      translation: 'Fazer um alinhamento rápido / Conversar sobre...',
      phoneticApprox: 'tu tʌtʃ beɪs ɑːn',
      category: 'Negócios & Trabalho',
      naturalSentence1: "Let's touch base on the budget tomorrow morning.",
      naturalSentence1Tr: 'Vamos nos alinhar sobre o orçamento amanhã de manhã.',
      naturalSentence2: "I just wanted to touch base regarding your email.",
      naturalSentence2Tr: 'Só queria dar um retorno rápido a respeito do seu e-mail.',
      commonCollocation: 'touch base with you / on this',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_b2_2',
      wordOrPhrase: 'To take into account...',
      translation: 'Levar em consideração / Ponderar...',
      phoneticApprox: 'tu teɪk ˈɪntuː əˈkaʊnt',
      category: 'Tomada de Decisão',
      naturalSentence1: "We need to take all customer feedback into account before launching.",
      naturalSentence1Tr: 'Precisamos levar em consideração todo o feedback dos clientes antes de lançar.',
      naturalSentence2: "Did you take the currency fluctuation into account?",
      naturalSentence2Tr: 'Você levou a flutuação cambial em conta?',
      commonCollocation: 'take into account / consideration',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_b2_3',
      wordOrPhrase: 'As far as I can tell...',
      translation: 'Pelo que posso perceber / Até onde sei...',
      phoneticApprox: 'æz fɑːr æz aɪ kæn tɛl',
      category: 'Argumentação & Nuance',
      naturalSentence1: "As far as I can tell, the project is right on schedule.",
      naturalSentence1Tr: 'Pelo que posso dizer, o projeto está perfeitamente no prazo.',
      naturalSentence2: "As far as I can tell, there's no easy solution.",
      naturalSentence2Tr: 'Pelo que vejo, não há solução simples.',
      commonCollocation: 'As far as I know / can tell',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_b2_4',
      wordOrPhrase: 'To figure out...',
      translation: 'Descobrir / Entender / Achar uma solução para...',
      phoneticApprox: 'tu fɪ-ɡjər áut',
      category: 'Resolução de Problemas',
      naturalSentence1: 'We need to figure out why the conversion dropped this month.',
      naturalSentence1Tr: 'Precisamos descobrir por que a conversão caiu este mês.',
      naturalSentence2: "Don't worry, we'll figure it out together.",
      naturalSentence2Tr: 'Não se preocupe, vamos descobrir uma saída juntos.',
      commonCollocation: 'figure out how / why',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_b2_5',
      wordOrPhrase: 'Bottom line is...',
      translation: 'O ponto principal é / Em suma...',
      phoneticApprox: 'bɑː-təm lain iz',
      category: 'Síntese Executiva',
      naturalSentence1: 'Bottom line is, we have to deliver this on time.',
      naturalSentence1Tr: 'O ponto principal é: temos que entregar isso no prazo.',
      naturalSentence2: 'Bottom line is that our customers love the new design.',
      naturalSentence2Tr: 'O que realmente importa é que nossos clientes adoraram o novo design.',
      commonCollocation: 'Bottom line is that',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_b2_6',
      wordOrPhrase: 'To wrap things up...',
      translation: 'Para encerrar / Finalizar a sessão...',
      phoneticApprox: 'tu ræp thiŋz ʌp',
      category: 'Reuniões & Condução',
      naturalSentence1: "To wrap things up, let's summarize the key action items.",
      naturalSentence1Tr: 'Para encerrar, vamos resumir as principais ações práticas.',
      naturalSentence2: "Let's wrap up this meeting so everyone can get back to work.",
      naturalSentence2Tr: 'Vamos finalizar esta reunião para que todos possam voltar ao trabalho.',
      commonCollocation: 'wrap up the meeting / project',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
  ],
  listeningItems: [
    {
      id: 'l_b2_1',
      level: 4,
      spokenAudioText: "Bottom line is, we've got to cut down on extraneous costs.",
      translation: 'O ponto principal é: temos que cortar custos desnecessários.',
      speed: 1.15,
      connectedSpeechBreakdown: '"Bottom line is" conecta sem corte. "got to" vira "gotta".',
      reductionFocus: 'Bottom-line-is we gotta cut down on extraneous costs.',
      shadowingPrompt: 'Ritmo executivo confiante e fluido.',
    },
    {
      id: 'l_b2_2',
      level: 5,
      spokenAudioText: "I wouldn't have bothered you if it weren't essential.",
      translation: 'Eu não teria te incomodado se não fosse essencial.',
      speed: 1.15,
      connectedSpeechBreakdown: '"wouldn\'t have" vira "wooden-av". "if it weren\'t" conecta com flap T.',
      reductionFocus: "I wooden-av bothered you if it weren't essential.",
      shadowingPrompt: 'Treine a entonação de justificativa profissional.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_b2_1',
      promptQuestion: 'How would you handle a disagreement with a senior stakeholder?',
      promptTranslation: 'Como você lidaria com uma discordância com um stakeholder sênior?',
      suggestedPattern: "I'd schedule a brief one-on-one meeting to hear their concerns and propose a data-backed alternative.",
      sampleNaturalAnswer: "I'd schedule a brief chat to align our expectations and find common ground.",
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_b2_1',
      basePattern: 'Had I known that ___, I would have ___.',
      basePatternTr: 'Se eu soubesse que [fato], eu teria [ação].',
      variations: [
        {
          slot: 'the deadline was pushed / paced myself differently',
          replacement: 'o prazo foi adiado / organizado meu ritmo de forma diferente',
          fullSentence: 'Had I known the deadline was pushed, I would have paced myself differently.',
          translation: 'Se eu soubesse que o prazo fora adiado, teria trabalhado com outro ritmo.',
        },
      ],
    },
  ],
  pronunciationTraps: [],
  thinkingStages: [],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'B2'),
};

const ENGLISH_C1: LevelCurriculum = {
  levelTitle: 'Fluência Operacional: Sofisticação, Nuance & Precisão Nativa',
  levelBadge: 'Nível C1 / Domínio Pleno Profissional',
  expectedOutcome: 'Comunicação executiva de alto nível, ironia, humor sutil, linguagem diplomática indireta, vocabulário estratégico e fluência espontânea sem esforço mental.',
  estimatedHoursToNext: 90,
  vocabItems: [
    {
      id: 'v_c1_1',
      wordOrPhrase: "To play devil's advocate...",
      translation: 'Fazer o papel de advogado do diabo / Questionar para testar a tese...',
      phoneticApprox: 'tu pleɪ ˈdɛv.əlz ˈæd.və.kət',
      category: 'Debate de Alto Nível',
      naturalSentence1: "Just to play devil's advocate, what happens if our competitor cuts their pricing in half?",
      naturalSentence1Tr: 'Só para fazer o papel de advogado do diabo, o que acontece se o concorrente cortar o preço pela metade?',
      naturalSentence2: "I'm not against the idea, I'm just playing devil's advocate.",
      naturalSentence2Tr: 'Não sou contra a ideia, só estou testando os pontos fracos.',
      commonCollocation: "play devil's advocate for a moment",
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_c1_2',
      wordOrPhrase: 'To strike a delicate balance...',
      translation: 'Encontrar um equilíbrio sutil / Conciliar dois lados opostos...',
      phoneticApprox: 'tu straɪk ə ˈdɛl.ə.kət ˈbæl.əns',
      category: 'Estratégia & Liderança',
      naturalSentence1: 'We need to strike a balance between innovation and immediate profitability.',
      naturalSentence1Tr: 'Precisamos encontrar um equilíbrio entre inovação e rentabilidade imediata.',
      naturalSentence2: 'It is tricky to strike the right balance in hybrid work.',
      naturalSentence2Tr: 'É delicado encontrar o equilíbrio certo no trabalho híbrido.',
      commonCollocation: 'strike a balance between X and Y',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_c1_3',
      wordOrPhrase: 'Notwithstanding the obvious risks...',
      translation: 'Não obstante / Apesar dos riscos evidentes...',
      phoneticApprox: 'ˌnɑːt.wɪðˈstæn.dɪŋ',
      category: 'Linguagem Diplomática & Formal',
      naturalSentence1: 'Notwithstanding the short deadline, the team delivered an outstanding result.',
      naturalSentence1Tr: 'Não obstante o prazo exíguo, a equipe entregou um resultado excepcional.',
      naturalSentence2: 'Notwithstanding the challenges, we remain confident.',
      naturalSentence2Tr: 'Apesar dos desafios, continuamos confiantes.',
      commonCollocation: 'Notwithstanding the fact that',
      isEssential50: true,
      masteryStatus: 'nova',
    },
    {
      id: 'v_c1_4',
      wordOrPhrase: 'To read between the lines...',
      translation: 'Ler nas entrelinhas / Captar a intenção implícita...',
      phoneticApprox: 'tu riid bi-tuiin dê lainz',
      category: 'Comunicação Indireta & Nuance',
      naturalSentence1: "If you read between the lines, they're subtly signaling a shift in leadership.",
      naturalSentence1Tr: 'Se você ler nas entrelinhas, eles estão sutilmente sinalizando uma mudança de liderança.',
      naturalSentence2: "You have to read between the lines in international diplomacy.",
      naturalSentence2Tr: 'É preciso ler nas entrelinhas na diplomacia internacional.',
      commonCollocation: 'reading between the lines',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
    {
      id: 'v_c1_5',
      wordOrPhrase: 'To leave no stone unturned...',
      translation: 'Não poupar esforços / Esgotar todas as possibilidades...',
      phoneticApprox: 'tu liiv nôu stôun ʌn-tɜːrnd',
      category: 'Expressões Idiomáticas Clássicas',
      naturalSentence1: 'We will leave no stone unturned until we identify the root cause of the bug.',
      naturalSentence1Tr: 'Não pouparemos esforços até identificar a causa raiz da falha.',
      naturalSentence2: 'They left no stone unturned during the due diligence.',
      naturalSentence2Tr: 'Eles examinaram absolutamente tudo durante a auditoria.',
      commonCollocation: 'leave no stone unturned',
      isEssential50: true,
      masteryStatus: 'aprendendo',
    },
    {
      id: 'v_c1_6',
      wordOrPhrase: 'It boils down to...',
      translation: 'Tudo se resume a / No fim das contas a questão é...',
      phoneticApprox: 'it bɔɪlz daun tu',
      category: 'Conclusão & Essência',
      naturalSentence1: 'Ultimately, success in this market boils down to customer trust and consistency.',
      naturalSentence1Tr: 'Em última análise, o sucesso neste mercado se resume à confiança do cliente e consistência.',
      naturalSentence2: 'It all boils down to execution.',
      naturalSentence2Tr: 'Tudo se resume à execução.',
      commonCollocation: 'it boils down to whether',
      isEssential50: true,
      masteryStatus: 'dominada',
    },
  ],
  listeningItems: [
    {
      id: 'l_c1_1',
      level: 5,
      spokenAudioText: "Notwithstanding the initial backlash, the executive board decided to forge ahead with the acquisition.",
      translation: 'Apesar da reação contrária inicial, a diretoria executiva decidiu seguir em frente com a aquisição.',
      speed: 1.2,
      connectedSpeechBreakdown: '"decided to" vira "decided-ta". "forge ahead" tem ligação suave de vogais.',
      reductionFocus: 'Notwithstanding the initial backlash...',
      shadowingPrompt: 'Tom formal, cadência britânica ou americana refinada.',
    },
    {
      id: 'l_c1_2',
      level: 5,
      spokenAudioText: "If you read between the lines, they are essentially acknowledging that the timeline was unfeasible from the outset.",
      translation: 'Se você ler nas entrelinhas, estão essencialmente reconhecendo que o cronograma era inviável desde o início.',
      speed: 1.25,
      connectedSpeechBreakdown: '"they are" elide para "they\'re". "from the outset" articula com ênfase final.',
      reductionFocus: 'Unfeasible from the outset.',
      shadowingPrompt: 'Fluidez rápida de conversa corporativa confidencial.',
    },
  ],
  fastDrills: [
    {
      id: 'fd_c1_1',
      promptQuestion: 'How do you navigate diplomatic disagreements when high organizational stakes are on the line?',
      promptTranslation: 'Como você conduz divergências diplomáticas quando altos interesses organizacionais estão em jogo?',
      suggestedPattern: 'I prioritize depersonalizing the friction, isolating objective metrics, and establishing aligned incentives first.',
      sampleNaturalAnswer: 'I decouple personal biases from the objective data and actively reframe the challenge around shared long-term objectives.',
      timeLimitSec: 5,
    },
  ],
  substitutionDrills: [
    {
      id: 'sd_c1_1',
      basePattern: 'Notwithstanding the fact that ___, we nonetheless managed to ___.',
      basePatternTr: 'Não obstante o fato de que [obstáculo], nós ainda assim conseguimos [vitória].',
      variations: [
        {
          slot: 'resources were constrained / exceed all targets',
          replacement: 'os recursos estavam limitados / superar todas as metas',
          fullSentence: 'Notwithstanding the fact that resources were constrained, we nonetheless managed to exceed all targets.',
          translation: 'Apesar de os recursos estarem limitados, ainda assim conseguimos superar todas as metas.',
        },
      ],
    },
  ],
  pronunciationTraps: [],
  thinkingStages: [],
  immersionSchedule: getImmersionScheduleFor('Inglês', 'C1'),
};

// Gerador dinâmico de currículo adaptado para Nível e Idioma com Expressões Nativas e Contrações
export function getCurriculumFor(language: TargetLanguage, level: FluencyLevel): LevelCurriculum {
  let base: LevelCurriculum;

  switch (level) {
    case 'Zero':
      base = ENGLISH_ZERO;
      break;
    case 'A1':
      base = ENGLISH_A1;
      break;
    case 'A2':
      base = ENGLISH_A2;
      break;
    case 'B1':
      base = ENGLISH_B1;
      break;
    case 'B2':
      base = ENGLISH_B2;
      break;
    case 'C1':
      base = ENGLISH_C1;
      break;
    default:
      base = ENGLISH_A1;
      break;
  }

  // Enriquecer com expressões nativas, contrações e gírias do dia a dia
  const bank = NATIVE_EXPRESSIONS_BANK[language];
  const nativeLevelItems = (bank && bank[level]) || [];
  const allLanguageNativeItems: VocabularyItem[] = [];

  if (bank) {
    Object.values(bank).forEach((list) => {
      list.forEach((it) => allLanguageNativeItems.push(it));
    });
  }

  const seen = new Set<string>();
  const mergedVocab: VocabularyItem[] = [];

  // Prioridade: termos do currículo base, expressões do nível, seguidas por termos adicionais
  [...base.vocabItems, ...nativeLevelItems, ...allLanguageNativeItems].forEach((item) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      mergedVocab.push(item);
    }
  });

  return {
    ...base,
    vocabItems: mergedVocab,
  };
}
