//Funções de navegação

const inimigosNecessariosPorCamada = 20;

const progressoFloresta = {
    camadaAtual: 1,
    maiorCamadaDesbloqueada: 1,

    derrotasPorCamada: {
        1: 0
    }
};

function obterDadosFlorestaSave() {
    return {
        camadaAtual: progressoFloresta.camadaAtual,
        maiorCamadaDesbloqueada: progressoFloresta.maiorCamadaDesbloqueada,
        derrotasPorCamada: { ...progressoFloresta.derrotasPorCamada }
    };
}

function carregarDadosFlorestaSave(dados) {
    if (
        !dados ||
        typeof dados.camadaAtual !== "number" ||
        typeof dados.maiorCamadaDesbloqueada !== "number" ||
        !dados.derrotasPorCamada
    ) {
        return false;
    }

    progressoFloresta.camadaAtual = dados.camadaAtual;
    progressoFloresta.maiorCamadaDesbloqueada = dados.maiorCamadaDesbloqueada;

    progressoFloresta.derrotasPorCamada = {
        ...dados.derrotasPorCamada
    };

    atualizarProgressoFloresta();
    atualizarSelecaoCamadas();

    const aviso = document.querySelector("#aviso-proxima-camada");

    if (
        progressoFloresta.derrotasPorCamada[progressoFloresta.camadaAtual] >= inimigosNecessariosPorCamada &&
        progressoFloresta.camadaAtual < 5
    ) {
        aviso.style.display = "block";
    } else {
        aviso.style.display = "none";
    }

    return true;
}

function registrarDerrotaInimigo() {
    const camada = progressoFloresta.camadaAtual;
    const derrotas = progressoFloresta.derrotasPorCamada[camada];

    if (derrotas >= inimigosNecessariosPorCamada) {
        return;
    }

    progressoFloresta.derrotasPorCamada[camada]++;

    if (progressoFloresta.derrotasPorCamada[camada] === inimigosNecessariosPorCamada && camada < 5) {
        const aviso = document.querySelector("#aviso-proxima-camada");
        aviso.style.display = "block";
    }

    atualizarProgressoFloresta();
    window.salvarProgresso();

    console.log(
        `Camada ${camada}: ${progressoFloresta.derrotasPorCamada[camada]}/${inimigosNecessariosPorCamada} inimigos derrotados`
    );
}

function atualizarProgressoFloresta() {
    const camada = progressoFloresta.camadaAtual;
    const derrotas = progressoFloresta.derrotasPorCamada[camada];

    document.querySelector("#progresso-camada").textContent =
        `Camada ${camada} — Inimigos derrotados: ${derrotas}/${inimigosNecessariosPorCamada}`;
}

function atualizarSelecaoCamadas() {
    const lista = document.querySelector("#lista-camadas");

    lista.innerHTML = "";

    for (let camada = 1; camada <= progressoFloresta.maiorCamadaDesbloqueada; camada++) {
        const botao = document.createElement("button");

        botao.textContent = `Camada ${camada}`;

        botao.addEventListener("click", function() {
            progressoFloresta.camadaAtual = camada;

            atualizarProgressoFloresta();
            atualizarSelecaoCamadas();
            window.salvarProgresso();
        });

        if (camada === progressoFloresta.camadaAtual) {
            botao.disabled = true;
        }

        lista.appendChild(botao);
    }
}

function avancarCamada() {
    const camadaAtual = progressoFloresta.camadaAtual;

    if (camadaAtual >= 5) {
        return;
    }

    const derrotas = progressoFloresta.derrotasPorCamada[camadaAtual];

    if (derrotas < inimigosNecessariosPorCamada) {
        return;
    }

    const proximaCamada = camadaAtual + 1;

    progressoFloresta.camadaAtual = proximaCamada;

    if (proximaCamada > progressoFloresta.maiorCamadaDesbloqueada) {
        progressoFloresta.maiorCamadaDesbloqueada = proximaCamada;
    }

    if (!progressoFloresta.derrotasPorCamada[proximaCamada]) {
        progressoFloresta.derrotasPorCamada[proximaCamada] = 0;
    }

    atualizarProgressoFloresta();

    atualizarSelecaoCamadas();

    window.salvarProgresso();

    console.log(`Você avançou para a camada ${proximaCamada}!`);
}

