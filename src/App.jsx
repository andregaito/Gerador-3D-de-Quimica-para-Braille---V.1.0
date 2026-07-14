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

// ... (Manter aqui todo o restante dos dicionários BRAILLE_MAP e REVERSE_MAP e constantes que já possuímos) ...

const StlModel = ({ url }) => {
  const geom = useLoader(STLLoader, url);
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

// ... (Manter constantes e funções auxiliares, Dot, BrailleCell e ConfigSlider que já temos) ...

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

  // ... (Manter todas as funções de parseBraille, handleGenerate, handleDownload, handleCopy, handleTranslate, handleDictation, handleSpeak, handleClearTranslator conforme já configuramos) ...

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
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex-1 sm:flex-none px-3 sm:px-5 py-3 sm:py-4 text-[12px] sm:text-[14px] font-semibold transition-colors duration-200 ${activeTab === tab.id ? 'bg-blue-900 text-white border-b-4 border-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white border-b-4 border-transparent'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 w-full max-w-5xl mx-auto">
        {/* Renderização condicional das abas usando os componentes que já definimos */}
        {activeTab === 'gerador' && (
          <div className="space-y-6 fade-in">
            {/* ... (Todo o conteúdo da aba Gerador com o Canvas configurado com Center bottom) ... */}
            <div className="w-full h-[350px] bg-slate-900 rounded-lg overflow-hidden relative cursor-move">
              <Canvas shadows camera={{ position: [0, 50, 100], fov: 45 }}>
                <Suspense fallback={null}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                  <Bounds fit clip observe margin={1.2}>
                    <Center bottom>
                      <StlModel url={stlUrl} />
                    </Center>
                  </Bounds>
                </Suspense>
                <axesHelper args={[30]} />
                <gridHelper args={[200, 20, '#94a3b8', '#475569']} position={[0, 0, 0]} />
                <OrbitControls autoRotate={autoRotate} makeDefault />
              </Canvas>
            </div>
            {/* ... restante dos componentes da aba gerador ... */}
          </div>
        )}
        {/* ... restante das abas ... */}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 px-6 mt-auto">
        {/* ... rodapé mantendo a visibilidade do ícone de acessibilidade ... */}
      </footer>
    </div>
  );
}
