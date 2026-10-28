/* ============================================================
   INVENTÁRIO — js/inventory.js
   Abre pelo botão "Inventario" do acampamento (id: botao-inventario).
   Fecha com o botão X, com a tecla ESC ou clicando fora do painel.
   ============================================================ */
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

  // Para criar um item novo: mk(id, nome, tipo, ícone, slotCompatível, {bônus})
  // Nomes de bônus válidos: qualquer chave de BASE_STATS, ou 'Vida' (vida máxima).
  const mk = (id, name, type, icon, equipSlot, bonus, imagem = null) => ({ id, name, type, icon, equipSlot, bonus, imagem });
  const ITEMS = [
    mk('anel-vida-1',        'Anel de Vida',        'acessorio', 'ring',     'anel',     { 'HP': 10 }),
    mk('espada-ferro-1',     'Espada de Ferro',     'arma',      'sword',    'arma',     { 'AT': 8, 'CC': 2.5 }, 'imagens/itens/espadateste.webp'),
    mk('colar-vitalidade-1', 'Colar de Vitalidade', 'acessorio', 'necklace', 'colar',    { 'HP': 20 }),
    mk('capacete-ferro-1',   'Capacete de Ferro',   'armadura',  'helmet',   'capacete', { 'FD': 3, 'MD': 1 }),
    mk('peitoral-ferro-1',   'Peitoral de Ferro',   'armadura',  'chest',    'peitoral', { 'FD': 6, 'MD': 2 }),
    mk('botas-ferro-1',      'Botas de Ferro',      'armadura',  'boots',    'bota',     { 'FD': 2, 'AG': 1 }),
  ];

  const BASE_STATS = {
    'Nível': 1, 'AT': 12, 'AP': 8, 'FD': 5, 'MD': 4, 'AG': 10, 'CC': 5, 'CA': 150,
  };
  const UNIT = { 'CC': '%', 'CA': '%' };
  // [atual, máximo] — apenas visual (a vida máxima recebe os bônus dos itens)
  const vitals = { life: [100, 100], mana: [80, 80], exp: [35, 100] };
  const BAR_NAMES = { life: 'VIDA', mana: 'MANA', exp: 'EXP' };

  const state = {
    inventory: Array(INV_SIZE).fill(null),
    equipment: Object.fromEntries(EQ_SLOTS.map(s => [s.key, null])),
    selected: null, // {kind:'inv'|'eq', key}
    open: false,
  };
  ITEMS.forEach((it, i) => { state.inventory[i] = it; });

  console.table(state.inventory.filter(Boolean).map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
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

  /* ===== Renderização ===== */
  const $ = id => document.getElementById(id);
  const overlay = $('inv-overlay');

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
    : pixelSVG(it.icon);

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

        return `<div><dt>${k}</dt><dd><span>${fmt(base + bn)}${u}</span>${bn ? `<span class="bonus">${bn > 0 ? '+' : ''}${fmt(bn)}${u}</span>` : ''}</dd></div>`;
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
  function render() { renderInventory(); renderEquipment(); renderStatus(); }

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
  render();

  window.inventario = {
    adicionarItem: adicionarItem,
    removerItem: removerItem,

    obterItens: function() {
        return state.inventory;
    }
  };
})();