function iniciarJogo() {
    document.querySelector("#menu-principal").style.display = "none";
    document.querySelector("#tela-jogo").style.display = "flex";
}

function abrirBifurcacao() {
    document.querySelector("#tela-jogo").style.display = "none";
    document.querySelector("#tela-bifurcacao").style.display = "flex";
}

function voltarAcampamento() {
    document.querySelector("#tela-bifurcacao").style.display = "none";
    document.querySelector("#tela-jogo").style.display = "flex";
}

function respawnAcampamento() {
    document.querySelector("#tela-combate").style.display = "none";
    document.querySelector("#tela-florestal").style.display = "none";
    document.querySelector("#tela-bifurcacao").style.display = "none";
    document.querySelector("#tela-cidade").style.display = "none";
    document.querySelector("#tela-mercador").style.display = "none";
    document.querySelector("#tela-cacador").style.display = "none";

    document.querySelector("#tela-jogo").style.display = "flex";
}

function abrirCidade() {
    document.querySelector("#tela-bifurcacao").style.display = "none";
    document.querySelector("#tela-cidade").style.display = "flex";
}

function voltarBifurcacao() {
    document.querySelector("#tela-cidade").style.display = "none";
    document.querySelector("#tela-bifurcacao").style.display = "flex";
}

function abrirMercador() {
    document.querySelector("#tela-cidade").style.display = "none";
    document.querySelector("#tela-mercador").style.display = "flex";
}

function abrirCacador() {
    document.querySelector("#tela-cidade").style.display = "none";
    document.querySelector("#tela-cacador").style.display = "flex";
}

function voltarDoMercador() {
    document.querySelector("#tela-mercador").style.display = "none";
    document.querySelector("#tela-cidade").style.display = "flex";
}

function voltarDoCacador() {
    document.querySelector("#tela-cacador").style.display = "none";
    document.querySelector("#tela-cidade").style.display = "flex";
}

function abrirAreaFlorestal() {
    document.querySelector("#tela-bifurcacao").style.display = "none";
    document.querySelector("#tela-florestal").style.display = "flex";

    atualizarProgressoFloresta();
    atualizarSelecaoCamadas();
}

function voltarBifurcacaoFlorestal() {
    document.querySelector("#tela-florestal").style.display = "none";
    document.querySelector("#tela-bifurcacao").style.display = "flex";
}

function voltarParaFloresta() {
    document.querySelector("#tela-combate").style.display = "none";
    document.querySelector("#tela-florestal").style.display = "flex";
}

function voltarParaFloresta() {
    if (!podeSairDoCombate()) {
        return;
    }

    document.querySelector("#tela-combate").style.display = "none";
    document.querySelector("#tela-florestal").style.display = "flex";
}


//Eventos de transição

document.querySelector("#menu-principal button")
    .addEventListener("click", iniciarJogo);

document.querySelector("#botao-explorar")
    .addEventListener("click", abrirBifurcacao);

document.querySelector("#botao-voltar-acampamento")
    .addEventListener("click", voltarAcampamento);

document.querySelector("#botao-cidade")
    .addEventListener("click", abrirCidade);

document.querySelector("#botao-voltar-bifurcacao")
    .addEventListener("click", voltarBifurcacao);

document.querySelector("#botao-mercador")
    .addEventListener("click", abrirMercador);

document.querySelector("#botao-cacador")
    .addEventListener("click", abrirCacador);

document.querySelector("#botao-voltar-mercador")
    .addEventListener("click", voltarDoMercador);

