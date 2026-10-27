/* ============================================================
   INVENTÁRIO — js/inventory.js
   Abre pelo botão "Inventario" do acampamento (id: botao-inventario).
   Fecha com o botão X, com a tecla ESC ou clicando fora do painel.
   ============================================================ */
(function () {
  'use strict';

  /* ===== Dados ===== */
  const INV_SIZE = 20;
  const EQ_SLOTS = [
    { key: 'arma', label: 'Arma', icon: 'sword' }, { key: 'colar', label: 'Colar', icon: 'necklace' },
    { key: 'anel', label: 'Anel', icon: 'ring' }, { key: 'capacete', label: 'Capacete', icon: 'helmet' },
    { key: 'peitoral', label: 'Peitoral', icon: 'chest' }, { key: 'bota', label: 'Bota', icon: 'boots' },
  ];

  // Para criar um item novo: mk(id, nome, tipo, ícone, slotCompatível, {bônus})
  // Nomes de bônus válidos: qualquer chave de BASE_STATS, ou 'Vida' (vida máxima).
  const mk = (id, name, type, icon, equipSlot, bonus) => ({ id, name, type, icon, equipSlot, bonus });
  const ITEMS = [
    mk('anel-vida-1',        'Anel de Vida',        'acessorio', 'ring',     'anel',     { 'Vida': 10 }),
    mk('espada-ferro-1',     'Espada de Ferro',     'arma',      'sword',    'arma',     { 'Dano Físico': 8, 'Chance Crítica': 2.5 }),
    mk('colar-vitalidade-1', 'Colar de Vitalidade', 'acessorio', 'necklace', 'colar',    { 'Vida': 20 }),
    mk('capacete-ferro-1',   'Capacete de Ferro',   'armadura',  'helmet',   'capacete', { 'Defesa Física': 3, 'Defesa Mágica': 1 }),
    mk('peitoral-ferro-1',   'Peitoral de Ferro',   'armadura',  'chest',    'peitoral', { 'Defesa Física': 6, 'Defesa Mágica': 2 }),
    mk('botas-ferro-1',      'Botas de Ferro',      'armadura',  'boots',    'bota',     { 'Defesa Física': 2, 'Agilidade': 1 }),
  ];

  const BASE_STATS = {
    'Nível': 1, 'Dano Físico': 12, 'Dano Mágico': 8, 'Defesa Física': 5, 'Defesa Mágica': 4,
    'Agilidade': 10, 'Chance Crítica': 5, 'Dano Crítico': 150,
  };
  const UNIT = { 'Chance Crítica': '%', 'Dano Crítico': '%' };
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
    const { pal, rows } = ART[name];
    let r = '';
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (pal[ch]) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[ch]}"/>`;
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
  function selectItem(l) { state.selected = l; render(); }
  const clearSelection = () => { state.selected = null; render(); };

  /* ===== Renderização ===== */
  const $ = id => document.getElementById(id);
  const overlay = $('inv-overlay');

  function tooltipText(it) {
    const lines = Object.entries(it.bonus).map(([k, v]) => `+${fmt(v)}${UNIT[k] || ''} ${k === 'Vida' ? 'Vida máxima' : k}`);
    return [it.name, ...lines].join('\n');
  }
  function slotHTML(l) {
    const it = getItem(l);
    const sel = sameLoc(state.selected, l);
    const selItem = state.selected && getItem(state.selected);
    const can = l.kind === 'eq' && selItem && selItem.equipSlot === l.key && !sel;
    const cls = ['slot', it ? '' : 'empty', sel ? 'selected' : '', can ? 'can-equip' : '', it && l.kind === 'eq' ? 'equipped' : ''].join(' ');
    let inner = '';
    if (it) inner = `<div class="item" draggable="true" data-name="${tooltipText(it)}">${pixelSVG(it.icon)}</div>`;
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
      const u = UNIT[k] || '', bn = b[k] || 0;
      return `<div><dt>${k}</dt><dd><span>${fmt(base + bn)}${u}</span>${bn ? `<span class="bonus">+${fmt(bn)}${u}</span>` : ''}</dd></div>`;
    }).join('');
    $('inv-portrait').innerHTML = pixelSVG('hero');
    for (const k of Object.keys(vitals)) {
      const bn = k === 'life' ? (b['Vida'] || 0) : 0;
      const cur = vitals[k][0] + bn, max = vitals[k][1] + bn;
      $('inv-' + k + '-fill').style.setProperty('--pct', (cur / max * 100) + '%');
      $('inv-' + k + '-label').innerHTML = `${BAR_NAMES[k]} ${cur}/${max}` + (bn ? ` <span class="bonus">+${bn}</span>` : '');
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
})();