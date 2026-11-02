//Funções de navegação

const inimigosNecessariosPorCamada = 20;

const progressoFloresta = {
    camadaAtual: 1,
    maiorCamadaDesbloqueada: 1,

    derrotasPorCamada: {
        1: 0
    }
};

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

let moedasJogador = 10000000;

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

    const produtos = produtosCacador.drops.filter(function(produto) {
        return itensInventario.some(function(itemInventario) {
            return itemInventario &&
                itemInventario.id === produto.idItem;
        });
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
            venderDrop(produto, itemInventario.quantity || 1);
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