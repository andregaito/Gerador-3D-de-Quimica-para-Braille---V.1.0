import React, { useState, useEffect, Suspense } from 'react';
import { Settings, ArrowRight, Download, Box, Copy, Check, Grip, Languages, Trash2, Mail, GraduationCap, Mic, MicOff, Volume2, Bug, User, Sliders, ChevronDown, ChevronUp, Handshake, Palette, Info } from 'lucide-react';
import { gerarModeloJSCAD, gerarUrlSTL, baixarArquivoSTL } from './braille3d';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Bounds, Environment } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

// Importações de Imagens Principais e Logos Dinâmicas
import iconeRotacao from './assets/icone-rotacao.png';
import logoPrincipal from './assets/Quimica ao Alcanse das maos logo 1 transparente.png';
import logoRoxo from './assets/Quimica ao Alcanse das maos logo transparente ROXO.png';
import iconeAcessibilidade from './assets/simbolo acessibilidade.png';

// =========================================================
// IMPORTAÇÃO DAS FOTOS DA EQUIPE
// =========================================================
import fotoAndreGaito from './assets/FotoMembro-AndreGaito.jpg';
import fotoRicardoMichel from './assets/FotoMembro-RicardoMichel.jpg';
import fotoFernandaNeves from './assets/FotoMembro-FernandaNeves.png';
import fotoHugoReis from './assets/FotoMembro-HugoReis.jpeg';
import fotoRaissaEcard from './assets/FotoMembro-RaissaEcard.jpg';
import fotoPedroXavier from './assets/FotoMembro-PedroXavier.jpg';

// =========================================================
// DADOS DA EQUIPE
// =========================================================
const EQUIPE = [
  {
    nome: "André Vinnicios S. Gaito",
    titulo: "Graduando em Licenciatura em Química",
    descricao: "Criador do Projeto Química ao Alcance das Mãos, responsável pela idealização, programação, modelagem e impressão 3D.",
    email: "andre.gaito@gradu.iq.ufrj.br",
    lattes: "http://lattes.cnpq.br/9008126975057063",
    foto: fotoAndreGaito
  },
  {
    nome: "Ricardo Cunha Michel",
    titulo: "Professor Doutor em Química",
    descricao: "Apoio à concepção dos materiais, orientação quanto à correção dos conceitos químicos e normas Braille, produção de recursos e estratégias de aplicação e coleta de dados.",
    email: "michel@iq.ufrj.br",
    lattes: "http://lattes.cnpq.br/7631294110820860",
    foto: fotoRicardoMichel
  },
  {
    nome: "Fernanda Das Neves Costa",
    titulo: "Prof. Dra. em Química",
    descricao: "Coordenação geral, tramitação institucional e ética, supervisão metodológica, articulação com o IBC e validação educacional dos instrumentos.",
    email: "FNCosta@IPPN.UFRJ.br",
    lattes: "http://lattes.cnpq.br/4349970710727785",
    foto: fotoFernandaNeves
  },
  {
    nome: "Raíssa Ecard da Costa Cruz",
    titulo: "Doutoranda em Química",
    descricao: "Validação técnica e conceitual dos kits pedagógicos, planejamento das atividades de campo, co-mediação nas intervenções educacionais e suporte metodológico.",
    email: "raissaecard@pos.iq.ufrj.br",
    lattes: "http://lattes.cnpq.br/5822903514342446",
    foto: fotoRaissaEcard
  },
  {
    nome: "Hugo Costa Reis",
    titulo: "Doutorando em Química",
    descricao: "Avaliação de usabilidade e ergonomia dos protótipos em impressão 3D, estruturação logística para a execução das dinâmicas, co-moderação na aplicação dos materiais.",
    email: "hugo.reis@eq.frj.br",
    lattes: "http://lattes.cnpq.br/3500602218294576",
    foto: fotoHugoReis
  },
  {
    nome: "Pedro Xavier",
    titulo: "Mestrando em Química",
    descricao: "Assistência técnica e pedagógica para implementação da tecnologia assistiva, impressão 3D e Modelagem dos materiais.",
    email: "pedrofariax@ima.ufrj.br",
    lattes: "http://lattes.cnpq.br/3367215215251168",
    foto: fotoPedroXavier
  }
];