document.querySelector("#botao-voltar-cacador")
    .addEventListener("click", voltarDoCacador);

document.querySelector("#botao-florestal")
    .addEventListener("click", abrirAreaFlorestal);

document.querySelector("#botao-voltar-bifurcacao-floresta")
    .addEventListener("click", voltarBifurcacaoFlorestal);

document.querySelector("#botao-explorar-floresta")
    .addEventListener("click", explorarFloresta);

document.querySelector("#botao-avancar-camada").addEventListener("click", function() {
    avancarCamada();

    document.querySelector("#aviso-proxima-camada").style.display = "none";

    document.querySelector("#tela-combate").style.display = "none";
    document.querySelector("#tela-florestal").style.display = "flex";
});

document.querySelector("#botao-voltar-floresta")
    .addEventListener("click", voltarParaFloresta);


    //Sistema de moedas do jogador

let moedasJogador = 0;

window.moedas = {
    obter: function() {
        return moedasJogador;
    },

    definir: function(valor) {
        if (!Number.isFinite(valor) || valor < 0) {
            return false;
        }

        moedasJogador = Math.floor(valor);
        atualizarMoedas();

        return true;
    }
};

function atualizarMoedas() {
    document.querySelector("#moedas-mercador").textContent =
        moedasJogador + " moedas";

    document.querySelector("#moedas-cacador").textContent =
        moedasJogador + " moedas";
}

function aplicarPenalidadeMoedas() {
    moedasJogador = Math.floor(moedasJogador * 0.5);

    atualizarMoedas();
}


//Criação de item

function criarItem({
    id,
    nome,
    precoCompra = 0,
    precoVenda = 0
}) {
    return {
        idItem: id,
        nome: nome,
        preco: precoCompra,
        precoVenda: precoVenda
    };
}


//Sistema loja do mercador

const produtosMercador = {
    pocoes: [
        criarItem({
            id: "pocao-vida-basica-1",
            nome: "Poção de Vida Básica",
            precoCompra: 15,
            precoVenda: 5
        }),
        criarItem({
            id: "pocao-mana-basica-1",
            nome: "Poção de Mana Básica",
            precoCompra: 15,
            precoVenda: 5
        }),
        criarItem({
            id: "pocao-vida-intermediaria-1",
            nome: "Poção de Vida Intermediária",
            precoCompra: 30,
            precoVenda: 10
        }),
        criarItem({
            id: "pocao-mana-intermediaria-1",
            nome: "Poção de Mana Intermediária",
            precoCompra: 30,
            precoVenda: 10
        }),
        criarItem({
            id: "pocao-vida-avancada-1",
            nome: "Poção de Vida Avançada",
            precoCompra: 70,
            precoVenda: 30
        }),
        criarItem({
            id: "pocao-mana-avancada-1",
            nome: "Poção de Mana Avançada",
            precoCompra: 70,
            precoVenda: 30
        })
    ],


    alimentos: [
        criarItem({
            id: "maca",
            nome: "Maçã",
            precoCompra: 10,
            precoVenda: 3
        }),
        criarItem({
            id: "banana",
            nome: "Banana",
            precoCompra: 10,
            precoVenda: 3
        })
    ],

    materiais: [
        criarItem({
            id: "pedra",
            nome: "Pedra",
            precoCompra: 5,
            precoVenda: 1
        }),
        criarItem({
            id: "madeira",
            nome: "Madeira",
            precoCompra: 5,
            precoVenda: 1
        })
    ]
};

function mostrarProdutosMercador(categoria) {
    const areaItens = document.querySelector("#itens-mercador");

    areaItens.innerHTML = "";

    const produtos = produtosMercador[categoria];

    produtos.forEach(function(produto) {
        const item = document.createElement("div");
        item.classList.add("item-mercador");

        const nome = document.createElement("span");
        nome.textContent = produto.nome;

        const preco = document.createElement("span");
        preco.textContent = produto.preco + " moedas";

        item.appendChild(nome);
        item.appendChild(preco);

        const botaoComprar = document.createElement("button");
        botaoComprar.textContent = "Comprar";

    botaoComprar.addEventListener("click", function() {
        comprarProduto(produto);
    });

    item.appendChild(botaoComprar);
        areaItens.appendChild(item);
    });
}

