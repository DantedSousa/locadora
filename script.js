document.addEventListener('DOMContentLoaded', function () {
    const formSessoes = document.getElementById('formSessoes');
    const formCompras = document.getElementById('formCompras');
    const tableSessoes = document.getElementById('tableSessoes').getElementsByTagName('tbody')[0];
    const tableCompras = document.getElementById('tableCompras').getElementsByTagName('tbody')[0];
    const itemPersonalizadoRow = document.getElementById('itemPersonalizadoRow');
    const totalSessoes = document.getElementById('totalSessoes');
    const totalCompras = document.getElementById('totalCompras');
    const totalGeral = document.getElementById('totalGeral');
    const valorTotalSessoes = document.getElementById('valorTotalSessoes');
    const valorTotalCompras = document.getElementById('valorTotalCompras');
    const valorTotalGeral = document.getElementById('valorTotalGeral');
    const btnAddSessao = document.getElementById('btnAddSessao');
    const btnAddCompra = document.getElementById('btnAddCompra');
    const btnAddPersonalizado = document.getElementById('btnAddPersonalizado');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnAcessarRegistros = document.getElementById('btnAcessarRegistros');
    const selectItem = document.getElementById('item');
    const outroItemInput = document.getElementById('outroItem');
    const itemPersonalizadoInput = document.getElementById('itemPersonalizado');
    const inputDia = document.getElementById('inputDia');
    const selectTV = document.getElementById('tv');
    let registrosSessoes = [];
    let registrosCompras = [];
    let registrosPorData = [];

    let tentativas = 3; // Número máximo de tentativas permitidas
    const senhaCorreta = '092016'; // Senha correta

    // Função para adicionar sessão de jogo
    btnAddSessao.addEventListener('click', function () {
        const horaInicial = document.getElementById('horaInicial').value.trim();
        const horaFinal = document.getElementById('horaFinal').value.trim();
        const valor = parseFloat(document.getElementById('valor').value.trim());
        const observacao = document.getElementById('observacao').value.trim();
        const tvSelecionada = selectTV.value.trim();

        if (horaInicial === '' || horaFinal === '' || isNaN(valor) || tvSelecionada === '') {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const sessao = { tv: tvSelecionada, horaInicial, horaFinal, valor, observacao };
        registrosSessoes.push(sessao);
        atualizarTabelaSessoes();
        atualizarTotais();
        formSessoes.reset();
    });

    // Função para adicionar compra
    btnAddCompra.addEventListener('click', function () {
        const nomeCliente = document.getElementById('nomeCliente').value.trim();
        let itemSelecionado = selectItem.value;
        const quantidade = parseInt(document.getElementById('quantidade').value.trim());

        if (nomeCliente === '' || quantidade === 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        if (itemSelecionado === 'outro') {
            itemSelecionado = outroItemInput.value.trim();
        }

        if (itemSelecionado === 'outro' || itemSelecionado === '') {
            alert('Por favor, digite o item personalizado.');
            return;
        }

        const compra = { nomeCliente, item: itemSelecionado, quantidade };
        registrosCompras.push(compra);
        atualizarTabelaCompras();
        atualizarTotais();
        formCompras.reset();
    });

    // Função para adicionar item personalizado
    btnAddPersonalizado.addEventListener('click', function () {
        const nomeCliente = document.getElementById('nomeCliente').value.trim();
        const itemPersonalizado = itemPersonalizadoInput.value.trim();
        const quantidade = parseInt(document.getElementById('quantidade').value.trim());

        if (nomeCliente === '' || itemPersonalizado === '' || quantidade === 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const compra = { nomeCliente, item: itemPersonalizado, quantidade };
        registrosCompras.push(compra);
        atualizarTabelaCompras();
        atualizarTotais();
        formCompras.reset();
    });

    // Evento para alternar visibilidade do campo "outro item"
    selectItem.addEventListener('change', function () {
        const selectedValue = selectItem.value;
        if (selectedValue === 'outro') {
            outroItemInput.style.display = 'inline-block';
            itemPersonalizadoRow.style.display = 'table-row';
        } else {
            outroItemInput.style.display = 'none';
            itemPersonalizadoRow.style.display = 'none';
        }
    });

    // Função para atualizar tabela de sessões
    function atualizarTabelaSessoes() {
        tableSessoes.innerHTML = '';
        registrosSessoes.forEach((sessao, index) => {
            const row = tableSessoes.insertRow();
            row.innerHTML = `
                <td>${sessao.tv}</td>
                <td>${sessao.horaInicial}</td>
                <td>${sessao.horaFinal}</td>
                <td>${sessao.valor.toFixed(2)}</td>
                <td class="observacao-cell">${sessao.observacao}</td>
                <td>
                    <button type="button" class="btnRemoverSessao" data-index="${index}">Remover</button>
                    <button type="button" class="btnEditarObservacao" data-index="${index}">Editar Obs.</button>
                </td>
            `;
        });

        // Adiciona evento de remover sessão
        const btnRemoverSessao = tableSessoes.getElementsByClassName('btnRemoverSessao');
        for (let i = 0; i < btnRemoverSessao.length; i++) {
            btnRemoverSessao[i].addEventListener('click', function () {
                const index = parseInt(btnRemoverSessao[i].getAttribute('data-index'));
                registrosSessoes.splice(index, 1);
                atualizarTabelaSessoes();
                atualizarTotais();
            });
        }

        // Adiciona evento para editar observação
        const btnEditarObservacao = tableSessoes.getElementsByClassName('btnEditarObservacao');
        for (let i = 0; i < btnEditarObservacao.length; i++) {
            btnEditarObservacao[i].addEventListener('click', function () {
                const index = parseInt(btnEditarObservacao[i].getAttribute('data-index'));
                const novaObservacao = prompt('Digite a nova observação:');
                if (novaObservacao !== null) {
                    registrosSessoes[index].observacao = novaObservacao.trim();
                    atualizarTabelaSessoes();
                    atualizarTotais();
                }
            });
        }
    }

    // Função para atualizar tabela de compras
    function atualizarTabelaCompras() {
        tableCompras.innerHTML = '';
        registrosCompras.forEach((compra, index) => {
            const row = tableCompras.insertRow();
            row.innerHTML = `
                <td>${compra.nomeCliente}</td>
                <td>${compra.item}</td>
                <td>${compra.quantidade}</td>
                <td>${(compra.quantidade * calcularValorItem(compra.item)).toFixed(2)}</td>
                <td><button type="button" class="btnRemoverCompra" data-index="${index}">Remover</button></td>
            `;
        });

        // Adiciona evento de remover compra
        const btnRemoverCompra = tableCompras.getElementsByClassName('btnRemoverCompra');
        for (let i = 0; i < btnRemoverCompra.length; i++) {
            btnRemoverCompra[i].addEventListener('click', function () {
                const index = parseInt(btnRemoverCompra[i].getAttribute('data-index'));
                registrosCompras.splice(index, 1);
                atualizarTabelaCompras();
                atualizarTotais();
            });
        }
    }

    // Função para calcular o valor do item
    function calcularValorItem(item) {
        switch (item) {
            case 'xilito':
            case 'pipoca':
                return 1.00;
            case 'cheetos':
            case 'cebolitos':
            case 'bacon':
            case 'Fini':
                return 1.50;
            case 'bombom':
                return 0.15;
            case 'Megalito':
            case 'Estrela':
                return 0.50;
            case 'nucita':
                return 0.35;
            case 'plutonita':
                return 0.25;
            default:
                return 0;
        }
    }

    // Função para atualizar os totais
    function atualizarTotais() {
        let totalValorSessoes = 0;
        registrosSessoes.forEach(sessao => {
            totalValorSessoes += sessao.valor;
        });
        valorTotalSessoes.textContent = totalValorSessoes.toFixed(2);

        let totalValorCompras = 0;
        registrosCompras.forEach(compra => {
            totalValorCompras += compra.quantidade * calcularValorItem(compra.item);
        });
        valorTotalCompras.textContent = totalValorCompras.toFixed(2);

        valorTotalGeral.textContent = (totalValorSessoes + totalValorCompras).toFixed(2);
    }

    // Evento para limpar registros com confirmação
    btnLimpar.addEventListener('click', function () {
        if (confirm('Deseja salvar os registros antes de limpar?')) {
            const dataRegistro = inputDia.value;
            const registrosDia = { data: dataRegistro, sessoes: registrosSessoes, compras: registrosCompras };
            registrosPorData.push(registrosDia);
            sessionStorage.setItem('registrosPorData', JSON.stringify(registrosPorData));
        }

        registrosSessoes = [];
        registrosCompras = [];
        atualizarTabelaSessoes();
        atualizarTabelaCompras();
        atualizarTotais();
    });

    // Evento para acessar a página de registros salvos
    btnAcessarRegistros.addEventListener('click', function () {
        const dataRegistro = inputDia.value;

        if (tentativas <= 0) {
            alert('Você excedeu o número máximo de tentativas.');
            btnAcessarRegistros.disabled = true;
            return;
        }

        const senha = prompt('Insira a senha para acessar os registros:');
        if (senha === senhaCorreta) {
            sessionStorage.setItem('diaRegistro', dataRegistro);
            window.location.href = 'registros.html';
        } else {
            tentativas--;
            alert(`Senha incorreta! Tentativas restantes: ${tentativas}`);
        }
    });

    // Evento para confirmar a data do dia
    document.getElementById('formDia').addEventListener('submit', function (event) {
        event.preventDefault();
        const dataRegistro = inputDia.value;
        sessionStorage.setItem('diaRegistro', dataRegistro);
        document.getElementById('sectionDia').style.display = 'none';
        document.getElementById('sectionPrincipal').style.display = 'block';
    });

    // Verifica se há uma data de registro salva e exibe a seção apropriada
    const diaRegistro = sessionStorage.getItem('diaRegistro');
    if (diaRegistro) {
        inputDia.value = diaRegistro;
        document.getElementById('sectionDia').style.display = 'none';
        document.getElementById('sectionPrincipal').style.display = 'block';
    } else {
        document.getElementById('sectionDia').style.display = 'block';
        document.getElementById('sectionPrincipal').style.display = 'none';
    }
});