// =========================================================
// ÍCONES SOCIAIS NATIVOS
// =========================================================
const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const StlModel = ({ url }) => {
  const geom = useLoader(STLLoader, url);
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

const BRAILLE_MAP = {
  uppercaseIndicator: [4, 6],
  letters: {
    'a': [1], 'b': [1, 2], 'c': [1, 4], 'd': [1, 4, 5], 'e': [1, 5],
    'f': [1, 2, 4], 'g': [1, 2, 4, 5], 'h': [1, 2, 5], 'i': [2, 4], 'j': [2, 4, 5],
    'k': [1, 3], 'l': [1, 2, 3], 'm': [1, 3, 4], 'n': [1, 3, 4, 5], 'o': [1, 3, 5],
    'p': [1, 2, 3, 4], 'q': [1, 2, 3, 4, 5], 'r': [1, 2, 3, 5], 's': [2, 3, 4], 't': [2, 3, 4, 5],
    'u': [1, 3, 6], 'v': [1, 2, 3, 6], 'w': [2, 4, 5, 6], 'x': [1, 3, 4, 6], 'y': [1, 3, 4, 5, 6], 'z': [1, 3, 5, 6],
    'á': [1, 2, 3, 5, 6], 'à': [1, 2, 3, 4, 6], 'â': [1, 6], 'ã': [3, 4, 5],
    'é': [1, 2, 3, 4, 5, 6], 'ê': [1, 2, 6],
    'í': [3, 4],
    'ó': [3, 4, 6], 'ô': [1, 4, 5, 6], 'õ': [2, 4, 6],
    'ú': [2, 3, 4, 5, 6],
    'ç': [1, 2, 3, 4, 6]
  },
  lowerNumbers: { 
    '1': [2], '2': [2, 3], '3': [2, 5], '4': [2, 5, 6], '5': [2, 6],
    '6': [2, 3, 5], '7': [2, 3, 5, 6], '8': [2, 3, 6], '9': [3, 5], '0': [3, 5, 6]
  },
  standardNumbers: { 
    '1': [1], '2': [1, 2], '3': [1, 4], '4': [1, 4, 5], '5': [1, 5],
    '6': [1, 2, 4], '7': [1, 2, 4, 5], '8': [1, 2, 5], '9': [2, 4], '0': [2, 4, 5]
  },
  symbols: { 
    '(': [1, 2, 6], ')': [3, 4, 5], '[': [1, 2, 3, 5, 6], ']': [2, 3, 4, 5, 6],
    '.': [3], ',': [2], ';': [2, 3], ':': [2, 5], '!': [2, 3, 5], '?': [2, 6]
  },
  chargeIndicator: [5], numberSign: [3, 4, 5, 6], plus: [2, 3, 5], minus: [3, 6]
};

const getU = (dots) => {
  let code = 10240; 
  if (dots) {
    dots.forEach(d => { if (d >= 1 && d <= 6) code += Math.pow(2, d - 1); });
  }
  return String.fromCharCode(code);
};

const REVERSE_LETTER_MAP = {};
Object.entries(BRAILLE_MAP.letters).forEach(([char, dots]) => {
  REVERSE_LETTER_MAP[getU(dots)] = char;
});

const REVERSE_SYM_MAP = {};
Object.entries(BRAILLE_MAP.symbols).forEach(([char, dots]) => {
  REVERSE_SYM_MAP[getU(dots)] = char;
});
REVERSE_SYM_MAP[getU(BRAILLE_MAP.plus)] = '+';
REVERSE_SYM_MAP[getU(BRAILLE_MAP.minus)] = '-';

const REVERSE_LOW_NUM_MAP = {};
Object.entries(BRAILLE_MAP.lowerNumbers).forEach(([char, dots]) => {
  REVERSE_LOW_NUM_MAP[getU(dots)] = char;
});

const UPPER_INDICATOR = getU(BRAILLE_MAP.uppercaseIndicator);
const NUMBER_INDICATOR = getU(BRAILLE_MAP.numberSign);
const CHARGE_INDICATOR = getU(BRAILLE_MAP.chargeIndicator);

const Dot = ({ active }) => (
  <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${active ? 'bg-slate-800 shadow-sm' : 'bg-transparent border-[1.5px] sm:border-2 border-slate-200'}`} />
);

const BrailleCell = ({ dots, label, description }) => {
  return (
    <div className="flex flex-col items-center sm:mx-1 sm:mb-4" role="group" aria-label={`Cela Braille: ${description}`}>
      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-white rounded-md border border-slate-300 shadow-sm" aria-hidden="true">
        <Dot active={dots.includes(1)} /> <Dot active={dots.includes(4)} />
        <Dot active={dots.includes(2)} /> <Dot active={dots.includes(5)} />
        <Dot active={dots.includes(3)} /> <Dot active={dots.includes(6)} />
      </div>
      <div className="mt-1.5 sm:mt-2 text-center flex flex-col items-center justify-center">
        <span className="block text-[11px] sm:text-sm font-bold text-slate-700 h-3 sm:h-5 leading-none">{label}</span>
        <span className="block text-[9px] sm:text-xs text-slate-500 w-[50px] sm:w-16 leading-tight break-words">{description}</span>
      </div>
    </div>
  );
};

const ConfigSlider = ({ label, value, min, max, step, unit, onChange, cor }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-1">
      <label className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase">{label}</label>
      <span 
        className="text-xs font-mono px-2 py-0.5 rounded transition-colors"
        style={{ color: cor, backgroundColor: `${cor}1A`, border: `1px solid ${cor}33` }}
      >
        {value} {unit}
      </span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} 
      value={value} onChange={onChange} 
      aria-label={`${label} em ${unit}`}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
      style={{ accentColor: cor }}
    />
  </div>
);

// =========================================================
// TESTADOR DE PALETA DE CORES EM TEMPO REAL
// =========================================================
const ColorTester = ({ corPrincipal, setCorPrincipal, modoRoxo, setModoRoxo }) => {
  const handleSwitch = () => {
    if (!modoRoxo) {
      setModoRoxo(true);
      setCorPrincipal('#7e22ce');
    } else {
      setModoRoxo(false);
      setCorPrincipal('#0e52c2');
    }
  };

  const handleColorPicker = (e) => {
    setModoRoxo(false);
    setCorPrincipal(e.target.value);
  };

  return (
    <div 
      className="flex items-center space-x-3 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex-shrink-0" 
      role="region" 
      aria-label="Testador rápido de paleta de cores"
    >
      <button
        type="button"
        onClick={handleSwitch}
        role="switch"
        aria-checked={modoRoxo}
        aria-label="Alternar tema entre Azul Padrão e Roxo"
        title="Alternar entre Azul Padrão e Roxo"
        className="w-11 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 cursor-pointer"
        style={{ backgroundColor: modoRoxo ? '#7e22ce' : '#0e52c2' }}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${modoRoxo ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>

      <label 
        className="cursor-pointer text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center relative"
        title="Escolher qualquer cor HEX personalizada"
        aria-label="Seletor de cor personalizada"
      >
        <Palette 
          className="w-5 h-5 transition-colors" 
          style={{ color: !modoRoxo && corPrincipal !== '#0e52c2' ? corPrincipal : undefined }} 
        />
        <input 
          type="color" 
          value={corPrincipal} 
          onChange={handleColorPicker} 
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
    </div>
  );
};

// =========================================================
// MOTOR INTELIGENTE DE VALIDAÇÃO E SUGESTÃO QUÍMICA (NOX / VALÊNCIA)
// =========================================================
const checarSugestaoQuimica = (texto) => {
  const limpo = texto.trim();
  if (!limpo || limpo.length < 2 || limpo.includes(' ')) return null;

  const noxFixos = {
    'Na': ['Na+'], 'K': ['K+'], 'Li': ['Li+'], 'Ag': ['Ag+'],
    'Ca': ['Ca2+'], 'Mg': ['Mg2+'], 'Ba': ['Ba2+'], 'Zn': ['Zn2+'],
    'Al': ['Al3+'],
    'F': ['F-'], 'Cl': ['Cl-'], 'Br': ['Br-'], 'I': ['I-'],
    'O': ['O2-'], 'S': ['S2-']
  };

  const compostosClassicos = {
    'Fe(OH)': ['Fe(OH)2', 'Fe(OH)3'], 'Fe(OH)1': ['Fe(OH)2', 'Fe(OH)3'], 'Fe(OH)4': ['Fe(OH)2', 'Fe(OH)3'], 'Fe(OH)5': ['Fe(OH)2', 'Fe(OH)3'],
    'Cu(OH)': ['CuOH', 'Cu(OH)2'], 'Cu(OH)3': ['CuOH', 'Cu(OH)2'],
    'Al(OH)': ['Al(OH)3'], 'Al(OH)2': ['Al(OH)3'],
    'Ca(OH)': ['Ca(OH)2'], 'Mg(OH)': ['Mg(OH)2'], 'Zn(OH)': ['Zn(OH)2'],
    'NaOH2': ['NaOH'], 'KOH2': ['KOH'],
    'HSO4': ['H2SO4'], 'H3SO4': ['H2SO4'], 'HSO3': ['H2SO3'],
    'HCO3': ['H2CO3'], 'HNO': ['HNO2', 'HNO3'],
    'H2O22': ['H2O2', 'H2O']
  };

  for (let errado in compostosClassicos) {
    if (limpo.toUpperCase() === errado.toUpperCase()) {
      return {
        mensagem: `O Ferro (Fe) ou o radical apresenta valência clássica diferente para essa combinação.`,
        sugestoes: compostosClassicos[errado]
      };
    }
  }

  const matchIon = limpo.match(/^([A-Z][a-z]?)([0-9]*)([+-])([0-9]*)$/);
  if (matchIon) {
    const [, elemento, numAntes, sinal, numDepois] = matchIon;
    const numeroCarga = numAntes || numDepois || '1';
    
    if (numeroCarga === '1') {
      const formCorreta = `${elemento}${sinal}`;
      if (limpo !== formCorreta && noxFixos[elemento] && noxFixos[elemento].includes(formCorreta)) {
        return {
          mensagem: `Na grafia química padrão, o número 1 na carga unitária é omitido.`,
          sugestoes: [formCorreta]
        };
      }
    }

    if (noxFixos[elemento]) {
      const corretaLista = noxFixos[elemento];
      if (!corretaLista.some(c => c === limpo || c === `${elemento}${numeroCarga}${sinal}`)) {
        return {
          mensagem: `O elemento ${elemento} possui NOX/Valência fixa e não costuma formar o íon digitado.`,
          sugestoes: corretaLista
        };
      }
    }

    if (numDepois && !numAntes) {
      return {
        mensagem: `A convenção da IUPAC recomenda colocar o número antes do sinal na carga do íon.`,
        sugestoes: [`${elemento}${numDepois}${sinal}`]
      };
    }
  }

  return null;
};

// COMPONENTE VISUAL: CAIXA DE ALERTA DE SUGESTÃO QUÍMICA
const AlertaSugestao = ({ sugestaoDados, aoAplicarSugestao }) => {
  if (!sugestaoDados) return null;

  return (
    <div 
      role="alert" 
      aria-live="polite"
      className="mt-3 bg-amber-50/90 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-sm flex items-start space-x-3 text-left transition-all"
    >
      <div className="p-1 bg-amber-500/10 rounded-full text-amber-600 flex-shrink-0 mt-0.5">
        <Info className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
        <span className="font-semibold block text-amber-950 mb-0.5">Sugestão de Estequiometria / IUPAC:</span>
        {sugestaoDados.mensagem}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-amber-800 font-medium">Talvez você quisesse dizer:</span>
          {sugestaoDados.sugestoes.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => aoAplicarSugestao(sug)}
              title={`Clique para corrigir automaticamente para ${sug}`}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-mono font-bold rounded border border-amber-300 shadow-2xs transition-colors cursor-pointer underline decoration-amber-500/50"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('gerador');

  const [corPrincipal, setCorPrincipal] = useState('#0e52c2'); 
  const [modoRoxo, setModoRoxo] = useState(false);

  const [input, setInput] = useState('Fe(OH)2');
  const [cells, setCells] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [copiado, setCopiado] = useState(false);
  
  const [brailleInput, setBrailleInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const [isListening, setIsListening] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config3D, setConfig3D] = useState({
    alturaPonto: 0.75,
    diametroPonto: 1.9,
    espessuraPlaca: 5.0,
    borda: 0.0,
    distPontos: 2.5,
    distCelas: 6.0,
    distLinhas: 10.0,
    margem: 2.0
  });

  const sugestaoQuimica = checarSugestaoQuimica(input);

  const handleAplicarSugestao = (novaFormula) => {
    setInput(novaFormula);
    parseBraille(novaFormula);
  };

  const parseBraille = (rawText) => {
    if (!rawText.trim()) {
      setCells([]);
      return [];
    }
    
    const subscriptMap = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', 
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    };
    const text = rawText.replace(/[₀-₉]/g, char => subscriptMap[char]);
    
    const result = [];
    const normalizedText = text.replace(/\r/g, ''); 
    const chargeRegex = /\s*([+-]\d*|\d+[+-])$/;
    
    let baseStr = normalizedText; 
    let chargeStr = "";

    if (!normalizedText.includes('\n')) {
      const match = normalizedText.trim().match(chargeRegex);
      if (match) { 
        chargeStr = match[1]; 
        baseStr = normalizedText.trim().slice(0, match.index).trim(); 
      }
    }

    for (let char of baseStr) {
      if (char === ' ') {
        result.push({ dots: [], label: ' ', description: 'Espaço' });
        continue;
      }
      if (char === '\n') {
        result.push({ isNewline: true, dots: [], label: '↵', description: 'Parágrafo' });
        continue;
      }

      const isLetter = /[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(char);

      if (isLetter) {
        if (char !== char.toLowerCase()) {
          result.push({ dots: BRAILLE_MAP.uppercaseIndicator, label: '⠨', description: 'Maiúscula' });
        }
        const lowerChar = char.toLowerCase();
        if (BRAILLE_MAP.letters[lowerChar]) {
          result.push({ dots: BRAILLE_MAP.letters[lowerChar], label: char, description: `Letra ${char}` });
        }
      } else if (/[0-9]/.test(char)) {
        result.push({ dots: BRAILLE_MAP.lowerNumbers[char], label: char, description: `Índice ${char}` });
      } else if (BRAILLE_MAP.symbols[char]) {
        result.push({ dots: BRAILLE_MAP.symbols[char], label: char, description: 'Símbolo' });
      }
    }

    if (chargeStr) {
      result.push({ dots: BRAILLE_MAP.chargeIndicator, label: '⠢', description: 'Ind. de Carga' });
      let inChargeNumber = false;
      for (let char of chargeStr) {
        if (char === '+') {
          inChargeNumber = false; result.push({ dots: BRAILLE_MAP.plus, label: '+', description: 'Positivo' });
        } else if (char === '-') {
          inChargeNumber = false; result.push({ dots: BRAILLE_MAP.minus, label: '-', description: 'Negativo' });
        } else if (/[0-9]/.test(char)) {
          if (!inChargeNumber) {
            result.push({ dots: BRAILLE_MAP.numberSign, label: '⠼', description: 'Numérico' });
            inChargeNumber = true;
          }
          result.push({ dots: BRAILLE_MAP.standardNumbers[char], label: char, description: `Número ${char}` });
        }
      }
    }
    
    setCells(result); 
    return result;
  };

  useEffect(() => { parseBraille(input); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const blocosGerados = parseBraille(input);
    if (!blocosGerados || blocosGerados.length === 0) return;
    
    setIsGenerating(true);
    setStlUrl(null); 

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const modelo3D = gerarModeloJSCAD(blocosGerados, config3D);
      const url = gerarUrlSTL(modelo3D);
      setStlUrl(url); 
    } catch (error) {
      console.error("Erro ao gerar modelo:", error);
      alert("Ocorreu um erro ao gerar a malha 3D.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (stlUrl) {
      const nomeStr = input.replace(/[^a-zA-Z0-9]/g, '_');
      baixarArquivoSTL(stlUrl, `MatrizBraille_${nomeStr}.stl`);
    }
  };

  const brailleUnicodeText = cells.map(cell => {
    if (cell.isNewline) return '\n';
    let code = 10240; 
    if (cell.dots) {
      cell.dots.forEach(d => {
        if (d >= 1 && d <= 6) code += Math.pow(2, d - 1);
      });
    }
    return String.fromCharCode(code);
  }).join('');

  const handleCopy = () => {
    navigator.clipboard.writeText(brailleUnicodeText);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); 
  };

  const handleBrailleTranslate = (text) => {
    setBrailleInput(text);
    let result = '';
    let isUpper = false;
    let isNumber = false;
    let isCharge = false;
    const numMap = {'a':'1','b':'2','c':'3','d':'4','e':'5','f':'6','g':'7','h':'8','i':'9','j':'0'};

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === ' ' || char === '⠀') {
        result += ' ';
        isNumber = false;
        isCharge = false;
        continue;
      }
      if (char === '\n') {
        result += '\n';
        isNumber = false;
        isCharge = false;
        continue;
      }
      if (char === UPPER_INDICATOR) {
        isUpper = true;
        continue;
      }
      if (char === NUMBER_INDICATOR) {
        isNumber = true;
        continue;
      }
      if (char === CHARGE_INDICATOR) {
        isCharge = true;
        continue;
      }

      const mappedLetter = REVERSE_LETTER_MAP[char];
      const mappedSym = REVERSE_SYM_MAP[char];
      const mappedLowNum = REVERSE_LOW_NUM_MAP[char];

      const prevChar = result.slice(-1);
      const prevPrevChar = result.length > 1 ? result.slice(-2, -1) : ' ';
      
      const isPrevLower = /[a-zçáàâãéêíóôõú]/.test(prevChar);
      const isPrevPrevUpper = /[A-Z]/.test(prevPrevChar);
      const isChemicalElement = isPrevLower && isPrevPrevUpper;

      if (mappedLetter && mappedSym) {
        let useSymbol = true;

        if (isUpper) {
          useSymbol = false;
        } else {
          let nextBraille = text[i+1];
          let nextIsLowerLetter = nextBraille && REVERSE_LETTER_MAP[nextBraille] && !REVERSE_SYM_MAP[nextBraille] && nextBraille !== UPPER_INDICATOR && nextBraille !== NUMBER_INDICATOR;

          if (isPrevLower && !isChemicalElement && (nextIsLowerLetter || !nextBraille || nextBraille === ' ' || nextBraille === '\n' || REVERSE_SYM_MAP[nextBraille])) {
            useSymbol = false;
            if (mappedSym === '(' && nextBraille) {
               let nL = REVERSE_LETTER_MAP[nextBraille];
               if (nL === 's' || nL === 'l' || nL === 'g' || nL === 'a') useSymbol = true;
            }
          } else if ((prevChar === ' ' || prevChar === '') && nextIsLowerLetter) {
            useSymbol = false;
          }
        }

        if (useSymbol) {
          result += mappedSym;
        } else {
          result += isUpper ? mappedLetter.toUpperCase() : mappedLetter;
          isUpper = false;
        }
        continue;
      }

      if (mappedLowNum && mappedSym) {
        if (isCharge) {
          result += mappedSym; 
          if (mappedSym === '+' || mappedSym === '-') isCharge = false;
        } else {
          let useNumber = true;
          if ((isPrevLower && !isChemicalElement) || prevChar === ' ') {
            useNumber = false;
          }
          result += useNumber ? mappedLowNum : mappedSym;
        }
        continue;
      }

      if (mappedLetter) {
        if (isNumber && numMap[mappedLetter]) {
          result += numMap[mappedLetter];
        } else {
          result += isUpper ? mappedLetter.toUpperCase() : mappedLetter;
          isUpper = false;
          isNumber = false;
        }
      } else if (mappedLowNum) {
        result += mappedLowNum;
      } else if (mappedSym) {
        result += mappedSym;
        if (isCharge && (mappedSym === '+' || mappedSym === '-')) isCharge = false;
      } else {
        result += char; 
      }
    }
    setTranslatedText(result);
  };

  const handleClearTranslator = () => {
    setBrailleInput('');
    setTranslatedText('');
  };

  const handleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta digitação por voz nativamente. Tente usar o Google Chrome ou Edge.");
      return;
    }
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const newText = input ? `${input} ${transcript}` : transcript;
      setInput(newText);
      parseBraille(newText);
    };
    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const celasFisicas = cells.filter(c => !c.isNewline);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      
      <header className="bg-white pt-6 pb-6 sm:pt-10 sm:pb-8 px-4 sm:px-6 shadow-sm z-10 relative">
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-start gap-3 sm:gap-6">
          <img 
            src={modoRoxo ? logoRoxo : logoPrincipal} 
            alt="Logo Química ao Alcance das Mãos" 
            className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-sm flex-shrink-0 transition-all duration-300"
          />
          <div className="text-left flex flex-col justify-center">
            <h1 className="text-lg sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Química ao Alcance das Mãos:
            </h1>
            <h2 className="text-[13px] sm:text-xl md:text-2xl font-medium text-slate-600 mt-0.5 sm:mt-2">
              Gerador 3D de Química para Braille
            </h2>
          </div>
        </div>
      </header>

      <nav 
        aria-label="Navegação Principal do Projeto" 
        className="shadow-md sticky top-0 z-20 transition-colors duration-300"
        style={{ backgroundColor: corPrincipal }}
      >
        <div role="tablist" className="max-w-5xl mx-auto flex flex-nowrap overflow-x-auto justify-start sm:justify-start w-full px-2 sm:px-0">
          {[
            { id: 'gerador', label: 'Gerador Braille' },
            { id: 'sobre', label: 'Sobre o Projeto' },
            { id: 'instrucoes', label: 'Instruções' },
            { id: 'saiba-mais', label: 'Saiba Mais' },
            { id: 'parcerias', label: 'Parcerias' },
            { id: 'equipe', label: 'Equipe' },
            { id: 'bug', label: 'Achou um Bug?' }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`painel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex-1 sm:flex-none px-3 sm:px-5 py-3 sm:py-4 text-[12px] sm:text-[14px] font-semibold transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'text-white border-b-4 border-white' 
                  : 'text-white/80 hover:bg-black/10 hover:text-white border-b-4 border-transparent'
              }`}
              style={{ backgroundColor: activeTab === tab.id ? 'rgba(0, 0, 0, 0.25)' : 'transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 w-full max-w-5xl mx-auto">
        
        {/* ======================================================== */}
        {/* ABA: GERADOR BRAILLE */}
        {/* ======================================================== */}
        {activeTab === 'gerador' && (
          <div id="painel-gerador" role="tabpanel" aria-label="Gerador Braille" className="space-y-6 fade-in">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-600 space-y-3">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <p className="flex-1 leading-relaxed">
                    Converte fórmulas químicas em arquivos 3D (STL) para impressão 3D e leitura tátil, seguindo as normas estabelecidas pela{' '}
                    <a 
                      href="https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-semibold hover:underline transition-colors"
                      style={{ color: corPrincipal }}
                    >
                      Grafia Química Braille para Uso no Brasil (3ª edição, 2017)
                    </a>.
                  </p>

                  <ColorTester 
                    corPrincipal={corPrincipal} 
                    setCorPrincipal={setCorPrincipal} 
                    modoRoxo={modoRoxo} 
                    setModoRoxo={setModoRoxo} 
                  />
                </div>

                <div 
                  className="border-l-4 pl-3 bg-slate-50 py-2 pr-3 rounded-r text-sm transition-colors"
                  style={{ borderColor: corPrincipal }}
                >
                  <p>
                    Uma ferramenta de tecnologia assistiva desenvolvida por{' '}
                    <a 
                      href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline cursor-pointer font-semibold text-slate-700"
                    >
                      André Vinnicios S. Gaito
                    </a>{' '}
                    para facilitar a inclusão no ensino de ciências e tornar a química ao alcance de todos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <label htmlFor="ionInput" className="block text-sm font-medium text-slate-700 mb-1">
                      Digite a fórmula do Íon, Composto Químico ou Texto
                    </label>
                    <textarea
                      id="ionInput" 
                      value={input}
                      onChange={(e) => { setInput(e.target.value); parseBraille(e.target.value); }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-lg font-mono resize-y min-h-[80px] pr-12"
                      rows={2}
                      placeholder="Ex: Fe(OH)2 ou qualquer texto multilinhas..."
                    />
                    <button
                      type="button"
                      onClick={handleDictation}
                      aria-label={isListening ? "Parar digitação por voz" : "Iniciar digitação por voz via microfone"}
                      title="Ditar por voz (Microfone)"
                      className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        isListening 
                          ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400' 
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit" disabled={isGenerating}
                      className={`w-full sm:w-auto px-6 py-3 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 h-[52px] ${
                        isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'hover:opacity-90'
                      }`}
                      style={{ backgroundColor: isGenerating ? undefined : corPrincipal }}
                    >
                      <Settings className={`w-5 h-5 inline-block ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'Processando Malha...' : 'Visualizar STL'}</span>
                    </button>
                  </div>
                </div>

                {/* CAIXA DE ALERTA DE SUGESTÃO QUÍMICA (IUPAC) */}
                <AlertaSugestao 
                  sugestaoDados={sugestaoQuimica} 
                  aoAplicarSugestao={handleAplicarSugestao} 
                />

                {/* MENU OCULTO: OPÇÕES AVANÇADAS */}
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAdvanced(!showAdvanced)} 
                    aria-expanded={showAdvanced}
                    aria-controls="painel-avancado"
                    className="flex items-center text-sm font-semibold text-slate-600 hover:opacity-80 transition-opacity"
                    style={{ color: showAdvanced ? corPrincipal : undefined }}
                  >
                    <Sliders className="w-4 h-4 mr-2" />
                    Opções Avançadas de Impressão 3D
                    {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </button>
                  
                  {showAdvanced && (
                    <div id="painel-avancado" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <ConfigSlider 
                        label="Altura do Ponto" value={config3D.alturaPonto} min="0.5" max="1.5" step="0.05" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, alturaPonto: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Diâmetro do Ponto" value={config3D.diametroPonto} min="1.0" max="2.0" step="0.05" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, diametroPonto: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Espessura da Placa" value={config3D.espessuraPlaca} min="0.0" max="10.0" step="0.5" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, espessuraPlaca: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Bordas Arredondadas" value={config3D.borda} min="0.0" max="10.0" step="0.5" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, borda: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Dist. Pontos (X/Y)" value={config3D.distPontos} min="1.0" max="3.0" step="0.1" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, distPontos: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Dist. Celas" value={config3D.distCelas} min="3.0" max="8.0" step="0.1" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, distCelas: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Dist. Linhas" value={config3D.distLinhas} min="5.0" max="15.0" step="0.5" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, distLinhas: e.target.value})} cor={corPrincipal}
                      />
                      <ConfigSlider 
                        label="Margem Geral" value={config3D.margem} min="1.0" max="5.0" step="0.5" unit="mm" 
                        onChange={(e) => setConfig3D({...config3D, margem: e.target.value})} cor={corPrincipal}
                      />
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* VISUALIZADOR 3D COM ACESSIBILIDADE E CORES DINÂMICAS */}
            {stlUrl && (
              <div 
                role="region" 
                aria-label="Área de pré-visualização do modelo 3D em formato STL"
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <Box className="w-5 h-5 mr-2 text-slate-500" />
                    Pré-visualização do Modelo 3D
                  </h2>
                  <button
                    onClick={handleDownload}
                    aria-label="Baixar arquivo 3D formato STL pronto para impressão"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Baixar .STL Pronto</span>
                    <span className="sm:hidden">Baixar STL</span>
                  </button>
                </div>
                
                <p className="sr-only">
                  Modelo 3D gerado com sucesso para a fórmula {input}. O arquivo possui aproximadamente {celasFisicas.length} celas braille. Utilize o botão de download acima para baixar o arquivo pronto para impressão.
                </p>

                <div aria-hidden="true" className="w-full h-[350px] bg-slate-900 rounded-lg overflow-hidden relative cursor-move">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    aria-label={autoRotate ? "Desligar rotação automática do modelo 3D" : "Ligar rotação automática do modelo 3D"}
                    title={autoRotate ? "Desligar Rotação Automática" : "Ligar Rotação Automática"}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full shadow-lg transition-all"
                    style={autoRotate ? { backgroundColor: corPrincipal, ring: `2px solid ${corPrincipal}` } : { backgroundColor: 'rgba(51, 65, 85, 0.8)' }}
                  >
                    <img 
                      src={iconeRotacao}
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </button>

                  <Canvas shadows camera={{ position: [0, 50, 100], fov: 45 }}>
                    <Suspense fallback={null}>
                      <Environment preset="city" />
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                      
                      <Bounds fit clip observe margin={1.2}>
                        <Center bottom position={[0, 0, 0]}>
                          <StlModel url={stlUrl} />
                        </Center>
                      </Bounds>
                    </Suspense>
                    
                    <axesHelper args={[30]} />
                    <gridHelper args={[200, 20, '#94a3b8', '#475569']} position={[0, 0, 0]} />
                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2.0} makeDefault enablePan={true} enableZoom={true} />
                  </Canvas>
                  
                  <p className="absolute bottom-3 left-0 w-full text-center text-xs text-slate-300 font-medium pointer-events-none drop-shadow-md">
                    Arraste para girar • Role o mouse para aproximar
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                Visualização das Celas Braille (Leitura Tátil 2D) <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
              </h2>
              
              {cells.length > 0 ? (
                <div>
                  <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-start gap-y-4 gap-x-1 sm:gap-x-0 bg-slate-100 p-4 sm:p-6 rounded-lg border border-slate-200 min-h-[180px]">
                    {cells.map((cell, index) => {
                      if (cell.isNewline) return <div key={`nl-${index}`} className="col-span-4 sm:w-full h-2 sm:h-4"></div>;
                      return <BrailleCell key={index} dots={cell.dots} label={cell.label} description={cell.description} />;
                    })}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4 px-1">
                    <p>Largura estimada na impressão: <span className="font-bold text-slate-700">~{(celasFisicas.length * 6.5).toFixed(1)} mm</span></p>
                    <p>Total: <span className="font-bold text-slate-700">{celasFisicas.length}</span> celas</p>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="block text-xs font-bold text-slate-500 mb-2 uppercase">Texto Braille (Unicode)</span>
                        <div className="text-4xl text-slate-800 tracking-widest font-mono mb-4 break-all min-h-[3rem] whitespace-pre-wrap">
                          {brailleUnicodeText}
                        </div>
                      </div>
                      <button
                        onClick={handleCopy}
                        aria-label="Copiar texto em formato Unicode Braille para a área de transferência"
                        className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md flex items-center justify-center space-x-2 transition-colors"
                      >
                        {copiado ? (
                          <span aria-live="assertive" className="flex items-center text-green-700 font-semibold">
                            <Check className="w-4 h-4 text-green-600 mr-1.5" />
                            <span>Copiado!</span>
                          </span>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar Texto Braille</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="md:w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-[11px] sm:text-xs font-bold text-slate-500 uppercase">
                          <Grip className="w-4 h-4 mr-1 sm:mr-1.5 text-slate-400" />
                          Digite o texto Braille
                        </span>
                        <button 
                          onClick={handleClearTranslator}
                          aria-label="Limpar texto Braille digitado"
                          title="Apagar todo o texto inserido"
                          className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Limpar
                        </button>
                      </div>
                      <textarea
                        value={brailleInput}
                        onChange={(e) => handleBrailleTranslate(e.target.value)}
                        aria-label="Área de digitação ou colagem de caracteres Braille"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 outline-none text-2xl font-mono text-slate-800 mb-4 resize-y min-h-[4rem]"
                        placeholder="Cole caracteres Braille aqui..."
                      />
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-xs font-bold text-slate-500 uppercase">
                          <Languages className="w-4 h-4 mr-1.5 transition-colors" style={{ color: corPrincipal }} />
                          Tradução em Português
                        </span>
                        <button
                          onClick={handleSpeak}
                          disabled={!translatedText}
                          aria-label="Ouvir tradução em voz alta em português"
                          title="Ouvir tradução em voz alta"
                          className="px-2 py-1 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: `${corPrincipal}20`, color: corPrincipal }}
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Ouvir
                        </button>
                      </div>

                      <div 
                        aria-live="polite" 
                        aria-atomic="true"
                        className="text-lg text-slate-800 font-medium min-h-[2.5rem] whitespace-pre-wrap break-words bg-slate-200/50 px-3 py-2 rounded-md border border-slate-200 flex-1"
                      >
                        {translatedText || <span className="text-slate-400 italic font-normal">Aguardando texto em braille...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg p-12">Nenhuma fórmula digitada.</div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: SOBRE O PROJETO */}
        {/* ======================================================== */}
        {activeTab === 'sobre' && (
          <div id="painel-sobre" role="tabpanel" aria-label="Sobre o Projeto" className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200 text-slate-700 fade-in space-y-8 text-left">
            <div className="border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Química ao Alcance das Mãos</h2>
              <p className="text-lg font-medium mt-2 transition-colors" style={{ color: corPrincipal }}>Democratizando o ensino de ciências através da tecnologia e da manufatura aditiva.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">O Desafio da Inclusão</h3>
              <p className="leading-relaxed">
                O ensino de química é historicamente pautado em elementos visuais: fórmulas espaciais, reações, cores e gráficos. Para alunos com deficiência visual ou baixa visão, isso cria uma barreira imensa no aprendizado. Embora o <strong>Instituto Benjamin Constant (IBC)</strong> e o MEC tenham estabelecido a norma da <em>Grafia Química Braille para Uso no Brasil</em>, a produção e o acesso a esses materiais físicos ainda são escassos, caros e lentos nas escolas regulares.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">A Solução: Código Aberto e Impressão 3D</h3>
              <p className="leading-relaxed">
                O Gerador 3D de Química para Braille nasceu para ser uma ponte entre a tecnologia de prototipagem rápida e a educação inclusiva. Através desta plataforma <strong>Open Source</strong>, qualquer professor, escola ou laboratório maker pode digitar uma fórmula e gerar uma matriz tátil digital (STL) em segundos. O que antes demorava semanas para ser encomendado, agora pode ser fabricado na própria escola via impressão 3D, sob demanda e com baixo custo.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Inovação em Equipamentos de Laboratório</h3>
              <p className="leading-relaxed">
                Acreditamos que a tecnologia assistiva deve ser ágil e escalável. Este gerador é o primeiro passo de uma visão de startup mais ampla focada na criação de <strong>equipamentos de laboratório adaptados</strong> e materiais didáticos inovadores. Nosso objetivo é consolidar um ecossistema onde o design de hardware torne os laboratórios de ciências espaços 100% acessíveis.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: PARCERIAS */}
        {/* ======================================================== */}
        {activeTab === 'parcerias' && (
          <div id="painel-parcerias" role="tabpanel" aria-label="Parcerias" className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200 fade-in text-center">
            <div className="flex justify-center mb-6">
              <div 
                className="p-5 rounded-full shadow-inner transition-colors" 
                aria-hidden="true"
                style={{ backgroundColor: `${corPrincipal}1A`, color: corPrincipal }}
              >
                <Handshake className="w-14 h-14" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Parcerias e Expansão</h2>
            
            <div className="max-w-3xl mx-auto space-y-6 text-slate-600 leading-relaxed text-left sm:text-center">
              <p>
                O projeto <strong>Química ao Alcance das Mãos</strong> visa transformar o ensino e a aprendizagem da química através da aplicação de ferramentas inclusivas e tecnologias inovadoras, como a impressão 3D e o design aberto de materiais didáticos.
              </p>
              <p>
                Nosso maior objetivo é <strong>expandir o alcance dessa tecnologia</strong>. Acreditamos que o conhecimento aberto tem o poder de mudar realidades, e por isso queremos que nossas matrizes de impressão 3D cheguem ao máximo possível de escolas, laboratórios e institutos de educação em todos os estados do país.
              </p>
              <p 
                className="font-medium text-slate-700 bg-slate-50 p-4 border-l-4 rounded-r-lg shadow-sm transition-colors"
                style={{ borderColor: corPrincipal }}
              >
                Qualquer escola, instituição ou entidade educacional que tenha interesse em aplicar os nossos materiais pedagógicos, testar o gerador ou firmar algum tipo de colaboração e parceria conosco é mais que bem-vinda!
              </p>
            </div>

            <div className="mt-10">
              <a 
                href="mailto:andrevinniciosgaito@gmail.com?subject=Interesse%20em%20Parceria%20-%20Química%20ao%20Alcance%20das%20Mãos" 
                className="inline-flex items-center px-8 py-4 text-white text-lg font-bold rounded-lg shadow-md transition-all transform hover:-translate-y-1 hover:opacity-90"
                style={{ backgroundColor: corPrincipal }}
              >
                <Mail className="w-6 h-6 mr-3" />
                Entre em Contato Conosco
              </a>
              <p className="mt-4 text-sm text-slate-500">Ou envie um e-mail para: <strong>andrevinniciosgaito@gmail.com</strong></p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: EQUIPE */}
        {/* ======================================================== */}
        {activeTab === 'equipe' && (
          <div id="painel-equipe" role="tabpanel" aria-label="Nossa Equipe" className="space-y-6 fade-in">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">Nossa Equipe</h2>
              <p className="text-slate-600 text-center mt-2">Conheça os pesquisadores e desenvolvedores por trás do projeto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EQUIPE.map((membro, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 transition-all hover:shadow-md">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-100 flex-shrink-0 bg-slate-200 flex items-center justify-center overflow-hidden">
                    {membro.foto ? (
                      <img src={membro.foto} alt={`Foto de ${membro.nome}`} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">{membro.nome}</h3>
                      <p className="text-sm font-semibold transition-colors" style={{ color: corPrincipal }}>{membro.titulo}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {membro.descricao}
                    </p>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap justify-center sm:justify-start gap-4">
                      {membro.email && (
                        <a href={`mailto:${membro.email}`} aria-label={`E-mail de ${membro.nome}`} className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          <Mail className="w-3.5 h-3.5 mr-1" />
                          E-mail
                        </a>
                      )}
                      {membro.lattes && (
                        <a href={membro.lattes} aria-label={`Currículo Lattes de ${membro.nome}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          <GraduationCap className="w-3.5 h-3.5 mr-1" />
                          Lattes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: ACHOU UM BUG? */}
        {/* ======================================================== */}
        {activeTab === 'bug' && (
          <div id="painel-bug" role="tabpanel" aria-label="Reporte de Bug" className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200 text-center fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full text-red-600" aria-hidden="true">
                <Bug className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Achou um Bug ou Tem uma Sugestão?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              O "Gerador 3D de Química para Braille" é um projeto de código aberto em constante evolução. 
              Caso você encontre algum erro na geração dos caracteres, formatações inconsistentes, problemas na 
              malha 3D ou qualquer outra falha técnica, por favor, nos avise! Suas sugestões de melhorias 
              também são essenciais para aprimorarmos a ferramenta.
            </p>
            <a 
              href="mailto:andrevinniciosgaito@gmail.com?subject=Reporte%20de%20Bug%20/%20Sugestão%20-%20Gerador%20Braille" 
              className="inline-flex items-center px-6 py-3 text-white font-bold rounded-lg shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: corPrincipal }}
            >
              <Mail className="w-5 h-5 mr-2" />
              Reportar para a Equipe
            </a>
            <p className="mt-6 text-sm text-slate-500">
              Contato direto: <strong>andrevinniciosgaito@gmail.com</strong>
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: INSTRUÇÕES (Placeholder) */}
        {/* ======================================================== */}
        {activeTab === 'instrucoes' && (
          <div id="painel-instrucoes" role="tabpanel" aria-label="Instruções" className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 fade-in">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Instruções de Impressão</h2>
            <p>Área reservada para guias passo a passo de como fatiar e imprimir o modelo STL gerado.</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: SAIBA MAIS (Placeholder) */}
        {/* ======================================================== */}
        {activeTab === 'saiba-mais' && (
          <div id="painel-saiba-mais" role="tabpanel" aria-label="Saiba Mais" className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 fade-in">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Saiba Mais</h2>
            <p>Área reservada para documentações futuras.</p>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center space-x-4">
            <img 
              src={iconeAcessibilidade} 
              alt="Símbolo de Acessibilidade" 
              className="w-10 h-10 object-contain opacity-80 flex-shrink-0"
            />
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-bold text-white">Química ao Alcance das Mãos:</h3>
              <p className="text-sm text-slate-400 mb-1">Gerador 3D de Química para Braille</p>
              <p className="text-xs text-slate-500">
                Criado por <a href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: corPrincipal }}>André Vinnicios S. Gaito</a>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <a href="mailto:andrevinniciosgaito@gmail.com" aria-label="Enviar E-mail para André Gaito" className="text-slate-400 hover:text-white transition-colors" title="Enviar E-mail">
              <Mail className="w-6 h-6" />
            </a>
            <a href="http://lattes.cnpq.br/9008126975057063" target="_blank" rel="noopener noreferrer" aria-label="Acessar Currículo Lattes de André Gaito" className="text-slate-400 hover:text-white transition-colors" title="Currículo Lattes">
              <GraduationCap className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/andre_gaito/" target="_blank" rel="noopener noreferrer" aria-label="Acessar perfil do Instagram de André Gaito" className="text-slate-400 hover:text-white transition-colors" title="Instagram">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="https://github.com/andregaito/Gerador-3D-de-Quimica-para-Braille---V.1.0" target="_blank" rel="noopener noreferrer" aria-label="Acessar repositório do projeto no GitHub" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
              <GithubIcon className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" target="_blank" rel="noopener noreferrer" aria-label="Acessar perfil do LinkedIn de André Gaito" className="text-slate-400 hover:text-white transition-colors" title="LinkedIn">
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
