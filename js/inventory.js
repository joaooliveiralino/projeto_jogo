(function () {
  'use strict';

  /* ===== Dados ===== */
  const INV_SIZE = 20;
  const TIPOS_EMPILHAVEIS = [
    "material",
    "drop",
    "pocao",
    "comida"
  ];
  const EQ_SLOTS = [
    { key: 'arma', label: 'Arma', icon: 'sword' }, { key: 'colar', label: 'Colar', icon: 'necklace' },
    { key: 'anel', label: 'Anel', icon: 'ring' }, { key: 'capacete', label: 'Capacete', icon: 'helmet' },
    { key: 'peitoral', label: 'Peitoral', icon: 'chest' }, { key: 'bota', label: 'Bota', icon: 'boots' },
  ];

  const mk = (id, name, type, equipSlot, bonus, imagem = null, tipoAtaque = null, efeitos = {}) => ({
    id,
    name,
    type,
    equipSlot,
    bonus,
    imagem,
    tipoAtaque,
    efeitos
  });
  const ITEMS = [
    // Armas Fisicas
    //mk('espada-base-1', 'Espada Base', 'arma', 'arma', { 'AT': 1, 'CC': 1 }, 'imagens/itens/espadateste.webp', 'fisico'),

    mk('porrete-1', 'Porrete', 'arma', 'arma', { 'AT': 3 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-quebrada-1', 'Espada Quebrada', 'arma', 'arma', { 'AT': 5 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-restaurada-1', 'Espada Restaurada', 'arma', 'arma', { 'AT': 8, 'CC': 1.5 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-media-1', 'Espada Media', 'arma', 'arma', { 'AT': 10, 'CC': 2.5 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-longa-1', 'Espada Longa', 'arma', 'arma', { 'AT': 13, 'CC': 3, 'CA': 50 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('adaga-presa-serpente-1', 'Adaga Presa de Serpente', 'arma', 'arma', { 'AT': 15, 'CC': 2, 'CA': 50, 'AG': 5 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-floresta-viva-1', 'Espada da Floresta Viva', 'arma', 'arma', { 'AT': 18, 'CA': 150 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-grama-1', 'Espada de Grama', 'arma', 'arma', { 'AT': 30, 'CC': 5, 'CA': 100, 'AG': 10 }, 'imagens/itens/espadateste.webp', 'fisico'),

    mk('adaga-presa-lobo-1', 'Adaga Presa de Lobo', 'arma', 'arma', { 'AT': 25, 'CC': 4, 'CA': 50, 'AG': 4 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('foice-congelada-eternamente-1', 'Foice Eternamente Congelada', 'arma', 'arma', { 'AT': 40, 'CC': 6, 'CA': 100 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-congelada-1', 'Espada Congelada', 'arma', 'arma', { 'AT': 30, 'CC': 10, 'CA': 50, 'AG': 2 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('adaga-faminta-1', 'Adaga Faminta', 'arma', 'arma', { 'AT': 70, 'CC': 10, 'CA': 100, 'AG': 6 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-gelo-1', 'Espada de gelo', 'arma', 'arma', { 'AT': 100, 'CC': 15, 'CA': 150, 'AG': 2 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-abissal-1', 'Espada Abissal', 'arma', 'arma', { 'AT': 20, 'CC': 40, 'CA': 450, 'AG': 15 }, 'imagens/itens/espadateste.webp', 'fisico'),
    mk('espada-elemental-1', 'Espada Elemental', 'arma', 'arma', { 'AT': 150, 'CC': 10, 'CA': 200, 'AG': 10 }, 'imagens/itens/espadateste.webp', 'fisico'),

    //Armas Magicas
    //mk('cajado-base-1', 'Cajado base', 'arma', 'arma', { 'AP': 1, 'MP': 1 }, 'imagens/itens/espadateste.webp', 'magico',),

    mk('graveto-1', 'Graveto', 'arma', 'arma', { 'AP': 5, 'MP': 3 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-quebrado-1', 'Cajado Quebrado', 'arma', 'arma', { 'AP': 8, 'MP': 5 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-restaurado-1', 'Cajado Restaurado', 'arma', 'arma', { 'AP': 10, 'MP': 7 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-basico-1', 'Cajado Básico', 'arma', 'arma', { 'AP': 15, 'MP': 10 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-magico-1', 'Cajado Magico', 'arma', 'arma', { 'AP': 20, 'MP': 15 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-ventos-1', 'Cajado dos Ventos', 'arma', 'arma', { 'AP': 35, 'MP': 20 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-vivo-1', 'Cajado Vivo', 'arma', 'arma', { 'AP': 45, 'MP': 25 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-jardim-1', 'Cajado do Jardim', 'arma', 'arma', { 'AP': 60, 'MP': 30 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-grama-1', 'Cajado de Grama', 'arma', 'arma', { 'AP': 30, 'MP': 60 }, 'imagens/itens/espadateste.webp', 'magico',),

    mk('cajado-invernal-1', 'Cajado Invernal', 'arma', 'arma', { 'AP': 85, 'MP': 30 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-gelo-1', 'Cajado de Gelo', 'arma', 'arma', { 'AP': 55, 'MP': 100 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-abissal-1', 'Cajado Abissal', 'arma', 'arma', { 'AP': 200, 'MP': -50 }, 'imagens/itens/espadateste.webp', 'magico',),
    mk('cajado-elemental-1', 'Cajado Elemental', 'arma', 'arma', { 'AP': 80, 'MP': 200 }, 'imagens/itens/espadateste.webp', 'magico',),

    //Aneis
    //mk('anel-base-1', 'Anel base', 'acessorio', 'anel', { 'HP': 1, 'MP': 1, 'AT': 1, 'AP': 1, 'FD': 1, 'MD': 1, 'AG': 1, 'CC': 1, 'CA': 1, }),

    mk('anel-pesado-1', 'Anel Pesado', 'acessorio', 'anel', { 'HP': 20, 'FD': 5, 'MD': 5 }),
    mk('anel-rapido-1', 'Anel Rápido', 'acessorio', 'anel', { 'HP': -30, 'AG': 7 }),
    mk('anel-fisico-1', 'Anel Fisico', 'acessorio', 'anel', { 'AT': 6, 'FD': 4, 'CA': 50 }),
    mk('anel-magico-1', 'Anel Magico', 'acessorio', 'anel', { 'MP': 15, 'AP': 6, 'MD': 4 }),
    mk('anel-perigoso-1', 'Anel Perigoso', 'acessorio', 'anel', { 'AT': 5, 'AP': 5, 'CC': 3 }),
    mk('anel-critico-1', 'Anel Critico', 'acessorio', 'anel', { 'CC': 10, 'CA': 75 }),
    mk('anel-assasino-1', 'Anel Assasino', 'acessorio', 'anel', { 'AT': 5, 'AG': 7 }),
    mk('anel-golem-1', 'Anel Golem', 'acessorio', 'anel', { 'HP': 25, 'AP': 4, 'FD': 6 }),
    mk('anel-suporte-1', 'Anel Suporte', 'acessorio', 'anel', { 'HP': 20, 'MP': 25, 'AG': 4 }),
    mk('anel-abencoado-1', 'Anel Abençoado', 'acessorio', 'anel', { 'HP': 10, 'MP': 15, 'AT': 3, 'AP': 3, 'FD': 4, 'MD': 4, 'AG': 5, 'CC': 2, 'CA': 50 }),

    //Colares
    //mk('colar-base-1', 'Colar base', 'acessorio', 'colar', { 'HP': 1 }),

    mk('colar-pesado-1', 'Colar Pesado', 'acessorio', 'colar', { 'HP': 20, 'MD': 5, 'FD': 5 }),
    mk('colar-rapido-1', 'Colar Rapido', 'acessorio', 'colar', { 'HP': -30, 'AG': 7 }),
    mk('colar-fisico-1', 'Colar Fisico', 'acessorio', 'colar', { 'AT': 6, 'FD': 4, 'CC': 2 }),
    mk('colar-magico-1', 'Colar Magico', 'acessorio', 'colar', { 'MP': 15, 'MD': 4, 'AP': 6 }),
    mk('colar-perigoso-1', 'Colar Perigoso', 'acessorio', 'colar', { 'AT': 5, 'AP': 5, 'CA': 50 }),
    mk('colar-critico-1', 'Colar Critico', 'acessorio', 'colar', { 'CC': 5, 'CA': 50 }),
    mk('colar-assasino-1', 'Colar Assasino', 'acessorio', 'colar', { 'AT': 5, 'AG': 7 }),
    mk('colar-golem-1', 'Colar Golem', 'acessorio', 'colar', { 'HP': 25, 'AP': 4, 'FD': 7 }),
    mk('colar-suporte-1', 'Colar Suporte', 'acessorio', 'colar', { 'HP': 20, 'MP': 25, 'AG': 4 }),
    mk('colar-abencoado-1', 'Colar Abençoado', 'acessorio', 'colar', { 'HP': 10, 'AT': 3, 'AP': 3, 'FD': 4, 'MD': 4, 'AG': 5, 'MP': 15, 'CC': 2, 'CA': 50 }),

    //Armaduras
    //mk('capacete-base-1', 'Capacete base', 'armadura', 'capacete', { 'FD': 3, 'MD': 1 }),
    //mk('peitoral-base-1', 'Peitoral base', 'armadura', 'peitoral', { 'FD': 6, 'MD': 2 }),
    //mk('botas-base-1', 'Botas base', 'armadura', 'bota', { 'FD': 2, 'AG': 1 }),

    mk('capacete-ferro-1', 'Capacete de Ferro', 'armadura', 'capacete', { 'FD': 1, 'MD': 1 }),
    mk('peitoral-ferro-1', 'Peitoral de Ferro', 'armadura', 'peitoral', { 'FD': 2, 'MD': 2 }),
    mk('botas-ferro-1', 'Botas de Ferro', 'armadura', 'bota', { 'FD': 1, 'AG': 1 }),
    mk('capacete-couro-javali-1', 'Capacete de Couro de Javali', 'armadura', 'capacete', { 'FD': 2, 'MD': 1 }),
    mk('peitoral-couro-javali-1', 'Peitoral de Couro de Javali', 'armadura', 'peitoral', { 'FD': 3, 'MD': 2 }),
    mk('botas-couro-javali-1', 'Botas de Couro de Javali', 'armadura', 'bota', { 'FD': 1, 'AG': 1 }),
    mk('capacete-escama-serpente-1', 'Capacete de Escama de Serpente', 'armadura', 'capacete', { 'FD': 3, 'MD': 2 }),
    mk('peitoral-escama-serpente-1', 'Peitoral de Escama de Serpente', 'armadura', 'peitoral', { 'FD': 5, 'MD': 3 }),
    mk('botas-escama-serpente-1', 'Botas de Escama de Serpente', 'armadura', 'bota', { 'FD': 2, 'AG': 1 }),
    mk('capacete-madeira-viva-1', 'Capacete de Madeira Viva', 'armadura', 'capacete', { 'FD': 3, 'MD': 4 }),
    mk('peitoral-madeira-viva-1', 'Peitoral de Madeira Viva', 'armadura', 'peitoral', { 'FD': 5, 'MD': 6 }),
    mk('botas-madeira-viva-1', 'Botas de Madeira Viva', 'armadura', 'bota', { 'FD': 3, 'AG': 2 }),
    mk('capacete-fundador-1', 'Capacete Fundador', 'armadura', 'capacete', { 'FD': 5, 'MD': 5 }),
    mk('peitoral-fundador-1', 'Peitoral Fundador', 'armadura', 'peitoral', { 'FD': 7, 'MD': 7 }),
    mk('botas-fundador-1', 'Botas Fundador', 'armadura', 'bota', { 'FD': 4, 'AG': 4 }),
    mk('capacete-grama-1', 'Capacete de Grama', 'armadura', 'capacete', { 'FD': -4, 'MD': 9 }),
    mk('peitoral-grama-1', 'Peitoral de Grama', 'armadura', 'peitoral', { 'FD': -6, 'MD': 12 }),
    mk('botas-grama-1', 'Botas de Grama', 'armadura', 'bota', { 'FD': -2, 'AG': 6 }),
    mk('capacete-couro-lobo-1', 'Capacete de Couro de Lobo', 'armadura', 'capacete', { 'FD': 7, 'MD': 5 }),
    mk('peitoral-couro-lobo-1', 'Peitoral de Couro de Lobo', 'armadura', 'peitoral', { 'FD': 9, 'MD': 6 }),
    mk('botas-couro-lobo-1', 'Botas de Couro de Lobo', 'armadura', 'bota', { 'FD': 5, 'AG': 4 }),
    mk('capacete-presas-nevadas-1', 'Capacete das Presas Nevadas', 'armadura', 'capacete', { 'FD': 9, 'MD': 4 }),
    mk('peitoral-presas-nevadas-1', 'Peitoral das Presas Nevadas', 'armadura', 'peitoral', { 'FD': 12, 'MD': 5 }),
    mk('botas-presas-nevadas-1', 'Botas das Presas Nevadas', 'armadura', 'bota', { 'FD': 7, 'AG': 3 }),
    mk('capacete-gelo-1', 'Capacete de Gelo', 'armadura', 'capacete', { 'FD': 10, 'MD': 10 }),
    mk('peitoral-gelo-1', 'Peitoral de gelo', 'armadura', 'peitoral', { 'FD': 14, 'MD': 14 }),
    mk('botas-gelo-1', 'Botas de Gelo', 'armadura', 'bota', { 'FD': 8, 'AG': 8 }),
    mk('capacete-ancestral-1', 'Capacete Ancestral', 'armadura', 'capacete', { 'FD': 16, 'MD': 16 }),
    mk('peitoral-ancestral-1', 'Peitoral Ancestral', 'armadura', 'peitoral', { 'FD': 20, 'MD': 20 }),
    mk('botas-ancestral-1', 'Botas Ancestrais', 'armadura', 'bota', { 'FD': 12, 'AG': 15 }),

    //Poções
    //mk('pocao-vida-base-1', 'Poção de Vida', 'pocao', null, {}, null, null, { curaVida: 30 }),
    //mk('pocao-mana-base-1', 'Poção de Mana', 'pocao', null, {}, null, null, { curaMana: 25 }),

    mk('pocao-vida-basica-1', 'Poção de Vida Basica', 'pocao', null, {}, null, null, { curaVida: 10 }),
    mk('pocao-mana-basica-1', 'Poção de Mana Basica', 'pocao', null, {}, null, null, { curaMana: 15 }),
    mk('pocao-vida-intermediaria-1', 'Poção de Vida Intermediaria', 'pocao', null, {}, null, null, { curaVida: 30 }),
    mk('pocao-mana-intermediaria-1', 'Poção de Mana Intermediaria', 'pocao', null, {}, null, null, { curaMana: 25 }),
    mk('pocao-vida-avancada-1', 'Poção de Vida Avançada', 'pocao', null, {}, null, null, { curaVida: 60 }),
    mk('pocao-mana-avancada-1', 'Poção de Mana Avançada', 'pocao', null, {}, null, null, { curaMana: 50 }),

    //Alimentos
    //mk('alimento-base', 'alimento base', 'comida', null, { curaVida: 1, curaMana: 1}),

    mk('maca', 'Maçã', 'comida', null, {}, null, null, { curaVida: 10, curaMana: 5 }),
    mk('banana', 'Banana', 'comida', null, {}, null, null, { curaVida: 10, curaMana: 5 }),
    mk('carne', 'Carne', 'comida', null, {}, null, null, { curaVida: 20, curaMana: 8 }),
    mk('batata-frita', 'Batata Frita', 'comida', null, {}, null, null, { curaVida: 20, curaMana: 8 }),
    mk('chimarrao', 'Chimarrão', 'comida', null, {}, null, null, { curaVida: 45, curaMana: 16 }),
    mk('pao-mortadela', 'Pão com Mortadela', 'comida', null, {}, null, null, { curaVida: 45, curaMana: 16 }),

    //Materiais
    //mk('material-base', 'materialbase', 'material', null, {}),

    mk('gosma', 'Gosma', 'material', null, {}),
    mk('pedra', 'Pedra', 'material', null, {}),
    mk('madeira', 'Madeira', 'material', null, {}),
    mk('presa-serpente', 'Presas de Serpente', 'material', null, {}),
    mk('escama-serpente', 'Escamas de Serpente', 'material', null, {}),
    mk('couro-javali', 'Couro de Javali', 'material', null, {}),
    mk('esfera-magica', 'Esfera Magica', 'material', null, {}),
    mk('madeira-viva', 'Madeira Viva', 'material', null, {}),
    mk('folha-viva', 'Folha Viva', 'material', null, {}),
    mk('gema-jardim', 'Gema do Jardim', 'material', null, {}),
    mk('lasca-fundador', 'Lasca do Fundador', 'material', null, {}),
    mk('elemento-grama', 'Elemente de Grama', 'material', null, {}),
    mk('presa-lobo', 'Presa de Lobo', 'material', null, {}),
    mk('couro-lobo', 'Couro de Lobo', 'material', null, {}),
    mk('cabo-foice-congelada', 'Cabo de Foice Congelada', 'material', null, {}),
    mk('pedaco-gelo-eterno', 'Pedaço de Gelo Eterno', 'material', null, {}),
    mk('presas-nevasca', 'Presas da Nevasca', 'material', null, {}),
    mk('pele-congelada', 'Pele Congelada', 'material', null, {}),
    mk('neve-magica', 'Neve Magica', 'material', null, {}),
    mk('fragmento-gelo-compactado', 'Fragemento de Gelo Compactado', 'material', null, {}),
    mk('elemento-gelo', 'Elemento de Gelo', 'material', null, {}),
  ];

  const BASE_STATS = {
    'Nível': 1, 'AT': 10, 'AP': 7, 'FD': 4, 'MD': 3, 'AG': 10, 'CC': 5, 'CA': 150,
  };
  const UNIT = { 'CC': '%', 'CA': '%' };
  // [atual, máximo] — apenas visual (a vida máxima recebe os bônus dos itens)
  const vitals = { life: [80, 80], mana: [65, 65], exp: [35, 100] };
  const BAR_NAMES = { life: 'VIDA', mana: 'MANA', exp: 'EXP' };
  let nivel = 1;

  const bonusNivel = {
      AT: 0,
      AP: 0,
      FD: 0,
      MD: 0,
      AG: 0,
      CC: 0
  };

const EXP_INICIAL = 100;
const MULTIPLICADOR_EXP = 1.30;

function calcularEXPNecessaria(nivel) {
    return Math.round(
        EXP_INICIAL * Math.pow(MULTIPLICADOR_EXP, nivel - 1)
    );
}

function aplicarBonusNivel() {
    bonusNivel.AT += 2;
    bonusNivel.AP += 2;
    bonusNivel.FD += 1;
    bonusNivel.MD += 1;
    bonusNivel.AG += 1;
    bonusNivel.CC += 0.5;

    vitals.life[1] += 10;
    vitals.mana[1] += 5;
}

function adicionarExperiencia(quantidade) {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return 0;
    }

    vitals.exp[0] += quantidade;

    let niveisGanhos = 0;

    while (vitals.exp[0] >= vitals.exp[1]) {
        vitals.exp[0] -= vitals.exp[1];

        nivel++;
        niveisGanhos++;

        aplicarBonusNivel();

        vitals.exp[1] = calcularEXPNecessaria(nivel);
    }

    renderStatus();

    return niveisGanhos;
}

function aplicarPenalidadeMorte() {
    vitals.exp[0] = Math.floor(vitals.exp[0] * 0.5);

    renderStatus();
}

  const state = {
    inventory: Array(INV_SIZE).fill(null),
    equipment: Object.fromEntries(EQ_SLOTS.map(s => [s.key, null])),
    selected: null, // {kind:'inv'|'eq', key}
    open: false,
  };

const ITENS_INICIAIS = [
    { id: 'pocao-vida-basica-1', quantidade: 2 },
    { id: 'pocao-mana-basica-1', quantidade: 2 },
    { id: 'porrete-1', quantidade: 1 },
    { id: 'graveto-1', quantidade: 1 },
    //teste de camadas
    { id: 'espada-abissal-1', quantidade: 1 }
];


function carregarItensIniciais() {
    ITENS_INICIAIS.forEach(function(itemInicial) {
        const itemCatalogo = ITEMS.find(function(item) {
            return item.id === itemInicial.id;
        });

        if (!itemCatalogo) {
            console.error(`Item não encontrado no catálogo: ${itemInicial.id}`);
            return;
        }

        adicionarItem({
            ...itemCatalogo,
            quantity: itemInicial.quantidade
        });
    });
}

  console.table(state.inventory.filter(Boolean).map(item => ({
    id: item.id,
    name: item.name,
    bonus: item.bonus,
    imagem: item.imagem
})));

  const fmt = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

  /* ===== Pixel art (matriz -> SVG) ===== */
  const IRON = { o: '#1A100B', w: '#E8EEF2', i: '#B8C0C8', m: '#8A939D', d: '#3E454D', g: '#E0A93B', b: '#70452B' };
  const ART = {
    ring: {
      pal: { o: '#1A100B', g: '#E0A93B', h: '#FFE08A', d: '#A06A1E', r: '#C93636' },
      rows: ['....oooo....', '...orrhro...', '....oooo....', '...ogggggo..', '..oghhgggdo.', '.ogh.....gdo',
        '.og.......do', '.og.......do', '.ogd.....ddo', '..ogddddddo.', '...oodddoo..', '....oooo....'],
    },
    sword: {
      pal: IRON,
      rows: ['.....oo.....', '....owio....', '....owmo....', '....owmo....', '....owmo....', '....owmo....',
        '....owmo....', '..oggggggo..', '..oooooooo..', '....obbo....', '....obbo....', '....oggo....'],
    },
    helmet: {
      pal: IRON,
      rows: ['...oooooo...', '..owiiiimo..', '.owiiiiiimo.', '.oiiiiiiimo.', '.oiiiiiiimo.', '.oddddddddo.',
        '.oiiiiiiimo.', '.oiiiiiiimo.', '.oimo..omio.', '.oooo..oooo.'],
    },
    chest: {
      pal: IRON,
      rows: ['.ooo....ooo.', '.oiio..oiio.', 'oiiiooooiiio', 'owiiiiiiiimo', 'oiiiiiiiiimo', '.oiiiiiiimo.',
        '.oiiiiiiimo.', '.obbggggbbo.', '.oiiiiiiimo.', '.oiiiiiiimo.', '.omiiiiiimo.', '..oooooooo..'],
    },
    boots: {
      pal: IRON,
      rows: ['.oooo..oooo.', '.oiio..oiio.', '.oimo..oimo.', '.oimo..oimo.', '.oimo..oimo.', '.oimo..oimo.',
        '.oiimo.oiimo', 'oiiiiooiiiio', 'oooooooooooo'],
    },
    necklace: {
      pal: { o: '#1A100B', g: '#E0A93B', f: '#B8F5C0', e: '#3FA75A', d: '#1F6B3A' },
      rows: ['..oo....oo..', '.ogo....ogo.', '.og......go.', '.og......go.', '..ogo..ogo..', '...oggggo...',
        '....oggo....', '...ofeeeo...', '...oeeeeo...', '....odeo....', '.....oo.....'],
    },
    hero: {
      pal: { o: '#1A100B', s: '#E8B98A', h: '#70452B', a: '#9AA3AD', c: '#3678D4', l: '#A87549', k: '#422719' },
      rows: ['...oooooo...', '..ohhhhhho..', '..ohssssho..', '..osossoso..', '...osssso...', '..oaaaaaao..',
        '.oaaccccaao.', '.osaccccaso.', '.osaccccaso.', '..oallllllo.', '...ollooll..', '...ollooll..',
        '..okkoookko.', '..oooooooo..'],
    },
  };
  function pixelSVG(name) {
    if (!ART[name]) {
        console.error("Ícone não encontrado em ART:", name);
        return "";
    }

    const { pal, rows } = ART[name];
    let r = "";

    rows.forEach((row, y) => [...row].forEach((ch, x) => {
        if (pal[ch]) {
            r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[ch]}"/>`;
        }
    }));

    return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" xmlns="http://www.w3.org/2000/svg">${r}</svg>`;
}

  /* ===== Acesso aos dados ===== */
  const getItem = l => (l.kind === 'inv' ? state.inventory[l.key] : state.equipment[l.key]);
  function setItem(l, item) { if (l.kind === 'inv') state.inventory[l.key] = item; else state.equipment[l.key] = item; }
  const sameLoc = (a, b) => a && b && a.kind === b.kind && a.key === b.key;
  // Validar compatibilidade
  const canPlace = (item, l) => !item || l.kind === 'inv' || item.equipSlot === l.key;
  const canSwap = (src, dst) => canPlace(getItem(src), dst) && canPlace(getItem(dst), src);

  /* Soma dos bônus de todos os itens equipados */
  function totalBonus() {
    const t = {};
    for (const it of Object.values(state.equipment)) {
      if (!it) continue;
      for (const [k, v] of Object.entries(it.bonus)) t[k] = (t[k] || 0) + v;
    }
    return t;
  }

  /* ===== Operações (alteram os dados e depois a interface) ===== */
  function moveItem(src, dst) {
    if (sameLoc(src, dst) || !getItem(src) || !canSwap(src, dst)) return false;
    const a = getItem(src), b = getItem(dst);
    setItem(dst, a); setItem(src, b);      // troca segura: nunca duplica nem perde
    render(); return true;
  }
  function unequipItem(slotKey) {
    const free = state.inventory.indexOf(null);
    if (free === -1) return false;          // inventário cheio: mantém equipado
    return moveItem({ kind: 'eq', key: slotKey }, { kind: 'inv', key: free });
  }
  function adicionarItem(item) {
    const empilhavel = TIPOS_EMPILHAVEIS.includes(item.type);

    const quantidade = Number.isInteger(item.quantity) && item.quantity > 0
        ? item.quantity
        : 1;

    // Se for empilhável, procura uma pilha do mesmo item.
    if (empilhavel) {
        const pilhaExistente = state.inventory.find(function(itemInventario) {
            return itemInventario &&
                itemInventario.id === item.id &&
                TIPOS_EMPILHAVEIS.includes(itemInventario.type);
        });

        if (pilhaExistente) {
            pilhaExistente.quantity =
                (pilhaExistente.quantity || 1) + quantidade;

            render();
            return true;
        }
    }

    // Só procura um espaço livre se precisar criar uma nova entrada.
    const espacoLivre = state.inventory.indexOf(null);

    if (espacoLivre === -1) {
        return false;
    }

    const novoItem = { ...item };

    if (empilhavel) {
        novoItem.quantity = quantidade;
    } else {
        delete novoItem.quantity;
    }

    state.inventory[espacoLivre] = novoItem;

    render();
    return true;
  }
  function removerItem(idItem, quantidade = 1) {
    const indice = state.inventory.findIndex(function(item) {
        return item && item.id === idItem;
    });

    if (indice === -1) {
        return false;
    }

    const item = state.inventory[indice];
    const quantidadeAtual = item.quantity || 1;

    // "all" remove a pilha inteira.
    if (quantidade === "all") {
        state.inventory[indice] = null;
        render();
        return true;
    }

    // Impede quantidades inválidas.
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return false;
    }

    // Não permite remover mais unidades do que existem.
    if (quantidade > quantidadeAtual) {
        return false;
    }

    if (quantidade === quantidadeAtual) {
        state.inventory[indice] = null;
    } else {
        item.quantity = quantidadeAtual - quantidade;
    }

    render();
    return true;
  }
  function selectItem(l) { state.selected = l; render(); }
  const clearSelection = () => { state.selected = null; render(); };

  const $ = id => document.getElementById(id);
  const overlay = $('inv-overlay');

  const botaoDescartar = $('inv-descartar');
  const modalDescarte = $('modal-descarte');
  const descarteNome = $('descarte-nome');
  const descarteQuantidade = $('descarte-quantidade');
  const descarteInput = $('descarte-input');
  const descarteConfirmar = $('descarte-confirmar');
  const descarteCancelar = $('descarte-cancelar');
  let itemParaDescartar = null;

  function atualizarBotaoDescartar() {
    const itemSelecionado = state.selected &&
        state.selected.kind === 'inv' &&
        getItem(state.selected);

    botaoDescartar.disabled = !itemSelecionado;
  }

  function tooltipText(it) {
    const lines = Object.entries(it.bonus).map(([k, v]) => {
    const sinal = v > 0 ? '+' : '';
    const nome = k === 'HP' ? 'Vida máxima' : k;

    return `${sinal}${fmt(v)}${UNIT[k] || ''} ${nome}`;
  });
    return [it.name, ...lines].join('\n');
  }
  function slotHTML(l) {
    const it = getItem(l);
    const sel = sameLoc(state.selected, l);
    const selItem = state.selected && getItem(state.selected);
    const can = l.kind === 'eq' && selItem && selItem.equipSlot === l.key && !sel;
    const cls = ['slot', it ? '' : 'empty', sel ? 'selected' : '', can ? 'can-equip' : '', it && l.kind === 'eq' ? 'equipped' : ''].join(' ');
    let inner = '';
    if (it) {
    const quantidade = it.quantity || 1;

    const contador = TIPOS_EMPILHAVEIS.includes(it.type) && quantidade > 1
        ? `<span class="item-quantidade">x${quantidade}</span>`
        : "";

    const desenho = it.imagem
      ? `<img src="${it.imagem}" alt="${it.name}" class="sprite-item">`
      : '';

    inner = `
      <div class="item" draggable="true" data-name="${tooltipText(it)}">
          ${desenho}
          ${contador}
      </div>
    `;
  }
    else if (l.kind === 'eq') inner = `<div class="ph">${pixelSVG(EQ_SLOTS.find(s => s.key === l.key).icon)}</div>`;
    return `<div class="${cls}" data-kind="${l.kind}" data-key="${l.key}">${inner}</div>`;
  }
  function renderInventory() {
    $('inv-grid').innerHTML = state.inventory.map((_, i) => slotHTML({ kind: 'inv', key: i })).join('');
  }
  function renderEquipment() {
    $('inv-eq-grid').innerHTML = EQ_SLOTS.map(s =>
      `<div class="eq">${slotHTML({ kind: 'eq', key: s.key })}<span>${s.label}</span></div>`).join('');
  }
  function renderStatus() {
    const b = totalBonus();

    $('inv-attrs').innerHTML = Object.entries(BASE_STATS).map(([k, base]) => {
    const u = UNIT[k] || '';
    const bn = b[k] || 0;

    const valorBase = k === 'Nível'
        ? nivel
        : base + (bonusNivel[k] || 0);

    const valorFinal = valorBase + bn;

    return `<div><dt>${k}</dt><dd><span>${fmt(valorFinal)}${u}</span>${bn ? ` <span class="bonus">${bn > 0 ? '+' : ''}${bn}</span>` : ''}</dd></div>`;
}).join('');

    $('inv-portrait').innerHTML = pixelSVG('hero');

    for (const k of Object.keys(vitals)) {
        let bn = 0;

        if (k === 'life') {
            bn = b['HP'] || 0;
        } else if (k === 'mana') {
            bn = b['MP'] || 0;
        }

        const cur = vitals[k][0] + bn;
        const max = vitals[k][1] + bn;

        $('inv-' + k + '-fill').style.setProperty(
            '--pct',
            (cur / max * 100) + '%'
        );

        $('inv-' + k + '-label').innerHTML =
            `${BAR_NAMES[k]} ${cur}/${max}` +
            (bn ? ` <span class="bonus">${bn > 0 ? '+' : ''}${bn}</span>` : '');
    }
}
  function render() {renderInventory(); renderEquipment(); renderStatus(); atualizarBotaoDescartar();}

  /* ===== Interação: clique ===== */
  const locOf = el => { const s = el.closest('.slot'); return s ? { kind: s.dataset.kind, key: s.dataset.kind === 'inv' ? +s.dataset.key : s.dataset.key } : null; };
  function flashInvalid(l) {
    const el = overlay.querySelector(`.slot[data-kind="${l.kind}"][data-key="${l.key}"]`);
    if (el) { el.classList.add('invalid'); setTimeout(() => el.classList.remove('invalid'), 300); }
  }
  overlay.addEventListener('click', e => {
    const l = locOf(e.target); if (!l) return;
    const sel = state.selected;
    if (!sel) {
      if (!getItem(l)) return;
      if (l.kind === 'eq') { if (!unequipItem(l.key)) flashInvalid(l); return; } // clicar no equipado = retirar
      return selectItem(l);
    }
    if (sameLoc(sel, l)) return clearSelection();
    if (moveItem(sel, l)) state.selected = null, render();
    else flashInvalid(l);
  });

  /* ===== Interação: arrastar e soltar ===== */
  let dragSrc = null;
  const clearDrop = () => overlay.querySelectorAll('.drop-ok,.drop-bad').forEach(el => el.classList.remove('drop-ok', 'drop-bad'));
  overlay.addEventListener('dragstart', e => {
    const l = e.target.closest && locOf(e.target); if (!l || !getItem(l)) return e.preventDefault();
    dragSrc = l; state.selected = null; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', getItem(l).id);
  });
  overlay.addEventListener('dragover', e => {
    const slot = e.target.closest('.slot'); if (!slot || !dragSrc) return;
    const l = locOf(slot); clearDrop();
    if (sameLoc(l, dragSrc)) return;
    if (canSwap(dragSrc, l)) { e.preventDefault(); slot.classList.add('drop-ok'); } else slot.classList.add('drop-bad');
  });
  overlay.addEventListener('drop', e => {
    e.preventDefault(); const slot = e.target.closest('.slot');
    if (slot && dragSrc) moveItem(dragSrc, locOf(slot));
    dragSrc = null; clearDrop();
  });
  overlay.addEventListener('dragend', () => { dragSrc = null; clearDrop(); });

  /* ===== Abrir e fechar ===== */
  function openInventory() {
    state.open = true;
    overlay.hidden = false;
  }
  function closeInventory() {
    state.open = false;
    state.selected = null; dragSrc = null;
    overlay.hidden = true;
    render(); // o estado dos itens é preservado
  }

  // Botão "Inventario" do acampamento
  botaoDescartar.addEventListener('click', function() {
    if (!state.selected || state.selected.kind !== 'inv') return;

    const item = getItem(state.selected);

    if (!item) return;

    itemParaDescartar = item;

    const quantidadeAtual = item.quantity || 1;

    descarteNome.textContent = item.name;
    descarteQuantidade.textContent = `Disponível: ${quantidadeAtual}`;

    descarteInput.min = 1;
    descarteInput.max = quantidadeAtual;
    descarteInput.value = 1;

    modalDescarte.hidden = false;
  });

  descarteCancelar.addEventListener('click', function() {
    modalDescarte.hidden = true;
    itemParaDescartar = null;
  });

  descarteConfirmar.addEventListener('click', function() {
    if (!itemParaDescartar) return;

    const quantidade = Number(descarteInput.value);
    const quantidadeAtual = itemParaDescartar.quantity || 1;

    if (
        !Number.isInteger(quantidade) ||
        quantidade <= 0 ||
        quantidade > quantidadeAtual
    ) {
        alert('Quantidade inválida!');
        return;
    }

    const sucesso = removerItem(itemParaDescartar.id, quantidade);

    if (!sucesso) return;

    modalDescarte.hidden = true;
    itemParaDescartar = null;
    clearSelection();
  });

  $('botao-inventario').addEventListener('click', openInventory);
  // Botão X
  $('inv-fechar').addEventListener('click', closeInventory);
  // Tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.open) closeInventory();
  });
  // Clique no fundo desfocado (fora do painel)
  let downNoFundo = false;
  overlay.addEventListener('mousedown', e => { downNoFundo = (e.target === overlay); });
  overlay.addEventListener('click', e => { if (e.target === overlay && downNoFundo) closeInventory(); });

  /* ===== Início ===== */
  carregarItensIniciais();
  render();

  window.inventario = {
    adicionarItem: adicionarItem,
    removerItem: removerItem,
    adicionarExperiencia: adicionarExperiencia,
    aplicarPenalidadeMorte: aplicarPenalidadeMorte,

    obterItens: function() {
        return state.inventory;
    },

    obterItemCatalogo: function(idItem) {
    return ITEMS.find(function(item) {
        return item.id === idItem;
    }) || null;
},

adicionarItemPorId: function(idItem, quantidade = 1) {
    const item = ITEMS.find(function(item) {
        return item.id === idItem;
    });

    if (!item) {
        console.error(`Item não encontrado: ${idItem}`);
        return false;
    }

    return adicionarItem({
        ...item,
        quantity: quantidade
    });
},

    obterAtributos: function() {
      const bonus = totalBonus();

      return {
        ...BASE_STATS,

        'Nível': nivel,

        AT: BASE_STATS.AT + bonusNivel.AT + (bonus.AT || 0),
        AP: BASE_STATS.AP + bonusNivel.AP + (bonus.AP || 0),
        FD: BASE_STATS.FD + bonusNivel.FD + (bonus.FD || 0),
        MD: BASE_STATS.MD + bonusNivel.MD + (bonus.MD || 0),
        AG: BASE_STATS.AG + bonusNivel.AG + (bonus.AG || 0),
        CC: BASE_STATS.CC + bonusNivel.CC + (bonus.CC || 0),

        CA: BASE_STATS.CA + (bonus.CA || 0)
      };
    },

    obterNivel: function() {
    return nivel;
},

obterExperiencia: function() {
    return {
        atual: vitals.exp[0],
        necessaria: vitals.exp[1]
    };
},

    obterVida: function() {
    const bonus = totalBonus().HP || 0;

    return {
        atual: vitals.life[0] + bonus,
        maxima: vitals.life[1] + bonus
    };
},

obterMana: function() {
    const bonus = totalBonus().MP || 0;

    return {
        atual: vitals.mana[0] + bonus,
        maxima: vitals.mana[1] + bonus
    };
},

atualizarVida: function(novaVida) {
    const bonus = totalBonus().HP || 0;

    vitals.life[0] = novaVida - bonus;

    renderStatus();
},

atualizarMana: function(novaMana) {
    const bonus = totalBonus().MP || 0;

    vitals.mana[0] = novaMana - bonus;

    renderStatus();
},

definirAtributosRespawn: function() {
    const vida = this.obterVida();
    const mana = this.obterMana();

    this.atualizarVida(Math.floor(vida.maxima * 0.3));
    this.atualizarMana(0);
},

obterTipoAtaque: function() {
    const armaEquipada = state.equipment.arma;

    if (!armaEquipada) {
        return "fisico";
    }

    return armaEquipada.tipoAtaque || "fisico";
},

  };
})();