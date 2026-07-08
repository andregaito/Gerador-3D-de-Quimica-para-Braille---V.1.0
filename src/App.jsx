import React, { useState, useEffect, Suspense } from 'react';
import { Beaker, Settings, AlertCircle, ArrowRight, Download, Box, Copy, Check } from 'lucide-react';
import { gerarModeloJSCAD, gerarUrlSTL, baixarArquivoSTL } from './braille3d';

import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import iconeRotacao from './assets/icone-rotacao.png';

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

// =========================================================
// LÓGICA DO TRADUTOR REVERSO (Braille -> Português)
// =========================================================
const getU = (dots) => {
  let code = 10240; // Base do Braille (U+2800)
  if (dots) {
    dots.forEach(d => { if (d >= 1 && d <= 6) code += Math.pow(2, d - 1); });
  }
  return String.fromCharCode(code);
};

const REVERSE_MAP = {};
Object.entries(BRAILLE_MAP.letters).forEach(([char, dots]) => {
  REVERSE_MAP[getU(dots)] = { type: 'letter', char };
});
Object.entries(BRAILLE_MAP.lowerNumbers).forEach(([char, dots]) => {
  REVERSE_MAP[getU(dots)] = { type: 'lowerNumber', char };
});
Object.entries(BRAILLE_MAP.symbols).forEach(([char, dots]) => {
  REVERSE_MAP[getU(dots)] = { type: 'symbol', char };
});
REVERSE_MAP[getU(BRAILLE_MAP.plus)] = { type: 'symbol', char: '+' };
REVERSE_MAP[getU(BRAILLE_MAP.minus)] = { type: 'symbol', char: '-' };

const UPPER_INDICATOR = getU(BRAILLE_MAP.uppercaseIndicator);
const NUMBER_INDICATOR = getU(BRAILLE_MAP.numberSign);
// =========================================================

const Dot = ({ active }) => (
  <div className={`w-4 h-4 rounded-full transition-colors duration-300 ${active ? 'bg-slate-800 shadow-sm' : 'bg-transparent border-2 border-slate-200'}`} />
);

const BrailleCell = ({ dots, label, description }) => {
  return (
    <div className="flex flex-col items-center mx-1 mb-4">
      <div className="grid grid-cols-2 gap-1.5 p-2 bg-white rounded-md border border-slate-300 shadow-sm">
        <Dot active={dots.includes(1)} /> <Dot active={dots.includes(4)} />
        <Dot active={dots.includes(2)} /> <Dot active={dots.includes(5)} />
        <Dot active={dots.includes(3)} /> <Dot active={dots.includes(6)} />
      </div>
      <div className="mt-2 text-center flex flex-col items-center justify-center">
        <span className="block text-sm font-bold text-slate-700 h-5">{label}</span>
        <span className="block text-xs text-slate-500 w-16 leading-tight break-words">{description}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [input, setInput] = useState('Fe(OH)2');
  const [cells, setCells] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [copiado, setCopiado] = useState(false);
  
  // Novos Estados para o Tradutor Reverso
  const [brailleInput, setBrailleInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const parseBraille = (text) => {
    if (!text.trim()) {
      setCells([]);
      return [];
    }
    
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

  // Função para executar a tradução Braille -> Português
  const handleBrailleTranslate = (text) => {
    setBrailleInput(text);
    let result = '';
    let isUpper = false;
    let isNumber = false;
    // Map para traduzir números padrão (precedidos pelo NUMBER_INDICATOR)
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
          result += numMap[mapped.char]; // Caso seja um número (a=1, b=2...)
        } else if (mapped.type === 'letter') {
          result += isUpper ? mapped.char.toUpperCase() : mapped.char;
          isUpper = false; // Consome o estado de Maiúscula após aplicar
        } else {
          result += mapped.char; // Simbolos, índices inferiores, etc.
        }
      } else {
        result += char; // Mantém o caractere se for desconhecido
      }
    }
    setTranslatedText(result);
  };

  const celasFisicas = cells.filter(c => !c.isNewline);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <Beaker className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-slate-800">Gerador 3D de Química em Braille, por André Gaito</h1>
          </div>
          <div className="text-slate-600 space-y-2">
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
            <p className="text-sm border-l-4 border-blue-500 pl-3 bg-slate-50 p-2 rounded-r">
              Uma ferramenta de tecnologia assistiva desenvolvida por{' '}
              <a 
                href="https://www.linkedin.com/in/andre-gaito-2a58151b1/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline cursor-pointer text-inherit"
              >
                <strong>André Vinnicios S. Gaito</strong>
              </a>{' '}
              para facilitar a inclusão no ensino de ciências e tornar a química ao alcance de todos.
            </p>
          </div>
        </div>

        {/* Formulário de Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="ionInput" className="block text-sm font-medium text-slate-700 mb-1">
                Digite a fórmula do Íon, Composto Químico ou Texto
              </label>
              <textarea
                id="ionInput" 
                value={input}
                onChange={(e) => { setInput(e.target.value); parseBraille(e.target.value); }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono resize-y min-h-[80px]"
                rows={2}
                placeholder="Ex: Fe(OH)2 ou qualquer texto multilinhas..."
              />
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

        {/* Visualizador 3D */}
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
                <span>Baixar .STL Pronto</span>
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

        {/* Visualização 2D e Área de Tradução */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">Visualização das Celas Braille (Leitura Tátil 2D) <ArrowRight className="w-4 h-4 ml-2 text-slate-400" /></h2>
          
          {cells.length > 0 ? (
            <div>
              <div className="flex flex-wrap items-start bg-slate-100 p-6 rounded-lg border border-slate-200 overflow-x-auto min-h-[180px]">
                {cells.map((cell, index) => {
                  if (cell.isNewline) return <div key={`nl-${index}`} className="w-full h-4"></div>;
                  return <BrailleCell key={index} dots={cell.dots} label={cell.label} description={cell.description} />;
                })}
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-slate-500 border-t border-slate-100 pt-4">
                <p>Largura estimada na impressão: <span className="font-bold text-slate-700">~{(celasFisicas.length * 6.5).toFixed(1)} mm</span></p>
                <p>Total: <span className="font-bold text-slate-700">{celasFisicas.length}</span> celas</p>
              </div>

              {/* CONTAINERS LADO A LADO - Copiar Braille e Tradutor Reverso */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                
                {/* Lado Esquerdo: Copiar o Braille Gerado */}
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

                {/* Lado Direito: Tradutor Reverso */}
                <div className="md:w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col">
                  <span className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tradutor Reverso (Braille ➔ Português)</span>
                  <textarea
                    value={brailleInput}
                    onChange={(e) => handleBrailleTranslate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-mono text-slate-800 mb-3 resize-y min-h-[4rem]"
                    placeholder="Cole caracteres Braille aqui..."
                  />
                  <span className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tradução:</span>
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
    </div>
  );
}
