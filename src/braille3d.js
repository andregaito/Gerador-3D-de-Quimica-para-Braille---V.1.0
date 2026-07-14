import { primitives, transforms, booleans } from '@jscad/modeling';
import { serialize } from '@jscad/stl-serializer';

const { cuboid, sphere } = primitives;
const { translate } = transforms;
const { union } = booleans;

function calcularRaioEsfera(diametroBase, alturaCalota) {
  const raioBase = diametroBase / 2.0;
  return (Math.pow(raioBase, 2) + Math.pow(alturaCalota, 2)) / (2 * alturaCalota);
}

// Agora a função recebe "config" vindo do App.jsx
export function gerarModeloJSCAD(cells, config = {}) {
  if (!cells || cells.length === 0) return null;

  // Parâmetros Físicos com valores padrões estabelecidos pelas normas do IBC
  const ALTURA_PONTO = parseFloat(config.alturaPonto) || 0.75;
  const DIAMETRO_PONTO = parseFloat(config.diametroPonto) || 1.9;
  const ESPESSURA_PLACA = parseFloat(config.espessuraPlaca) || 5.0;
  const DIST_PONTOS_X = parseFloat(config.distPontos) || 2.5;
  const DIST_PONTOS_Y = parseFloat(config.distPontos) || 2.5;
  const DIST_CELAS = parseFloat(config.distCelas) || 6.0;
  const DIST_LINHAS = parseFloat(config.distLinhas) || 10.0;
  const MARGEM = parseFloat(config.margem) || 2.0;

  const COORDS_PONTO = {
    1: [0, 2 * DIST_PONTOS_Y],
    2: [0, DIST_PONTOS_Y],
    3: [0, 0],
    4: [DIST_PONTOS_X, 2 * DIST_PONTOS_Y],
    5: [DIST_PONTOS_X, DIST_PONTOS_Y],
    6: [DIST_PONTOS_X, 0]
  };

  const raioEsfera = calcularRaioEsfera(DIAMETRO_PONTO, ALTURA_PONTO);
  const zOffset = ESPESSURA_PLACA - (raioEsfera - ALTURA_PONTO);

  let maxCols = 0;
  let currentCol = 0;
  let numLines = 1;

  cells.forEach(cell => {
    if (cell.isNewline) {
      numLines++;
      currentCol = 0;
    } else {
      currentCol++;
      if (currentCol > maxCols) maxCols = currentCol;
    }
  });

  const textoW = maxCols > 0 ? ((maxCols - 1) * DIST_CELAS) + DIST_PONTOS_X : 0;
  const textoH = ((numLines - 1) * DIST_LINHAS) + (2 * DIST_PONTOS_Y);

  const comprimentoPlaca = textoW + (2 * MARGEM);
  const larguraPlaca = textoH + (2 * MARGEM);

  let placa = cuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA] });
  placa = translate([comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2], placa);

  const formasPontos = [];
  
  let currentXIndex = 0;
  let currentYIndex = 0;

  cells.forEach((cell) => {
    if (cell.isNewline) {
      currentYIndex++;
      currentXIndex = 0;
      return;
    }

    const xOffsetCela = MARGEM + (currentXIndex * DIST_CELAS);
    const yOffsetCela = MARGEM + ((numLines - 1 - currentYIndex) * DIST_LINHAS);

    if (cell.dots && cell.dots.length > 0) {
      cell.dots.forEach(numeroDoPonto => {
        const [px, py] = COORDS_PONTO[numeroDoPonto];
        
        let ponto = sphere({ radius: raioEsfera, segments: 32 });
        ponto = translate([xOffsetCela + px, yOffsetCela + py, zOffset], ponto);
        
        formasPontos.push(ponto);
      });
    }
    
    currentXIndex++;
  });

  return union(placa, ...formasPontos);
}

export function gerarUrlSTL(modelo3D) {
  if (!modelo3D) return null;
  const stlDados = serialize({ binary: true }, modelo3D);
  const blob = new Blob(stlDados, { type: 'model/stl' });
  return URL.createObjectURL(blob);
}

export function baixarArquivoSTL(url, nomeArquivo = 'formula_braille.stl') {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
