
import React, { useState, useEffect } from 'react';

export default function CalculadoraShopee() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorDesejado, setValorDesejado] = useState('');
  const [taxaPercentual, setTaxaPercentual] = useState(20);
  const [taxaFixa, setTaxaFixa] = useState(4);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const salvo = localStorage.getItem('shopee_db');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  const calcularPrecoVenda = () => {
    const desejado = parseFloat(valorDesejado) || 0;
    const taxaProd = parseFloat(taxaPercentual) / 100;
    const fixo = parseFloat(taxaFixa) || 0;
    if (desejado === 0) return "0.00";
    return ((desejado + fixo) / (1 - taxaProd)).toFixed(2);
  };

  const salvarDados = (e) => {
    e.preventDefault();
    if (!nomeProduto || !valorDesejado) return alert("Preencha tudo!");

    const novoItem = {
      id: Date.now(),
      nome: nomeProduto,
      custo: valorDesejado,
      venda: calcularPrecoVenda()
    };

    const novaLista = [novoItem, ...historico];
    setHistorico(novaLista);
    localStorage.setItem('shopee_db', JSON.stringify(novaLista));
    setNomeProduto('');
    setValorDesejado('');
  };

  const removerItem = (id) => {
    const filtrado = historico.filter(i => i.id !== id);
    setHistorico(filtrado);
    localStorage.setItem('shopee_db', JSON.stringify(filtrado));
  };

  return (
    <div className="container-geral">
      <style>{`
        .container-geral { font-family: sans-serif; background: #000; min-height: 100vh; display: flex; justify-content: center; padding: 20px; color: #fff; }
        .card { background: #111; width: 100%; max-width: 400px; border-radius: 15px; padding: 25px; border: 1px solid #222; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 15px; }
        .header h1 { color: #2ecc71; font-size: 18px; margin: 0; letter-spacing: 1px; }
        .header p { color: #666; font-size: 12px; margin: 5px 0 0; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        label { display: block; font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; background: #222; border: 1px solid #333; padding: 12px; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box; font-size: 16px; }
        input:focus { border-color: #2ecc71; }
        .resultado-box { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 12px; padding: 15px; text-align: center; margin: 20px 0; }
        .resultado-label { font-size: 10px; color: #2ecc71; font-weight: bold; display: block; }
        .resultado-valor { font-size: 32px; font-weight: 900; }
        .btn-salvar { width: 100%; background: #2ecc71; color: #000; border: none; padding: 15px; border-radius: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-salvar:active { transform: scale(0.98); }
        .historico-titulo { font-size: 12px; color: #555; margin-top: 30px; border-bottom: 1px solid #222; padding-bottom: 5px; }
        .lista { margin-top: 15px; max-height: 250px; overflow-y: auto; }
        .item { background: #1a1a1a; padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #2ecc71; }
        .item h3 { margin: 0; font-size: 14px; }
        .item p { margin: 3px 0 0; font-size: 12px; color: #777; }
        .item .venda { color: #2ecc71; font-weight: bold; }
        .btn-del { background: none; border: none; color: #444; font-size: 18px; cursor: pointer; }
        .btn-del:hover { color: #e74c3c; }
      `}</style>

      <div className="card">
        <div className="header">
          <h1>ADAILSON SOLUÇÕES DIGITAIS</h1>
          <p>Calculadora da shopee v1.0</p>
        </div>

        <div className="row">
          <div>
            <label>Taxa Shopee (%)</label>
            <input type="number" value={taxaPercentual} onChange={(e) => setTaxaPercentual(e.target.value)} />
          </div>
          <div>
            <label>Fixo (R$)</label>
            <input type="number" value={taxaFixa} onChange={(e) => setTaxaFixa(e.target.value)} />
          </div>
        </div>

        <form onSubmit={salvarDados}>
          <div style={{marginBottom: '15px'}}>
            <label>Produto de Tobias Barreto</label>
            <input type="text" placeholder="Ex: Vestido de Malha" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label>Quanto quer receber? (Líquido)</label>
            <input type="number" placeholder="Fábrica + Sua Margem" value={valorDesejado} onChange={(e) => setValorDesejado(e.target.value)} />
          </div>

          <div className="resultado-box">
            <span className="resultado-label">Preço Sugerido p/ Anúncio</span>
            <span className="resultado-valor">R$ {calcularPrecoVenda()}</span>
          </div>

          <button type="submit" className="btn-salvar">SALVAR NA LISTA</button>
        </form>

        <h2 className="historico-titulo">HISTÓRICO DE CÁLCULOS</h2>
        <div className="lista">
          {historico.map(i => (
            <div className="item" key={i.id}>
              <div>
                <h3>{i.nome}</h3>
                <p>Líquido: R$ {i.custo} | <span className="venda">Venda: R$ {i.venda}</span></p>
              </div>
              <button className="btn-del" onClick={() => removerItem(i.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}