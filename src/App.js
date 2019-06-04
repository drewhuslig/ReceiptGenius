import React from 'react';
import Modal from './components/Modal';
import ReportTotal from './components/ReportTotal';
import ReceiptModel from './components/ReceiptModel';
import './App.css';
import Axios from 'axios';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      total: 0,
      startDate: new Date(),
      data: [],
      selectedOption: "",
      description: ''
    }
  }


  componentWillMount = () => {
    Axios.get('/receipts')
      .then(res => {
        console.log(res.data);
        this.calculateTotal(res.data)
        this.setState({
          data: res.data
        })
      })
  }

  calculateTotal = (data) => {
    let t = 0;
    data.forEach(element => {
      t += element.total;
    });
    this.setState({total: parseFloat(t).toFixed(2)})
  }

  handleChangeDate = date => {
    this.setState({
      startDate: date
    })
  }

  getFileType(type) {
    if (type === 'application/pdf') {
      return 'far fa-file-pdf file-image'
    }
    return 'far fa-file-image file-image'
  }

  removeItem = (id, e) => {
    e.preventDefault();
    console.log(id);
    Axios.delete('/receipts', {data: {id: id}})
      .then(res => {
        this.setState({data: res.data}, this.calculateTotal(res.data))
      })
  }

  openModal = e => {
    e.preventDefault();
    const modal = this.refs.modal;
    modal.style.display = 'block';
  }

  

  handleChangeOption = e => {
    this.setState({
      selectedOption: e.target.value
    })
  }

  handleChangeFile = e => {
    this.setState({file: e.target.files[0]})
  }

  handleChangeDescription = e => {
    this.setState({description: e.target.value})
  }

  handleChangeTotal = value => {
    this.setState({total: value})
  }

  handleChangeName = e => {
    this.setState({name: e.target.value})
  }
  
  addReceipt = e => {
    this.closeModal(e);
    let formData = new FormData()
    formData.append('file', this.state.file);
    formData.append('name', this.state.name);
    formData.append('total', this.state.total);
    formData.append('data', this.state.startDate.toLocaleDateString("en-US"))
    formData.append('category', this.state.selectedOption);
    formData.append('description', this.state.description);
    Axios.post('/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      this.setState({data: res.data}, this.calculateTotal(res.data));
    })
  }

  handleLabelClick = (e, button) => {
    if(button.checked){
      e.preventDefault();
      button.checked = false;
      this.setState({selectedOption: ""})
    }
  }

  handleTotal = (e) => {
    this.setState({
      total: e.target.value
    }, function() {
      e.target.value = e.target.value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    })
  }

  outsideClick = (e) => {
    const modal = this.refs.modal;
    
    if (e.target ===  modal){
      e.preventDefault();
      this.refs.modalComponent.setState({message: ""})
      modal.style.display = 'none';
    }
  }

  closeModal = (e) => {
    e.preventDefault();
    const modal = this.refs.modal;
    modal.style.display = 'none';
  }

  render(){
    return (
      <div className="App">
        <header className='header'>
          <i className='fas fa-receipt'></i> Receipt<strong>Genius</strong>
        </header>

        <div className='body'>
          <div className='clearfix'>
            <button className='add-receipt-btn btn float-left' onClick={e => this.openModal(e)}><i className='fas fa-plus'> Add receipt</i></button>
            <ReportTotal total = {this.state.total}/>
          </div>

          <hr></hr>

          <div className='container'>
            {this.state.data.map(receipt => {
                return (
                  <ReceiptModel 
                    getFileType = {this.getFileType}
                    removeItem = {this.removeItem}
                    receipt = {receipt}
                  />
                )
              })
            }
            
          </div>
        </div>
        <div className='modal' ref='modal' onClick={e => this.outsideClick(e)}>
          <Modal
            ref='modalComponent'
            handleChangeDate = {this.handleChangeDate}
            handleChangeOption = {this.handleChangeOption}
            handleChangeFile = {this.handleChangeFile}
            handleChangeDescription = {this.handleChangeDescription}
            handleChangeTotal = {this.handleChangeTotal}
            handleChangeName = {this.handleChangeName}
            handleLabelClick = {this.handleLabelClick}
            addReceipt = {this.addReceipt}
            startDate = {this.state.startDate}
            closeModal = {this.closeModal}
          />
        </div>
      </div>
    );
  }
}
