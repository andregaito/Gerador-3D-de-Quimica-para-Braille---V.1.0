import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Settings, ArrowRight, Download, Box, Copy, Check, Grip, Languages, Trash2, Mail, GraduationCap, Mic, MicOff, Volume2, Bug, User, Sliders, ChevronDown, ChevronUp, Handshake, Palette, Info, Heart, Layers, Eye, EyeOff } from 'lucide-react';
import { gerarModeloJSCAD, geradorBlocoIonicoJSCAD, gerarUrlSTL, baixarArquivoSTL } from './braille3d';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Bounds, Environment } from '@react-three/drei';
import { STLLoader, STLExporter } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

// Importações de Imagens Principais e Logos Dinâmicas por Cor
import iconeRotacao from './assets/icone-rotacao.png';
import logoPrincipal from './assets/Quimica ao Alcanse das maos logo 1 transparente.png';
import logoAmarelo from './assets/Quimica ao Alcanse das maos logo transparente AMARELO.png';
import logoAzul from './assets/Quimica ao Alcanse das maos logo transparente AZUL.png';
import logoLaranja from './assets/Quimica ao Alcanse das maos logo transparente LARANJA.png';
import logoRosa from './assets/Quimica ao Alcanse das maos logo transparente ROSA.png';
import logoRoxo from './assets/Quimica ao Alcanse das maos logo transparente ROXO.png';
import logoVerde from './assets/Quimica ao Alcanse das maos logo transparente VERDE.png';
import logoVermelho from './assets/Quimica ao Alcanse das maos logo transparente VERMELHO.png';
import iconeAcessibilidade from './assets/simbolo acessibilidade.png';

// Importações do Guia do OrcaSlicer
import imgSelecaoImpressora from './assets/Selecao Impressora 3D Orca Slicer.png';
import imgMenuInicial from './assets/Menu Inicial Orca Slicer.png';
import imgPreVisualizacao from './assets/Pre visualizacao Peca 3D.png';
import imgMultiCor from './assets/Previsualizar Multi cor Orca slicer.png';

// DADOS DA EQUIPE E ÍCONES
import fotoAndreGaito from './assets/FotoMembro-AndreGaito.jpg';
import fotoRicardoMichel from './assets/FotoMembro-RicardoMichel.jpg';
import fotoFernandaNeves from './assets/FotoMembro-FernandaNeves.png';
import fotoHugoReis from './assets/FotoMembro-HugoReis.jpeg';
import fotoRaissaEcard from './assets/FotoMembro-RaissaEcard.jpg';
import fotoPedroXavier from './assets/FotoMembro-PedroXavier.jpg';

const EQUIPE = [
  { nome: "André Vinnicios S. Gaito", titulo: "Graduando em Licenciatura em Química", descricao: "Criador do Projeto Química ao Alcance das Mãos, responsável pela idealização, programação, modelagem, impressão 3D e aplicação/validação dos materiais didáticos produzidos.", email: "andre.gaito@gradu.iq.ufrj.br", lattes: "[http://lattes.cnpq.br/9008126975057063](http://lattes.cnpq.br/9008126975057063)", foto: fotoAndreGaito },
  { nome: "Ricardo Cunha Michel", titulo: "Professor Doutor em Química", descricao: "Apoio à concepção dos materiais, orientação quanto à correção dos conceitos químicos e normas Braille, produção de recursos e estratégias de aplicação e coleta de dados.", email: "michel@iq.ufrj.br", lattes: "[http://lattes.cnpq.br/7631294110820860](http://lattes.cnpq.br/7631294110820860)", foto: fotoRicardoMichel },
  { nome: "Fernanda Das Neves Costa", titulo: "Professora Doutora em Química", descricao: "Coordenação geral, tramitação institucional e ética, supervisão metodológica, articulação com o Instituto Benjamin Costant (IBC) e validação educacional dos instrumentos.", email: "FNCosta@IPPN.UFRJ.br", lattes: "[http://lattes.cnpq.br/4349970710727785](http://lattes.cnpq.br/4349970710727785)", foto: fotoFernandaNeves },
  { nome: "Raíssa Ecard da Costa Cruz", titulo: "Doutoranda em Química", descricao: "Validação técnica e conceitual dos kits pedagógicos, planejamento das atividades de campo, co-mediação nas intervenções educacionais e suporte metodológico.", email: "raissaecard@pos.iq.ufrj.br", lattes: "[http://lattes.cnpq.br/5822903514342446](http://lattes.cnpq.br/5822903514342446)", foto: fotoRaissaEcard },
  { nome: "Hugo Costa Reis", titulo: "Doutorando em Química", descricao: "Avaliação de usabilidade e ergonomia dos protótipos em impressão 3D, estruturação logística para a execução das dinâmicas, co-moderação na aplicação dos materiais.", email: "hugo.reis@eq.frj.br", lattes: "[http://lattes.cnpq.br/3500602218294576](http://lattes.cnpq.br/3500602218294576)", foto: fotoHugoReis },
  { nome: "Pedro Xavier", titulo: "Mestrando em Química", descricao: "Assistência técnica e pedagógica para implementação da tecnologia assistiva, impressão 3D e Modelagem dos materiais.", email: "pedrofariax@ima.ufrj.br", lattes: "[http://lattes.cnpq.br/3367215215251168](http://lattes.cnpq.br/3367215215251168)", foto: fotoPedroXavier }
];

const GithubIcon = ({ className }) => <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>;
const InstagramIcon = ({ className }) => <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

