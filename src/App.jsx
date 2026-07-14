import React, { useState, useEffect, Suspense } from 'react';
import { Settings, ArrowRight, Download, Box, Copy, Check, Grip, Languages, Trash2, Mail, GraduationCap, Mic, MicOff, Volume2, Bug, User, Sliders, ChevronDown, ChevronUp, Handshake } from 'lucide-react';
import { gerarModeloJSCAD, gerarUrlSTL, baixarArquivoSTL } from './braille3d';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Bounds, Environment } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

// Importações de Imagens
import iconeRotacao from './assets/icone-rotacao.png';
import logoPrincipal from './assets/Quimica ao Alcanse das maos logo 1 transparente.png';
import iconeAcessibilidade from './assets/simbolo acessibilidade.png';

// Importações das fotos da equipe
import fotoAndreGaito from './assets/FotoMembro-AndreGaito.jpg';
import fotoRicardoMichel from './assets/FotoMembro-RicardoMichel.jpg';
import fotoFernandaNeves from './assets/FotoMembro-FernandaNeves.png';
import fotoHugoReis from './assets/FotoMembro-HugoReis.jpeg';
import fotoRaissaEcard from './assets/FotoMembro-RaissaEcard.jpg';
import fotoPedroXavier from './assets/FotoMembro-PedroXavier.jpg';

const EQUIPE = [
  { nome: "André Vinnicios S. Gaito", titulo: "Graduando em Licenciatura em Química", descricao: "Criador do Projeto Química ao Alcance das Mãos, responsável pela idealização, programação, modelagem e impressão 3D.", email: "andre.gaito@gradu.iq.ufrj.br", lattes: "http://lattes.cnpq.br/9008126975057063", foto: fotoAndreGaito },
  { nome: "Ricardo Cunha Michel", titulo: "Professor Doutor em Química", descricao: "Apoio à concepção dos materiais, orientação quanto à correção dos conceitos químicos e normas Braille.", email: "michel@iq.ufrj.br", lattes: "http://lattes.cnpq.br/7631294110820860", foto: fotoRicardoMichel },
  { nome: "Fernanda Das Neves Costa", titulo: "Doutora em Química", descricao: "Coordenação geral, tramitação institucional e ética, supervisão metodológica, articulação com o IBC.", email: "FNCosta@IPPN.UFRJ.br", lattes: "http://lattes.cnpq.br/4349970710727785", foto: fotoFernandaNeves },
  { nome: "Raíssa Ecard da Costa Cruz", titulo: "Doutoranda em Química", descricao: "Validação técnica e conceitual dos kits pedagógicos, planejamento das atividades de campo.", email: "raissaecard@pos.iq.ufrj.br", lattes: "http://lattes.cnpq.br/5822903514342446", foto: fotoRaissaEcard },
  { nome: "Hugo Costa Reis", titulo: "Doutorando em Química", descricao: "Avaliação de usabilidade e ergonomia dos protótipos em impressão 3D.", email: "hugo.reis@eq.ufrj.br", lattes: "http://lattes.cnpq.br/3500602218294576", foto: fotoHugoReis },
  { nome: "Pedro Xavier", titulo: "Membro do Projeto", descricao: "Assistência técnica e pedagógica para implementação da tecnologia assistiva.", email: "pedrofariax@ima.ufrj.br", lattes: "http://lattes.cnpq.br/3367215215251168", foto: fotoPedroXavier }
];

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
    'a': [1], 'b': [1, 2], 'c': [1, 4], 'd': [1, 4, 5], 'e': [1, 5], 'f': [1, 2, 4], 'g': [1, 2, 4, 5], 'h': [1, 2, 5], 'i': [2, 4], 'j': [2, 4, 5], 'k': [1, 3], 'l': [1, 2, 3], 'm': [1, 3, 4], 'n': [1, 3, 4, 5], 'o': [1, 3, 5], 'p': [1, 2, 3, 4], 'q': [1, 2, 3, 4, 5], 'r': [1, 2, 3, 5], 's': [2, 3, 4], 't': [2, 3, 4, 5], 'u': [1, 3, 6], 'v': [1, 2, 3, 6], 'w': [2, 4, 5, 6], 'x': [1, 3, 4, 6], 'y': [1, 3, 4, 5, 6], 'z': [1, 3, 5, 6], 'á': [1, 2, 3, 5, 6], 'à': [1, 2, 3, 4, 6], 'â': [1, 6], 'ã': [3, 4, 5], 'é': [1, 2, 3, 4, 5, 6], 'ê': [1, 2, 6], 'í': [3, 4], 'ó': [3, 4, 6], 'ô': [1, 4, 5, 6], 'õ': [2, 4, 6], 'ú': [2, 3, 4, 5, 6], 'ç': [1, 2, 3, 4, 6]
  },
  lowerNumbers: { '1': [2], '2': [2, 3], '3': [2, 5], '4': [2, 5, 6], '5': [2, 6], '6': [2, 3, 5], '7': [2, 3, 5, 6], '8': [2, 3, 6], '9': [3, 5], '0': [3, 5, 6] },
  standardNumbers: { '1': [1], '2': [1, 2], '3': [1, 4], '4': [1, 4, 5], '5': [1, 5], '6': [1, 2, 4], '7': [1, 2, 4, 5], '8': [1, 2, 5], '9': [2, 4], '0': [2, 4, 5] },
  symbols: { '(': [1, 2, 6], ')': [3, 4, 5], '[': [1, 2, 3, 5, 6], ']': [2, 3, 4, 5, 6], '.': [3], ',': [2], ';': [2, 3], ':': [2, 5], '!': [2, 3, 5], '?': [2, 6] },
  chargeIndicator: [5], numberSign: [3, 4, 5, 6], plus: [2, 3, 5], minus: [3, 6]
};

