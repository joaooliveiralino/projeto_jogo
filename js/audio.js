
const AudioGame = (() => {
    const sons = {
    ambiente: new Audio("soundtrack/background.mp3"),
    combate: new Audio("soundtrack/backgroundbattle.mp3"),

    ataque: new Audio("soundtrack/atkbasico.wav"),
    bolaFogo: new Audio("soundtrack/bolafogo.wav"),
    cortePoderoso: new Audio("soundtrack/cortepoderoso.wav"),
    clique: new Audio("soundtrack/click.wav"),
    dano: new Audio("soundtrack/dano.mp3"),
    pocao: new Audio("soundtrack/pocao.mp3")
};

    let musicaAtual = null;
    let volumeMusica = 0.4;
    let volumeEfeitos = 0.7;
    let audioLiberado = false;

    sons.ambiente.loop = true;
    sons.combate.loop = true;

    function tocarMusica(nome) {
        const musica = sons[nome];

        if (!musica || musicaAtual === nome) return;

        if (musicaAtual) {
            sons[musicaAtual].pause();
            sons[musicaAtual].currentTime = 0;
        }

        musicaAtual = nome;
        musica.volume = volumeMusica;

        musica.play().catch(erro => {
            console.log("Não foi possível iniciar a música:", erro);
        });
    }

    function tocarEfeito(nome) {
        const som = sons[nome];

        if (!som || nome === "ambiente" || nome === "combate") return;

        const instancia = som.cloneNode();
        instancia.volume = volumeEfeitos;
        instancia.play().catch(erro => {
            console.log("Não foi possível reproduzir o efeito:", erro);
        });
    }

    function iniciarAudio() {
        if (audioLiberado) return;

        audioLiberado = true;
        tocarMusica("ambiente");
    }

    function definirVolumeMusica(valor) {
        volumeMusica = Math.max(0, Math.min(1, valor));

        if (musicaAtual) {
            sons[musicaAtual].volume = volumeMusica;
        }
    }

    function definirVolumeEfeitos(valor) {
        volumeEfeitos = Math.max(0, Math.min(1, valor));
    }

    return {
        tocarMusica,
        tocarEfeito,
        iniciarAudio,
        definirVolumeMusica,
        definirVolumeEfeitos
    };
})();

window.AudioGame = AudioGame;

// Libera o áudio após a primeira interação do jogador.
document.addEventListener("click", AudioGame.iniciarAudio, { once: true });
document.addEventListener("keydown", AudioGame.iniciarAudio, { once: true });

document.addEventListener("click", function(event) {
    if (event.target.closest("button")) {
        AudioGame.tocarEfeito("clique");
    }
});