// Verifica se o navegador suporta Service Workers e registra o Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}

const form = document.getElementById('abastecimentoForm');
const totalGastoMes = document.getElementById('totalGastoMes');
const listaAbastecimentos = document.getElementById('listaAbastecimentos');

// Armazena os abastecimentos em localStorage
const armazenarAbastecimento = (abastecimento) => {
    let abastecimentos = JSON.parse(localStorage.getItem('abastecimentos')) || [];
    abastecimentos.push(abastecimento);
    localStorage.setItem('abastecimentos', JSON.stringify(abastecimentos));
};

// Calcula o total gasto no mês corrente
const calcularTotalGastoMes = () => {
    const abastecimentos = JSON.parse(localStorage.getItem('abastecimentos')) || [];
    const mesAtual = new Date().getMonth();
    const total = abastecimentos.reduce((acc, abastecimento) => {
        const dataAbastecimento = new Date(abastecimento.data);
        if (dataAbastecimento.getMonth() === mesAtual) {
            return acc + parseFloat(abastecimento.valorTotal);
        }
        return acc;
    }, 0);
    totalGastoMes.textContent = `R$ ${total.toFixed(2)}`;
};

// Renderiza a lista de abastecimentos
const renderizarAbastecimentos = () => {
    const abastecimentos = JSON.parse(localStorage.getItem('abastecimentos')) || [];
    listaAbastecimentos.innerHTML = '';
    abastecimentos.forEach(abastecimento => {
        const li = document.createElement('li');
        li.textContent = `${abastecimento.tipo}: R$ ${abastecimento.valorTotal} - ${abastecimento.quantidadeLitros} L - R$ ${abastecimento.valorLitro}/L`;
        listaAbastecimentos.appendChild(li);
    });
};

// Evento de submissão do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const quantidadeLitros = parseFloat(document.getElementById('quantidadeLitros').value);
    const valorLitro = parseFloat(document.getElementById('valorLitro').value);

    const abastecimento = {
        tipo,
        valorTotal,
        quantidadeLitros,
        valorLitro,
        data: new Date()
    };

    armazenarAbastecimento(abastecimento);
    calcularTotalGastoMes();
    renderizarAbastecimentos();

    form.reset();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    calcularTotalGastoMes();
    renderizarAbastecimentos();
});
