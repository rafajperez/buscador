import { useState } from "react";
import { FiSearch } from "react-icons/fi";
// 1. Importar o axios (Certifique-se que ele está instalado: npm install axios)
import axios from "axios";

import "./style.css";

function App() {
  // Estado para armazenar o valor digitado no input
  const [input, setInput] = useState(""); // Ajustado para string vazia
  // Estado para armazenar os dados do endereço retornado pela API
  const [cepData, setCepData] = useState(null);

  async function handleSearch() {
    // Validação básica: se o input estiver vazio ou não tiver 8 dígitos, não faz a busca
    if (input === "" || input.length !== 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos.");
      setInput(""); // Limpa o campo
      return;
    }

    try {
      // 2. Chamar a API ViaCEP com o CEP digitado
      const response = await axios.get(
        `https://viacep.com.br/ws/${input}/json/`
      );

      // 3. Verificar se a API retornou um erro (CEP inválido)
      if (response.data.erro) {
        setCepData(null);
        alert("CEP não encontrado.");
        setInput("");
        return;
      }

      // Armazenar os dados no estado e limpar o input
      setCepData(response.data);
      setInput("");
    } catch (error) {
      // Tratar erros de conexão
      alert("Erro ao buscar o CEP. Tente novamente.");
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscador Cep</h1>

      <div className="containerInput">
        <input
          type="text"
          id="cepInput"
          placeholder="Digite seu Cep..."
          value={input}
          // Adicionar o evento onKeyDown para buscar também ao pressionar Enter
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="buttonSearch"
          onClick={handleSearch} // Função de busca agora funciona!
          title="Pesquisar CEP"
          aria-label="Pesquisar CEP" // Boa prática de acessibilidade
        >
          <FiSearch size={25} color="#FFF" />
        </button>
      </div>

      {/* 4. Renderização Condicional: Só exibe o MAIN se houver dados (cepData não for null) */}
      {cepData && (
        <main className="main">
          <h2>CEP: {cepData.cep}</h2>
          <span>{cepData.logradouro}</span>
          {/* O ViaCEP retorna 'complemento' ou 'unidade'. Exibe se existir */}
          {cepData.complemento && (
            <span>Complemento: {cepData.complemento}</span>
          )}
          <span>Bairro: {cepData.bairro}</span>
          <span>
            {cepData.localidade} - {cepData.uf}
          </span>
        </main>
      )}
    </div>
  );
}

export default App;
