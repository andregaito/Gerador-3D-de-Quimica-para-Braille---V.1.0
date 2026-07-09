import React, { useState, useEffect, Suspense } from 'react';
import { Settings, ArrowRight, Download, Box, Copy, Check, Grip, Languages, Trash2, Mail, GraduationCap, Mic, MicOff, Volume2 } from 'lucide-react';
import { gerarModeloJSCAD, gerarUrlSTL, baixarArquivoSTL } from './braille3d';

import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

// Importações de Imagens
import iconeRotacao from './assets/icone-rotacao.png';
import logoPrincipal from './assets/Quimica ao Alcanse das maos logo 1 transparente.png';
import iconeAcessibilidade from './assets/simbolo acessibilidade.png';

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
    <mesh geometry={geom}>
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

const REVERSE_MAP = {};

Object.entries(BRAILLE_MAP.letters).forEach(([char, dots]) => {
  REVERSE_MAP[getU(dots)] = { type: 'letter', char };
});
Object.entries(BRAILLE_MAP.symbols).forEach(([char, dots]) => {
  REVERSE_MAP[getU(dots)] = { type: 'symbol', char };
});
Object.entries(BRAILLE_MAP.lowerNumbers).forEach(([char, dots]) => {
  const u = getU(dots);
  if (REVERSE_MAP[u] && REVERSE_MAP[u].type === 'symbol') {
    if (char !== '1') {
      REVERSE_MAP[u] = { type: 'lowerNumber', char };
    }
  } else {
    REVERSE_MAP[u] = { type: 'lowerNumber', char };
  }
});

REVERSE_MAP[getU(BRAILLE_MAP.plus)] = { type: 'symbol', char: '+' };
REVERSE_MAP[getU(BRAILLE_MAP.minus)] = { type: 'symbol', char: '-' };

const UPPER_INDICATOR = getU(BRAILLE_MAP.uppercaseIndicator);
const NUMBER_INDICATOR = getU(BRAILLE_MAP.numberSign);