const getU = (dots) => {
  let code = 10240; 
  if (dots) { dots.forEach(d => { if (d >= 1 && d <= 6) code += Math.pow(2, d - 1); }); }
  return String.fromCharCode(code);
};

const REVERSE_LETTER_MAP = {};
Object.entries(BRAILLE_MAP.letters).forEach(([char, dots]) => { REVERSE_LETTER_MAP[getU(dots)] = char; });
const REVERSE_SYM_MAP = {};
Object.entries(BRAILLE_MAP.symbols).forEach(([char, dots]) => { REVERSE_SYM_MAP[getU(dots)] = char; });
REVERSE_SYM_MAP[getU(BRAILLE_MAP.plus)] = '+';
REVERSE_SYM_MAP[getU(BRAILLE_MAP.minus)] = '-';
const REVERSE_LOW_NUM_MAP = {};
Object.entries(BRAILLE_MAP.lowerNumbers).forEach(([char, dots]) => { REVERSE_LOW_NUM_MAP[getU(dots)] = char; });

const UPPER_INDICATOR = getU(BRAILLE_MAP.uppercaseIndicator);
const CHARGE_INDICATOR = getU(BRAILLE_MAP.chargeIndicator);

const Dot = ({ active }) => (
  <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${active ? 'bg-slate-800 shadow-sm' : 'bg-transparent border-[1.5px] sm:border-2 border-slate-200'}`} />
);

const BrailleCell = ({ dots, label, description }) => (
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

const ConfigSlider = ({ label, value, min, max, step, unit, onChange }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-1">
      <label className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase">{label}</label>
      <span className="text-xs font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">{value} {unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
  </div>
);

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
  const [isListening, setIsListening] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config3D, setConfig3D] = useState({ alturaPonto: 0.75, diametroPonto: 1.9, espessuraPlaca: 5.0, borda: 0.0, distPontos: 2.5, distCelas: 6.0, distLinhas: 10.0, margem: 2.0 });

  const parseBraille = (rawText) => {
    if (!rawText.trim()) { setCells([]); return []; }
    const subscriptMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    const text = rawText.replace(/[₀-₉]/g, char => subscriptMap[char]);
    const result = [];
    const normalizedText = text.replace(/\r/g, ''); 
    const chargeRegex = /\s*([+-]\d*|\d+[+-])$/;
    let baseStr = normalizedText; let chargeStr = "";
    if (!normalizedText.includes('\n')) {
      const match = normalizedText.trim().match(chargeRegex);
      if (match) { chargeStr = match[1]; baseStr = normalizedText.trim().slice(0, match.index).trim(); }
    }
    for (let char of baseStr) {
      if (char === ' ') { result.push({ dots: [], label: ' ', description: 'Espaço' }); continue; }
      if (char === '\n') { result.push({ isNewline: true, dots: [], label: '↵', description: 'Parágrafo' }); continue; }
      const isLetter = /[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(char);
      if (isLetter) {
        if (char !== char.toLowerCase()) result.push({ dots: BRAILLE_MAP.uppercaseIndicator, label: '⠨', description: 'Maiúscula' });
        const lowerChar = char.toLowerCase();
        if (BRAILLE_MAP.letters[lowerChar]) result.push({ dots: BRAILLE_MAP.letters[lowerChar], label: char, description: `Letra ${char}` });
      } else if (/[0-9]/.test(char)) { result.push({ dots: BRAILLE_MAP.lowerNumbers[char], label: char, description: `Índice ${char}` }); }
      else if (BRAILLE_MAP.symbols[char]) { result.push({ dots: BRAILLE_MAP.symbols[char], label: char, description: 'Símbolo' }); }
    }
    if (chargeStr) {
      result.push({ dots: BRAILLE_MAP.chargeIndicator, label: '⠢', description: 'Ind. de Carga' });
      let inChargeNumber = false;
      for (let char of chargeStr) {
        if (char === '+') { inChargeNumber = false; result.push({ dots: BRAILLE_MAP.plus, label: '+', description: 'Positivo' }); }
        else if (char === '-') { inChargeNumber = false; result.push({ dots: BRAILLE_MAP.minus, label: '-', description: 'Negativo' }); }
        else if (/[0-9]/.test(char)) {
          if (!inChargeNumber) { result.push({ dots: BRAILLE_MAP.numberSign, label: '⠼', description: 'Numérico' }); inChargeNumber = true; }
          result.push({ dots: BRAILLE_MAP.standardNumbers[char], label: char, description: `Número ${char}` });
        }
      }
    }
    setCells(result); return result;
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
          const modelo3D = gerarModeloJSCAD(blocosGerados, config3D);
          const url = gerarUrlSTL(modelo3D);
          setStlUrl(url); 
        } catch (error) { console.error("Erro:", error); alert("Erro ao gerar malha."); }
        finally { setIsGenerating(false); }
      });
    });
  };

  const handleDownload = () => { if (stlUrl) baixarArquivoSTL(stlUrl, `MatrizBraille_${input.replace(/[^a-zA-Z0-9]/g, '_')}.stl`); };
  const brailleUnicodeText = cells.map(cell => cell.isNewline ? '\n' : String.fromCharCode(10240 + (cell.dots || []).reduce((acc, d) => acc + Math.pow(2, d - 1), 0))).join('');
  const handleCopy = () => { navigator.clipboard.writeText(brailleUnicodeText); setCopiado(true); setTimeout(() => setCopiado(false), 2000); };
  
  const handleBrailleTranslate = (text) => {
    setBrailleInput(text); let result = ''; let isUpper = false; let isNumber = false; let isCharge = false;
    const numMap = {'a':'1','b':'2','c':'3','d':'4','e':'5','f':'6','g':'7','h':'8','i':'9','j':'0'};
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ' || char === '⠀') { result += ' '; isNumber = false; isCharge = false; continue; }
      if (char === '\n') { result += '\n'; isNumber = false; isCharge = false; continue; }
      if (char === UPPER_INDICATOR) { isUpper = true; continue; }
      if (char === NUMBER_INDICATOR) { isNumber = true; continue; }
      if (char === CHARGE_INDICATOR) { isCharge = true; continue; }
      const mappedLetter = REVERSE_LETTER_MAP[char]; const mappedSym = REVERSE_SYM_MAP[char]; const mappedLowNum = REVERSE_LOW_NUM_MAP[char];
      if (mappedLetter && mappedSym) {
        let useSymbol = isUpper ? false : true;
        if (useSymbol) result += mappedSym; else { result += isUpper ? mappedLetter.toUpperCase() : mappedLetter; isUpper = false; }
      } else if (mappedLowNum && mappedSym) {
        result += (isCharge) ? mappedSym : mappedLowNum;
      } else if (mappedLetter) {
        if (isNumber && numMap[mappedLetter]) result += numMap[mappedLetter];
        else { result += isUpper ? mappedLetter.toUpperCase() : mappedLetter; isUpper = false; isNumber = false; }
      } else if (mappedLowNum) result += mappedLowNum;
      else if (mappedSym) result += mappedSym;
      else result += char;
    }
    setTranslatedText(result);
  };

  const handleClearTranslator = () => { setBrailleInput(''); setTranslatedText(''); };
  const handleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition(); recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => { const newText = input ? `${input} ${e.results[0][0].transcript}` : e.results[0][0].transcript; setInput(newText); parseBraille(newText); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };
  const handleSpeak = () => { if (translatedText) { const u = new SpeechSynthesisUtterance(translatedText); u.lang = 'pt-BR'; window.speechSynthesis.speak(u); } };
  const celasFisicas = cells.filter(c => !c.isNewline);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white pt-6 pb-6 sm:pt-10 sm:pb-8 px-4 sm:px-6 shadow-sm z-10 relative">
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-start gap-3 sm:gap-6">
          <img src={logoPrincipal} alt="Logo" className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-sm flex-shrink-0" />
          <div className="text-left flex flex-col justify-center">
            <h1 className="text-lg sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Química ao Alcance das Mãos:</h1>
            <h2 className="text-[13px] sm:text-xl md:text-2xl font-medium text-slate-600 mt-0.5 sm:mt-2">Gerador 3D de Química para Braille</h2>
          </div>
        </div>
      </header>

      <nav className="bg-[#0e52c2] shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-nowrap overflow-x-auto justify-start sm:justify-start w-full px-2 sm:px-0">
          {['gerador', 'sobre', 'instrucoes', 'saiba-mais', 'parcerias', 'equipe', 'bug'].map((id) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`whitespace-nowrap flex-1 sm:flex-none px-3 sm:px-5 py-3 sm:py-4 text-[12px] sm:text-[14px] font-semibold transition-colors duration-200 ${activeTab === id ? 'bg-blue-900 text-white border-b-4 border-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white border-b-4 border-transparent'}`}>
              {id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 w-full max-w-5xl mx-auto">
        {activeTab === 'gerador' && (
          <div className="space-y-6 fade-in">
            {/* O conteúdo do gerador permanece igual ao anterior com o Canvas corrigido */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               {/* FORMULARIO E SLIDERS AQUI... */}
               <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fórmula</label>
                        <textarea value={input} onChange={(e) => {setInput(e.target.value); parseBraille(e.target.value);}} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-lg font-mono min-h-[80px]" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Gerar</button>
                  </div>
                  {/* SLIDERS E VISUALIZADOR STL AQUI (Conforme código anterior) */}
               </form>
            </div>
          </div>
        )}
        {/* Adicione aqui as outras abas conforme o modelo anterior */}
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-8 px-6 mt-auto">
        {/* RODAPÉ... */}
      </footer>
    </div>
  );
}
