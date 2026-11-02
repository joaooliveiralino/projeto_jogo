const jogador = {
    atributos: {},
    vidaAtual: 80,
    vidaMaxima: 80,
    manaAtual: 65,
    manaMaxima: 65,

    atualizarAtributos: function() {
        this.atributos = window.inventario.obterAtributos();

        const vida = window.inventario.obterVida();
        this.vidaAtual = vida.atual;
        this.vidaMaxima = vida.maxima;

        const mana = window.inventario.obterMana();
        this.manaAtual = mana.atual;
        this.manaMaxima = mana.maxima;
    },

    respawn: function() {
        window.inventario.definirAtributosRespawn();
        this.atualizarAtributos();
    }
};



jogador.atualizarAtributos();

let inimigo;
let turnoAtual;
let combateFinalizado = false;
let usandoConsumivel = false;
let executandoAcao = false;

const habilidades = {
    bolaDeFogo: {
        nome: "Bola de Fogo",
        tipoDano: "magico",
        multiplicador: 1.5,
        custoMana: 20
    },
    cortePoderoso: {
        nome: "Corte Poderoso",
        tipoDano: "fisico",
        multiplicador: 1.8,
        custoMana: 15
    },
};

function atualizarMenuHabilidades() {
    const lista = document.querySelector("#lista-habilidades");

    lista.innerHTML = "";

    Object.entries(habilidades).forEach(([id, habilidade]) => {
        const botao = document.createElement("button");

        botao.textContent =
            `${habilidade.nome} — ${habilidade.custoMana} Mana`;

        botao.dataset.habilidade = id;

        lista.appendChild(botao);

        botao.addEventListener("click", function() {
            const idHabilidade = botao.dataset.habilidade;

            usarHabilidade(idHabilidade);
        });
    });
}

atualizarMenuHabilidades();

function atualizarMenuItens() {
    const lista = document.querySelector("#lista-itens-combate");

    lista.innerHTML = "";

    const itens = window.inventario.obterItens();

    const consumiveis = itens.filter(function(item) {
        return item && (
            item.type === "pocao" ||
            item.type === "comida"
        );
    });

    consumiveis.forEach(function(item) {
        const botao = document.createElement("button");

        botao.textContent = `${item.name} x${item.quantity || 1}`;

        botao.dataset.item = item.id;

        lista.appendChild(botao);

        botao.addEventListener("click", async function() {
        
        if (usandoConsumivel || (!combateFinalizado && turnoAtual !== "jogador")) {
            return;
        }

    usandoConsumivel = true;

    bloquearAcoesCombate();
    botao.disabled = true;

    const idItem = botao.dataset.item;

    const itemSelecionado = window.inventario.obterItens().find(function(item) {
        return item && item.id === idItem;
    });

    if (!itemSelecionado) {
        return;
    }

    const efeitos = itemSelecionado.efeitos || {};

    const vida = window.inventario.obterVida();
    const mana = window.inventario.obterMana();

    let vidaRecuperada = 0;
    let manaRecuperada = 0;

    if (efeitos.curaVida > 0) {
        const novaVida = Math.min(
            vida.atual + efeitos.curaVida,
            vida.maxima
        );

        vidaRecuperada = novaVida - vida.atual;
    }

    if (efeitos.curaMana > 0) {
        const novaMana = Math.min(
            mana.atual + efeitos.curaMana,
            mana.maxima
        );

        manaRecuperada = novaMana - mana.atual;
    }

    if (vidaRecuperada === 0 && manaRecuperada === 0) {
    adicionarMensagem("Você não precisa recuperar vida ou mana!");

    usandoConsumivel = false;

    botoesCombate.forEach(botao => {
        botao.disabled = false;
    });

    atualizarMenuItens();

    return;
}

    if (vidaRecuperada > 0) {
        window.inventario.atualizarVida(vida.atual + vidaRecuperada);
    }

    if (manaRecuperada > 0) {
        window.inventario.atualizarMana(mana.atual + manaRecuperada);
    }

    window.inventario.removerItem(idItem);

    atualizarMenuItens();

    jogador.atualizarAtributos();

    atualizarInterfaceCombate();

    if (vidaRecuperada > 0 && manaRecuperada > 0) {
        adicionarMensagem(
            `Você utilizou ${itemSelecionado.name} e recuperou ${vidaRecuperada} de vida e ${manaRecuperada} de mana!`
        );
    } else if (vidaRecuperada > 0) {
        adicionarMensagem(
            `Você utilizou ${itemSelecionado.name} e recuperou ${vidaRecuperada} pontos de vida!`
        );
    } else {
        adicionarMensagem(
            `Você utilizou ${itemSelecionado.name} e recuperou ${manaRecuperada} pontos de mana!`
        );
    }

    await esperar(1000);

    if (!combateFinalizado) {
        alternarTurno();
        await executarTurnoInimigo();
    } else {
        usandoConsumivel = false;
        executandoAcao = false;
        atualizarMenuItens();
}

    });
    });
}

