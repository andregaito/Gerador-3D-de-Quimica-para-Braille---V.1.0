import { primitives, transforms, booleans } from '@jscad/modeling';
import { serialize } from '@jscad/stl-serializer';

const { cuboid, sphere } = primitives;
const { translate } = transforms;
const { union } = booleans;

// ==========================================
// PARÂMETROS FÍSICOS (Baseados nas normas)
// ==========================================
const ALTURA_PONTO = 0.75;
const DIAMETRO_PONTO = 1.9;
const ESPESSURA_PLACA = 5.0;

const DIST_PONTOS_X = 2.5;
const DIST_PONTOS_Y = 2.5;
const DIST_CELAS = 6.0;
const MARGEM = 2.0;

function calcularRaioEsfera(diametroBase, alturaCalota) {
  const raioBase = diametroBase / 2.0;
  return (Math.pow(raioBase, 2) + Math.pow(alturaCalota, 2)) / (2 * alturaCalota);
}

const COORDS_PONTO = {
  1: [0, 2 * DIST_PONTOS_Y],
  2: [0, DIST_PONTOS_Y],
  3: [0, 0],
  4: [DIST_PONTOS_X, 2 * DIST_PONTOS_Y],
  5: [DIST_PONTOS_X, DIST_PONTOS_Y],
  6: [DIST_PONTOS_X, 0]
};

export function gerarModeloJSCAD(cells) {
  if (!cells || cells.length === 0) return null;

  const raioEsfera = calcularRaioEsfera(DIAMETRO_PONTO, ALTURA_PONTO);
  const zOffset = ESPESSURA_PLACA - (raioEsfera - ALTURA_PONTO);

  const textoW = ((cells.length - 1) * DIST_CELAS) + DIST_PONTOS_X;
  const textoH = 2 * DIST_PONTOS_Y; 
  
  const comprimentoPlaca = textoW + (2 * MARGEM);
  const larguraPlaca = textoH + (2 * MARGEM);

  let placa = cuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA] });
  placa = translate([comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2], placa);

  const formasPontos = [];

  cells.forEach((cell, index) => {
    const xOffsetCela = MARGEM + (index * DIST_CELAS);
    const yOffsetCela = MARGEM; 

    cell.dots.forEach(numeroDoPonto => {
      const [px, py] = COORDS_PONTO[numeroDoPonto];
      
      let ponto = sphere({ radius: raioEsfera, segments: 32 });
      ponto = translate([xOffsetCela + px, yOffsetCela + py, zOffset], ponto);
      
      formasPontos.push(ponto);
    });
  });

  return union(placa, ...formasPontos);
}

// Cria a URL temporária para o navegador exibir o 3D ou baixar
export function gerarUrlSTL(modelo3D) {
  if (!modelo3D) return null;
  const stlDados = serialize({ binary: true }, modelo3D);
  const blob = new Blob(stlDados, { type: 'model/stl' });
  return URL.createObjectURL(blob);
}

// Força o download usando a URL que geramos acima
export function baixarArquivoSTL(url, nomeArquivo = 'formula_braille.stl') {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}