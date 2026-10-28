//Funções de navegação

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

    //Sistema de moedas do jogador

let moedasJogador = 10000000;

function atualizarMoedas() {
    document.querySelector("#moedas-mercador").textContent =
        moedasJogador + " moedas";

    document.querySelector("#moedas-cacador").textContent =
        moedasJogador + " moedas";
}


//Criação de item

function criarItem({
    id,
    nome,
    tipo,
    icone = "hero",
    imagem = null,
    precoCompra = 0,
    precoVenda = 0,
    equipSlot = null,
    bonus = {}
}) {
    return {
        nome: nome,
        preco: precoCompra,
        precoVenda: precoVenda,

        itemInventario: {
            id: id,
            name: nome,
            type: tipo,
            icon: icone,
            imagem: imagem,
            equipSlot: equipSlot,
            bonus: bonus
        }
    };
}

const testePocao = criarItem({
    id: "pocao-vida-basica",
    nome: "Poção de Vida Básica",
    tipo: "pocao",
    precoCompra: 15,
    precoVenda: 5
});

console.log(testePocao);


//Sistema loja do mercador

const produtosMercador = {
    pocoes: [
            criarItem({
                id: "pocao-vida-basica",
                nome: "Poção de Vida Básica",
                tipo: "pocao",
                precoCompra: 15,
                precoVenda: 5
            }),
            criarItem({
                id: "pocao-mana-basica",
                nome: "Poção de Mana Básica",
                tipo: "pocao",
                precoCompra: 15,
                precoVenda: 5
            }),
            criarItem({
                id: "pocao-vida-intermediaria",
                nome: "Poção de Vida Intermediária",
                tipo: "pocao",
                precoCompra: 30,
                precoVenda: 10
            }),
            criarItem({
                id: "pocao-mana-intermediaria",
                nome: "Poção de Mana Intermediária",
                tipo: "pocao",
                precoCompra: 30,
                precoVenda: 10
            }),
            criarItem({
                id: "pocao-vida-avancada",
                nome: "Poção de Vida Avançada",
                tipo: "pocao",
                precoCompra: 70,
                precoVenda: 30
            }),
            criarItem({
                id: "pocao-mana-avancada",
                nome: "Poção de Mana Avançada",
                tipo: "pocao",
                precoCompra: 70,
                precoVenda: 30
            }),
    ],

    alimentos: [
            criarItem({
                id: "maca",
                nome: "Maçã",
                tipo: "comida",
                precoCompra: 10,
                precoVenda: 3
            }),
            criarItem({
                id: "banana",
                nome: "Banana",
                tipo: "comida",
                precoCompra: 10,
                precoVenda: 3
            }),
    ],

    materiais: [
            criarItem({
                id: "pedra",
                nome: "Pedra",
                tipo: "material",
                precoCompra: 5,
                precoVenda: 1
            }),
            criarItem({
                id: "madeira",
                nome: "Madeira",
                tipo: "material",
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
                tipo: "arma",
                icone: "sword",
                precoCompra: 100,
                precoVenda: 40,
                equipSlot: "arma",
                bonus: { "AT": 6 }
            }),
            criarItem({
                id: "espada-longa-1",
                nome: "Espada Longa",
                tipo: "arma",
                icone: "sword",
                precoCompra: 150,
                precoVenda: 55,
                equipSlot: "arma",
                bonus: { "AT": 10, "AG": -5, "CC": 4 }
            }),
            criarItem({
                id: "cajado-basico-1",
                nome: "Cajado Básico",
                tipo: "arma",
                icone: "sword", //Temporario
                precoCompra: 100,
                precoVenda: 40,
                equipSlot: "arma",
                bonus: { "AP": 7, "MD": 5 }
            }),
            criarItem({
                id: "cajado-magico-1",
                nome: "Cajado Mágico",
                tipo: "arma",
                icone: "sword", //Temporario
                precoCompra: 150,
                precoVenda: 55,
                equipSlot: "arma",
                bonus: { "AP": 12, "MP": 7 }    
            })
    ],
    drops: [
            criarItem({
                id: "dente-slime-1",
                nome: "Dente de Slime",
                tipo: "material",
                precoVenda: 10,
                icone: "sword" //Temporario
            })
]
};

function adicionarDropTeste() {
    const produto = produtosCacador.drops.find(
        item => item.itemInventario.id === "dente-slime-1"
    );

    const adicionado = window.inventario.adicionarItem(
        produto.itemInventario
    );

    if (adicionado) {
        alert("Dente de Slime adicionado ao inventário!");
    } else {
        alert("Inventário cheio!");
    }
}

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
        produto.itemInventario.id,
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

function venderDropTeste() {
    const drop = produtosCacador.drops.find(
        item => item.itemInventario.id === "dente-slime-1"
    );

    if (!drop) {
        alert("Drop de teste não encontrado!");
        return;
    }

    venderDrop(drop, 1);
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
                itemInventario.id === produto.itemInventario.id
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
        quantidade.setAttribute(
            "aria-label",
            "Quantidade para vender"
        );

        const botaoVender = document.createElement("button");
        botaoVender.textContent = "Vender quantidade";

        botaoVender.addEventListener("click", function() {
            const valor = Number(quantidade.value);
            venderDrop(produto, valor);
            mostrarProdutosCacador("drops");
        });

        const botaoVenderTudo = document.createElement("button");
        botaoVenderTudo.textContent = "Vender tudo";

        botaoVenderTudo.addEventListener("click", function() {
            const itens = window.inventario.obterItens();

            const encontrado = itens.find(function(itemInventario) {
                return itemInventario &&
                    itemInventario.id === produto.itemInventario.id
            });

            if (!encontrado) {
                alert("Você não possui esse item no inventário!");
                mostrarProdutosCacador("drops");
                return;
            }

            venderDrop(
                produto,
                encontrado.quantity || 1
            );

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

    if (!produto.itemInventario) {
        alert("Este item ainda não pode ser comprado.");
        return;
    }

    const itemAdicionado = window.inventario.adicionarItem(
        produto.itemInventario
    );

    if (!itemAdicionado) {
        alert("Seu inventário está cheio!");
        return;
    }

    moedasJogador -= produto.preco;

    atualizarMoedas();

    alert("Você comprou: " + produto.nome);
}