document.querySelectorAll(".categoria-mercador")
    .forEach(function(botao) {
        botao.addEventListener("click", function() {
            const categoria = botao.dataset.categoria;
            mostrarProdutosMercador(categoria);
        });
    });

mostrarProdutosMercador("pocoes");


//Sistema loja do caçador

const produtosCacador = {
    armas: [
        criarItem({
            id: "espada-media-1",
            nome: "Espada Média",
            precoCompra: 100,
            precoVenda: 40
        }),
        criarItem({
            id: "espada-longa-1",
            nome: "Espada Longa",
            precoCompra: 150,
            precoVenda: 55
        }),
        criarItem({
            id: "cajado-basico-1",
            nome: "Cajado Básico",
            precoCompra: 100,
            precoVenda: 40
        }),
        criarItem({
            id: "cajado-magico-1",
            nome: "Cajado Mágico",
            precoCompra: 150,
            precoVenda: 55
        })
    ],

    drops: []
};

const precosDrops = {
    "gosma": 5,
    "pedra": 3,
    "madeira": 3,
    "presa-serpente": 10,
    "escama-serpente": 12,
    "couro-javali": 8,
    "esfera-magica": 15,
    "madeira-viva": 12,
    "folha-viva": 8,
    "gema-jardim": 20,
    "lasca-fundador": 25,
    "elemento-grama": 15,
    "presa-lobo": 12,
    "couro-lobo": 10,
    "cabo-foice-congelada": 20,
    "pedaco-gelo-eterno": 25,
    "presas-nevasca": 20,
    "pele-congelada": 15,
    "neve-magica": 10,
    "fragmento-gelo-compactado": 30,
    "elemento-gelo": 20
};

function venderDrop(produto, quantidade) {
    const inventario = window.inventario;

    if (!inventario) {
        alert("Inventário indisponível!");
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Informe uma quantidade válida!");
        return;
    }

    const removido = inventario.removerItem(
        produto.idItem,
        quantidade
    );

    if (!removido) {
        alert("Você não possui essa quantidade do item!");
        return;
    }

    const valorVenda = produto.precoVenda * quantidade;
    moedasJogador += valorVenda;

    atualizarMoedas();
    window.salvarProgresso();

    alert(
        `Você vendeu ${quantidade}x ${produto.nome} por ${valorVenda} moedas!`
    );
}

