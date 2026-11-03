const SistemaSave = (() => {

    const CHAVE_SAVE = "restorya_save";

    function salvar(dados) {
        try {
            const save = {
                versao: 1,
                dataSalvamento: Date.now(),
                dados: dados
            };

            localStorage.setItem(CHAVE_SAVE, JSON.stringify(save));

            console.log("Jogo salvo com sucesso!");
            return true;

        } catch (erro) {
            console.error("Erro ao salvar o jogo:", erro);
            return false;
        }
    }

    function carregar() {
        try {
            const conteudo = localStorage.getItem(CHAVE_SAVE);

            if (!conteudo) {
                return null;
            }

            const save = JSON.parse(conteudo);

            if (!save.dados || save.versao !== 1) {
                return null;
            }

            console.log("Jogo carregado com sucesso!");
            return save.dados;

        } catch (erro) {
            console.error("Erro ao carregar o jogo:", erro);
            return null;
        }
    }

    function existeSave() {
        return localStorage.getItem(CHAVE_SAVE) !== null;
    }

    function apagarSave() {
        localStorage.removeItem(CHAVE_SAVE);
        console.log("Save apagado!");
    }

    return {
        salvar: salvar,
        carregar: carregar,
        existeSave: existeSave,
        apagarSave: apagarSave
    };

})();

window.sistemaSave = SistemaSave;

window.salvarProgresso = function() {
    const dados = {
        inventario: window.inventario.obterDadosSave(),
        moedas: window.moedas.obter(),
        floresta: obterDadosFlorestaSave(),
        ultimoDescanso: ultimoDescanso,
        base: window.base.obterDadosSave(),
    };

    return window.sistemaSave.salvar(dados);
};

window.carregarProgresso = function() {
    const dados = window.sistemaSave.carregar();

    if (!dados) {
        return false;
    }

    const inventarioCarregado =
        window.inventario.carregarDadosSave(dados.inventario);

    if (!inventarioCarregado) {
        return false;
    }

    if (dados.base) {
        window.base.carregarDadosSave(dados.base);
    }

    if (typeof dados.moedas === "number") {
        window.moedas.definir(dados.moedas);
    }

    if (dados.floresta) {
        carregarDadosFlorestaSave(dados.floresta);
    }

    if (typeof dados.ultimoDescanso === "number") {
        ultimoDescanso = dados.ultimoDescanso;
    }

    return true;
};

document.addEventListener("DOMContentLoaded", function() {
    window.carregarProgresso();
});

setInterval(function() {
    window.salvarProgresso();
    console.log("Salvamento automático realizado!");
}, 60000);

window.addEventListener("beforeunload", function() {
    window.salvarProgresso();
});