import { primitives, transforms, booleans, text, geometries, expansions, extrusions } from '@jscad/modeling';
import { serialize } from '@jscad/stl-serializer';

const { cuboid, roundedCuboid, sphere } = primitives;
const { translate } = transforms;
const { union, subtract } = booleans;
const { vectorText } = text;
const { path2 } = geometries;
const { expand } = expansions;
const { extrudeLinear } = extrusions;

function calcularRaioEsfera(diametroBase, alturaCalota) {
  const raioBase = diametroBase / 2.0;
  return (Math.pow(raioBase, 2) + Math.pow(alturaCalota, 2)) / (2 * alturaCalota);
}

// ============================================================================
// GERADOR ORIGINAL BRAILLE
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
// NOVO: GERADOR PARA BLOCOS IÔNICOS (COM ENCAIXES E TEXTO 3D EXTRUDADO)
// ============================================================================
export function geradorBlocoIonicoJSCAD(params) {
  const {
    tipo = 'cation',      
    valencia = 1,         
    largura = 55.9,       // Largura base (parte sólida)
    altura = 25.0,        // Altura por carga
    espessura = 5.0,      
    larguraEncaixe = 9.1, 
    alturaEncaixe = 11.0, 
    formula = "H+",     
    espessuraTexto = 1.0, 
    incluirBraille = false,
    cellsBraille = []
  } = params;

  const qtdEncaixes = Math.min(Math.max(valencia, 1), 4);
  const alturaTotal = altura * qtdEncaixes;

  let malhaFinal = null;
  const encaixes = [];

  // Lógica Física:
  // Cátion: A placa base tem largura normal e o pino sai para a direita.
  // Ânion: A placa base engloba a largura total (largura sólida + a área que será cavada). 
  if (tipo === 'cation') {
    let blocoBase = cuboid({ size: [largura, alturaTotal, espessura] });
    blocoBase = translate([largura / 2, alturaTotal / 2, espessura / 2], blocoBase);

    for (let i = 0; i < qtdEncaixes; i++) {
      const posY = (i * altura) + (altura / 2);
      let pino = cuboid({ size: [larguraEncaixe, alturaEncaixe, espessura] });
      pino = translate([largura + (larguraEncaixe / 2) - 0.05, posY, espessura / 2], pino);
      encaixes.push(pino);
    }
    malhaFinal = union(blocoBase, ...encaixes);

  } else {
    // Para ânions, a largura visual "disponível" da peça é a mesma da base,
    // mas a peça final engloba a largura normal + o espaço do pino macho que a preencherá.
    const larguraTotalAnion = largura + larguraEncaixe;
    let blocoBase = cuboid({ size: [larguraTotalAnion, alturaTotal, espessura] });
    blocoBase = translate([larguraTotalAnion / 2, alturaTotal / 2, espessura / 2], blocoBase);

    for (let i = 0; i < qtdEncaixes; i++) {
      const posY = (i * altura) + (altura / 2);
      let buraco = cuboid({ size: [larguraEncaixe + 0.15, alturaEncaixe + 0.15, espessura + 2] });
      buraco = translate([(larguraEncaixe / 2) - 0.05, posY, espessura / 2], buraco);
      encaixes.push(buraco);
    }
    malhaFinal = subtract(blocoBase, ...encaixes);
  }

  // 3. Processamento de Texto Vectorial Profissional (Expansão de Paths)
  const parseFormulaVetorial = (str) => {
    const elementos = [];
    let xOffset = 0;
    const escalaNormal = 0.40;
    const escalaPequena = 0.25;
    const grossuraLinha = 1.3; // Linhas limpas e grossas para o 3D
    const zSize = Math.abs(espessuraTexto);

    for (let i = 0; i < str.length; i++) {
      let char = str[i];
      let isSub = /[₀-₉]/.test(char);
      let isSup = /[⁺⁻⁰⁻⁹]/.test(char) || (i === str.length - 1 && /[+-]/.test(char));
      let escala = (isSub || isSup) ? escalaPequena : escalaNormal;
      let yOffset = isSub ? -3.0 : (isSup ? 4.0 : 0);

      const subMap = { '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9' };
      const supMap = { '⁺':'+', '⁻':'-', '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9' };
      let charClean = subMap[char] || supMap[char] || char;

      let vetorChar = vectorText({ x: 0, y: 0, input: charClean });
      
      let paths = vetorChar.map(segmento => path2.fromPoints({closed: false}, segmento));
      let pathsExpandidos = paths.map(p => expand({delta: grossuraLinha/2, corners: 'round', segments: 16}, p));
      let extrusoes3D = pathsExpandidos.map(p => extrudeLinear({height: zSize}, p));
      
      if (extrusoes3D.length > 0) {
        let letraFinal = union(...extrusoes3D);
        // Aplica o tamanho e a posição na palavra
        letraFinal = translate([xOffset, yOffset, 0], scale([escala, escala, 1], letraFinal));
        elementos.push(letraFinal);
      }
      xOffset += (isSub || isSup) ? 6.0 : 9.5; 
    }
    return { geometria: elementos.length > 0 ? union(...elementos) : null, larguraTotal: xOffset };
  };

  const objTexto = parseFormulaVetorial(formula);
  let geometriaConteudo = [];

  // Centro Visual da área gravável
  const centroXVisual = tipo === 'anion' ? larguraEncaixe + (largura / 2) : largura / 2;
  
  // Alinhamento do Texto
  const startX = centroXVisual - (objTexto.larguraTotal / 2);
  const startY = incluirBraille ? (alturaTotal / 2) + 4 : (alturaTotal / 2) - 2;

  if (objTexto.geometria) {
    let zPos = espessuraTexto >= 0 ? espessura : espessura - Math.abs(espessuraTexto);
    let textoAlinhado = translate([startX, startY, zPos], objTexto.geometria);
    geometriaConteudo.push(textoAlinhado);
  }

  // 4. Braille Centralizado (Se solicitado)
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

    const brailleRealW = ((cellsBraille.length - 1) * DIST_CELAS) + DIST_PONTOS_X;
    const brailleStartX = centroXVisual - (brailleRealW / 2);
    const brailleStartY = (alturaTotal / 2) - 10;

    const pontinhos = [];
    let currentXIndex = 0;
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

  // 5. União ou Cavamento do Texto no Bloco
  if (geometriaConteudo.length > 0) {
    const malhaConteudo = union(...geometriaConteudo);
    if (espessuraTexto < 0) {
      malhaFinal = subtract(malhaFinal, malhaConteudo);
    } else {
      malhaFinal = union(malhaFinal, malhaConteudo);
    }
  }

  // Centraliza a malha total
  let centroY = alturaTotal / 2;
  let centroX = tipo === 'cation' ? (largura + larguraEncaixe) / 2 : (largura + larguraEncaixe) / 2;
  malhaFinal = translate([-centroX, -centroY, 0], malhaFinal);

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
