function iniciarJogo() {
    document.querySelector("#menu-principal").style.display = "none";
    document.querySelector("#tela-jogo").style.display = "flex";
}

document.querySelector("button").addEventListener("click", iniciarJogo);