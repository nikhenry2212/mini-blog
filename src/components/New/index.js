import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../firebase';
import './new.css';

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titulo: '',
      image: null,
      url: '',
      descricao: '',
      alert: '',
      progress: 0,
    };
    this.cadastrar = this.cadastrar.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  //verifica se está logado == false return pra home '/'
  componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace('/');
      return null;
    }
  }

  cadastrar = async (e) => {
    e.preventDefault();
    //verifica se o campo esta  diferente de vazio 'com conteudo'
    if (this.state.titulo !== '' && this.state.image !== '' && this.state.descricao !== '' && this.state.image !== null && this.state.url !== '') {
      //peguei a função através do firebase.js e armazenei em uma var
      let posts = firebase.app.ref('posts');
      //fiz um push passando uma nova key no firebase
      let chave = posts.push().key;
      //aqui pega a referencia do posts passa a nova chave dentro da funcão child().set({pega novo: titulo, image, descricao e o autor que está atribuido no local storage})
      await posts.child(chave).set({
        titulo: this.state.titulo,
        image: this.state.url,
        descricao: this.state.descricao,
        autor: localStorage.nome
      });
      // se tudo ocorrer como esperado e inserir o post novo, volta a tela de /dashboard
      this.props.history.push('/dashboard');
    } else {
      //msg de alerta se os campos não estiver preenchidos
      this.setState({ alert: 'Preencha todos os campos!' })
    }
  }
  handleFile = async (e) => {
    if (e.target.files[0]) {

      const image = e.target.files[0]
      if (image.type === 'image/png' || image.type === 'image/jpeg') {
        await this.setState({ image: image })
        this.handleUpload();

      } else {
        alert('Envie uma imagem do tipo PNG ou JPG')
        this.setState({ image: null });
        return null;
      }

    }

  }
  handleUpload = async () => {
    const { image } = this.state;
    const currentUid = firebase.getCurrentUid();

    const uploadTask = firebase.storage.ref(`images/${currentUid}/${image.name}`)
      .put(image);

    await uploadTask.on('state_changed',
      (snapshot) => {
        //progress
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) *100);
        this.setState({progress})
      },
      (error) => {
        //error
        console.log('====================================');
        console.log('Error imagem :' + error);
        console.log('====================================');
      },
      () => {
        //sucesso
        firebase.storage.ref(`images/${currentUid}`)
          .child(image.name).getDownloadURL()
          .then(url => {
            this.setState({ url: url });
          })
      })
  }

  render() {
    return (
      <div>
        <header id="new">
          <Link to='/dashboard'>Voltar</Link>
        </header>
        <form onSubmit={this.cadastrar} id="new-post">
          <span>{this.state.alert}</span>

          <input type="file"
            onChange={this.handleFile} /><br />
          {this.state.url !== '' ?
            <img src={this.state.url} width="250" height="150" alt="capa do post" />
          :
          <progress value={this.state.progress} max="100"/>
          }

          <label>Titulo:</label><br />
          <input type="text" placeholder="Nome do post" value={this.state.titulo} autoFocus
            onChange={(e) => this.setState({ titulo: e.target.value })} /><br />

          {/* <label>Url da imagem:</label><br/>
          <input type="text" placeholder="Url da capa" value={this.state.image} 
          onChange={(e)=> this.setState({image: e.target.value})} /><br/>  */}



          <label>Descrição:</label><br />
          <textarea type="text" placeholder="Alguma descrição" value={this.state.descricao}
            onChange={(e) => this.setState({ descricao: e.target.value })} /><br />

          <button type="submit">Cadastrar</button>

        </form>
      </div>
    )
  }
}
export default withRouter(New);