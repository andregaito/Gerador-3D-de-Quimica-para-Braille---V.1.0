import { primitives, transforms, booleans } from '@jscad/modeling';
import { serialize } from '@jscad/stl-serializer';

// Adicionamos a importação do roundedCuboid
const { cuboid, roundedCuboid, sphere } = primitives;
const { translate } = transforms;
const { union } = booleans;

function calcularRaioEsfera(diametroBase, alturaCalota) {
  const raioBase = diametroBase / 2.0;
  return (Math.pow(raioBase, 2) + Math.pow(alturaCalota, 2)) / (2 * alturaCalota);
}

export function gerarModeloJSCAD(cells, config = {}) {
  if (!cells || cells.length === 0) return null;

  // Recebe as variáveis dinâmicas ou aplica os padrões oficiais do IBC
  const ALTURA_PONTO = config.alturaPonto !== undefined ? parseFloat(config.alturaPonto) : 0.75;
  const DIAMETRO_PONTO = config.diametroPonto !== undefined ? parseFloat(config.diametroPonto) : 1.9;
  const ESPESSURA_PLACA = config.espessuraPlaca !== undefined ? parseFloat(config.espessuraPlaca) : 5.0;
  const DIST_PONTOS_X = config.distPontos !== undefined ? parseFloat(config.distPontos) : 2.5;
  const DIST_PONTOS_Y = config.distPontos !== undefined ? parseFloat(config.distPontos) : 2.5;
  const DIST_CELAS = config.distCelas !== undefined ? parseFloat(config.distCelas) : 6.0;
  const DIST_LINHAS = config.distLinhas !== undefined ? parseFloat(config.distLinhas) : 10.0;
  const MARGEM = config.margem !== undefined ? parseFloat(config.margem) : 2.0;
  const RAIO_BORDA = config.borda !== undefined ? parseFloat(config.borda) : 0.0;

  const COORDS_PONTO = {
    1: [0, 2 * DIST_PONTOS_Y],
    2: [0, DIST_PONTOS_Y],
    3: [0, 0],
    4: [DIST_PONTOS_X, 2 * DIST_PONTOS_Y],
    5: [DIST_PONTOS_X, DIST_PONTOS_Y],
    6: [DIST_PONTOS_X, 0]
  };

  const raioEsfera = calcularRaioEsfera(DIAMETRO_PONTO, ALTURA_PONTO);
  
  // Define a altura das bolinhas: se houver placa, sobem. Se placa = 0, tocam o chão (Z=0)
  let zOffset;
  if (ESPESSURA_PLACA > 0) {
    zOffset = ESPESSURA_PLACA - (raioEsfera - ALTURA_PONTO);
  } else {
    zOffset = raioEsfera; 
  }

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

  // Lógica de Geração da Base
  let placa = null;
  if (ESPESSURA_PLACA > 0) {
    if (RAIO_BORDA > 0) {
        // Trava matemática: O raio da borda não pode ser maior que a metade da espessura da peça.
        const maxRadius = Math.min(comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2) - 0.01;
        const safeRadius = Math.min(RAIO_BORDA, maxRadius);
        placa = roundedCuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA], roundRadius: safeRadius, segments: 32 });
    } else {
        placa = cuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA] });
    }
    placa = translate([comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2], placa);
  }

  // Lógica de Geração das Bolinhas Braille
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

  // Se a placa existir, une placa+bolinhas. Se não (0mm), une somente as bolinhas.
  if (placa) {
    return union(placa, ...formasPontos);
  } else {
    return union(...formasPontos); 
  }
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
