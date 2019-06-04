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
      data: [],
      
    }
  }

  //Retrieves data for receipts before component mounts
  componentWillMount = () => {
    return Axios.get('/receipts')
      .then(res => {
        this.calculateTotal(res.data)
        this.setState({
          data: res.data
        })
      })
  }

  //Calculates total of all receipts
  calculateTotal = (data) => {
    let t = 0;
    data.forEach(element => {
      t += element.total;
    });
    this.setState({total: parseFloat(t).toFixed(2)})
  }
  
  //Removes receipt from DB and updates state
  removeItem = (id, e) => {
    e.preventDefault();
    console.log(id);
    Axios.delete('/receipts', {data: {id: id}})
      .then(res => {
        this.setState({data: res.data}, this.calculateTotal(res.data))
      })
  }

  //Displays modal component
  openModal = e => {
    e.preventDefault();
    const modal = this.refs.modal;
    modal.style.display = 'block';
  }
  
  //Adds receipt to DB and updates State
  addReceipt = (e, formData) => {
    this.closeModal(e);
    Axios.post('/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      this.setState({data: res.data}, this.calculateTotal(res.data));
    })
  }

  //Closes model when clicked outside of form area
  outsideClick = (e) => {
    const modal = this.refs.modal;
    
    if (e.target ===  modal){
      e.preventDefault();
      this.refs.modalComponent.setState({message: ""})
      modal.style.display = 'none';
    }
  }

  //Hides model
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
            addReceipt = {this.addReceipt}
            closeModal = {this.closeModal}
          />
        </div>
      </div>
    );
  }
}