function mostrarProdutosCacador(categoria) {
    const areaItens = document.querySelector("#itens-cacador");

    areaItens.innerHTML = "";

    const produtos = produtosCacador[categoria];

    if (categoria === "drops") {
    const itensInventario = window.inventario.obterItens();

    const produtos = itensInventario
        .filter(function(item) {
            return item &&
                (item.type === "material" || item.type === "drop") &&
                item.quantity > 0 &&
                precosDrops[item.id] !== undefined;
        })
        .map(function(item) {
            return {
                idItem: item.id,
                nome: item.name,
                precoVenda: precosDrops[item.id]
            };
        });

    if (produtos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent =
            "Você não possui materiais ou drops para vender.";
        areaItens.appendChild(mensagem);
        return;
    }

    produtos.forEach(function(produto) {
        const itemInventario = itensInventario.find(function(item) {
            return item && item.id === produto.idItem;
        });

        const item = document.createElement("div");
        item.classList.add("item-cacador");

        const nome = document.createElement("span");
        nome.textContent = produto.nome;

        const preco = document.createElement("span");
        preco.textContent = produto.precoVenda + " moedas por unidade";

        const quantidade = document.createElement("input");
        quantidade.type = "number";
        quantidade.min = "1";
        quantidade.max = itemInventario.quantity;
        quantidade.step = "1";
        quantidade.value = "1";
        quantidade.setAttribute("aria-label", "Quantidade para vender");

        const botaoVender = document.createElement("button");
        botaoVender.textContent = "Vender quantidade";

        botaoVender.addEventListener("click", function() {
            venderDrop(produto, Number(quantidade.value));
            mostrarProdutosCacador("drops");
        });

        const botaoVenderTudo = document.createElement("button");
        botaoVenderTudo.textContent = "Vender tudo";

        botaoVenderTudo.addEventListener("click", function() {
            venderDrop(produto, itemInventario.quantity);
            mostrarProdutosCacador("drops");
        });

        item.appendChild(nome);
        item.appendChild(preco);
        item.appendChild(quantidade);
        item.appendChild(botaoVender);
        item.appendChild(botaoVenderTudo);

        areaItens.appendChild(item);
    });

    return;
}
    
    produtos.forEach(function(produto) {
        const item = document.createElement("div");
        item.classList.add("item-cacador");

        const nome = document.createElement("span");
        nome.textContent = produto.nome;

        const preco = document.createElement("span");
        preco.textContent = produto.preco + " moedas";

        const botaoComprar = document.createElement("button");
        botaoComprar.textContent = "Comprar";

        botaoComprar.addEventListener("click", function() {
            comprarProduto(produto);
        });

        item.appendChild(nome);
        item.appendChild(preco);
        item.appendChild(botaoComprar);

        areaItens.appendChild(item);
    });
}

document.querySelectorAll(".categoria-cacador")
    .forEach(function(botao) {
        botao.addEventListener("click", function() {
            const categoria = botao.dataset.categoria;
            mostrarProdutosCacador(categoria);
        });
    });

mostrarProdutosCacador("armas");

atualizarMoedas();

function comprarProduto(produto) {
    if (moedasJogador < produto.preco) {
        alert("Você não tem moedas suficientes!");
        return;
    }

    if (!produto.idItem) {
        alert("Este item ainda não pode ser comprado.");
        return;
    }

    const itemAdicionado = window.inventario.adicionarItemPorId(
        produto.idItem
    );

    if (!itemAdicionado) {
        alert("Seu inventário está cheio!");
        return;
    }

    moedasJogador -= produto.preco;

    atualizarMoedas();
    window.salvarProgresso();

    alert("Você comprou: " + produto.nome);
}

function explorarFloresta() {
    const inimigo = selecionarInimigo();

    if (!inimigo) {
        return;
    }

    document.querySelector("#tela-florestal").style.display = "none";
    document.querySelector("#tela-combate").style.display = "flex";

    iniciarCombate(inimigo);
}

let ultimoDescanso = 0;
const TEMPO_ENTRE_DESCANSOS = 30 * 60 * 1000;

function descansar() {
    const agora = Date.now();
    const tempoPassado = agora - ultimoDescanso;

    if (tempoPassado < TEMPO_ENTRE_DESCANSOS) {
        const tempoRestante = TEMPO_ENTRE_DESCANSOS - tempoPassado;
        const minutos = Math.ceil(tempoRestante / 60000);

        alert(`Você precisa esperar mais ${minutos} minutos para descansar novamente.`);
        return;
    }

    const vida = window.inventario.obterVida();
    const mana = window.inventario.obterMana();

    const novaVida = Math.min(
        vida.atual + Math.floor(vida.maxima * 0.5),
        vida.maxima
    );

    const novaMana = Math.min(
        mana.atual + Math.floor(mana.maxima * 0.5),
        mana.maxima
    );

    window.inventario.atualizarVida(novaVida);
    window.inventario.atualizarMana(novaMana);

    ultimoDescanso = agora;

    window.salvarProgresso();

    alert("Você descansou e recuperou parte da sua vida e mana!");
}

document.getElementById("botao-descansar").addEventListener("click", function() {
    descansar();
});