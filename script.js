let todosEstados = []; // Armazena todos os estados do Brasil

// 1. Carrega todos os estados ao abrir a página
async function carregarTodosEstados() {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    todosEstados = await response.json();
  } catch (error) {
    console.error('Erro ao carregar estados:', error);
  }
}

// 2. Filtra estados por região e atualiza o select
function filtrarEstadosPorRegiao(regiaoSelecionada) {
  const estadosFiltrados = regiaoSelecionada ? 
    todosEstados.filter(uf => uf.regiao.nome === regiaoSelecionada) : 
    todosEstados;

  const estadoSelect = document.getElementById('estado');
  estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
  
  estadosFiltrados.forEach(uf => {
    estadoSelect.innerHTML += `
      <option value="${uf.sigla}">
        ${uf.nome} (${uf.sigla})
      </option>
    `;
  });
  
  estadoSelect.disabled = !regiaoSelecionada;
}

// 3. Carrega cidades do estado selecionado
async function carregarCidades(uf) {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const cidades = await response.json();
    
    const cidadeSelect = document.getElementById('cidade');
    cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
    
    cidades.forEach(cidade => {
      cidadeSelect.innerHTML += `
        <option value="${cidade.nome}">
          ${cidade.nome}
        </option>
      `;
    });
    
    cidadeSelect.disabled = false;
  } catch (error) {
    console.error('Erro ao carregar cidades:', error);
  }
}

// 4. Exibe resultado final
function mostrarResultado() {
  const estado = document.getElementById('estado').selectedOptions[0]?.text || '';
  const cidade = document.getElementById('cidade').value || '';
  const resultado = document.getElementById('resultado');
  
  if (estado && cidade) {
    resultado.textContent = `Você selecionou: ${cidade} - ${estado}`;
  } else {
    resultado.textContent = '';
  }
}

// 5. Configura eventos
document.addEventListener('DOMContentLoaded', async () => {
  // Carrega estados ao iniciar
  await carregarTodosEstados();

  // Evento para mudança de região
  document.getElementById('regiao').addEventListener('change', function() {
    const regiao = this.value;
    
    // Reseta selects dependentes
    document.getElementById('estado').innerHTML = '<option value="">Selecione o estado</option>';
    document.getElementById('cidade').innerHTML = '<option value="">Selecione a cidade</option>';
    document.getElementById('cidade').disabled = true;
    document.getElementById('resultado').textContent = '';
    
    // Filtra estados
    filtrarEstadosPorRegiao(regiao);
  });

  // Evento para mudança de estado
  document.getElementById('estado').addEventListener('change', function() {
    const uf = this.value;
    
    // Reseta selects dependentes
    document.getElementById('cidade').innerHTML = '<option value="">Selecione a cidade</option>';
    document.getElementById('cidade').disabled = true;
    document.getElementById('resultado').textContent = '';
    
    if (uf) carregarCidades(uf);
  });

  // Evento para mudança de cidade
  document.getElementById('cidade').addEventListener('change', mostrarResultado);
});
