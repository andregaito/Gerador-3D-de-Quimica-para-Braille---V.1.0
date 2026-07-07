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
const DIST_LINHAS = 10.0; // Novo parâmetro: Espaço Vertical entre uma linha e outra
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

  // 1. Identificar as dimensões corretas do texto (Múltiplas Linhas)
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

  // Calcula a largura pela linha de maior comprimento, e a altura pela quantidade de quebras de linha
  const textoW = maxCols > 0 ? ((maxCols - 1) * DIST_CELAS) + DIST_PONTOS_X : 0;
  const textoH = ((numLines - 1) * DIST_LINHAS) + (2 * DIST_PONTOS_Y);

  const comprimentoPlaca = textoW + (2 * MARGEM);
  const larguraPlaca = textoH + (2 * MARGEM);

  // 2. Desenha a placa principal
  let placa = cuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA] });
  placa = translate([comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2], placa);

  const formasPontos = [];
  
  let currentXIndex = 0;
  let currentYIndex = 0;

  // 3. Posiciona todos os pontos na malha levando em consideração o Eixo X e o Eixo Y
  cells.forEach((cell) => {
    if (cell.isNewline) {
      currentYIndex++;
      currentXIndex = 0;
      return; // Pula a célula pois o Enter é invisível na malha
    }

    const xOffsetCela = MARGEM + (currentXIndex * DIST_CELAS);
    // Para a leitura tátil ser de cima para baixo, a Linha 0 (primeira) recebe os maiores valores de Y.
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

// Cria a URL temporária para o navegador exibir o 3D ou baixar
export function gerarUrlSTL(modelo3D) {
  if (!modelo3D) return null;
  const stlDados = serialize({ binary: true }, modelo3D);
  const blob = new Blob(stlDados, { type: 'model/stl' });
  return URL.createObjectURL(blob);
}

// Força o download usando a URL gerada
export function baixarArquivoSTL(url, nomeArquivo = 'formula_braille.stl') {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
