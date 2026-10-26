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


//Sistema loja do mercador

const produtosMercador = {
    pocoes: [
        { nome: "Poção de Vida Basica", preco: 15 },
        { nome: "Poção de Mana Basica", preco: 15 },
        { nome: "Poção de Vida Intermediaria", preco: 25 },
        { nome: "Poção de Mana Intermediaria", preco: 25 },
        { nome: "Poção de Vida Avançada", preco: 50 },
        { nome: "Poção de Mana Avançada", preco: 50 }
    ],

    alimentos: [
        { nome: "Carne Assada", preco: 10 },
        { nome: "Pão", preco: 5 }
    ],

    materiais: [
        { nome: "Minério de Ferro", preco: 15 },
        { nome: "Madeira", preco: 5 }
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
        { nome: "Espada de Ferro", preco: 100 },
        { nome: "Arco Simples", preco: 80 },
        { nome: "Adaga de Caçador", preco: 60 }
    ],

    drops: []
};

function mostrarProdutosCacador(categoria) {
    const areaItens = document.querySelector("#itens-cacador");

    areaItens.innerHTML = "";

    if (categoria === "drops") {
        const mensagem = document.createElement("p");

        mensagem.textContent =
            "A venda de drops estará disponível quando o inventário for implementado.";

        areaItens.appendChild(mensagem);
        return;
    }

    const produtos = produtosCacador[categoria];

    produtos.forEach(function(produto) {
        const item = document.createElement("div");
        item.classList.add("item-cacador");

        const nome = document.createElement("span");
        nome.textContent = produto.nome;

        const preco = document.createElement("span");
        preco.textContent = produto.preco + " moedas";

        item.appendChild(nome);
        item.appendChild(preco);

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