const Dot = ({ active }) => (
  <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${active ? 'bg-slate-800 shadow-sm' : 'bg-transparent border-[1.5px] sm:border-2 border-slate-200'}`} />
);

const BrailleCell = ({ dots, label, description }) => {
  return (
    <div className="flex flex-col items-center sm:mx-1 sm:mb-4">
      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-white rounded-md border border-slate-300 shadow-sm">
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

export default function App() {
  const [activeTab, setActiveTab] = useState('gerador');

  const [input, setInput] = useState('Fe(OH)2');
  const [cells, setCells] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [copiado, setCopiado] = useState(false);
  
  const [brailleInput, setBrailleInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  // Estado para controle do ditado por voz
  const [isListening, setIsListening] = useState(false);

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

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const modelo3D = gerarModeloJSCAD(blocosGerados);
          const url = gerarUrlSTL(modelo3D);
          setStlUrl(url); 
        } catch (error) {
          console.error("Erro ao gerar modelo:", error);
          alert("Ocorreu um erro ao gerar a malha 3D.");
        } finally {
          setIsGenerating(false);
        }
      });
    });
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
    const numMap = {'a':'1','b':'2','c':'3','d':'4','e':'5','f':'6','g':'7','h':'8','i':'9','j':'0'};

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ' || char === '⠀') {
        result += ' ';
        isNumber = false;
        continue;
      }
      if (char === '\n') {
        result += '\n';
        isNumber = false;
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
      const mapped = REVERSE_MAP[char];
      if (mapped) {
        if (isNumber && mapped.type === 'letter' && numMap[mapped.char]) {
          result += numMap[mapped.char];
        } else if (mapped.type === 'letter') {
          result += isUpper ? mapped.char.toUpperCase() : mapped.char;
          isUpper = false;
        } else {
          result += mapped.char;
        }
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

  // =========================================================
  // FUNÇÕES DE ÁUDIO (Ditado e Leitura em Voz Alta)
  // =========================================================
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
            src={logoPrincipal} 
            alt="Logo Química ao Alcance das Mãos" 
            className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-sm flex-shrink-0"
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

      <nav className="bg-[#0e52c2] shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-nowrap overflow-x-auto justify-start sm:justify-start w-full px-2 sm:px-0">
          {[
            { id: 'gerador', label: 'Gerador Braille' },
            { id: 'sobre', label: 'Sobre o Projeto' },
            { id: 'instrucoes', label: 'Instruções' },
            { id: 'saiba-mais', label: 'Saiba Mais' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex-1 sm:flex-none px-3 sm:px-8 py-3 sm:py-4 text-[12px] sm:text-[15px] font-semibold transition-colors duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-900 text-white border-b-4 border-white' 
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white border-b-4 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 w-full max-w-5xl mx-auto">
        
        {activeTab === 'gerador' && (
          <div className="space-y-6 fade-in">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-600 space-y-3">
                <p>
                  Converte fórmulas químicas em arquivos 3D (STL) para impressão 3D e leitura tátil, seguindo as normas estabelecidas pela{' '}
                  <a 
                    href="https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
                  >
                    Grafia Química Braille para Uso no Brasil (3ª edição, 2017)
                  </a>.
                </p>
                <div className="border-l-4 border-blue-500 pl-3 bg-slate-50 py-2 pr-3 rounded-r text-sm">
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
              <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
                {/* DIV RELATIVA PARA ACOMODAR O BOTÃO DE MICROFONE */}
                <div className="flex-1 relative">
                  <label htmlFor="ionInput" className="block text-sm font-medium text-slate-700 mb-1">
                    Digite a fórmula do Íon, Composto Químico ou Texto
                  </label>
                  <textarea
                    id="ionInput" 
                    value={input}
                    onChange={(e) => { setInput(e.target.value); parseBraille(e.target.value); }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono resize-y min-h-[80px] pr-12"
                    rows={2}
                    placeholder="Ex: Fe(OH)2 ou qualquer texto multilinhas..."
                  />
                  {/* BOTÃO DE DITADO POR VOZ */}
                  <button
                    type="button"
                    onClick={handleDictation}
                    title="Ditar por voz (Microfone)"
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400' 
                        : 'bg-slate-200 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit" disabled={isGenerating}
                    className={`w-full sm:w-auto px-6 py-3 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2 h-[52px] ${
                      isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <Settings className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Processando Malha...' : 'Visualizar STL'}</span>
                  </button>
                </div>
              </form>
            </div>

            {stlUrl && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <Box className="w-5 h-5 mr-2 text-slate-500" />
                    Pré-visualização do Modelo 3D
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Baixar .STL Pronto</span>
                    <span className="sm:hidden">Baixar STL</span>
                  </button>
                </div>
                
                <div className="w-full h-[350px] bg-slate-900 rounded-lg overflow-hidden relative cursor-move">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`absolute top-4 right-4 z-10 p-1 rounded-full shadow-lg transition-all ${
                      autoRotate ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-slate-700/80 hover:bg-slate-600'
                    }`}
                    title={autoRotate ? "Desligar Rotação Automática" : "Ligar Rotação Automática"}
                  >
                    <img 
                      src={iconeRotacao}
                      alt="Rotacionar" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </button>

                  <Canvas shadows camera={{ position: [0, 50, 100], fov: 45 }}>
                    <Suspense fallback={null}>
                      <Stage environment="city" intensity={0.5} adjustCamera>
                        <StlModel url={stlUrl} />
                      </Stage>
                    </Suspense>
                    <axesHelper args={[30]} />
                    <gridHelper args={[200, 20, '#94a3b8', '#475569']} position={[0, -0.1, 0]} />
                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2.0} enablePan={true} enableZoom={true} />
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
                        className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md flex items-center justify-center space-x-2 transition-colors"
                      >
                        {copiado ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">Copiado!</span>
                          </>
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
                          className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors"
                          title="Apagar todo o texto inserido"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Limpar
                        </button>
                      </div>
                      <textarea
                        value={brailleInput}
                        onChange={(e) => handleBrailleTranslate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-mono text-slate-800 mb-4 resize-y min-h-[4rem]"
                        placeholder="Cole caracteres Braille aqui..."
                      />
                      
                      {/* BOTÃO DE LER EM VOZ ALTA (TTS) */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-xs font-bold text-slate-500 uppercase">
                          <Languages className="w-4 h-4 mr-1.5 text-blue-500" />
                          Tradução em Português
                        </span>
                        <button
                          onClick={handleSpeak}
                          disabled={!translatedText}
                          className="px-2 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Ouvir tradução em voz alta"
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Ouvir
                        </button>
                      </div>

                      <div className="text-lg text-slate-800 font-medium min-h-[2.5rem] whitespace-pre-wrap break-words bg-slate-200/50 px-3 py-2 rounded-md border border-slate-200 flex-1">
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

        {/* OUTRAS ABAS (Subpáginas) */}
        {activeTab === 'sobre' && (
  <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200 text-slate-700 fade-in space-y-8 text-left">
    
    <div className="border-b border-slate-100 pb-6">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Química ao Alcance das Mãos</h2>
      <p className="text-lg text-blue-600 font-medium mt-2">Democratizando o ensino de ciências através da tecnologia e da manufatura aditiva.</p>
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

    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Sobre o Desenvolvedor</h3>
      <p className="text-sm leading-relaxed">
        Idealizado e desenvolvido por <strong>André Vinnicios S. Gaito</strong>, o projeto une paixão por química, programação e desenvolvimento de hardware. Movido pela filosofia do movimento maker, André busca transformar a forma como ferramentas educacionais são construídas, provando que a verdadeira inovação acontece quando a ciência é colocada ao alcance de todas as mãos.
      </p>
    </div>

  </div>
)}

        {activeTab === 'instrucoes' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 fade-in">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Instruções de Impressão</h2>
            <p>Área reservada para guias passo a passo de como fatiar e imprimir o modelo STL gerado.</p>
          </div>
        )}

        {activeTab === 'saiba-mais' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 fade-in">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Saiba Mais</h2>
            <p>Área reservada para atualizações, parcerias e futuro do projeto.</p>
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
                Criado por <a href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">André Vinnicios S. Gaito</a>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <a href="mailto:andrevinniciosgaito@gmail.com" className="text-slate-400 hover:text-white transition-colors" title="Enviar E-mail">
              <Mail className="w-6 h-6" />
            </a>
            <a href="http://lattes.cnpq.br/9008126975057063" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Currículo Lattes">
              <GraduationCap className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/andre_gaito/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Instagram">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="https://github.com/andregaito/Gerador-3D-de-Quimica-para-Braille---V.1.0" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
              <GithubIcon className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" title="LinkedIn">
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
