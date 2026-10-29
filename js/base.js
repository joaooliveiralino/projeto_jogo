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
  const CUSTOS_RECEITAS_BIGORNA = {
    'espada-ferro-forja':   [{ id: 'madeira', qtd: 3 }],   // <<< Espada de Ferro
    'capacete-ferro-forja': [{ id: 'madeira', qtd: 2 }],   // <<< Capacete de Ferro
    'peitoral-ferro-forja': [{ id: 'madeira', qtd: 4 }],   // <<< Peitoral de Ferro
    'botas-ferro-forja':    [{ id: 'madeira', qtd: 2 }],   // <<< Botas de Ferro
    'anel-ferro-forja':     [{ id: 'madeira', qtd: 1 }],   // <<< Anel de Ferro
    'colar-ferro-forja':    [{ id: 'madeira', qtd: 2 }],   // <<< Colar de Ferro
  };

  /* ----- Materiais conhecidos (nome mostrado nos custos) ----- */
  // O id precisa ser igual ao id do item no inventário/loja.
  const MATERIAIS = {
    'madeira':        { nome: 'Madeira',        tipo: 'material', icone: 'hero' },
    'pedra':          { nome: 'Pedra',          tipo: 'material', icone: 'hero' },
    // 'barra-de-ferro': { nome: 'Barra de Ferro', tipo: 'material', icone: 'hero' },  // reative quando usar
    'maca':           { nome: 'Maçã',           tipo: 'comida',   icone: 'hero' },
    'banana':         { nome: 'Banana',         tipo: 'comida',   icone: 'hero' },
  };

  /* ##########################################################
     ##   RECEITAS DE CADA CONSTRUÇÃO  <<<  ALTERE AQUI  >>>  ##
     ##   custo: materiais gastos | bonus: buffs do item      ##
     ##   Chaves de bônus: AT AP FD MD AG CC CA HP MP         ##
     ##   Ícones prontos: sword helmet chest boots ring       ##
     ##   necklace (ou use "imagem" com o caminho do .webp)   ##
     ##   O custo da bigorna fica no bloco acima.             ##
     ########################################################## */
  const RECEITAS = {
    bigorna: [ // armas, armaduras e acessórios
      { id: 'espada-ferro-forja',    nome: 'Espada de Ferro',    tipo: 'arma',      icone: 'sword',    equipSlot: 'arma',     bonus: { AT: 8, CC: 2.5 },  custo: CUSTOS_RECEITAS_BIGORNA['espada-ferro-forja'] },
      { id: 'capacete-ferro-forja',  nome: 'Capacete de Ferro',  tipo: 'armadura',  icone: 'helmet',   equipSlot: 'capacete', bonus: { FD: 3, MD: 1 },    custo: CUSTOS_RECEITAS_BIGORNA['capacete-ferro-forja'] },
      { id: 'peitoral-ferro-forja',  nome: 'Peitoral de Ferro',  tipo: 'armadura',  icone: 'chest',    equipSlot: 'peitoral', bonus: { FD: 6, MD: 2 },    custo: CUSTOS_RECEITAS_BIGORNA['peitoral-ferro-forja'] },
      { id: 'botas-ferro-forja',     nome: 'Botas de Ferro',     tipo: 'armadura',  icone: 'boots',    equipSlot: 'bota',     bonus: { FD: 2, AG: 1 },    custo: CUSTOS_RECEITAS_BIGORNA['botas-ferro-forja'] },
      { id: 'anel-ferro-forja',      nome: 'Anel de Ferro',      tipo: 'acessorio', icone: 'ring',     equipSlot: 'anel',     bonus: { FD: 1, HP: 5 },    custo: CUSTOS_RECEITAS_BIGORNA['anel-ferro-forja'] },
      { id: 'colar-ferro-forja',     nome: 'Colar de Ferro',     tipo: 'acessorio', icone: 'necklace', equipSlot: 'colar',    bonus: { MD: 2, HP: 10 },   custo: CUSTOS_RECEITAS_BIGORNA['colar-ferro-forja'] },
    ],
    bancada: [ // itens em geral
      { id: 'pocao-vida-basica', nome: 'Poção de Vida Básica', tipo: 'pocao', icone: 'hero', equipSlot: null, bonus: {}, custo: [{ id: 'maca', qtd: 2 },   { id: 'pedra', qtd: 1 }] },
      { id: 'pocao-mana-basica', nome: 'Poção de Mana Básica', tipo: 'pocao', icone: 'hero', equipSlot: null, bonus: {}, custo: [{ id: 'banana', qtd: 2 }, { id: 'pedra', qtd: 1 }] },
    ],
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
  const nomeMaterial = id => (MATERIAIS[id] ? MATERIAIS[id].nome : id);

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
    pagos.forEach(p => inv().adicionarItem({ ...p.item, quantity: p.qtd }));
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
      Object.keys(MATERIAIS).map(id => `${nomeMaterial(id)} x${contar(id)}`).join(' &nbsp;|&nbsp; ');
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
      lista.innerHTML = RECEITAS[chave].map((r, i) =>
        cartao(r.nome, '', htmlBuffs(r.bonus) + `<div class="base-custos">${htmlCusto(r.custo)}</div>`,
          `<button type="button" data-criar="${i}">Criar</button>`)).join('');
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
    if (!temCusto(receita.custo)) return mensagem(chave, 'Materiais insuficientes.', false);
    const pagos = pagar(receita.custo);
    if (!pagos) return mensagem(chave, 'Não foi possível gastar os materiais.', false);

    const novo = {
      id: receita.id, name: receita.nome, type: receita.tipo, icon: receita.icone,
      imagem: receita.imagem || null, equipSlot: receita.equipSlot, bonus: { ...receita.bonus },
    };
    if (!inv().adicionarItem(novo)) {          // sem espaço: devolve os materiais
      devolver(pagos);
      renderizar(chave);
      return mensagem(chave, 'Inventário cheio! Libere um espaço.', false);
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
      fabricar(chave, RECEITAS[chave][+b.dataset.criar]);
    }
  });
  document.getElementById('botao-construir').addEventListener('click', () => mostrar('base'));

  /* ===== API para o resto do jogo ===== */
  window.base = {
    construida: chave => !!construidas[chave],
    // Para testes (ex.: no console): base.darMaterial('madeira', 10)
    darMaterial: (id, qtd = 1) => {
      const m = MATERIAIS[id]; if (!m) return false;
      const ok = inv().adicionarItem({ id, name: m.nome, type: m.tipo, icon: m.icone, imagem: null, equipSlot: null, bonus: {}, quantity: qtd });
      renderizarVisivel(); return ok;
    },
  };
})();