const botaoAtacar = document.querySelector("#botao-atacar");

const botoesCombate = [
    document.querySelector("#botao-atacar"),
    document.querySelector("#botao-habilidade"),
    document.querySelector("#botao-itens-combate")
];

function bloquearAcoesCombate() {
    botoesCombate.forEach(botao => {
        botao.disabled = true;
    });

    if (combateFinalizado) {
        document.querySelector("#botao-itens-combate").disabled = false;
    }
}

function criarInimigo(nome, vida, tipoAtaque, atributos, imagem, chance, experiencia = 0) {
    return {
        nome: nome,
        imagem: imagem,
        tipoAtaque: tipoAtaque,
        chance: chance,
        experiencia: experiencia,

        vidaAtual: vida,
        vidaMaxima: vida,

        atributos: {
            AT: atributos.AT,
            AP: atributos.AP,
            FD: atributos.FD,
            MD: atributos.MD,
            AG: atributos.AG,
            CC: atributos.CC,
            CA: atributos.CA
        }
    };
}

const inimigosPorCamada = {
        1: [
            criarInimigo("Slime", 40, "fisico", {
                AT: 9,
                AP: 0,
                FD: 6,
                MD: 2,
                AG: 5,
                CC: 3,
                CA: 150
            }, "imagens/area-florestal/Slime/slimeL.png", 49, 10),

            criarInimigo("Grass Element", 30, "magico", {
                AT: 0,
                AP: 12,
                FD: 2,
                MD: 8,
                AG: 4,
                CC: 8,
                CA: 150
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 49, 15),

            criarInimigo("Grass Fragment", 2, "magico", {
                AT: 0,
                AP: 0,
                FD: 0,
                MD: 0,
                AG: 0,
                CC: 0,
                CA: 100
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 2, 2)
        ],

        2: [
            criarInimigo("Javali", 50, "fisico", {
                AT: 20,
                AP: 0,
                FD: 12,
                MD: 2,
                AG: 2,
                CC: 3,
                CA: 150
            }, "imagens/area-florestal/Javali/javali_L.png", 29, 25),

            criarInimigo("Serpente", 30, "fisico", {
                AT: 16,
                AP: 0,
                FD: 8,
                MD: 5,
                AG: 40,
                CC: 5,
                CA: 150
            }, "imagens/area-florestal/Serpente/Serpente_L.png", 69, 20),

            criarInimigo("Grass Fragment", 2, "magico", {
                AT: 0,
                AP: 0,
                FD: 0,
                MD: 0,
                AG: 0,
                CC: 0,
                CA: 100
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 2, 2)
        ],

        3:[
            criarInimigo("Dríade", 38, "magico", {
                AT: 0,
                AP: 23,
                FD: 7,
                MD: 14,
                AG: 8,
                CC: 8,
                CA: 150
            }, "imagens/area-florestal/druida/Druida_L.png", 49, 35),

            criarInimigo("Javali", 60, "fisico", {
                AT: 20,
                AP: 0,
                FD: 15,
                MD: 2,
                AG: 4,
                CC: 6,
                CA: 150
            }, "imagens/area-florestal/Javali/javali_L.png", 49, 40),

            criarInimigo("Grass Fragment", 2, "magico", {
                AT: 0,
                AP: 0,
                FD: 0,
                MD: 0,
                AG: 0,
                CC: 0,
                CA: 100
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 2, 2)
        ],

        4:[
            criarInimigo("Dríade", 50, "magico", {
                AT: 0,
                AP: 30,
                FD: 9,
                MD: 19,
                AG: 10,
                CC: 8,
                CA: 150
            }, "imagens/area-florestal/druida/Druida_L.png", 34, 45),

            criarInimigo("Vanfer", 65, "magico", {
                AT: 0,
                AP: 35,
                FD: 12,
                MD: 19,
                AG: 10,
                CC: 15,
                CA: 150
            }, "imagens/area-florestal/Vanfer/Vanfer_L.png", 64, 50),

            criarInimigo("Grass Fragment", 2, "magico", {
                AT: 0,
                AP: 0,
                FD: 0,
                MD: 0,
                AG: 0,
                CC: 0,
                CA: 100
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 2, 2)
        ],

        5:[
            criarInimigo("Dríade", 65, "magico", {
                AT: 0,
                AP: 38,
                FD: 12,
                MD: 24,
                AG: 13,
                CC: 10,
                CA: 150
            }, "imagens/area-florestal/druida/Druida_L.png", 29, 55),

            criarInimigo("Vanfer", 80, "magico", {
                AT: 0,
                AP: 44,
                FD: 17,
                MD: 27,
                AG: 16,
                CC: 15,
                CA: 150
            }, "imagens/area-florestal/Vanfer/Vanfer_L.png", 59, 70),

            criarInimigo("Grass Fragment", 2, "magico", {
                AT: 0,
                AP: 0,
                FD: 0,
                MD: 0,
                AG: 0,
                CC: 0,
                CA: 100
            }, "imagens/area-florestal/espirito-grama/Es_Grama_L.png", 2, 2),

            criarInimigo("OakGarden, The Nature Founder", 125, "magico", {
                AT: 0,
                AP: 60,
                FD: 25,
                MD: 35,
                AG: 20,
                CC: 20,
                CA: 200
            }, "imagens/area-florestal/Boss_Florestal/OakGarden_L.png", 10, 150),
        ]
};

const dropsInimigos = {
    "Slime": [
        { id: "gosma", chance: 80 },
        { id: "espada-quebrada-1", chance: 10 }
    ],

    "Grass Element": [
        { id: "esfera-magica", chance: 25 }
    ],

    "Grass Fragment": [
        { id: "elemento-grama", chance: 25 }
    ],

    "Javali": [
        { id: "couro-javali", chance: 60 },
        { id: "carne", chance: 60 }
    ],

    "Serpente": [
        { id: "presa-serpente", chance: 45 },
        { id: "escama-serpente", chance: 65 }
    ],

    "Dríade": [
        { id: "madeira-viva", chance: 65 },
        { id: "folha-viva", chance: 65 }
    ],

    "Vanfer": [
        { id: "cajado-quebrado-1", chance: 10 },
        { id: "esfera-magica", chance: 75 }
    ],

    "OakGarden, The Nature Founder": [
        { id: "gema-jardim", chance: 100 },
        { id: "lasca-fundador", chance: 100 }
    ]
};

function validarChancesInimigos() {
    for (const camada in inimigosPorCamada) {
        const inimigos = inimigosPorCamada[camada];

        const total = inimigos.reduce(function(soma, inimigo) {
            return soma + inimigo.chance;
        }, 0);

        if (total !== 100) {
            console.error(
                `Erro na camada ${camada}: a soma das chances é ${total}%, mas deveria ser 100%.`
            );

            return false;
        }
    }

    console.log("Todas as camadas possuem chances totalizando 100%.");
    return true;
}

validarChancesInimigos();

function selecionarInimigo() {
    const camada = progressoFloresta.camadaAtual;

    const inimigosDisponiveis = inimigosPorCamada[camada];

    if (!inimigosDisponiveis || inimigosDisponiveis.length === 0) {
        console.error(`Não existem inimigos cadastrados na camada ${camada}.`);
        return null;
    }

    const sorteio = Math.random() * 100;

    let acumulado = 0;

    for (const modelo of inimigosDisponiveis) {
        acumulado += modelo.chance;

        if (sorteio < acumulado) {
            return criarInimigo(
                modelo.nome,
                modelo.vidaMaxima,
                modelo.tipoAtaque,
                modelo.atributos,
                modelo.imagem,
                modelo.chance,
                modelo.experiencia
            );
        }
    }

    return null;
}

function definirPrimeiroTurno() {
    if (jogador.atributos.AG > inimigo.atributos.AG) {
        turnoAtual = "jogador";
    } else {
        turnoAtual = "inimigo";
    }

    console.log("Primeiro turno:", turnoAtual);
}

function recompensarExperiencia() {
    const quantidade = inimigo.experiencia;

    if (quantidade <= 0) {
        return;
    }

    const niveisGanhos = window.inventario.adicionarExperiencia(quantidade);

    jogador.atualizarAtributos();

    atualizarInterfaceCombate();

    adicionarMensagem(`Você recebeu ${quantidade} EXP!`);

    if (niveisGanhos > 0) {
        adicionarMensagem(
            niveisGanhos === 1
                ? `Você subiu para o nível ${jogador.atributos["Nível"]}!`
                : `Você subiu ${niveisGanhos} níveis! Agora está no nível ${jogador.atributos["Nível"]}!`
        );
    }
}

function recompensarDrops() {
    const drops = dropsInimigos[inimigo.nome] || [];

    for (const drop of drops) {
        const sorteio = Math.random() * 100;

        if (sorteio < drop.chance) {
            const sucesso = window.inventario.adicionarItemPorId(drop.id);

            if (sucesso) {
                console.log(`Item recebido: ${drop.id}`);
            } else {
                console.log(`Não foi possível receber ${drop.id}: inventário cheio.`);
            }
        }
    }
}

function iniciarCombate(novoInimigo) {
    usandoConsumivel = false;
    executandoAcao = false;

    inimigo = novoInimigo;

    console.log(inimigo);

    jogador.atualizarAtributos();

    combateFinalizado = false;

    limparLog();

    definirPrimeiroTurno();

    atualizarInterfaceCombate();

    adicionarMensagem("Um novo combate começou!");

    botoesCombate.forEach(botao => {
        botao.disabled = turnoAtual !== "jogador";
    });

    if (turnoAtual === "inimigo") {
        executarTurnoInimigo();
    }
}

async function executarTurnoInimigo() {
    atacar(inimigo, jogador);

    atualizarInterfaceCombate();

    await esperar(1000);

    if (jogador.vidaAtual <= 0) {
        combateFinalizado = true;
        bloquearAcoesCombate();
        botaoAtacar.disabled = true;

        window.inventario.aplicarPenalidadeMorte();
        aplicarPenalidadeMoedas();
        jogador.respawn();
        respawnAcampamento();

        adicionarMensagem("Você foi derrotado!");
        return;
    }

    alternarTurno();

if (turnoAtual === "jogador" && !combateFinalizado) {
    usandoConsumivel = false;
    executandoAcao = false;

    botoesCombate.forEach(botao => {
        botao.disabled = false;
    });
}
}

function alternarTurno() {
    if (turnoAtual === "jogador") {
        turnoAtual = "inimigo";
    } else {
        turnoAtual = "jogador";
    }

    console.log("Turno atual:", turnoAtual);
}

function calcularDano(atacante, defensor) {
    let danoBase;

    let tipoAtaque;

    if (atacante === jogador) {
        tipoAtaque = window.inventario.obterTipoAtaque();
    } else {
        tipoAtaque = atacante.tipoAtaque;
    }

    if (tipoAtaque === "magico") {
        danoBase = atacante.atributos.AP - defensor.atributos.MD;
    } else {
        danoBase = atacante.atributos.AT - defensor.atributos.FD;
    }

    const variacao = Math.random() * 0.2 + 0.9;

    const danoFinal = Math.floor(danoBase * variacao);

    return Math.max(1, danoFinal);
}

function verificarCritico(atacante, dano) {
    const chanceCritica = atacante.atributos.CC;
    const danoCritico = atacante.atributos.CA;

    const sorteio = Math.random() * 100;

    if (sorteio < chanceCritica) {
        const danoFinal = Math.floor(dano * (danoCritico / 100));

        return {
            dano: danoFinal,
            critico: true
        };
    }

    return {
        dano: dano,
        critico: false
    };
}

function verificarEsquiva(atacante, defensor) {
    const agilidadeAtacante = atacante.atributos.AG;
    const agilidadeDefensor = defensor.atributos.AG;

    const chanceEsquiva = Math.max(0,5 + (agilidadeDefensor - agilidadeAtacante));

    const sorteio = Math.random() * 100;

    return sorteio < chanceEsquiva;
}

function calcularDanoMagico(atacante, defensor, multiplicador = 1) {
    const danoBase =
        (atacante.atributos.AP * multiplicador) - defensor.atributos.MD;

    const variacao = Math.random() * 0.2 + 0.9;

    const danoFinal = Math.floor(danoBase * variacao);

    return Math.max(1, danoFinal);
}

function calcularDanoHabilidade(atacante, defensor, habilidade) {
    if (habilidade.tipoDano === "magico") {
        return calcularDanoMagico(
            atacante,
            defensor,
            habilidade.multiplicador
        );
    }

    if (habilidade.tipoDano === "fisico") {
        const danoBase =
            (atacante.atributos.AT * habilidade.multiplicador) -
            defensor.atributos.FD;

        const variacao = Math.random() * 0.2 + 0.9;

        const danoFinal = Math.floor(danoBase * variacao);

        return Math.max(1, danoFinal);
    }

    return 1;
}

function aplicarDano(defensor, dano) {
    defensor.vidaAtual -= dano;

    if (defensor.vidaAtual < 0) {
        defensor.vidaAtual = 0;
    }

    // Se o defensor for o jogador, atualiza o inventário.
    if (defensor === jogador) {
        window.inventario.atualizarVida(defensor.vidaAtual);
    }

    const nome = defensor.nome || "Jogador";

    adicionarMensagem(`${nome} recebeu ${dano} de dano!`);

    console.log(
        `Vida restante: ${defensor.vidaAtual}/${defensor.vidaMaxima}`
    );
}

function consumirMana(jogador, quantidade) {
    jogador.manaAtual -= quantidade;

    if (jogador.manaAtual < 0) {
        jogador.manaAtual = 0;
    }

    window.inventario.atualizarMana(jogador.manaAtual);

    atualizarInterfaceCombate();
}

async function usarHabilidade(idHabilidade) {
    const habilidade = habilidades[idHabilidade];

    if (!habilidade) {
        return;
    }

    if (combateFinalizado || turnoAtual !== "jogador" || executandoAcao) {
        return;
    }

    executandoAcao = true;

    if (jogador.manaAtual < habilidade.custoMana) {
        adicionarMensagem("Mana insuficiente!");
        return;
    }

    bloquearAcoesCombate();

    consumirMana(jogador, habilidade.custoMana);

    adicionarMensagem(`Você usou ${habilidade.nome}!`);

    if (verificarEsquiva(jogador, inimigo)) {
        adicionarMensagem(`${inimigo.nome} esquivou da habilidade!`);
    } else {
        const dano = calcularDanoHabilidade(jogador, inimigo, habilidade);

        aplicarDano(inimigo, dano);
    }

    atualizarInterfaceCombate();

    await esperar(1000);

    if (inimigo.vidaAtual <= 0) {
        combateFinalizado = true;
        registrarDerrotaInimigo();
        recompensarExperiencia();
        recompensarDrops();
        bloquearAcoesCombate();

        adicionarMensagem("Você derrotou o inimigo!");
        return;
    }

    alternarTurno();

    await executarTurnoInimigo();
}

function atacar(atacante, defensor) {
    const nomeAtacante = atacante.nome || "Jogador";
    const nomeDefensor = defensor.nome || "Jogador";

    adicionarMensagem(`${nomeAtacante} atacou ${nomeDefensor}!`);

    if (verificarEsquiva(atacante, defensor)) {
        adicionarMensagem(`${nomeDefensor} esquivou do ataque!`);
        return;
    }

    const danoBase = calcularDano(atacante, defensor);

    const resultado = verificarCritico(atacante, danoBase);

    if (resultado.critico) {
        adicionarMensagem("GOLPE CRÍTICO!");
    }

    aplicarDano(defensor, resultado.dano);
}

async function atacarComJogador() {
    console.log("Turno no clique:", turnoAtual);
    if (combateFinalizado) {
        console.log("O combate já terminou!");
        return;
    }

    if (turnoAtual !== "jogador") {
        console.log("Não é seu turno!");
        return;
    }

    botaoAtacar.disabled = true;

    atacar(jogador, inimigo);

    atualizarInterfaceCombate();

    await esperar(1000);

    if (inimigo.vidaAtual <= 0) {
        combateFinalizado = true;
        registrarDerrotaInimigo();
        recompensarExperiencia();
        recompensarDrops();
        bloquearAcoesCombate();
        botaoAtacar.disabled = true;

        adicionarMensagem("Você derrotou o inimigo!");

        return;
    }

    alternarTurno();

    await executarTurnoInimigo();
}

function atualizarInterfaceCombate() {

    document.querySelector("#nome-inimigo").textContent = inimigo.nome;

    document.querySelector("#vida-jogador").textContent =
        `${jogador.vidaAtual}/${jogador.vidaMaxima}`;

    document.querySelector("#mana-jogador").textContent =
        `${jogador.manaAtual}/${jogador.manaMaxima}`;

    document.querySelector("#vida-inimigo").textContent =
        `${inimigo.vidaAtual}/${inimigo.vidaMaxima}`;

    const porcentagemVidaJogador =
        (jogador.vidaAtual / jogador.vidaMaxima) * 100;

    const porcentagemManaJogador =
        (jogador.manaAtual / jogador.manaMaxima) * 100;

    const porcentagemVidaInimigo =
        (inimigo.vidaAtual / inimigo.vidaMaxima) * 100;

    document.querySelector("#barra-vida-jogador").style.width =
        `${porcentagemVidaJogador}%`;

    document.querySelector("#barra-mana-jogador").style.width =
        `${porcentagemManaJogador}%`;

    document.querySelector("#barra-vida-inimigo").style.width =
        `${porcentagemVidaInimigo}%`;

    document.querySelector("#imagem-inimigo").src = inimigo.imagem;
}

function esperar(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo));
}

function adicionarMensagem(mensagem) {
    const log = document.querySelector("#log-combate");

    const paragrafo = document.createElement("p");

    paragrafo.textContent = mensagem;

    log.appendChild(paragrafo);

    log.scrollTop = log.scrollHeight;
}

function limparLog() {
    const log = document.querySelector("#log-combate");

    log.innerHTML = "";
}

function podeSairDoCombate() {
    return combateFinalizado;
}

const botaoNovoCombate = document.querySelector("#botao-novo-combate");

botaoNovoCombate.addEventListener("click", function() {
    const novoInimigo = selecionarInimigo();

    if (novoInimigo) {
        iniciarCombate(novoInimigo);
    }
});

document.querySelector("#botao-atacar").addEventListener("click", atacarComJogador);

const botaoHabilidades = document.querySelector("#botao-habilidade");
const menuHabilidades = document.querySelector("#menu-habilidades");
const botaoFecharHabilidades = document.querySelector("#botao-fechar-habilidades");

const botaoItens = document.querySelector("#botao-itens-combate");
const menuItens = document.querySelector("#menu-itens");
const botaoFecharItens = document.querySelector("#botao-fechar-itens");

botaoHabilidades.addEventListener("click", function() {
    if (turnoAtual !== "jogador" || combateFinalizado) {
        return;
    }

    botoesCombate.forEach(botao => {
        botao.style.display = "none";
    });

    document.querySelector("#botao-novo-combate").style.display = "none";

    menuHabilidades.style.display = "block";
});

botaoFecharHabilidades.addEventListener("click", function() {
    menuHabilidades.style.display = "none";

    botoesCombate.forEach(botao => {
        botao.style.display = "";
    });

    document.querySelector("#botao-novo-combate").style.display = "";
});

botaoItens.addEventListener("click", function() {
    if (!combateFinalizado && turnoAtual !== "jogador") {
        return;
    }

    botoesCombate.forEach(botao => {
        botao.style.display = "none";
    });

    document.querySelector("#botao-novo-combate").style.display = "none";

    atualizarMenuItens();

    menuItens.style.display = "block";
});

botaoFecharItens.addEventListener("click", function() {
    menuItens.style.display = "none";

    botoesCombate.forEach(botao => {
        botao.style.display = "";
    });

    document.querySelector("#botao-novo-combate").style.display = "";
});