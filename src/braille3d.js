import { primitives, transforms, booleans, text, measurements } from '@jscad/modeling';
import { serialize } from '@jscad/stl-serializer';

const { cuboid, roundedCuboid, sphere, cylinder } = primitives;
const { translate, rotateX, scale } = transforms;
const { union, subtract } = booleans;
const { vectorText } = text;
const { measureBoundingBox } = measurements;

function calcularRaioEsfera(diametroBase, alturaCalota) {
  const raioBase = diametroBase / 2.0;
  return (Math.pow(raioBase, 2) + Math.pow(alturaCalota, 2)) / (2 * alturaCalota);
}

// ============================================================================
// GERADOR TEXTO BRAILLE (Aba Gerador Braille)
// ============================================================================
export function gerarModeloJSCAD(cells, config = {}) {
  if (!cells || cells.length === 0) return null;

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
    1: [0, 2 * DIST_PONTOS_Y], 2: [0, DIST_PONTOS_Y], 3: [0, 0],
    4: [DIST_PONTOS_X, 2 * DIST_PONTOS_Y], 5: [DIST_PONTOS_X, DIST_PONTOS_Y], 6: [DIST_PONTOS_X, 0]
  };

  const raioEsfera = calcularRaioEsfera(DIAMETRO_PONTO, ALTURA_PONTO);
  let zOffset = ESPESSURA_PLACA > 0 ? ESPESSURA_PLACA - (raioEsfera - ALTURA_PONTO) : raioEsfera;

  let maxCols = 0; let currentCol = 0; let numLines = 1;
  cells.forEach(cell => {
    if (cell.isNewline) { numLines++; currentCol = 0; }
    else { currentCol++; if (currentCol > maxCols) maxCols = currentCol; }
  });

  const textoW = maxCols > 0 ? ((maxCols - 1) * DIST_CELAS) + DIST_PONTOS_X : 0;
  const textoH = ((numLines - 1) * DIST_LINHAS) + (2 * DIST_PONTOS_Y);
  const comprimentoPlaca = textoW + (2 * MARGEM);
  const larguraPlaca = textoH + (2 * MARGEM);

  let placa = null;
  if (ESPESSURA_PLACA > 0) {
    if (RAIO_BORDA > 0) {
      const maxRadius = Math.min(comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2) - 0.01;
      const safeRadius = Math.min(RAIO_BORDA, maxRadius);
      placa = roundedCuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA], roundRadius: safeRadius, segments: 32 });
    } else {
      placa = cuboid({ size: [comprimentoPlaca, larguraPlaca, ESPESSURA_PLACA] });
    }
    placa = translate([comprimentoPlaca / 2, larguraPlaca / 2, ESPESSURA_PLACA / 2], placa);
  }

  const formasPontos = [];
  let currentXIndex = 0; let currentYIndex = 0;
  cells.forEach((cell) => {
    if (cell.isNewline) { currentYIndex++; currentXIndex = 0; return; }
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

  return placa ? union(placa, ...formasPontos) : union(...formasPontos);
}

// ============================================================================
// NOVO GERADOR PARA BLOCOS IÔNICOS (COM ENCAIXES E TEXTO 3D)
// ============================================================================
export function geradorBlocoIonicoJSCAD(params) {
  const {
    tipo = 'cation',      // 'cation' | 'anion'
    valencia = 1,         // 1, 2, 3, 4
    largura = 60,         // X
    altura = 40,          // Y
    espessura = 6,        // Z
    tamanhoEncaixe = 8,   // Largura/Altura do pino ou rasgo
    formula = "H3O+",     // Texto de exemplo inicial
    espessuraTexto = 0.0, // Positivo para relevo, negativo para corte
    incluirBraille = false,
    cellsBraille = []
  } = params;

  // 1. Cria o bloco base principal
  let blocoBase = cuboid({ size: [largura, altura, espessura] });
  blocoBase = translate([largura / 2, altura / 2, espessura / 2], blocoBase);

  // 2. Geração dos Encaixes (Positivos para Cátion, Negativos para Ânion)
  const encaixes = [];
  const qtdEncaixes = Math.min(Math.max(valencia, 1), 4);
  const espacamentoY = altura / (qtdEncaixes + 1);

  for (let i = 1; i <= qtdEncaixes; i++) {
    const posY = espacamentoY * i;
    // Dimensão do pino/rasgo trapezoidal ou retangular com folga de tolerância
    const pinoW = tamanhoEncaixe;
    const pinoH = tamanhoEncaixe * 0.8;
    
    let pino = cuboid({ size: [pinoW, pinoH, espessura] });
    
    if (tipo === 'cation') {
      // Macho: Projeta para fora no lado direito ou esquerdo
      pino = translate([largura + (pinoW / 2) - 0.1, posY, espessura / 2], pino);
      encaixes.push(pino);
    } else {
      // Fêmea: Subtrai para dentro na lateral esquerda ou direita
      pino = cuboid({ size: [pinoW * 1.05, pinoH * 1.05, espessura + 2] }); // Folga extra no corte
      pino = translate([- (pinoW / 2) + 0.1, posY, espessura / 2], pino);
      encaixes.push(pino);
    }
  }

  let malhaFinal = tipo === 'cation' ? union(blocoBase, ...encaixes) : subtract(blocoBase, ...encaixes);

  // 3. Processamento de Fórmulas com Subescrito/Sobreescrito em Vetores 3D
  const parseFormulaVetorial = (str) => {
    const elementos = [];
    let xOffset = 0;
    const escalaNormal = 0.35;
    const escalaPequena = 0.22;

    for (let i = 0; i < str.length; i++) {
      let char = str[i];
      let isSub = /[₀-₉]/.test(char);
      let isSup = /[⁺⁻⁰⁻⁹]/.test(char) || (i === str.length - 1 && /[+-]/.test(char));
      let escala = (isSub || isSup) ? escalaPequena : escalaNormal;
      let yOffset = isSub ? -2.5 : (isSup ? 3.5 : 0);

      // Converte sub/sup de volta ao texto normal para o renderizador de fontes vetoriais
      const subMap = { '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9' };
      const supMap = { '⁺':'+', '⁻':'-', '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9' };
      let charClean = subMap[char] || supMap[char] || char;

      let vetorChar = vectorText({ x: 0, y: 0, input: charClean });
      
      // Extrusão de linhas 2D para prismas 3D
      let hastesChar = [];
      vetorChar.forEach(segmento => {
        const p1 = segmento[0]; const p2 = segmento[1];
        const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        const angulo = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        
        let haste = cuboid({ size: [dist, 1.2, Math.abs(espessuraTexto)] });
        haste = translate([dist/2, 0, 0], haste);
        haste = rotateX(0, haste); // Fix orientation
        // Transforma a linha rotacionando em Z
        const { rotateZ } = transforms;
        haste = rotateZ(angulo, haste);
        haste = translate([p1[0] * escala + xOffset, p1[1] * escala + yOffset, 0], haste);
        hastesChar.push(haste);
      });

      if (hastesChar.length > 0) {
        elementos.push(union(...hastesChar));
      }
      xOffset += (isSub || isSup) ? 5.5 : 8.5;
    }
    return { geometria: elementos.length > 0 ? union(...elementos) : null, larguraTotal: xOffset };
  };

  const objTexto = parseFormulaVetorial(formula);
  let geometriaConteudo = [];

  // Centralização geral (Texto + Braille se ativado)
  let larguraTotalConteudo = objTexto.larguraTotal;
  let brailleW = 0;
  
  if (incluirBraille && cellsBraille.length > 0) {
    brailleW = cellsBraille.length * 6.0;
    larguraTotalConteudo = Math.max(larguraTotalConteudo, brailleW);
  }

  const startX = (largura - larguraTotalConteudo) / 2;
  const startY = incluirBraille ? (altura / 2) + 4 : altura / 2;

  if (objTexto.geometria) {
    let zPos = espessuraTexto >= 0 ? espessura + (espessuraTexto / 2) : espessura - (Math.abs(espessuraTexto) / 2);
    let textoAlinhado = translate([startX, startY, zPos], objTexto.geometria);
    geometriaConteudo.push(textoAlinhado);
  }

  // 4. Adiciona o Braille se requisitado
  if (incluirBraille && cellsBraille.length > 0) {
    const ALTURA_PONTO = 0.75;
    const DIAMETRO_PONTO = 1.8;
    const DIST_CELAS = 6.0;
    const DIST_PONTOS_X = 2.5; const DIST_PONTOS_Y = 2.5;
    const COORDS_PONTO = {
      1: [0, 2 * DIST_PONTOS_Y], 2: [0, DIST_PONTOS_Y], 3: [0, 0],
      4: [DIST_PONTOS_X, 2 * DIST_PONTOS_Y], 5: [DIST_PONTOS_X, DIST_PONTOS_Y], 6: [DIST_PONTOS_X, 0]
    };
    const raioEsfera = calcularRaioEsfera(DIAMETRO_PONTO, ALTURA_PONTO);
    let zOffset = espessuraTexto >= 0 ? espessura - (raioEsfera - ALTURA_PONTO) : espessura - Math.abs(espessuraTexto);

    const pontinhos = [];
    let currentXIndex = 0;
    const brailleStartX = (largura - (cellsBraille.length * DIST_CELAS)) / 2;
    const brailleStartY = (altura / 2) - 10;

    cellsBraille.forEach(cell => {
      if (cell.dots && cell.dots.length > 0) {
        cell.dots.forEach(num => {
          const [px, py] = COORDS_PONTO[num];
          let ponto = sphere({ radius: raioEsfera, segments: 24 });
          ponto = translate([brailleStartX + (currentXIndex * DIST_CELAS) + px, brailleStartY + py, zOffset], ponto);
          pontinhos.push(ponto);
        });
      }
      currentXIndex++;
    });
    if (pontinhos.length > 0) geometriaConteudo.push(union(...pontinhos));
  }

  // 5. União ou Subtração (Cut negativo) com o Bloco
  if (geometriaConteudo.length > 0) {
    const malhaConteudo = union(...geometriaConteudo);
    if (espessuraTexto < 0) {
      malhaFinal = subtract(malhaFinal, malhaConteudo);
    } else {
      malhaFinal = union(malhaFinal, malhaConteudo);
    }
  }

  return malhaFinal;
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
