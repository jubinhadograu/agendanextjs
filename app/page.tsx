"use client"
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import { db } from '../config/firebase';
import React, { FormEvent, useEffect, useState } from 'react';

/*utilizo o 'type' para tipar o valor das variaveis utilizados*/
type Contato ={
  chave: string,
  nome: string,
  email: string,
  telefone: string,
  observacoes: string
}

const Home: NextPage = () => {

  /* o primeiro termo é a variavel, e o segundo é a função
  que vai adicionar valor na variavel */
  const[nome, setNome] = useState('')
  const[email, setEmail] = useState('')
  const[telefone, setTelefone] = useState('')
  const[observacoes, setObservacoes] = useState('')

  /* lista de contatos gerais */
  const[contatos, setContatos] = useState<Contato[]>()

  /* lista de contatos da busca */
  const [busca, setBusca] = useState<Contato[]>()

  const[Buscando, setBuscando] = useState(false)

  const[chave, setChave] = useState('')

  const[atualizando, setAtualizando] = useState(false)

  /* vai executar essa funcao toda vez que atualizar a pagina,
  pegando os dados do banco de dados e mostrando para o usuario */
  useEffect(() => {
    const refContatos = db.ref('contatos')

    refContatos.on('value', resultado => {
      const resultadoContatos = Object.entries<Contato>(resultado.val()?? {}).map(([chave, valor]) => {
        return{
          'chave': chave,
          'nome': valor.nome,
          'email': valor.email,
          'telefone': valor.telefone,
          'observacoes': valor.observacoes
        }
      }) //o '.val' serve para que venha somente os valores do resultado
    
      setContatos(resultadoContatos)
    })
  }, [])

  /* essa function é responsavel por gravar os dados que foram
  inseridos no formulario no banco de dados */
  function gravar(event: FormEvent){
    event.preventDefault() //evento para previnir a pagina de apagar os dados quando recarregar
    const ref = db.ref('contatos')

    const data = {
      nome,
      email,
      telefone,
      observacoes
    }

    /*aqui vou estar definindo um novo valor para as variaveis,
    da qual vai limpar os valores adicionados nos campos quando o botao Salvar for pressionado*/
    ref.push(data)
    setNome('')
    setEmail('')
    setTelefone('')
    setObservacoes('')
  }

  /* essa function irá acessar os contatos no banco de dados e ir
  atras da ref para então excluí-la */
  function deletar(ref: string){
    const referencia = db.ref(`contatos/${ref}`).remove();
  }

  /* essa function vai mapear os contatos e ver se cada letra
  digitada pertence a algum contato e se existir, vai ser armazenado na busca */
  function buscar(event: FormEvent){
    const palavra = (event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        console.log(event.target.value);
      };
    console.log(palavra);

    if(palavra.length > 0){
      setBuscando(true)
    const dados = new Array

    contatos?.map(contato => {
      const regra = new RegExp(event.target.value, "gi")
      if(regra.test(contato.nome)){
        dados.push(contato)
      }
    })

    setBusca(dados)
    }else{
      setBuscando(false)
    }
    
  }

  /* essa functiion vai trazer os dados que ja estao gravados no banco para as caixas
  de preenchimento de dados */
  function editar (contato: Contato){
    setAtualizando(true)
    setChave(contato.chave)
    setNome(contato.nome)
    setEmail(contato.email)
    setTelefone(contato.telefone)
    setObservacoes(contato.observacoes)
  }

  /* essa function vai atualizar os dados no banco de dados, trazendo as informacoes
  editadas */
  function atualizar(){
    const ref = db.ref('contatos/')

    const dados = {
      'nome': nome,
      'email': email,
      'telefone': telefone,
      'observacoes': observacoes
    }

    ref.child(chave).update(dados)

    setNome('')
    setEmail('')
    setTelefone('')
    setObservacoes('')

    setAtualizando(false)
  }

  return (
    <>
    <main className={styles.container}>
      <form>
        <input type='text' placeholder='Nome' value={nome} onChange={event => setNome(event.target.value)}></input>
        <input type='email' placeholder='Email' value={email} onChange={event => setEmail(event.target.value)}></input>
        <input type='tel' placeholder='Telefone' value={telefone} onChange={event => setTelefone(event.target.value)}></input>
        <textarea placeholder='Observações' value={observacoes} onChange={event => setObservacoes(event.target.value)}></textarea>
        {atualizando ?
          <button type='button' onClick={atualizar}>Atualizar</button> :
          <button type='button' onClick={gravar}>Salvar</button>
        }
      </form>
      <div className={styles.caixacontatos}>
        <input type='text' placeholder='Buscar' onChange={buscar}></input>
        {Buscando ?
        busca?.map(contato =>{
          return(
          // eslint-disable-next-line react/jsx-key
          <div key={contato.chave} className={styles.caixaindividual}>
          <div className={styles.boxtitulo}>
          <p className={styles.nometitulo}>{contato.nome}</p>
          <div>
            <a onClick={() => editar(contato)}>Editar</a>
            <a onClick={() => deletar(contato.chave)}>Excluir</a>
          </div>
          </div>
          <div className={styles.dados}>
            <p>{contato.email}</p>
          <p>{contato.telefone}</p>
          <p>{contato.observacoes}</p>
          </div>
          
          </div>
        )
        })  : contatos?.map(contato =>{
            return(
            // eslint-disable-next-line react/jsx-key
            <div key={contato.chave} className={styles.caixaindividual}>
            <div className={styles.boxtitulo}>
            <p className={styles.nometitulo}>{contato.nome}</p>
            <div>
            <a onClick={() => editar(contato)}>Editar</a>
              <a onClick={() => deletar(contato.chave)}>Excluir</a>
            </div>
            </div>
            <div className={styles.dados}>
            <p>{contato.email}</p>
            <p>{contato.telefone}</p>
            <p>{contato.observacoes}</p>
            </div>
            
            </div>
          )
          })}
        
      </div>
    </main>
    </>
  )
}

export default Home;