// RENDERIZADOR 3D COM EXTRATOR DE DIMENSÕES
const StlModel = ({ url, cor, onDimensionsParsed }) => {
  const originalGeom = useLoader(STLLoader, url);
  
  const geom = useMemo(() => {
    const clonedGeom = originalGeom.clone();
    clonedGeom.computeBoundingBox();
    const box = clonedGeom.boundingBox;
    
    if (onDimensionsParsed) {
      const sizeX = Math.abs(box.max.x - box.min.x);
      const sizeY = Math.abs(box.max.y - box.min.y);
      const sizeZ = Math.abs(box.max.z - box.min.z);
      onDimensionsParsed({ x: sizeX.toFixed(1), y: sizeY.toFixed(1), z: sizeZ.toFixed(1) });
    }

    const centerX = (box.max.x + box.min.x) / 2;
    const centerZ = (box.max.z + box.min.z) / 2;
    clonedGeom.translate(-centerX, -box.min.y, -centerZ);
    clonedGeom.computeBoundingBox();    
    return clonedGeom;
  }, [originalGeom, onDimensionsParsed]);

  return (
    <mesh geometry={geom} castShadow receiveShadow position={[0, 0, 0]}>
      <meshStandardMaterial color={cor || "#0e52c2"} roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

// OVERLAY DE DIMENSÕES
const DimensionsOverlay = ({ dimensions, isVisible }) => {
  if (!dimensions || !isVisible) return null;
  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur border border-slate-700 p-3 rounded-lg shadow-xl text-white select-none pointer-events-none transition-opacity duration-300">
      <h4 className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider text-center">Dimensões Totais</h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div><span className="block text-[10px] text-red-400 font-bold mb-0.5">X (Larg)</span><span className="font-mono font-bold text-[13px]">{dimensions.x}<span className="text-[9px] ml-0.5">mm</span></span></div>
        <div><span className="block text-[10px] text-green-400 font-bold mb-0.5">Y (Alt)</span><span className="font-mono font-bold text-[13px]">{dimensions.y}<span className="text-[9px] ml-0.5">mm</span></span></div>
        <div><span className="block text-[10px] text-blue-400 font-bold mb-0.5">Z (Esp)</span><span className="font-mono font-bold text-[13px]">{dimensions.z}<span className="text-[9px] ml-0.5">mm</span></span></div>
      </div>
    </div>
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
  if (dots) { dots.forEach(d => { if (d >= 1 && d <= 6) code += Math.pow(2, d - 1); }); }
  return String.fromCharCode(code);
};

const REVERSE_LETTER_MAP = {}; Object.entries(BRAILLE_MAP.letters).forEach(([char, dots]) => { REVERSE_LETTER_MAP[getU(dots)] = char; });
const REVERSE_SYM_MAP = {}; Object.entries(BRAILLE_MAP.symbols).forEach(([char, dots]) => { REVERSE_SYM_MAP[getU(dots)] = char; });
REVERSE_SYM_MAP[getU(BRAILLE_MAP.plus)] = '+'; REVERSE_SYM_MAP[getU(BRAILLE_MAP.minus)] = '-';
const REVERSE_LOW_NUM_MAP = {}; Object.entries(BRAILLE_MAP.lowerNumbers).forEach(([char, dots]) => { REVERSE_LOW_NUM_MAP[getU(dots)] = char; });

const UPPER_INDICATOR = getU(BRAILLE_MAP.uppercaseIndicator);
const NUMBER_INDICATOR = getU(BRAILLE_MAP.numberSign);
const CHARGE_INDICATOR = getU(BRAILLE_MAP.chargeIndicator);

const Dot = ({ active }) => (
  <div className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-colors duration-300 ${active ? 'bg-slate-800 shadow-sm' : 'bg-transparent border-[1.5px] sm:border-2 border-slate-200'}`} />
);

const BrailleCell = ({ dots, label, description }) => {
  return (
    <div className="flex flex-col items-center sm:mx-1 sm:mb-4" role="group" aria-label={`Cela Braille: ${description}`}>
      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-white rounded-md shadow-sm" aria-hidden="true">
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
      <span className="text-xs font-mono px-2 py-0.5 rounded transition-colors" style={{ color: cor, backgroundColor: `${cor}1A`, border: `1px solid ${cor}33` }}>
        {value} {unit}
      </span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} 
      value={value} onChange={onChange} 
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
      style={{ accentColor: cor }}
    />
  </div>
);

const getTheme = (idOrHex) => {
  const predefined = {
    '#0e52c2': { cabecalho: '#ffffff', abaNormal: '#0e52c2', abaAtiva: '#0a3d91', fundoPrincipal: '#869fd8', btnVisualizar: '#0e52c2', btnBaixar: '#059669', fundoCaixa: '#ffffff', fundoSubCaixa: '#f8fafc', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#0e52c2', logo: logoAzul, textoSubCaixa: '#1e293b' },
    '#1a8441': { cabecalho: '#ffffff', abaNormal: '#1a8441', abaAtiva: '#1c6030', fundoPrincipal: '#87a194', btnVisualizar: '#1c6030', btnBaixar: '#066a63', fundoCaixa: '#eaf6f0', fundoSubCaixa: '#c3e4d3', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#1a8441', logo: logoVerde, textoSubCaixa: '#1e293b' },
    '#511576': { cabecalho: '#d8cff6', abaNormal: '#511576', abaAtiva: '#380d60', fundoPrincipal: '#87a2da', btnVisualizar: '#591884', btnBaixar: '#93e450', fundoCaixa: '#ede9fe', fundoSubCaixa: '#e8dafd', textoAba: '#a0f658', textoAbaNormal: 'rgba(160,246,88,0.6)', textoBtnVis: '#a0f658', borderBtnVis: '#a0f658', textoBtnBaixar: '#591884', borderBtnBaixar: '#591884', bordaGeral: '#cdc7f3', logo: logoRoxo, textoSubCaixa: '#000000' },
    '#db2777': { cabecalho: '#ffffff', abaNormal: '#db2777', abaAtiva: '#be185d', fundoPrincipal: '#f4a6c8', btnVisualizar: '#db2777', btnBaixar: '#059669', fundoCaixa: '#fdf2f8', fundoSubCaixa: '#fce7f3', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#db2777', logo: logoRosa, textoSubCaixa: '#1e293b' },
    '#dc2626': { cabecalho: '#ffffff', abaNormal: '#dc2626', abaAtiva: '#b91c1c', fundoPrincipal: '#f19e9e', btnVisualizar: '#dc2626', btnBaixar: '#059669', fundoCaixa: '#fef2f2', fundoSubCaixa: '#fee2e2', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#dc2626', logo: logoVermelho, textoSubCaixa: '#1e293b' },
    '#ea580c': { cabecalho: '#ffffff', abaNormal: '#ea580c', abaAtiva: '#c2410c', fundoPrincipal: '#f8bd9d', btnVisualizar: '#ea580c', btnBaixar: '#059669', fundoCaixa: '#fff7ed', fundoSubCaixa: '#ffedd5', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#ea580c', logo: logoLaranja, textoSubCaixa: '#1e293b' },
    '#ca8a04': { cabecalho: '#ffffff', abaNormal: '#ca8a04', abaAtiva: '#a16207', fundoPrincipal: '#f7dfa4', btnVisualizar: '#ca8a04', btnBaixar: '#059669', fundoCaixa: '#fefce8', fundoSubCaixa: '#fef9c3', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: '#ca8a04', logo: logoAmarelo, textoSubCaixa: '#1e293b' }
  };
  if (predefined[idOrHex]) return { corPrincipal: idOrHex, ...predefined[idOrHex] };
  return { corPrincipal: idOrHex, cabecalho: '#ffffff', abaNormal: idOrHex, abaAtiva: 'rgba(0,0,0,0.25)', fundoPrincipal: `${idOrHex}20`, btnVisualizar: idOrHex, btnBaixar: '#059669', fundoCaixa: '#ffffff', fundoSubCaixa: '#f8fafc', textoAba: '#ffffff', textoAbaNormal: 'rgba(255,255,255,0.7)', textoBtnVis: '#ffffff', borderBtnVis: 'transparent', textoBtnBaixar: '#ffffff', borderBtnBaixar: 'transparent', bordaGeral: idOrHex, logo: logoPrincipal, textoSubCaixa: '#1e293b' };
};

// Logica Cores Dinâmicas dos Blocos Ionicos baseado no Tema Escolhido
const getIonColorBasedOnTheme = (themeHex, ionType) => {
  const map = {
    '#0e52c2': { cation: '#0e52c2', anion: '#dc2626' }, 
    '#511576': { cation: '#1a8441', anion: '#511576' }, 
    '#1a8441': { cation: '#1a8441', anion: '#ea580c' }, 
    '#dc2626': { cation: '#0e52c2', anion: '#dc2626' }, 
    '#ea580c': { cation: '#1a8441', anion: '#ea580c' }, 
    '#ca8a04': { cation: '#ca8a04', anion: '#ff4500' }, 
    '#db2777': { cation: '#db2777', anion: '#a855f7' }  
  };
  if (map[themeHex]) return map[themeHex][ionType];
  return ionType === 'cation' ? '#0e52c2' : '#dc2626'; 
};

const ColorTester = ({ corPrincipal, setCorPrincipal }) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const isRoxo = corPrincipal === '#511576';
  const CORES_PREDEFINIDAS = [
    { nome: 'Azul', hex: '#0e52c2' }, { nome: 'Roxo', hex: '#511576' }, { nome: 'Rosa', hex: '#db2777' },
    { nome: 'Vermelho', hex: '#dc2626' }, { nome: 'Laranja', hex: '#ea580c' }, { nome: 'Amarelo', hex: '#ca8a04' },
    { nome: 'Verde', hex: '#1a8441' }
  ];

  useEffect(() => {
    const handleScroll = () => { if (menuAberto) setMenuAberto(false); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuAberto]);

  return (
    <div className="relative flex items-center space-x-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border shadow-sm flex-shrink-0 z-10 transition-colors duration-500" style={{ borderColor: `${corPrincipal}40` }}>
      <button type="button" onClick={() => { setCorPrincipal(isRoxo ? '#0e52c2' : '#511576'); setMenuAberto(false); }} className="w-11 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none cursor-pointer flex-shrink-0" style={{ backgroundColor: isRoxo ? '#511576' : '#0e52c2' }}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isRoxo ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <div className="relative">
        <button onClick={() => setMenuAberto(!menuAberto)} className="cursor-pointer text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center p-1">
          <Palette className="w-5 h-5 transition-colors" style={{ color: (!isRoxo && corPrincipal !== '#0e52c2') ? corPrincipal : undefined }} />
        </button>
        {menuAberto && (
          <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-xl border-2 flex flex-col gap-3 w-max z-50 animate-fadeIn transition-colors duration-500" style={{ borderColor: corPrincipal }}>
            <span className="text-[11px] font-bold text-slate-500 uppercase px-1">Cores Predefinidas</span>
            <div className="flex flex-nowrap items-center gap-2 px-1">
              {CORES_PREDEFINIDAS.map(c => (
                <button key={c.nome} type="button" onClick={() => { setCorPrincipal(c.hex); setMenuAberto(false); }} className={`w-7 h-7 rounded-full shadow-sm hover:scale-110 transition-transform flex-shrink-0 ${corPrincipal === c.hex ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`} style={{ backgroundColor: c.hex }} title={c.nome} />
              ))}
            </div>
            <div className="border-t border-slate-100 my-1"></div>
            <label className="flex items-center justify-between px-1 cursor-pointer hover:bg-slate-50 rounded p-1.5 transition-colors">
              <span className="text-xs font-semibold text-slate-600">Cor Livre (RGB)</span>
              <input type="color" value={corPrincipal} onChange={(e) => setCorPrincipal(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 shadow-sm" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const checarSugestaoQuimica = (texto) => {
  const limpo = texto.trim();
  if (!limpo || limpo.length < 2 || limpo.includes(' ')) return null;

  const noxElementos = {
    'H': ['H+', 'H-'], 'Li': ['Li+'], 'Na': ['Na+'], 'K': ['K+'], 'Rb': ['Rb+'], 'Cs': ['Cs+'],
    'Be': ['Be2+'], 'Mg': ['Mg2+'], 'Ca': ['Ca2+'], 'Sr': ['Sr2+'], 'Ba': ['Ba2+'],
    'Fe': ['Fe2+', 'Fe3+'], 'Cu': ['Cu+', 'Cu2+'], 'Zn': ['Zn2+'], 'Al': ['Al3+'],
    'O': ['O2-', 'O22-'], 'S': ['S2-', 'S4+', 'S6+'], 'F': ['F-'], 'Cl': ['Cl-', 'Cl+', 'Cl3+', 'Cl5+', 'Cl7+']
  };

  const oxidosClassicos = {
    'NaO': ['Na2O', 'Na2O2'], 'KO': ['K2O', 'K2O2'], 'FeO': ['FeO', 'Fe2O3', 'Fe3O4'],
    'Cu2O2': ['CuO'], 'CO3': ['CO', 'CO2'], 'SO': ['SO2', 'SO3'], 'SO4': ['SO2', 'SO3']
  };

  const compostosEnsinoMedio = {
    'NaOH2': ['NaOH'], 'Ca(OH)': ['Ca(OH)2'], 'HSO4': ['H2SO4'], 'HNO': ['HNO2', 'HNO3'],
    'HPO4': ['H3PO4'], 'HCO3': ['H2CO3'], 'NaCl2': ['NaCl'], 'CaSO42': ['CaSO4']
  };

  const dicionarioGeral = { ...oxidosClassicos, ...compostosEnsinoMedio };

  for (let errado in dicionarioGeral) {
    if (limpo.toUpperCase() === errado.toUpperCase()) {
      return { mensagem: `A proporção estequiométrica ou valência mais comum para esta substância é diferente.`, sugestoes: dicionarioGeral[errado] };
    }
  }

  const matchIon = limpo.match(/^([A-Z][a-z]?)([0-9]*)([+-])([0-9]*)$/);
  if (matchIon) {
    const [, elemento, numAntes, sinal, numDepois] = matchIon;
    const numeroCarga = numAntes || numDepois || '1';
    
    if (numeroCarga === '1') {
      const formCorreta = `${elemento}${sinal}`;
      if (limpo !== formCorreta && noxElementos[elemento] && noxElementos[elemento].includes(formCorreta)) {
        return { mensagem: `Na grafia química padrão, o número 1 na carga unitária é omitido.`, sugestoes: [formCorreta] };
      }
    }

    if (noxElementos[elemento]) {
      const corretaLista = noxElementos[elemento];
      if (!corretaLista.some(c => c.toUpperCase() === limpo.toUpperCase() || c === `${elemento}${numeroCarga}${sinal}`)) {
        return { mensagem: `O elemento ${elemento} não costuma formar o íon digitado. Confira os NOX mais estáveis:`, sugestoes: corretaLista };
      }
    }

    if (numDepois && !numAntes) {
      return { mensagem: `A convenção da IUPAC recomenda colocar o número antes do sinal na carga do íon.`, sugestoes: [`${elemento}${numDepois}${sinal}`] };
    }
  }
  return null;
};

const AlertaSugestao = ({ sugestaoDados, aoAplicarSugestao }) => {
  if (!sugestaoDados) return null;
  return (
    <div role="alert" className="mt-3 bg-amber-50/90 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-sm flex items-start space-x-3 text-left transition-all">
      <div className="p-1 bg-amber-500/10 rounded-full text-amber-600 flex-shrink-0 mt-0.5"><Info className="w-5 h-5" /></div>
      <div className="flex-1 text-xs sm:text-sm text-amber-900 leading-relaxed text-justify">
        <span className="font-semibold block text-amber-950 mb-0.5">Sugestão de Estequiometria / IUPAC:</span>
        {sugestaoDados.mensagem}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-amber-800 font-medium">Talvez você quisesse dizer:</span>
          {sugestaoDados.sugestoes.map((sug, idx) => (
            <button key={idx} type="button" onClick={() => aoAplicarSugestao(sug)} className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-mono font-bold rounded border border-amber-300 shadow-2xs transition-colors cursor-pointer underline decoration-amber-500/50">{sug}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('gerador');
  const [corPrincipal, setCorPrincipal] = useState('#0e52c2'); 
  const theme = getTheme(corPrincipal);

  // Estados Gerador Braille Original
  const [input, setInput] = useState('Fe(OH)2');
  const [cells, setCells] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stlUrl, setStlUrl] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  
  const [dimensoesGerador, setDimensoesGerador] = useState(null);
  const [mostrarDimensoesGerador, setMostrarDimensoesGerador] = useState(true);

  const [copiado, setCopiado] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [brailleInput, setBrailleInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config3D, setConfig3D] = useState({
    alturaPonto: 0.75, diametroPonto: 1.9, espessuraPlaca: 5.0, borda: 0.0,
    distPontos: 2.5, distCelas: 6.0, distLinhas: 10.0, margem: 2.0
  });

  // ESTADOS DA NOVA ABA: BLOCOS IÔNICOS
  const [ionConfig, setIonConfig] = useState({
    tipo: 'cation',
    valencia: 1,
    largura: 55.9,
    altura: 25.0,
    espessura: 5.0,
    larguraEncaixe: 9.1,
    alturaEncaixe: 11.0,
    formula: 'H⁺',
    espessuraTexto: 1.0,
    fonte: 'Arial Black',
    incluirBraille: false,
    corModelo: getIonColorBasedOnTheme(corPrincipal, 'cation'),
    corCustomizada: false
  });
  
  const [ionStlUrl, setIonStlUrl] = useState(null);
  const [isGeneratingIon, setIsGeneratingIon] = useState(false);
  const [dimensoesIonico, setDimensoesIonico] = useState(null);
  const [mostrarDimensoesIonico, setMostrarDimensoesIonico] = useState(true);

  useEffect(() => {
    if (!ionConfig.corCustomizada) {
      setIonConfig(prev => ({ ...prev, corModelo: getIonColorBasedOnTheme(corPrincipal, prev.tipo) }));
    }
  }, [corPrincipal, ionConfig.tipo]);

  const sugestaoQuimica = checarSugestaoQuimica(input);

  const handleAplicarSugestao = (novaFormula) => {
    setInput(novaFormula);
    parseBraille(novaFormula);
  };

  const parseBraille = (rawText) => {
    if (!rawText.trim()) { setCells([]); return []; }
    
    const subscriptMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
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
      if (char === ' ') { result.push({ dots: [], label: ' ', description: 'Espaço' }); continue; }
      if (char === '\n') { result.push({ isNewline: true, dots: [], label: '↵', description: 'Parágrafo' }); continue; }

      const isLetter = /[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(char);

      if (isLetter) {
        if (char !== char.toLowerCase()) result.push({ dots: BRAILLE_MAP.uppercaseIndicator, label: '⠨', description: 'Maiúscula' });
        const lowerChar = char.toLowerCase();
        if (BRAILLE_MAP.letters[lowerChar]) result.push({ dots: BRAILLE_MAP.letters[lowerChar], label: char, description: `Letra ${char}` });
      } else if (/[0-9]/.test(char)) { result.push({ dots: BRAILLE_MAP.lowerNumbers[char], label: char, description: `Índice ${char}` });
      } else if (BRAILLE_MAP.symbols[char]) { result.push({ dots: BRAILLE_MAP.symbols[char], label: char, description: 'Símbolo' }); }
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
    
    setCells(result); 
    return result;
  };

  useEffect(() => { parseBraille(input); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const blocosGerados = parseBraille(input);
    if (!blocosGerados || blocosGerados.length === 0) return;
    
    setIsGenerating(true); setStlUrl(null); setDimensoesGerador(null);
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const modelo3D = gerarModeloJSCAD(blocosGerados, config3D);
      const url = gerarUrlSTL(modelo3D);
      setStlUrl(url); 
    } catch (error) { console.error("Erro ao gerar modelo:", error); alert("Ocorreu um erro ao gerar a malha 3D."); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateIon = async (e) => {
    e.preventDefault();
    setIsGeneratingIon(true); setIonStlUrl(null); setDimensoesIonico(null);
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const brailleGerado = ionConfig.incluirBraille ? parseBraille(ionConfig.formula) : [];
      const modeloIon = geradorBlocoIonicoJSCAD({ ...ionConfig, cellsBraille: brailleGerado });
      setIonStlUrl(gerarUrlSTL(modeloIon));
    } catch (error) { console.error("Erro no bloco iônico:", error); alert("Ocorreu um erro ao modelar o bloco iônico."); }
    finally { setIsGeneratingIon(false); }
  };

  const handleDownload = (urlAlvo, nomeAba = "MatrizBraille") => {
    const alvo = urlAlvo || stlUrl;
    if (!alvo) return;

    const loader = new STLLoader();
    loader.load(alvo, (geometry) => {
      geometry.rotateX(Math.PI / 2);
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const centerX = (box.max.x + box.min.x) / 2;
      const centerY = (box.max.y + box.min.y) / 2;
      geometry.translate(-centerX, -centerY, -box.min.z);

      const mesh = new THREE.Mesh(geometry);
      const exporter = new STLExporter();
      const stlString = exporter.parse(mesh); 
      
      const blob = new Blob([stlString], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const nomeStr = (nomeAba === "BlocoIonico" ? ionConfig.formula : input).replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${nomeAba}_${nomeStr}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    });
  };

  const brailleUnicodeText = cells.map(cell => {
    if (cell.isNewline) return '\n';
    let code = 10240; 
    if (cell.dots) { cell.dots.forEach(d => { if (d >= 1 && d <= 6) code += Math.pow(2, d - 1); }); }
    return String.fromCharCode(code);
  }).join('');

  const handleCopy = () => { navigator.clipboard.writeText(brailleUnicodeText); setCopiado(true); setTimeout(() => setCopiado(false), 2000); };
  const handleCopyPix = () => { navigator.clipboard.writeText('andrevinniciosgaito@gmail.com'); setPixCopiado(true); setTimeout(() => setPixCopiado(false), 3000); };

  const handleBrailleTranslate = (text) => {
    setBrailleInput(text);
    let result = ''; let isUpper = false; let isNumber = false; let isCharge = false;
    const numMap = {'a':'1','b':'2','c':'3','d':'4','e':'5','f':'6','g':'7','h':'8','i':'9','j':'0'};

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ' || char === '⠀') { result += ' '; isNumber = false; isCharge = false; continue; }
      if (char === '\n') { result += '\n'; isNumber = false; isCharge = false; continue; }
      if (char === UPPER_INDICATOR) { isUpper = true; continue; }
      if (char === NUMBER_INDICATOR) { isNumber = true; continue; }
      if (char === CHARGE_INDICATOR) { isCharge = true; continue; }

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
        if (isUpper) { useSymbol = false; } else {
          let nextBraille = text[i+1];
          let nextIsLowerLetter = nextBraille && REVERSE_LETTER_MAP[nextBraille] && !REVERSE_SYM_MAP[nextBraille] && nextBraille !== UPPER_INDICATOR && nextBraille !== NUMBER_INDICATOR;
          if (isPrevLower && !isChemicalElement && (nextIsLowerLetter || !nextBraille || nextBraille === ' ' || nextBraille === '\n' || REVERSE_SYM_MAP[nextBraille])) {
            useSymbol = false;
            if (mappedSym === '(' && nextBraille) {
               let nL = REVERSE_LETTER_MAP[nextBraille];
               if (nL === 's' || nL === 'l' || nL === 'g' || nL === 'a') useSymbol = true;
            }
          } else if ((prevChar === ' ' || prevChar === '') && nextIsLowerLetter) { useSymbol = false; }
        }
        if (useSymbol) { result += mappedSym; } else { result += isUpper ? mappedLetter.toUpperCase() : mappedLetter; isUpper = false; }
        continue;
      }

      if (mappedLowNum && mappedSym) {
        if (isCharge) { result += mappedSym; if (mappedSym === '+' || mappedSym === '-') isCharge = false; }
        else { let useNumber = true; if ((isPrevLower && !isChemicalElement) || prevChar === ' ') useNumber = false; result += useNumber ? mappedLowNum : mappedSym; }
        continue;
      }

      if (mappedLetter) {
        if (isNumber && numMap[mappedLetter]) { result += numMap[mappedLetter]; } else { result += isUpper ? mappedLetter.toUpperCase() : mappedLetter; isUpper = false; isNumber = false; }
      } else if (mappedLowNum) { result += mappedLowNum; } else if (mappedSym) { result += mappedSym; if (isCharge && (mappedSym === '+' || mappedSym === '-')) isCharge = false; } else { result += char; }
    }
    setTranslatedText(result);
  };

  const handleClearTranslator = () => { setBrailleInput(''); setTranslatedText(''); };

  const handleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Seu navegador não suporta digitação por voz nativamente."); return; }
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => { const transcript = event.results[0][0].transcript; const newText = input ? `${input} ${transcript}` : transcript; setInput(newText); parseBraille(newText); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSpeak = () => {
    if (!translatedText) return; window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'pt-BR'; utterance.rate = 0.92; utterance.pitch = 1.0;
    const vozes = window.speechSynthesis.getVoices();
    const vozNatural = vozes.find(v => v.lang.includes('pt') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Francisca') || v.name.includes('Antonio'))) || vozes.find(v => v.lang.includes('pt'));
    if (vozNatural) { utterance.voice = vozNatural; }
    window.speechSynthesis.speak(utterance);
  };

  const celasFisicas = cells.filter(c => !c.isNewline);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 transition-colors duration-500" style={{ backgroundColor: theme.fundoPrincipal }}>
      
      <header className="pt-6 pb-6 sm:pt-10 sm:pb-8 px-4 sm:px-6 z-10 relative transition-colors duration-500 shadow-sm" style={{ backgroundColor: theme.cabecalho }}>
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-start gap-3 sm:gap-6">
          <img src={theme.logo || logoPrincipal} alt="Logo" className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-sm flex-shrink-0 transition-all duration-300" />
          <div className="text-left flex flex-col justify-center">
            <h1 className="text-lg sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Química ao Alcance das Mãos:</h1>
            <h2 className="text-[13px] sm:text-xl md:text-2xl font-medium text-slate-600 mt-0.5 sm:mt-2">Gerador 3D de Química para Braille</h2>
          </div>
        </div>
      </header>

      <nav aria-label="Navegação Principal do Projeto" className="shadow-md sticky top-0 z-30 transition-colors duration-500" style={{ backgroundColor: theme.abaNormal }}>
        <div role="tablist" className="max-w-5xl mx-auto flex flex-nowrap overflow-x-auto justify-start sm:justify-start w-full px-2 sm:px-0 scrollbar-hide">
          {[
            { id: 'gerador', label: 'Gerador Braille' },
            { id: 'ionicos', label: 'Blocos Iônicos' },
            { id: 'sobre', label: 'Sobre o Projeto' },
            { id: 'instrucoes', label: 'Instruções' },
            { id: 'saiba-mais', label: 'Saiba Mais' },
            { id: 'parcerias', label: 'Parcerias' },
            { id: 'equipe', label: 'Equipe' },
            { id: 'bug', label: 'Achou um Bug?' }
          ].map((tab) => (
            <button
              key={tab.id} role="tab" aria-selected={activeTab === tab.id} aria-controls={`painel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap flex-1 sm:flex-none px-3 sm:px-5 py-3 sm:py-4 text-[12px] sm:text-[14px] font-semibold transition-all duration-300 border-b-4"
              style={{ backgroundColor: activeTab === tab.id ? theme.abaAtiva : 'transparent', color: activeTab === tab.id ? theme.textoAba : theme.textoAbaNormal, borderColor: activeTab === tab.id ? theme.textoAba : 'transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 w-full max-w-5xl mx-auto">
        
        {/* ========================================================================= */}
        {/* ABA: GERADOR BRAILLE ORIGINAL */}
        {/* ========================================================================= */}
        {activeTab === 'gerador' && (
          <div id="painel-gerador" role="tabpanel" aria-label="Gerador Braille" className="space-y-6 fade-in">
            <div className="p-6 rounded-xl shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
              <div className="text-slate-600 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <p className="flex-1 leading-relaxed pr-2 text-justify">
                    Converte fórmulas químicas em arquivos 3D (STL) para impressão 3D e leitura tátil, seguindo as normas estabelecidas pela <a href="[https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file](https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file)" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline transition-colors" style={{ color: theme.corPrincipal }}>Grafia Química Braille para Uso no Brasil (3ª edição, 2017)</a>.
                  </p>
                  <div className="flex-shrink-0 self-start"><ColorTester corPrincipal={corPrincipal} setCorPrincipal={setCorPrincipal} /></div>
                </div>
                <div className="border-l-4 pl-3 py-2 pr-3 rounded-r text-sm transition-colors" style={{ borderColor: theme.corPrincipal, backgroundColor: 'rgba(255,255,255,0.4)' }}>
                  <p className="text-justify">Uma ferramenta de tecnologia assistiva desenvolvida por <a href="[https://www.linkedin.com/in/andre-gaito-2a58151b1/](https://www.linkedin.com/in/andre-gaito-2a58151b1/)" target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer font-semibold text-slate-700">André Vinnicios S. Gaito</a> para facilitar a inclusão no ensino de ciências e tornar a química ao alcance de todos.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
              <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <label htmlFor="ionInput" className="block text-sm font-medium text-slate-700 mb-1">Digite a fórmula do Íon, Composto Químico ou Texto</label>
                    <textarea id="ionInput" value={input} onChange={(e) => { setInput(e.target.value); parseBraille(e.target.value); }} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-lg font-mono resize-y min-h-[80px] pr-12 transition-colors duration-500" style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }} rows={2} placeholder="Ex: Fe(OH)2 ou qualquer texto multilinhas..." />
                    <button type="button" onClick={handleDictation} title="Ditar por voz" className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400' : 'bg-white/50 text-slate-500 hover:text-slate-800 backdrop-blur'}`}>
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={isGenerating} className={`w-full sm:w-auto px-6 py-3 font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 h-[52px] ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'hover:opacity-90'}`} style={!isGenerating ? { backgroundColor: theme.btnVisualizar, color: theme.textoBtnVis, border: `2px solid ${theme.borderBtnVis}` } : {}}>
                      <Settings className={`w-5 h-5 inline-block ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'Processando Malha...' : 'Visualizar STL'}</span>
                    </button>
                  </div>
                </div>

                <AlertaSugestao sugestaoDados={sugestaoQuimica} aoAplicarSugestao={handleAplicarSugestao} />

                <div className="border-t border-slate-200 pt-4 mt-2">
                  <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: theme.corPrincipal }}>
                    <Sliders className="w-4 h-4 mr-2" /> Opções Avançadas de Impressão 3D {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </button>
                  {showAdvanced && (
                    <div id="painel-avancado" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 bg-slate-50/50 p-5 rounded-lg border border-slate-200">
                      <ConfigSlider label="Altura do Ponto" value={config3D.alturaPonto} min="0.5" max="1.5" step="0.05" unit="mm" onChange={(e) => setConfig3D({...config3D, alturaPonto: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Diâmetro do Ponto" value={config3D.diametroPonto} min="1.0" max="2.0" step="0.05" unit="mm" onChange={(e) => setConfig3D({...config3D, diametroPonto: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Espessura da Placa" value={config3D.espessuraPlaca} min="0.0" max="10.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, espessuraPlaca: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Bordas Arredondadas" value={config3D.borda} min="0.0" max="10.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, borda: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Dist. Pontos (X/Y)" value={config3D.distPontos} min="1.0" max="3.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, distPontos: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Dist. Celas" value={config3D.distCelas} min="3.0" max="8.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, distCelas: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Dist. Linhas" value={config3D.distLinhas} min="5.0" max="15.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, distLinhas: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                      <ConfigSlider label="Margem Geral" value={config3D.margem} min="1.0" max="5.0" step="0.1" unit="mm" onChange={(e) => setConfig3D({...config3D, margem: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                    </div>
                  )}
                </div>
              </form>
            </div>

            {stlUrl && (
              <div role="region" className="p-6 rounded-xl shadow-sm transition-colors duration-500 flex flex-col" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center"><Box className="w-5 h-5 mr-2 text-slate-500" />Pré-visualização do Modelo 3D</h2>
                    <button onClick={() => setMostrarDimensoesGerador(!mostrarDimensoesGerador)} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-semibold border border-slate-200 transition-colors">
                      {mostrarDimensoesGerador ? <><EyeOff className="w-3.5 h-3.5"/> Ocultar Dimensões</> : <><Eye className="w-3.5 h-3.5"/> Mostrar Dimensões</>}
                    </button>
                  </div>
                  <button onClick={() => handleDownload(stlUrl, "MatrizBraille")} className="px-4 py-2 font-medium rounded-md shadow-sm transition-colors flex items-center space-x-2 hover:opacity-90" style={{ backgroundColor: theme.btnBaixar, color: theme.textoBtnBaixar, border: `2px solid ${theme.borderBtnBaixar}` }}>
                    <Download className="w-4 h-4" /><span className="hidden sm:inline">Baixar Arquivo STL</span><span className="sm:hidden">Baixar STL</span>
                  </button>
                </div>
                
                <p className="sr-only text-justify">Modelo 3D gerado. Arquivo possui aproximadamente {celasFisicas.length} celas braille.</p>

                <div aria-hidden="true" className="w-full h-[350px] bg-slate-900 rounded-lg overflow-hidden relative cursor-move" onDoubleClick={() => setMostrarDimensoesGerador(!mostrarDimensoesGerador)}>
                  
                  <DimensionsOverlay dimensions={dimensoesGerador} isVisible={mostrarDimensoesGerador} />

                  <button onClick={() => setAutoRotate(!autoRotate)} className="absolute top-4 right-4 z-10 p-1 rounded-full shadow-lg transition-all" style={autoRotate ? { backgroundColor: theme.corPrincipal, border: `2px solid ${theme.corPrincipal}` } : { backgroundColor: 'rgba(51, 65, 85, 0.8)' }}>
                    <img src={iconeRotacao} alt="" className="w-12 h-12 rounded-full object-cover" />
                  </button>

                  <Canvas shadows camera={{ position: [0, 50, 100], fov: 45 }}>
                    <Suspense fallback={null}>
                      <Environment preset="city" /><ambientLight intensity={0.5} /><directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                      <Bounds fit clip observe margin={1.2}>
                        <StlModel url={stlUrl} cor={theme.corPrincipal} onDimensionsParsed={setDimensoesGerador} />
                      </Bounds>
                    </Suspense>
                    <axesHelper args={[30]} /><gridHelper args={[200, 20, '#94a3b8', '#475569']} position={[0, 0, 0]} />
                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2.0} makeDefault enablePan={true} enableZoom={true} />
                  </Canvas>
                  
                  <p className="absolute bottom-3 left-0 w-full text-center text-xs text-slate-300 font-medium pointer-events-none drop-shadow-md">Arraste para girar • Role para aproximar • 2 cliques para ocultar dimensões</p>
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">Visualização das Celas Braille (Leitura Tátil 2D) <ArrowRight className="w-4 h-4 ml-2 text-slate-400" /></h2>
              {cells.length > 0 && (
                <div>
                  <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-start gap-y-4 gap-x-1 sm:gap-x-0 p-4 sm:p-6 rounded-lg border border-slate-200 min-h-[180px] transition-colors duration-500" style={{ backgroundColor: theme.fundoSubCaixa }}>
                    {cells.map((cell, index) => {
                      if (cell.isNewline) return <div key={`nl-${index}`} className="col-span-4 sm:w-full h-2 sm:h-4"></div>;
                      return <BrailleCell key={index} dots={cell.dots} label={cell.label} description={cell.description} />;
                    })}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-xs sm:text-sm text-slate-500 border-t border-slate-200 pt-4 px-1">
                    <p>Largura estimada na impressão: <span className="font-bold text-slate-700">~{(celasFisicas.length * 6.5).toFixed(1)} mm</span></p>
                    <p>Total: <span className="font-bold text-slate-700">{celasFisicas.length}</span> celas</p>
                  </div>
                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between transition-colors">
                      <div>
                        <span className="block text-xs font-bold text-slate-500 mb-2 uppercase">Texto Braille (Unicode)</span>
                        <div className="text-4xl tracking-widest font-mono mb-4 break-all min-h-[3rem] whitespace-pre-wrap p-2 rounded-md transition-colors duration-500 text-justify" style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }}>
                          {brailleUnicodeText}
                        </div>
                      </div>
                      <button onClick={handleCopy} className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md flex items-center justify-center space-x-2 transition-colors">
                        {copiado ? <span className="flex items-center text-green-700 font-semibold"><Check className="w-4 h-4 text-green-600 mr-1.5" /><span>Copiado!</span></span> : <><Copy className="w-4 h-4" /><span>Copiar Texto Braille</span></>}
                      </button>
                    </div>

                    <div className="md:w-1/2 border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-[11px] sm:text-xs font-bold text-slate-500 uppercase"><Grip className="w-4 h-4 mr-1 sm:mr-1.5 text-slate-400" />Digite o texto Braille</span>
                        <button onClick={handleClearTranslator} className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors"><Trash2 className="w-3 h-3 mr-1" />Limpar</button>
                      </div>
                      <textarea value={brailleInput} onChange={(e) => handleBrailleTranslate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-400 outline-none text-2xl font-mono mb-4 resize-y min-h-[4rem] transition-colors duration-500 text-justify" style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }} placeholder="Cole caracteres Braille aqui..." />
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-xs font-bold text-slate-500 uppercase"><Languages className="w-4 h-4 mr-1.5 transition-colors" style={{ color: theme.corPrincipal }} />Tradução em Português</span>
                        <div className="flex gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(translatedText); alert("Tradução copiada!"); }} className="px-2 py-1 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors" style={{ backgroundColor: `${theme.corPrincipal}20`, color: theme.corPrincipal }}><Copy className="w-3 h-3 mr-1" />Copiar</button>
                          <button onClick={handleSpeak} disabled={!translatedText} className="px-2 py-1 rounded text-[10px] sm:text-xs font-bold flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: `${theme.corPrincipal}20`, color: theme.corPrincipal }}><Volume2 className="w-3 h-3 mr-1" />Ouvir</button>
                        </div>
                      </div>
                      <div className="w-full px-3 py-2 border border-slate-300 rounded-md text-base sm:text-lg min-h-[3.5rem] font-sans whitespace-pre-wrap transition-colors duration-500 flex-grow text-justify" style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }}>
                        {translatedText || <span className="text-slate-400 italic text-sm">A tradução aparecerá aqui...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA NOVA: BLOCOS IÔNICOS (IMPLEMENTAÇÃO EXCLUSIVA E SEM ALTERAR OUTROS CÓDIGOS) */}
        {/* ========================================================================= */}
        {activeTab === 'ionicos' && (
          <div id="painel-ionicos" role="tabpanel" aria-label="Blocos Iônicos" className="space-y-6 fade-in">
            
            <div className="p-6 rounded-xl shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Gerador Didático: Blocos Iônicos com Encaixes</h2>
                  <p className="text-slate-600 text-sm mt-1 text-justify">Crie seus proprios <strong>Bloquinhos Iônicos</strong> para ensinar diversos conceitos de química, como: Tipos de Ligações Químicas, Estequiometria/Balanceamento, Número de Oxidação (NOX) e Valência. Em que os <strong>Cátions</strong> possuem <strong>encaixes positivos (+)</strong> na extremidade direita, enquanto os <strong>Ânions possuem encaixes negativos (-)</strong> na sua extremidade esquerda que se conectam perfeitamente nos Cátions. A altura do bloco multiplica dependendo da valência (ex: bloco +2 tem o dobro da altura base).</p>
                </div>
                <ColorTester corPrincipal={corPrincipal} setCorPrincipal={setCorPrincipal} />
              </div>

              <div className="mt-4 p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2 shadow-sm">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span><strong>Atenção a Formatação:</strong> Para que a fórmula química saia correta no bloco, digite ou cole utilizando números sobrescritos (⁺, ⁻, ¹, ², ³, ⁴, ⁵, ⁶) e subscritos (₁, ₂, ₃, ₄, ₅, ₆).. Exemplo: <strong>SO₄²⁻</strong> ou <strong>H⁺</strong>. O texto será centralizado e dimensionado de forma automática!.</span>
              </div>
            </div>

            <div className="p-6 rounded-xl shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
              <form onSubmit={handleGenerateIon} className="space-y-6">
                
                {/* 1. Seleção de Tipo (Cátion ou Ânion) e Valência */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">1. Escolha o Tipo de Íon e a Valência (Carga)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((val) => (
                      <button
                        key={`cat-${val}`} type="button"
                        onClick={() => {
                          setIonConfig(prev => ({ 
                            ...prev, 
                            tipo: 'cation', 
                            valencia: val, 
                            corModelo: prev.corCustomizada ? prev.corModelo : getIonColorBasedOnTheme(corPrincipal, 'cation') 
                          }));
                        }}
                        className={`p-3 rounded-lg border-2 font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${ionConfig.tipo === 'cation' && ionConfig.valencia === val ? 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-105' : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'}`}
                      >
                        <span className="text-lg">Cátion +{val}</span>
                        <span className="text-[10px] font-normal opacity-80 uppercase tracking-wider mt-1">Encaixe Positivo</span>
                      </button>
                    ))}
                    {[1, 2, 3, 4].map((val) => (
                      <button
                        key={`an-${val}`} type="button"
                        onClick={() => {
                          setIonConfig(prev => ({ 
                            ...prev, 
                            tipo: 'anion', 
                            valencia: val, 
                            corModelo: prev.corCustomizada ? prev.corModelo : getIonColorBasedOnTheme(corPrincipal, 'anion') 
                          }));
                        }}
                        className={`p-3 rounded-lg border-2 font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${ionConfig.tipo === 'anion' && ionConfig.valencia === val ? 'bg-red-600 text-white border-red-700 shadow-md transform scale-105' : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'}`}
                      >
                        <span className="text-lg">Ânion -{val}</span>
                        <span className="text-[10px] font-normal opacity-80 uppercase tracking-wider mt-1">Encaixe Negativo</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fórmula e Estilo de Texto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">2. Fórmula Química do Íon</label>
                    <input
                      type="text" value={ionConfig.formula}
                      onChange={(e) => setIonConfig({ ...ionConfig, formula: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none text-xl font-mono"
                      style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }}
                      placeholder="Ex: H⁺ ou Ca²⁺"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Fonte do Texto no Bloco</label>
                    <select
                      value={ionConfig.fonte} onChange={(e) => setIonConfig({ ...ionConfig, fonte: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 outline-none font-medium text-sm bg-white cursor-pointer"
                      style={{ backgroundColor: theme.fundoSubCaixa, color: theme.textoSubCaixa }}
                    >
                      <option value="sans">Modern Sans-Serif (Padrão 3D)</option>
                      <option value="serif">Academic Serif Clássica</option>
                      <option value="mono">Technical Monospace</option>
                      <option value="arial">Arial Black</option>
                      <option value="himalaya">Microsoft Himalaya</option>
                      <option value="helvetica">Helvetica</option>
                      <option value="times">Times New Roman</option>
                      <option value="courier">Courier New</option>
                      <option value="verdana">Verdana</option>
                      <option value="georgia">Georgia</option>
                      <option value="tahoma">Tahoma</option>
                      <option value="comic">Comic Sans MS</option>
                      <option value="impact">Impact</option>
                    </select>
                  </div>
                </div>

                {/* 3. Dimensões do Bloco e Encaixes */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">3. Dimensões Físicas</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                    <ConfigSlider label="Largura da Base (X)" value={ionConfig.largura} min="30.0" max="100.0" step="0.2" unit="mm" onChange={(e) => setIonConfig({...ionConfig, largura: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                    <ConfigSlider label={`Altura da Base (Y)`} value={ionConfig.altura} min="15.0" max="50.0" step="0.2" unit="mm" onChange={(e) => setIonConfig({...ionConfig, altura: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                    <ConfigSlider label="Espessura da base (Z)" value={ionConfig.espessura} min="2.0" max="15.0" step="0.2" unit="mm" onChange={(e) => setIonConfig({...ionConfig, espessura: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                    <ConfigSlider label="Largura do Encaixe" value={ionConfig.larguraEncaixe} min="4.0" max="20.0" step="0.25" unit="mm" onChange={(e) => setIonConfig({...ionConfig, larguraEncaixe: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                    <ConfigSlider label="Altura do Encaixe" value={ionConfig.alturaEncaixe} min="4.0" max="25.0" step="0.25" unit="mm" onChange={(e) => setIonConfig({...ionConfig, alturaEncaixe: parseFloat(e.target.value)})} cor={theme.corPrincipal} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-right">Altura Total (Base x Valência) = {(ionConfig.altura * ionConfig.valencia).toFixed(1)}mm</p>
                </div>

                {/* 4. Espessura do Texto e Adição de Braille */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                    <ConfigSlider
                      label="Espessura do Texto / Relevo"
                      value={ionConfig.espessuraTexto} min="-2.0" max="2.0" step="0.1" unit="mm"
                      onChange={(e) => setIonConfig({...ionConfig, espessuraTexto: parseFloat(e.target.value)})}
                      cor={ionConfig.espessuraTexto < 0 ? '#dc2626' : theme.corPrincipal}
                    />
                    <span className="text-xs text-slate-500 block mt-1.5">
                      {ionConfig.espessuraTexto < 0 ? 'Valores negativos: O texto será gerado como uma marcação negativa "para dentro da peça".' : 'Valores Positivos: O texto será gerado como um "Relevo" para fora da peça.'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 h-full shadow-sm">
                    <div>
                      <span className="font-bold text-slate-800 block">Adicionar Escrita Braille ao Bloco?</span>
                      <span className="text-xs text-slate-500">Gera a tradução tátil no bloco (centralizado automaticamente).</span>
                    </div>
                    <input
                      type="checkbox" checked={ionConfig.incluirBraille}
                      onChange={(e) => setIonConfig({ ...ionConfig, incluirBraille: e.target.checked })}
                      className="w-6 h-6 rounded cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Botão Gerar Malha */}
                <div className="pt-2">
                  <button
                    type="submit" disabled={isGeneratingIon}
                    className={`w-full py-4 text-white font-bold text-lg rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 ${isGeneratingIon ? 'bg-slate-400 cursor-not-allowed' : 'hover:opacity-95'}`}
                    style={!isGeneratingIon ? { backgroundColor: theme.corPrincipal } : {}}
                  >
                    <Layers className={`w-6 h-6 ${isGeneratingIon ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingIon ? 'Modelando Blocos e Vetores...' : `Visualizar STL (Íon ${ionConfig.tipo === 'cation' ? '+' : '-'}${ionConfig.valencia})`}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* VISUALIZADOR 3D DO BLOCO IÔNICO */}
            {ionStlUrl && (
              <div className="p-6 rounded-xl shadow-sm transition-colors duration-500 flex flex-col fade-in" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center"><Box className="w-5 h-5 mr-2 text-slate-500" />Pré-visualização 3D</h2>
                    
                    <button onClick={() => setMostrarDimensoesIonico(!mostrarDimensoesIonico)} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-semibold border border-slate-200 transition-colors">
                      {mostrarDimensoesIonico ? <><EyeOff className="w-3.5 h-3.5"/> Ocultar Dimensões</> : <><Eye className="w-3.5 h-3.5"/> Mostrar Dimensões</>}
                    </button>

                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                      <Palette className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Cor (RGB):</span>
                      <input type="color" value={ionConfig.corModelo} onChange={(e) => setIonConfig({ ...ionConfig, corModelo: e.target.value, corCustomizada: true })} className="w-6 h-6 rounded border-0 cursor-pointer p-0" title="Mudar cor do bloco livremente" />
                    </div>
                  </div>

                  <button onClick={() => handleDownload(ionStlUrl, "BlocoIonico")} className="px-5 py-2.5 font-bold rounded-md shadow-sm transition-colors flex items-center space-x-2 text-white hover:opacity-90" style={{ backgroundColor: theme.btnBaixar }}>
                    <Download className="w-5 h-5" /><span>Baixar STL do Bloco</span>
                  </button>
                </div>

                <div className="w-full h-[450px] bg-slate-900 rounded-lg overflow-hidden relative cursor-move" onDoubleClick={() => setMostrarDimensoesIonico(!mostrarDimensoesIonico)}>
                  
                  <DimensionsOverlay dimensions={dimensoesIonico} isVisible={mostrarDimensoesIonico} />

                  <button onClick={() => setAutoRotate(!autoRotate)} className="absolute top-4 right-4 z-10 p-1.5 rounded-full shadow-lg transition-all" style={autoRotate ? { backgroundColor: theme.corPrincipal, border: `2px solid ${theme.corPrincipal}` } : { backgroundColor: 'rgba(51, 65, 85, 0.8)' }}>
                    <img src={iconeRotacao} alt="" className="w-10 h-10 rounded-full object-cover" />
                  </button>
                  <Canvas shadows camera={{ position: [0, 60, 110], fov: 45 }}>
                    <Suspense fallback={null}>
                      <Environment preset="city" /><ambientLight intensity={0.6} /><directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                      <Bounds fit clip observe margin={1.3}>
                        <StlModel url={ionStlUrl} cor={ionConfig.corModelo} onDimensionsParsed={setDimensoesIonico} />
                      </Bounds>
                    </Suspense>
                    <axesHelper args={[30]} /><gridHelper args={[200, 20, '#94a3b8', '#475569']} position={[0, 0, 0]} />
                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2.0} makeDefault enablePan={true} enableZoom={true} />
                  </Canvas>
                  <p className="absolute bottom-3 left-0 w-full text-center text-xs text-slate-300 font-medium pointer-events-none drop-shadow-md">Gire a peça para inspecionar os pinos e rasgos • 2 cliques para ocultar dimensões XYZ</p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: SOBRE O PROJETO */}
        {/* ======================================================== */}
        {activeTab === 'sobre' && (
          <div id="painel-sobre" role="tabpanel" aria-label="Sobre o Projeto" className="p-8 sm:p-12 rounded-xl shadow-sm transition-colors duration-500 text-slate-700 fade-in space-y-8 text-left" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
            <div className="border-b border-slate-200 pb-6"><h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Química ao Alcance das Mãos</h2><p className="text-lg font-medium mt-2 transition-colors text-justify" style={{ color: theme.corPrincipal }}>Democratizando o ensino de ciências através da tecnologia e da manufatura aditiva.</p></div>
            <div className="space-y-4"><h3 className="text-xl font-bold text-slate-800">O Desafio da Inclusão</h3><p className="leading-relaxed text-justify">O ensino de química é historicamente pautado em elementos visuais: fórmulas espaciais, reações, cores e gráficos. Para alunos com deficiência visual ou baixa visão, isso cria uma barreira imensa no aprendizado. Embora o <strong>Instituto Benjamin Constant (IBC)</strong> e o Ministerio da Educação (MEC) tenham estabelecido a norma da <a href="[https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file](https://www.gov.br/ibc/pt-br/pesquisa-e-tecnologia/materiais-especializados-1/livros-em-braille-1/o-sistema-braille-arquivos/grafia-quimica-braille-para-uso-no-brasil-pdf.pdf/@@display-file/file)" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline transition-colors" style={{ color: theme.corPrincipal }}>Grafia Química Braille para Uso no Brasil (3ª edição, 2017)</a>, a produção e o acesso a esses materiais físicos ainda são escassos, caros e lentos nas escolas regulares.</p></div>
            <div className="space-y-4"><h3 className="text-xl font-bold text-slate-800">A Solução: Código Aberto e Impressão 3D</h3><p className="leading-relaxed text-justify">O Gerador 3D de Química para Braille nasceu para ser uma ponte entre a tecnologia de prototipagem rápida e a educação inclusiva. Através desta plataforma <strong>Open Source</strong>, qualquer professor, escola ou laboratório maker pode digitar uma fórmula e gerar uma matriz tátil digital (STL) em segundos. O que antes demorava semanas para ser encomendado, agora pode ser fabricado na própria escola via impressão 3D, sob demanda e com baixo custo.</p></div>
            <div className="space-y-4"><h3 className="text-xl font-bold text-slate-800">Inovação em Equipamentos de Laboratório</h3><p className="leading-relaxed text-justify">Acreditamos que a tecnologia assistiva deve ser ágil e escalável. Este gerador é o primeiro passo de uma visão de startup mais ampla focada na criação de equipamentos de laboratório adaptados e materiais didáticos inovadores. Nosso objetivo é consolidar um ecossistema onde o design de hardware torne os laboratórios de ciências espaços 100% acessíveis.</p></div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: PARCERIAS */}
        {/* ======================================================== */}
        {activeTab === 'parcerias' && (
          <div id="painel-parcerias" role="tabpanel" aria-label="Parcerias" className="p-8 sm:p-12 rounded-xl shadow-sm transition-colors duration-500 fade-in text-center" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
            <div className="flex justify-center mb-6"><div className="p-5 rounded-full shadow-inner transition-colors" style={{ backgroundColor: `${theme.corPrincipal}1A`, color: theme.corPrincipal }}><Handshake className="w-14 h-14" /></div></div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Parcerias e Expansão</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-slate-600 leading-relaxed text-left sm:text-center text-justify"><p>O projeto <strong>Química ao Alcance das Mãos</strong> visa transformar o ensino e a aprendizagem da química através da aplicação de ferramentas inclusivas e tecnologias inovadoras, como a impressão 3D e o design aberto de materiais didáticos. Nosso maior objetivo é <strong>expandir o alcance dessa tecnologia</strong>. Acreditamos que o conhecimento aberto tem o poder de mudar realidades, e por isso queremos que nossas matrizes de impressão 3D cheguem ao máximo possível de escolas, laboratórios e institutos de educação em todos os estados do país.</p><p className="font-medium text-slate-700 bg-white/50 p-4 border-l-4 rounded-r-lg shadow-sm transition-colors text-justify" style={{ borderColor: theme.corPrincipal }}>Qualquer escola, instituição ou entidade educacional que tenha interesse em aplicar os nossos materiais pedagógicos, testar o gerador ou firmar algum tipo de colaboração e parceria conosco é mais que bem-vinda!</p></div>
            <div className="mt-8 mb-12"><a href="mailto:andrevinniciosgaito@gmail.com?subject=Interesse%20em%20Parceria%20-%20Química%20ao%20Alcance%20das%20Mãos" className="inline-flex items-center px-8 py-4 text-white text-lg font-bold rounded-lg shadow-md transition-all transform hover:-translate-y-1 hover:opacity-90" style={{ backgroundColor: theme.corPrincipal }}><Mail className="w-6 h-6 mr-3" />Entre em Contato Conosco</a><p className="mt-4 text-sm text-slate-500">Ou envie um e-mail para: <strong>andrevinniciosgaito@gmail.com</strong></p></div>
            <div className="p-6 sm:p-8 rounded-xl bg-slate-50 border border-slate-200 shadow-sm mt-8">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Apoie esta Iniciativa</h3>
              <p className="text-slate-600 text-justify max-w-2xl mx-auto leading-relaxed mb-6">O <strong>Química ao Alcance das Mãos</strong> é um projeto independente e 100% voluntário. Nós garantimos que nossa plataforma e todos os seus recursos permanecerão <strong>sempre gratuitos e de código aberto</strong> para educadores, escolas e alunos de todo o Brasil. No entanto, temos custos contínuos para manter o site no ar de forma estável e continuar trazendo melhorias ao projeto. Se este gerador foi útil para você ou sua instituição, considere fazer uma doação voluntária de qualquer valor! Sua contribuição é fundamental para nos ajudar a manter a ferramenta no ar, além de permitir atualizações e a criação de novas funcionalidades assistivas.</p>
              <div className="flex flex-col items-center justify-center">
                <button onClick={handleCopyPix} className="inline-flex items-center px-6 py-3 font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors shadow-md transform hover:-translate-y-0.5">
                  {pixCopiado ? <Check className="w-5 h-5 mr-2" /> : <Heart className="w-5 h-5 mr-2 fill-current" />}{pixCopiado ? 'Chave PIX Copiada!' : 'Fazer um PIX'}
                </button>
                <p className="text-xs text-slate-500 mt-3 font-mono bg-white px-3 py-1 border border-slate-200 rounded">Chave PIX (E-mail): <strong>andrevinniciosgaito@gmail.com</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: EQUIPE */}
        {/* ======================================================== */}
        {activeTab === 'equipe' && (
          <div id="painel-equipe" role="tabpanel" aria-label="Nossa Equipe" className="space-y-6 fade-in">
            <div className="p-8 rounded-xl shadow-sm transition-colors duration-500 mb-6" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}><h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">Nossa Equipe</h2><p className="text-slate-600 text-center mt-2 text-justify">Conheça os pesquisadores, desenvolvedores e professores que tornam o projeto Química ao Alcance das Mãos possível.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EQUIPE.map((membro, index) => (
                <div key={index} className="p-6 rounded-xl shadow-sm transition-colors duration-500 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 hover:shadow-md" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/50 flex-shrink-0 bg-slate-200 flex items-center justify-center overflow-hidden">{membro.foto ? <img src={membro.foto} alt={`Foto de ${membro.nome}`} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-slate-400" aria-hidden="true" />}</div>
                  <div className="flex-1 space-y-2">
                    <div><h3 className="text-lg font-bold text-slate-800 leading-tight">{membro.nome}</h3><p className="text-sm font-semibold transition-colors text-justify" style={{ color: theme.corPrincipal }}>{membro.titulo}</p></div>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify">{membro.descricao}</p>
                    <div className="pt-3 mt-3 border-t border-slate-200/50 flex flex-wrap justify-center sm:justify-start gap-4">
                      {membro.email && (<a href={`mailto:${membro.email}`} className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"><Mail className="w-3.5 h-3.5 mr-1" />E-mail</a>)}
                      {membro.lattes && (<a href={membro.lattes} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"><GraduationCap className="w-3.5 h-3.5 mr-1" />Lattes</a>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: BUG */}
        {/* ======================================================== */}
        {activeTab === 'bug' && (
          <div id="painel-bug" role="tabpanel" aria-label="Reporte de Bug" className="p-8 sm:p-12 rounded-xl shadow-sm transition-colors duration-500 text-center fade-in" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
            <div className="flex justify-center mb-6"><div className="p-4 bg-red-100 rounded-full text-red-600" aria-hidden="true"><Bug className="w-12 h-12" /></div></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Achou um Bug ou Tem uma Sugestão?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 text-justify">O "Gerador 3D de Química para Braille" é um projeto de código aberto em constante evolução. Caso você encontre algum erro na geração dos caracteres, formatações inconsistentes, problemas na malha 3D ou qualquer outra falha técnica, por favor, nos avise! Suas sugestões de melhorias também são sempre bem-vindas, e essenciais para continuarmos aprimorando as ferramentas e funcionalidades do site.</p>
            <a href="mailto:andrevinniciosgaito@gmail.com?subject=Reporte%20de%20Bug%20/%20Sugestão%20-%20Gerador%20Braille" className="inline-flex items-center px-6 py-3 text-white font-bold rounded-lg shadow-sm transition-all hover:opacity-90" style={{ backgroundColor: theme.corPrincipal }}><Mail className="w-5 h-5 mr-2" />Reportar para a Equipe</a>
            <p className="mt-6 text-sm text-slate-500">Ou envie um e-mail para: <strong>andrevinniciosgaito@gmail.com</strong></p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: INSTRUÇÕES */}
        {/* ======================================================== */}
        {activeTab === 'instrucoes' && (
          <div id="painel-instrucoes" role="tabpanel" aria-label="Instruções de Uso" className="p-6 sm:p-10 rounded-xl shadow-sm transition-colors duration-500 text-left fade-in space-y-10" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
            <div className="border-b border-slate-200 pb-4"><h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Manual de Instruções</h2><p className="text-sm sm:text-base text-slate-500 mt-1 text-justify">Veja como extrair o máximo potencial do gerador digital e realizar a impressão 3D das suas matrizes em Braille.</p></div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" />1. Como Usar os Recursos do Site</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-100 space-y-1 shadow-sm"><h4 className="font-bold text-slate-800 flex items-center gap-1.5"><Box className="w-4 h-4 text-slate-500" /> Gerador Braille 3D</h4><p className="text-justify">Digite qualquer fórmula química, palavra ou texto longo no campo principal. O sistema aplicará as normas de grafia instantaneamente e montará o modelo 3D em tempo real. Clicando em <strong>"Visualizar STL"</strong> você avalia o resultado e, em seguida, basta clicar em <strong>Baixar Arquivo STL</strong> para levar à impressora.</p></div>
                <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-100 space-y-1 shadow-sm"><h4 className="font-bold text-slate-800 flex items-center gap-1.5"><ArrowRight className="w-4 h-4 text-slate-500" /> Leitura Tátil 2D</h4><p className="text-justify">Abaixo do modelo 3D, você verá um mapa bidimensional das celas geradas, em que as <strong>bolinhas pretas</strong> indicam os pontos em relevo. É uma forma simples e visual de validar o que foi escrito e ajudar alunos ou educadores a se familiarizarem com a grafia Braille num primeiro momento.</p></div>
                <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-100 space-y-1 shadow-sm"><h4 className="font-bold text-slate-800 flex items-center gap-1.5"><Copy className="w-4 h-4 text-slate-500" /> Texto Braille (Unicode)</h4><p className="text-justify">Essa caixa gera o seu texto utilizando a fonte Unicode oficial do Braille digital. O botão <strong>"Copiar Texto Braille"</strong> permite que você copie os símbolos e cole-os diretamente em e-mails, redes sociais, documentos do Word ou painéis de comunicação.</p></div>
                <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-100 space-y-1 shadow-sm"><h4 className="font-bold text-slate-800 flex items-center gap-1.5"><Languages className="w-4 h-4 text-slate-500" /> Tradutor Reverso e Áudio</h4><p className="text-justify">Achou uma frase em Braille na internet e quer saber o que está escrito? Basta colar os caracteres em braille na caixa <strong>"Digite o texto Braille"</strong>. O site fará a leitura reversa traduzindo para o português no mesmo instante. Também é possível clicar em <strong>"Ouvir"</strong> para o sistema ditar o texto em voz alta para você.</p></div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><Sliders className="w-5 h-5 text-slate-500" />2. Customização Ergonômica da Matriz</h3>
              <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed space-y-2 shadow-sm">
                <p className="text-justify">Ao abrir o painel de <strong>"Opções Avançadas de Impressão 3D"</strong> logo abaixo do campo de texto, você desbloqueia o controle de toda a geometria matemática da peça gerada: altura e diâmetro dos pontos, espessura da base, arredondamento das bordas, etc.</p>
                <p className="font-medium text-slate-700 text-justify">Por que isso é útil?</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-justify">
                  <li><strong>Acessibilidade sob medida:</strong> Alguns alunos com perda de sensibilidade tátil podem preferir que os pontos Braille sejam ligeiramente mais altos ou mais espaçados para facilitar a distinção.</li>
                  <li><strong>Calibração do Bico da Impressora:</strong> Se estiver usando impressoras com bicos maiores (0.6mm ou 0.8mm) para imprimir mais rápido, você pode aumentar o <em>Diâmetro do Ponto</em> para evitar que fiquem finos ou falhados demais.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><Box className="w-5 h-5 text-slate-500" />3. Guia de Impressão 3D (Fatiamento no OrcaSlicer)</h3>
              <div className="p-5 rounded-lg border-l-4 space-y-6 shadow-sm" style={{ borderColor: theme.corPrincipal, backgroundColor: 'rgba(255,255,255,0.4)' }}>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-red-700 text-base uppercase tracking-wider flex items-center gap-1.5">⚠️ REGRA DE OURO: IMPRESSÃO SEMPRE NA VERTICAL (EM PÉ)</h4>
                  <p className="text-slate-700 text-sm sm:text-base text-justify">Ao exportar o arquivo 3D <strong>".stl"</strong> e jogá-lo no software para impressão (fatiador), certifique-se de que a placa de texto está posicionada <strong>na vertical ("em pé") sobre a mesa</strong>, orientada ao longo do eixo Z.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 flex items-center justify-center p-2"><img src={imgSelecaoImpressora} alt="Seleção de Impressora no OrcaSlicer" className="w-full h-auto object-contain rounded" /></div>
                      <div className="p-4 text-sm text-slate-600 text-justify"><strong className="block text-slate-800 mb-1 text-base">Passo 1: Impressora</strong>Abra o OrcaSlicer e selecione sua impressora na lista de dispositivos. O programa tem perfis prontos para máquinas modernas, como a <em>Creality Ender-3 V3 KE</em> ou a <em>Bambu Lab A1</em>.</div>
                    </div>
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 flex items-center justify-center p-2"><img src={imgMenuInicial} alt="Menu inicial com peça posicionada em pé" className="w-full h-auto object-contain rounded" /></div>
                      <div className="p-4 text-sm text-slate-600 text-justify"><strong className="block text-slate-800 mb-1 text-base">Passo 2: Filamento e Posição</strong>Arraste o seu `.stl` para dentro da plataforma. Perceba que a peça já é gerada em pé. Utilize <strong>PLA</strong> ou <strong>PETG</strong>. Evite usar filamento ABS em impressoras de câmara aberta, pois a peça longa certamente sofrerá "Warping" (encolhimento do plástico, fazendo a base descolar da mesa).</div>
                    </div>
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 flex items-center justify-center p-2"><img src={imgPreVisualizacao} alt="Pré visualização da peça 3D fatiada" className="w-full h-auto object-contain rounded" /></div>
                      <div className="p-4 text-sm text-slate-600 text-justify"><strong className="block text-slate-800 mb-1 text-base">Passo 3: Fatiamento da Peça 3D</strong>No canto superior direito, clique em "Pré-Visualizar" (ou aperte "Ctrl + R") para gerar as camadas de impressão. Confira se os pontos subiram de forma perfeitamente lisa na visualização e, em seguida, clique em <strong>Exportar Arquivo G-code</strong> para imprimir.</div>
                    </div>
                    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-100 flex items-center justify-center p-2"><img src={imgMultiCor} alt="Impressão Braille colorida multimaterial" className="w-full h-auto object-contain rounded" /></div>
                      <div className="p-4 text-sm text-slate-600 text-justify"><strong className="block text-slate-800 mb-1 text-base">Dica Extra: Impressão Multimaterial (Colorida)</strong>Caso possua uma máquina multicolorida (Bambu Lab A1/P1S combo, Creality K1C, Anycubic Kobra 3). Você pode pintar os pontos Braille de outra cor usando a ferramenta do próprio fatiador. Isso gera um excelente contraste e ajuda incrivelmente alunos com baixa visão ou professores com visão regular a identificar os caracteres braille!</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-xs sm:text-sm bg-white/60 p-4 rounded border border-slate-200/60 mt-4 shadow-sm text-justify">
                  <p><strong>Por que NÃO imprimir a peça deitada de barriga na mesa?</strong></p>
                  <p>Se a placa for impressa deitada horizontalmente, a ponta esférica de cada pontinho do Braille será fatiada em "degraus" por causa do empilhamento do eixo Z da impressora (conhecido como efeito escada ou <em>staircasing</em>). Esses micrômetros de plástico serrilhado deixam a superfície do Braille extremamente áspera e desconfortável, podendo até arranhar e machucar as pontas dos dedos da pessoa cega após minutos de leitura contínua.</p>
                  <hr className="my-2 border-slate-200" />
                  <p><strong>A vantagem absoluta de imprimir EM PÉ:</strong></p>
                  <p>Na vertical, os motores dos eixos X e Y desenham perfeitamente o arco contínuo e orgânico das bolinhas laterais. A extrusora faz movimentos arredondados contínuos e sobe de forma muito mais suave. O resultado final são semiesferas perfeitamente lisas, sedosas ao toque, e que garantem 100% de conforto e segurança na leitura tátil.</p>
                </div>
                <div className="pt-4 text-sm sm:text-base text-slate-700">
                  <h4 className="font-bold mb-1">Ainda não possui um software fatiador?</h4>
                  <p className="text-justify mb-4">Caso seja o seu primeiro contato com impressão 3D ou se você está estruturando um laboratório maker na sua escola, recomendamos o download do <strong>OrcaSlicer</strong>. Pois é uma das ferramentas de fatiamento de código aberto mais robusta e amigável no momento, já contendo perfis prontos e perfeitamente calibrados para praticamente todas as marcas do mercado.</p>
                  <a href="https://www.orcaslicer.com/download/" rel="noopener noreferrer" className="inline-flex mt-1 items-center px-5 py-3 font-bold text-white rounded-lg shadow-md hover:opacity-90 transition-opacity" style={{ backgroundColor: theme.corPrincipal }}>
                    <Download className="w-5 h-5 mr-2" /> Baixar OrcaSlicer
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: SAIBA MAIS */}
        {/* ======================================================== */}
        {activeTab === 'Novidades e Próximos Passos' && (
          <div id="painel-saiba-mais" role="tabpanel" aria-label="Saiba Mais" className="p-12 rounded-xl shadow-sm transition-colors duration-500 text-center text-slate-500 fade-in" style={{ backgroundColor: theme.fundoCaixa, border: `2px solid ${theme.bordaGeral}` }}>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Saiba Mais</h2>
            <p className="text-justify">O projeto Química ao Alcance das Mãos é uma iniciativa em contínua expansão e aprimoramento científico. Atualmente, nosso foco está na criação e consolidação de redes de colaboração com instituições de referência no ensino e pesquisa, como: o Instituto Benjamin Constant (IBC), a UFRJ, o IFRJ e o Colégio Pedro II. Estamos preparando novos recursos, dinâmicas interativas e formações didáticas que serão disponibilizadas em breve aqui na plataforma. Para acompanhar em tempo real nossas próximas atualizações, aprovações, agendas de aplicação nas escolas e parcerias firmadas, siga nossos canais oficiais de comunicação no Instagram: @quimicaaoalcancedasmaos e  @projetoatomizando</p>
            <p className="text-justify">É com grande satisfação que celebramos a estreita parceria com o Projeto Atomizando (@projetoatomizando), uma brilhante iniciativa de extensão e divulgação científica da Universidade Federal do Rio de Janeiro (UFRJ). O Atomizando se destaca por aproximar a química do dia a dia e das escolas através de dinâmicas lúdicas, metodologias ativas e experimentação, tornando a aprendizagem muito mais interativa e estimulante. Esta aliança estratégica representa uma verdadeira "força-tarefa" que soma conhecimentos teóricos, práticos e metodológicos para enriquecer e consolidar ambos os projetos. O traço de união dessa parceria é a Profa. Dra. Fernanda das Neves Costa (IPPN/UFRJ), coordenadora do Atomizando e peça fundamental na equipe do Química ao Alcance das Mãos. Sua liderança é indispensável na condução da articulação institucional do nosso projeto, especialmente nos trâmites acadêmicos e nas submissões ao Comitê de Ética em Pesquisa (CEP) em colaboração com o Instituto Benjamin Constant (IBC).</p>

            
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
            <Palette className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Cor (RGB):</span>
            <input type="color" value={ionConfig.corModelo} onChange={(e) => setIonConfig({ ...ionConfig, corModelo: e.target.value, corCustomizada: true })} className="w-6 h-6 rounded border-0 cursor-pointer p-0" title="Mudar cor do bloco livremente" />
            </div>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <img src={iconeAcessibilidade} alt="Símbolo de Acessibilidade" className="w-10 h-10 object-contain opacity-80 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-bold text-white">Química ao Alcance das Mãos:</h3>
              <p className="text-sm text-slate-400 mb-1">Gerador 3D de Química para Braille</p>
              <p className="text-xs text-slate-500">
                Criado por <a href="[https://www.linkedin.com/in/andre-gaito-2a58151b1/](https://www.linkedin.com/in/andre-gaito-2a58151b1/)" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: theme.corPrincipal === '#511576' ? '#a0f658' : theme.corPrincipal }}>André Vinnicios S. Gaito</a>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <a href="mailto:andrevinniciosgaito@gmail.com" aria-label="Enviar E-mail" className="text-slate-400 hover:text-white transition-colors"><Mail className="w-6 h-6" /></a>
            <a href="[http://lattes.cnpq.br/9008126975057063](http://lattes.cnpq.br/9008126975057063)" target="_blank" rel="noopener noreferrer" aria-label="Lattes" className="text-slate-400 hover:text-white transition-colors"><GraduationCap className="w-6 h-6" /></a>
            <a href="[https://www.instagram.com/andre_gaito/](https://www.instagram.com/andre_gaito/)" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
            <a href="[https://github.com/andregaito/Gerador-3D-de-Quimica-para-Braille---V.1.0](https://github.com/andregaito/Gerador-3D-de-Quimica-para-Braille---V.1.0)" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors"><GithubIcon className="w-6 h-6" /></a>
            <a href="[https://www.linkedin.com/in/andre-gaito-2a58151b1/](https://www.linkedin.com/in/andre-gaito-2a58151b1/)" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors"><LinkedinIcon className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>

    </div>
  );
}
