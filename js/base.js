/* ============================================================
   SISTEMA DA BASE — js/base.js
   Botão "Criar/Construir" do acampamento (id: botao-construir).
   Usa window.inventario (inventory.js) para ler, gastar e entregar itens.
   ============================================================ */
(function () {
  'use strict';

  /* ##########################################################
     ##########################################################
     ##   CUSTO DAS CONSTRUÇÕES  <<<  ALTERE AQUI  >>>        ##
     ##   Formato: { id: 'id-do-material', qtd: quantidade }  ##
     ##   Pode colocar mais de um material na mesma lista.    ##
     ##########################################################
     ########################################################## */
  const CUSTOS_CONSTRUCAO = {
    cabana:   [{ id: 'madeira', qtd: 1 }],                                  // <<< custo da CABANA
    bigorna:  [{ id: 'madeira', qtd: 10 }, { id: 'pedra', qtd: 10 }],       // <<< custo da BIGORNA
    bancada:  [{ id: 'madeira', qtd: 10 }],                                 // <<< custo da BANCADA DE TRABALHO
  };

  /* ##########################################################
     ##########################################################
     ##   CUSTO DAS RECEITAS DA BIGORNA  <<<  ALTERE AQUI >>> ##
     ##   Por enquanto tudo custa MADEIRA (provisório).       ##
     ##   Para trocar depois, mude o id/qtd de cada linha.    ##
     ##   Ex.: [{ id: 'barra-de-ferro', qtd: 3 }]            ##
     ##########################################################
     ########################################################## */
  const CUSTOS_RECEITAS_BIGORNA = {};

  /* ----- Materiais conhecidos (nome mostrado nos custos) ----- */
  // O id precisa ser igual ao id do item no inventário/loja.
  const MATERIAIS = [
    'madeira',
    'pedra',
    'maca',
    'banana'
  ];

  /* ##########################################################
     ##   RECEITAS DE CADA CONSTRUÇÃO  <<<  ALTERE AQUI  >>>  ##
     ##   custo: materiais gastos | bonus: buffs do item      ##
     ##   Chaves de bônus: AT AP FD MD AG CC CA HP MP         ##
     ##   Ícones prontos: sword helmet chest boots ring       ##
     ##   necklace (ou use "imagem" com o caminho do .webp)   ##
     ##   O custo da bigorna fica no bloco acima.             ##
     ########################################################## */
    //id: 'ID_DO_ITEM',
    //nome: 'Nome do Item',
    //custo: [
    //    { id: 'ID_DO_MATERIAL', qtd: 2 },
    //    { id: 'OUTRO_MATERIAL', qtd: 3 }
    //]

    const RECEITAS = {
    bigorna: {
        armas: [
          {
            id: 'espada-restaurada-1',
            nome: 'Espada Restaurada',
            custo: [
              { id: 'espada-quebrada-1', qtd: 1 },
              { id: 'pedra', qtd: 10},
              { id: 'gosma', qtd: 5}
            ]
          },
          {
            id: 'adaga-presa-serpente-1',
            nome: 'Adaga da Presa de Serpente',
            custo: [
              { id: 'presa-serpente', qtd: 10 },
              { id: 'escama-serpente', qtd: 5 },
            ]
          },
          {
            id: 'espada-floresta-viva-1',
            nome: 'Espada da Floresta Viva',
            custo: [
              { id: 'madeira-viva', qtd: 15 },
              { id: 'folha-viva', qtd: 10},
            ]
          },
          {
            id: 'adaga-presa-lobo-1',
            nome: 'Adaga de Presas de Lobo',
            custo: [
              { id: 'presa-lobo', qtd: 15 },
              { id: 'couro-lobo', qtd: 10},
            ]
          },
          {
            id: 'foice-congelada-eternamente-1',
            nome: 'Foice Eternamente Congelada',
            custo: [
              { id: 'cabo-foice-congelada', qtd: 1 },
              { id: 'pedaco-gelo-eterno', qtd: 10},
              { id: 'fragmento-gelo-compactado', qtd: 10}
            ]
          },
          {
            id: 'espada-congelada-1',
            nome: 'Espada Congelada',
            custo: [
              { id: 'pedaco-gelo-eterno', qtd: 20 },
              { id: 'neve-magica', qtd: 5},
              { id: 'fragmento-gelo-compactado', qtd: 10}
            ]
          },
          {
            id: 'adaga-faminta-1',
            nome: 'Adaga Faminta',
            custo: [
              { id: 'presas-nevasca', qtd: 4 },
              { id: 'pele-congelada', qtd: 6},
            ]
          },
          {
            id: 'espada-grama-1',
            nome: 'Espada de Grama',
            custo: [
              { id: 'elemento-grama', qtd: 5 },
              { id: 'gema-jardim', qtd: 6 },
              { id: 'lasca-fundador', qtd: 6 }
            ]
          },
          {
            id: 'espada-gelo-1',
            nome: 'Espada de Gelo',
            custo: [
              { id: 'cabo-foice-congelada', qtd: 1 },
              { id: 'elemento-gelo', qtd: 5},
              { id: 'presas-nevasca', qtd: 6},
              { id: 'fragmento-gelo-eterno', qtd: 6}
            ]
          },
          {
            id: 'espada-abissal-1',
            nome: 'Espada Abissal',
            custo: [
              { id: 'gosma', qtd: 25 },
              { id: 'presa-serpente', qtd: 20},
              { id: 'esfera-magica', qtd: 20 },
              { id: 'madeira-viva', qtd: 18 },
              { id: 'folha-viva', qtd: 18 },
              { id: 'gema-jardim', qtd: 10 },
              { id: 'lasca-fundador', qtd: 10 },
              { id: 'presa-lobo', qtd: 25 },
              { id: 'cabo-foice-congelada', qtd: 5 },
              { id: 'pedaco-gelo-eterno', qtd: 18 },
              { id: 'presas-nevasca', qtd: 10 },
              { id: 'pele-congelada', qtd: 10 },
              { id: 'fragmento-gelo-compactado', qtd: 18 },
              { id: 'espada-restaurada-1', qtd: 1 },
            ]
          },
          {
            id: 'espada-elemental-1',
            nome: 'Espada Elemental',
            custo: [
              { id: 'espada-abissal-1', qtd: 1 },
              { id: 'espada-grama-1', qtd: 1},
              { id: 'espada-gelo-1', qtd: 1},
              { id: 'elemento-gelo', qtd: 5},
              { id: 'elemento-grama', qtd: 5},
            ]
          },

          {
            id: 'cajado-restaurado-1',
            nome: 'Cajado Restaurado',
            custo: [
              { id: 'cajado-quebrado-1', qtd: 1 },
              { id: 'pedra', qtd: 5 },
              { id: 'gosma', qtd: 12 }
            ]
          },
          {
            id: 'cajado-ventos-1',
            nome: 'Cajado dos Ventos',
            custo: [
              { id: 'esfera-magica', qtd: 10 },
              { id: 'madeira-viva', qtd: 6 },
              { id: 'folha-viva', qtd: 3 }
            ]
          },
          {
            id: 'cajado-vivo-1',
            nome: 'Cajado Vivo',
            custo: [
              { id: 'madeira-viva', qtd: 15 },
              { id: 'folha-viva', qtd: 12 },
              { id: 'esfera-magica', qtd: 2 }
            ]
          },
          {
            id: 'cajado-jardim-1',
            nome: 'Cajado do Jardim',
            custo: [
              { id: 'gema-jardim', qtd: 6 },
              { id: 'lasca-fundador', qtd: 6 },
              { id: 'esfera-magica', qtd: 18 }
            ]
          },
          {
            id: 'cajado-invernal-1',
            nome: 'Cajado Invernal',
            custo: [
              { id: 'pedaco-gelo-compactado', qtd: 6 },
              { id: 'cabo-foice-congelada', qtd: 1 },
              { id: 'neve-magica', qtd: 12 }
            ]
          },
          {
            id: 'cajado-grama-1',
            nome: 'Cajado de Grama',
            custo: [
              { id: 'elemento-grama', qtd: 5 },
              { id: 'lasca-fundador', qtd: 12 },
              { id: 'gema-jardim', qtd: 12 }
            ]
          },
          {
            id: 'cajado-gelo-1',
            nome: 'Cajado de Gelo',
            custo: [
              { id: 'elemento-gelo', qtd: 5 },
              { id: 'cabo-foice-congelada', qtd: 1 },
              { id: 'pedaco-gelo-eterno', qtd: 12 },
              { id: 'fragmento-gelo-compactado', qtd: 10}
            ]
          },
          {
            id: 'cajado-abissal-1',
            nome: 'Cajado Abissal',
            custo: [
              { id: 'gosma', qtd: 25 },
              { id: 'presa-serpente', qtd: 20},
              { id: 'esfera-magica', qtd: 20 },
              { id: 'madeira-viva', qtd: 18 },
              { id: 'folha-viva', qtd: 18 },
              { id: 'gema-jardim', qtd: 10 },
              { id: 'lasca-fundador', qtd: 10 },
              { id: 'presa-lobo', qtd: 25 },
              { id: 'cabo-foice-congelada', qtd: 5 },
              { id: 'pedaco-gelo-eterno', qtd: 18 },
              { id: 'presas-nevasca', qtd: 10 },
              { id: 'pele-congelada', qtd: 10 },
              { id: 'fragmento-gelo-compactado', qtd: 18 },
              { id: 'cajado-restaurado-1', qtd: 1 },
            ]
          },
          {
            id: 'espada-elemental-1',
            nome: 'Espada Elemental',
            custo: [
              { id: 'cajado-abissal-1', qtd: 1 },
              { id: 'cajado-grama-1', qtd: 1},
              { id: 'cajado-gelo-1', qtd: 1},
              { id: 'elemento-gelo', qtd: 5},
              { id: 'elemento-grama', qtd: 5},
            ]
          },
        ],
        armaduras: [
          {
            nome: 'Armadura de Ferro',
            resultado: [
              { id: 'capacete-ferro-1', qtd: 1 },
              { id: 'peitoral-ferro-1', qtd: 1 },
              { id: 'botas-ferro-1', qtd: 1 }
            ],
            custo: [
              { id: 'pedra', qtd: 50 },
              { id: 'madeira', qtd: 50 },
              { id: 'gosma', qtd: 35}
            ]
          },
          {
            nome: 'Armadura de Couro de Javali',
            resultado: [
              { id: 'capacete-couro-javali-1', qtd: 1 },
              { id: 'peitoral-couro-javali-1', qtd: 1 },
              { id: 'botas-couro-javali-1', qtd: 1 }
            ],
            custo: [
              { id: 'couro-javali', qtd: 75 },
              { id: 'gosma', qtd: 35 }
            ]
          },
          {
            nome: 'Armadura de Escama de Serpente',
            resultado: [
              { id: 'capacete-escama-serpente-1', qtd: 1 },
              { id: 'peitoral-escama-serpente-1', qtd: 1 },
              { id: 'botas-escama-serpente-1', qtd: 1 }
            ],
            custo: [
              { id: 'escama-serpente', qtd: 75 },
              { id: 'gosma', qtd: 35 }
            ]
          },
          {
            nome: 'Armadura de Madeira Viva',
            resultado: [
              { id: 'capacete-madeira-viva-1', qtd: 1 },
              { id: 'peitoral-madeira-viva-1', qtd: 1 },
              { id: 'botas-madeira-viva-1', qtd: 1 }
            ],
            custo: [
              { id: 'madeira-viva', qtd: 75 },
              { id: 'gosma', qtd: 35 }
            ]
          },
          {
            nome: 'Armadura Fundadora',
            resultado: [
              { id: 'capacete-fundador-1', qtd: 1 },
              { id: 'peitoral-fundador-1', qtd: 1 },
              { id: 'botas-fundador-1', qtd: 1 }
            ],
            custo: [
              { id: 'lasca-fundador', qtd: 35 },
              { id: 'gema-jardim', qtd: 5 },
              { id: 'gosma', qtd: 15}
            ]
          },
          {
            nome: 'Armadura de Couro de Lobo',
            resultado: [
              { id: 'capacete-couro-lobo-1', qtd: 1 },
              { id: 'peitoral-couro-lobo-1', qtd: 1 },
              { id: 'botas-couro-lobo-1', qtd: 1 }
            ],
            custo: [
              { id: 'couro-lobo', qtd: 75 },
              { id: 'gosma', qtd: 35 }
            ]
          },
          {
            nome: 'Armadura de presas nevadas',
            resultado: [
              { id: 'capacete-presas-nevadas-1', qtd: 1 },
              { id: 'peitoral-presas-nevadas-1', qtd: 1 },
              { id: 'botas-presas-nevadas-1', qtd: 1 }
            ],
            custo: [
              { id: 'presas-nevasca', qtd: 75 },
              { id: 'gosma', qtd: 35 },
              { id: 'pele-congelada', qtd: 35}
            ]
          },
          {
            nome: 'Armadura de Grama',
            resultado: [
              { id: 'capacete-grama-1', qtd: 1 },
              { id: 'peitoral-grama-1', qtd: 1 },
              { id: 'botas-grama-1', qtd: 1 }
            ],
            custo: [
              { id: 'elemento-grama', qtd: 35 },
              { id: 'gema-jardim', qtd: 5 }
            ]
          },
          {
            nome: 'Armadura de Gelo',
            resultado: [
              { id: 'capacete-gelo-1', qtd: 1 },
              { id: 'peitoral-gelo-1', qtd: 1 },
              { id: 'botas-gelo-1', qtd: 1 }
            ],
            custo: [
              { id: 'elemento-gelo', qtd: 35 },
              { id: 'pele-congelada', qtd: 5 }
            ]
          },
          {
            nome: 'Armadura Ancestral',
            resultado: [
              { id: 'capacete-ancestral', qtd: 1 },
              { id: 'peitoral-ancestral', qtd: 1 },
              { id: 'botas-ancestral', qtd: 1 }
            ],
            custo: [
              { id: 'elemento-grama', qtd: 50 },
              { id: 'elemento-gelo', qtd: 50 },
              { id: 'lasca-fundador', qtd: 25},
              { id: 'pele-congelada', qtd: 25}
            ]
          },
        ],
        acessorios: [
          {
            nome: 'Conjunto Pesado',
            resultado: [
              { id: 'colar-pesado-1', qtd: 1 },
              { id: 'anel-pesado-1', qtd: 1 }
            ],
            custo: [
              { id: 'couro-javali', qtd: 15 },
              { id: 'escama-serpente', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Rápido',
            resultado: [
              { id: 'colar-rapido-1', qtd: 1 },
              { id: 'anel-rapido-1', qtd: 1 }
            ],
            custo: [
              { id: 'presa-serpente', qtd: 15 },
              { id: 'folha-viva', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Fisico',
            resultado: [
              { id: 'colar-fisico-1', qtd: 1 },
              { id: 'anel-fisico-1', qtd: 1 }
            ],
            custo: [
              { id: 'presa-lobo', qtd: 15 },
              { id: 'presa-serpente', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Magico',
            resultado: [
              { id: 'colar-magico-1', qtd: 1 },
              { id: 'anel-magico-1', qtd: 1 }
            ],
            custo: [
              { id: 'esfera-magica', qtd: 15 },
              { id: 'neve-magica', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Perigoso',
            resultado: [
              { id: 'colar-perigoso-1', qtd: 1 },
              { id: 'anel-perigoso-1', qtd: 1 }
            ],
            custo: [
              { id: 'madeira-viva', qtd: 15 },
              { id: 'pedaco-gelo-eterno', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Critico',
            resultado: [
              { id: 'colar-critico-1', qtd: 1 },
              { id: 'anel-critico-1', qtd: 1 }
            ],
            custo: [
              { id: 'fragmento-gelo-compactado', qtd: 15 },
              { id: 'presa-serpente', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Assasino',
            resultado: [
              { id: 'colar-assasino-1', qtd: 1 },
              { id: 'anel-assasino-1', qtd: 1 }
            ],
            custo: [
              { id: 'esfera-magica', qtd: 15 },
              { id: 'pedaco-gelo-eterno', qtd: 15 }
            ]
          },
          {
            nome: 'Conjunto Golem',
            resultado: [
              { id: 'colar-golem-1', qtd: 1 },
              { id: 'anel-golem-1', qtd: 1 }
            ],
            custo: [
              { id: 'madeira-viva', qtd: 15 },
              { id: 'lasca-fundador', qtd: 5 }
            ]
          },
          {
            nome: 'Conjunto Suporte',
            resultado: [
              { id: 'colar-suporte-1', qtd: 1 },
              { id: 'anel-suporte-1', qtd: 1 }
            ],
            custo: [
              { id: 'esfera-magica', qtd: 15 },
              { id: 'pele-congelada', qtd: 5 }
            ]
          },
          {
            nome: 'Conjunto Abençoado',
            resultado: [
              { id: 'colar-abencoado-1', qtd: 1 },
              { id: 'anel-abencoado-1', qtd: 1 }
            ],
            custo: [
              { id: 'elemento-grama', qtd: 2 },
              { id: 'elemento-gelo', qtd: 2 }
            ]
          },
        ]
    },

    bancada: {
    pocoes: [
        {
            id: 'pocao-vida-basica-1',
            nome: 'Poção de Vida Básica',
            custo: [
                { id: 'maca', qtd: 4 },
                { id: 'banana', qtd: 2 }
            ]
        },
        {
            id: 'pocao-mana-basica-1',
            nome: 'Poção de mana Básica',
            custo: [
                { id: 'banana', qtd: 4 },
                { id: 'maca', qtd: 2 }
            ]
        },
    ],
    comidas: [],
    outros: []
}
};

  /* ----- Descrição das construções (ordem em que aparecem) ----- */
  const CONSTRUCOES = {
    cabana:   { nome: 'Cabana',              icone: 'cabana',   desc: 'Primeiro upgrade. Libera as outras melhorias da base.', tela: null },
    bigorna:  { nome: 'Bigorna',             icone: 'bigorna',  desc: 'Cria armas, armaduras e acessórios.',                   tela: 'bigorna',  requer: 'cabana' },
    bancada:  { nome: 'Bancada de Trabalho', icone: 'bancada',  desc: 'Cria itens.',                                           tela: 'bancada',  requer: 'cabana' },
  };

  const TELAS = {
    base:     { titulo: 'Construções',         texto: 'Escolha o que construir ou usar na sua base.' },
    bigorna:  { titulo: 'Bigorna',             texto: 'Forje armas, armaduras e acessórios.' },
    bancada:  { titulo: 'Bancada de Trabalho', texto: 'Crie itens com os materiais que você coletou.' },
  };

  const UNIT = { CC: '%', CA: '%' };
  const construidas = { cabana: false, bigorna: false, bancada: false };
  const fmt = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const nomeMaterial = id => {
    const item = inv().obterItemCatalogo(id);
    return item ? item.name : id;
  };

  /* ===== Ícones das construções (pixel art) ===== */
  const ICONES = {
    cabana: {
      pal: { o: '#1A100B', r: '#A8412E', R: '#7A2C1D', w: '#C99A68', y: '#9AD3F0', d: '#5A3A20' },
      rows: ['.....oo.....', '....orro....', '...orrRro...', '..orrrRrro..', '.orrrRrrrro.', 'orrrrRrrrrro',
        'oooooooooooo', '.owwwwwwwwo.', '.owyywwddwo.', '.owyywwddwo.', '.owwwwwddwo.', '.oooooooooo.'],
    },
    bigorna: {
      pal: { o: '#1A100B', w: '#E8EEF2', i: '#B8C0C8', m: '#8A939D', d: '#3E454D' },
      rows: ['..oooooooooo', '.owwiiiiiiio', 'oiiiiiiiiiio', '.ooooiiiioo.', '....oiiiio..', '....oiiiio..',
        '...oimmmmio.', '..oiiiiiiiio', '..oddddddddo', '..oooooooooo'],
    },
    bancada: {
      pal: { o: '#1A100B', I: '#B8C0C8', b: '#8A5A34', B: '#A8743F', T: '#C99A68' },
      rows: ['............', '..ooo.......', '.oIIIo..oo..', '..obo..obbo.', '..obo..obbo.', 'oooooooooooo',
        'oBBBBBBBBBBo', 'oBTTTTTTTTBo', 'oooooooooooo', '.obo....obo.', '.obo....obo.', '.ooo....ooo.'],
    },
  };
  function pixelSVG(nome) {
    const { pal, rows } = ICONES[nome];
    let r = '';
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (pal[ch]) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[ch]}"/>`;
    }));
    return `<svg viewBox="0 0 12 ${rows.length}" xmlns="http://www.w3.org/2000/svg">${r}</svg>`;
  }

  /* ===== Cenários em pixel art: bancada e bigorna (320x180 ampliados) ===== */
  function cenario(tipo) {
    const W = 320, H = 180, cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
    const disco = (cx, cy, r, c) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) R(cx + x, cy + y, 1, 1, c); };
    const brilho = (cx, cy, r, c) => { g.globalAlpha = 0.1; for (let i = r; i > 0; i -= 6) disco(cx, cy, i, c); g.globalAlpha = 1; };
    const pontos = (n, x0, x1, y0, y1, cores) => { for (let i = 0; i < n; i++) R(x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0), 1, 1, cores[(rnd() * cores.length) | 0]); };

    if (tipo === 'bancada') {             // oficina de madeira
      R(0, 0, W, H, '#6b4428');
      for (let x = 0; x < W; x += 16) { R(x, 0, 15, 140, (x / 16) % 2 ? '#7a4e2b' : '#85562f'); R(x + 15, 0, 1, 140, '#3d2312'); }
      pontos(260, 0, W, 0, 138, ['#5a3a20', '#946237']);
      R(0, 0, W, 12, '#3d2312'); R(0, 12, W, 3, '#5a3a20'); R(0, 136, W, 4, '#3d2312');
      for (let y = 140; y < H; y += 10) { R(0, y, W, 9, (y / 10) % 2 ? '#5a3a20' : '#664125'); R(0, y + 9, W, 1, '#2c1a0d'); }
      R(244, 26, 52, 52, '#2c1a0d'); R(248, 30, 44, 44, '#9ad3f0'); R(248, 30, 44, 14, '#b8e4f8');   // janela
      R(268, 30, 4, 44, '#2c1a0d'); R(248, 50, 44, 4, '#2c1a0d'); R(240, 78, 60, 5, '#5a3a20');
      g.globalAlpha = 0.14; for (let y = 84; y < H; y++) R(244 + (y - 84) * 0.5, y, 40, 1, '#ffe9a0'); g.globalAlpha = 1;
      R(10, 56, 56, 4, '#2c1a0d'); R(16, 44, 8, 12, '#c0392b'); R(18, 42, 4, 2, '#2c1a0d'); R(30, 46, 8, 10, '#2f7ae5'); R(44, 48, 8, 8, '#3fa75a');   // prateleiras
      R(10, 92, 56, 4, '#2c1a0d'); R(16, 80, 10, 12, '#e0a93b'); R(32, 84, 12, 8, '#c99a68'); R(50, 82, 8, 10, '#8a939d');
      R(158, 12, 2, 18, '#2c1a0d'); R(152, 30, 14, 14, '#2c1a0d'); R(155, 33, 8, 8, '#ffd45e'); brilho(159, 37, 36, '#ffd27a');           // lanterna
      R(60, 118, 200, 10, '#a8743f'); R(60, 118, 200, 3, '#c99a68'); R(66, 128, 10, 24, '#6b4428'); R(244, 128, 10, 24, '#6b4428');       // bancada
      R(100, 108, 3, 10, '#8a5a34'); R(96, 105, 11, 5, '#b8c0c8'); R(140, 114, 40, 4, '#b8c0c8'); R(180, 111, 8, 8, '#8a5a34'); R(200, 112, 36, 6, '#c99a68');
      R(8, 110, 24, 36, '#6b4428'); R(8, 118, 24, 2, '#2c1a0d'); R(8, 136, 24, 2, '#2c1a0d');                                           // barril
      R(268, 118, 40, 34, '#8a5a34'); R(268, 118, 40, 3, '#a8743f'); R(268, 134, 40, 2, '#5a3a20'); R(286, 118, 4, 34, '#5a3a20');       // caixote
    } else if (tipo === 'bigorna') {             // forja de pedra
      R(0, 0, W, H, '#2a2530');
      for (let y = 0; y < 140; y += 10) for (let x = -((y / 10) % 2) * 12; x < W; x += 24) R(x, y, 23, 9, ['#3a3445', '#352f40', '#403a4c'][(rnd() * 3) | 0]);
      R(0, 140, W, 40, '#221e2a'); for (let x = 0; x < W; x += 20) R(x, 140, 1, 40, '#15121a'); R(0, 140, W, 2, '#15121a');
      R(36, 6, 24, 36, '#4a4452');                                                                  // chaminé
      R(8, 40, 80, 100, '#4a4452'); R(12, 44, 72, 96, '#3a3445'); R(24, 76, 48, 64, '#15121a'); R(30, 68, 36, 10, '#15121a');   // forno
      brilho(48, 112, 76, '#ff7a1a');
      R(26, 114, 44, 26, '#d6432b'); R(30, 104, 36, 20, '#ff8a1f'); R(36, 96, 24, 14, '#ffc247'); R(42, 100, 12, 8, '#fff2a8');
      R(236, 30, 70, 3, '#6b4428'); R(250, 33, 4, 30, '#6b4428'); R(244, 30, 16, 8, '#8a939d'); R(280, 33, 2, 40, '#8a939d'); R(284, 33, 2, 40, '#8a939d'); // ferramentas
      R(270, 118, 30, 28, '#6b4428'); R(270, 126, 30, 2, '#2c1a0d'); R(270, 138, 30, 2, '#2c1a0d'); R(272, 118, 26, 4, '#3a7bd5');         // balde
      R(140, 112, 80, 10, '#b8c0c8'); R(140, 112, 80, 3, '#e8eef2'); R(120, 114, 22, 6, '#b8c0c8'); R(112, 116, 10, 3, '#8a939d');       // bigorna
      R(158, 122, 44, 12, '#8a939d'); R(148, 134, 64, 8, '#3e454d'); R(146, 142, 68, 38, '#6b4428');
      for (let y = 150; y < H; y += 8) R(146, y, 68, 1, '#4a2c17');
      pontos(70, 110, 230, 84, 140, ['#ffb02e', '#ff6a1a', '#fff2a8']);
    }
    return cv.toDataURL();
  }

  /* ===== Inventário (ponte com inventory.js) ===== */
  const inv = () => window.inventario;
  function contar(id) {
    return inv().obterItens().reduce((t, it) => t + (it && it.id === id ? (it.quantity || 1) : 0), 0);
  }
  const temCusto = custo => custo.every(c => contar(c.id) >= c.qtd);

  // Gasta o custo. Se algo falhar, devolve o que já tirou e retorna null.
  function pagar(custo) {
    const pagos = [];
    for (const c of custo) {
      const modelo = inv().obterItens().find(it => it && it.id === c.id);
      const copia = modelo ? { ...modelo } : null;
      if (!copia || !inv().removerItem(c.id, c.qtd)) { devolver(pagos); return null; }
      pagos.push({ item: copia, qtd: c.qtd });
    }
    return pagos;
  }
  function devolver(pagos) {
    pagos.forEach(p => {
        inv().adicionarItemPorId(p.item.id, p.qtd);
    });
  }

  /* ===== Criação da interface ===== */
  const principal = document.querySelector('main') || document.body;
  const telas = {};
  const msgs = {};

  function criarTela(chave) {
    const t = document.createElement('section');
    t.id = 'tela-' + (chave === 'base' ? 'base' : 'base-' + chave);
    t.className = 'base-tela base-fundo-' + chave;
    if (chave !== 'base') t.style.backgroundImage = 'url(' + cenario(chave) + ')';   // a tela de construções usa o mesmo fundo do acampamento (css)
    t.innerHTML =
      `<h1>${TELAS[chave].titulo}</h1>
       <p>${TELAS[chave].texto}</p>
       <div class="base-painel">
         <div class="base-materiais"></div>
         <div class="base-lista"></div>
         <p class="base-msg" role="status"></p>
       </div>
       <button type="button" class="base-voltar">${chave === 'base' ? 'Voltar ao acampamento' : 'Voltar às construções'}</button>`;
    principal.appendChild(t);
    t.querySelector('.base-voltar').addEventListener('click', () => mostrar(chave === 'base' ? 'jogo' : 'base'));
    telas[chave] = t;
    msgs[chave] = t.querySelector('.base-msg');
  }
  Object.keys(TELAS).forEach(criarTela);

  function mostrar(chave) {
    document.querySelectorAll('main > section').forEach(s => { s.style.display = 'none'; });
    if (chave === 'jogo') { document.querySelector('#tela-jogo').style.display = 'flex'; return; }
    renderizar(chave);
    telas[chave].style.display = 'flex';
  }

  function mensagem(chave, texto, ok) {
    msgs[chave].textContent = texto;
    msgs[chave].className = 'base-msg ' + (ok ? 'ok' : 'erro');
  }

  /* ===== Renderização ===== */
  function htmlCusto(custo) {
    return custo.map(c => {
      const tem = contar(c.id);
      return `<span class="base-custo ${tem >= c.qtd ? 'ok' : 'falta'}">${nomeMaterial(c.id)} ${tem}/${c.qtd}</span>`;
    }).join('');
  }
  function htmlBuffs(bonus) {
    const lista = Object.entries(bonus || {}).map(([k, v]) =>
      `<span class="base-buff ${v < 0 ? 'neg' : ''}">${v > 0 ? '+' : ''}${fmt(v)}${UNIT[k] || ''} ${k}</span>`);
    return lista.length ? `<div class="base-buffs">${lista.join('')}</div>` : '';
  }
  function resumoMateriais() {
    return '<strong>Seus materiais:</strong> ' +
      MATERIAIS.map(id => `${nomeMaterial(id)} x${contar(id)}`).join(' &nbsp;|&nbsp; ');
  }
  function cartao(titulo, desc, extra, botao, icone) {
    const ic = icone ? `<div class="base-icone">${pixelSVG(icone)}</div>` : '';
    return `<div class="base-card">${ic}<div class="base-info"><strong>${titulo}</strong><span>${desc}</span>${extra}</div>${botao}</div>`;
  }

  function renderizar(chave) {
    const t = telas[chave];
    const lista = t.querySelector('.base-lista');
    t.querySelector('.base-materiais').innerHTML = resumoMateriais();

    if (chave === 'base') {
      // Sem cabana: aparece só a cabana. Com cabana: libera a bigorna e a bancada.
      const visiveis = Object.keys(CONSTRUCOES).filter(k => k === 'cabana' || construidas.cabana);
      lista.innerHTML = visiveis.map(k => {
        const c = CONSTRUCOES[k];
        const custo = `<div class="base-custos">${construidas[k] ? '' : htmlCusto(CUSTOS_CONSTRUCAO[k])}</div>`;
        let botao;
        if (!construidas[k]) botao = `<button type="button" data-construir="${k}">Construir</button>`;
        else if (c.tela) botao = `<button type="button" data-usar="${c.tela}">Entrar</button>`;
        else botao = `<span class="base-pronta">Construída</span>`;
        return cartao(c.nome, c.desc, custo, botao, c.icone);
      }).join('');
    } else {
      const categorias = RECEITAS[chave];

      lista.innerHTML = Object.entries(categorias).map(([categoria, receitas]) => {
        if (receitas.length === 0) return '';

        const titulo = categoria.charAt(0).toUpperCase() + categoria.slice(1);

        return `
          <div class="base-categoria">
            <h2>${titulo}</h2>
            ${receitas.map((r, i) =>
              cartao(
                r.nome,
                '',
                htmlBuffs(r.bonus) + `<div class="base-custos">${htmlCusto(r.custo)}</div>`,
                `<button type="button" data-categoria="${categoria}" data-criar="${i}">Criar</button>`
              )
            ).join('')}
          </div>
        `;
      }).join('');
    }
  }
  function renderizarVisivel() {
    Object.keys(telas).forEach(k => { if (telas[k].style.display === 'flex') renderizar(k); });
  }

  /* ===== Ações ===== */
  function construir(chave) {
    if (construidas[chave]) return;
    const req = CONSTRUCOES[chave].requer;
    if (req && !construidas[req]) return mensagem('base', 'Construa a Cabana primeiro.', false);
    if (!temCusto(CUSTOS_CONSTRUCAO[chave])) return mensagem('base', 'Materiais insuficientes.', false);
    if (!pagar(CUSTOS_CONSTRUCAO[chave])) return mensagem('base', 'Não foi possível gastar os materiais.', false);
    construidas[chave] = true;
    renderizar('base');
    mensagem('base', CONSTRUCOES[chave].nome + ' construída!' +
      (chave === 'cabana' ? ' Novas construções liberadas.' : ''), true);
  }

  function fabricar(chave, receita) {
    if (!temCusto(receita.custo)) {
        return mensagem(chave, 'Materiais insuficientes.', false);
    }

    // Permite fabricar um item ou vários itens.
    const resultados = receita.resultado || [
        { id: receita.id, qtd: 1 }
    ];

    if (!resultados.length || resultados.some(r => !r.id || r.qtd < 1)) {
        return mensagem(chave, 'Receita com resultado inválido.', false);
    }

    const pagos = pagar(receita.custo);

    if (!pagos) {
        return mensagem(chave, 'Não foi possível gastar os materiais.', false);
    }

    const adicionados = [];

    // Entrega cada item da receita.
    for (const item of resultados) {
        const qtd = item.qtd || 1;
        const adicionado = inv().adicionarItemPorId(item.id, qtd);

        if (!adicionado) {
            // Remove os itens que já foram entregues.
            adicionados.forEach(r => {
                inv().removerItem(r.id, r.qtd);
            });

            // Devolve os materiais gastos.
            devolver(pagos);

            renderizar(chave);
            return mensagem(chave, 'Inventário cheio! Libere espaço.', false);
        }

        adicionados.push({ id: item.id, qtd });
    }

    renderizar(chave);
    mensagem(chave, receita.nome + ' criado e enviado ao inventário!', true);
}

  /* ===== Eventos ===== */
  principal.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.construir) construir(b.dataset.construir);
    else if (b.dataset.usar) mostrar(b.dataset.usar);
    else if (b.dataset.criar !== undefined) {
      const tela = b.closest('.base-tela');
      const chave = Object.keys(telas).find(k => telas[k] === tela);

      const categoria = b.dataset.categoria;
      const indice = Number(b.dataset.criar);

      const receita = RECEITAS[chave][categoria][indice];

      fabricar(chave, receita);
    }
  });
  document.getElementById('botao-construir').addEventListener('click', () => mostrar('base'));

  /* ===== API para o resto do jogo ===== */
  window.base = {
    construida: chave => !!construidas[chave],
    // Para testes (ex.: no console): base.darMaterial('madeira', 10)
    darMaterial: (id, qtd = 1) => {
    if (!inv().obterItemCatalogo(id)) return false;

    const ok = inv().adicionarItemPorId(id, qtd);

    renderizarVisivel();
    return ok;
},
  obterDadosSave: () => ({
    construidas: { ...construidas }
}),

carregarDadosSave: dados => {
    if (!dados || !dados.construidas) {
        return false;
    }

    Object.keys(construidas).forEach(chave => {
        if (typeof dados.construidas[chave] === "boolean") {
            construidas[chave] = dados.construidas[chave];
        }
    });

    renderizarVisivel();
    return true;
},
  };
})();