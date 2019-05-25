import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import json from './reciept_data.json';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      total: 0,
      data: json,
      startDate: new Date()
    }
  }


  componentWillMount = () => {
    let t = 0;
    this.state.data.forEach(element => {
      t += element.total;
    });

    this.setState({
      total: parseFloat(t).toFixed(2)
    })
  }

  handleChange = date => {
    this.setState({
      startDate: date
    }, console.log(this.state))
  }

  getFileType(type) {
    if (type === 'application/pdf') {
      return 'far fa-file-pdf file-image'
    }
    return 'far fa-file-image file-image'
  }

  removeItem = (id, e) => {
    e.preventDefault();
    let result = this.state.data.filter(m => m['id'] !== id)
    this.setState({data: result});
  }

  openModal = (e) => {
    e.preventDefault();
    const modal = this.refs.modal;
    modal.style.display = 'block';
  }

  closeModal = (e) => {
    e.preventDefault();
    const modal = this.refs.modal;
    modal.style.display = 'none';
  }

  outsideClick = (e) => {
    e.preventDefault();
    const modal = this.refs.modal;
    if (e.target ===  modal){
      modal.style.display = 'none'
    }
  }

  render(){
    return (
      <div className="App">
        <header className='header'>
          <i className='fas fa-receipt'></i> Receipt<strong>Genius</strong>
        </header>

        <div className='body'>
          <div className='clearfix'>
            <button className='add-receipt-btn' onClick={e => this.openModal(e)}><i className='fas fa-plus'> Add receipt</i></button>
            <div className='report-total'>
              Report Total: ${this.state.total}
            </div>
          </div>

          <div className='modal' ref='modal' onClick={e => this.outsideClick(e)}>
            <div className='modal-content'>
              <div className='modal-header clearfix'>
                <div className='modal-title'>Add Receipt</div>
                <span className='closeBtn fas fa-times' onClick={e => this.closeModal(e)}></span>
              </div>
              
              <div className='modal-form'>
                <form>
                  Receipt file*<br></br>
                  <input type='file' name='file'></input><br></br>
                  Vendor/Retailer*<br></br>
                  <input type='text' name='name'></input><br></br>
                  Transaction Date*<br></br>
                  <DatePicker
                  dateFormat='yyy/MM/dd'
                  selected={this.state.startDate} 
                  onChange={this.handleChange} /><br></br>
                  Receipt total ($USD)*<br></br>
                  <input type='number' name='total'></input><br></br>
                  Category<br></br>
                  <input></input><br></br>
                  Description<br></br>
                  <input type='text' name='description'></input><br></br>
                  * Indicates a required feild<br></br>

                </form>
              </div>
            </div>
          </div>

          <hr></hr>

          <div className='container clearfix'>
            {this.state.data.map(receipt => {
                return (
                  <div className='grid-item receipt' key={receipt.id}>
                    <div className='remove-item'>
                      <button className='remove-item-btn' onClick={(e) => this.removeItem(receipt.id, e)}><i className='fas fa-trash'></i></button>
                    </div>
                    <div className='receipt-container'>
                      
                      <div className='gird-item file-img-container'>
                        <i className={this.getFileType(receipt.file.type)}></i>
                      </div>
                      <div className='grid-item details'>
                        <div className='name detail'>{receipt.name}</div>
                        <div className='date detail'>{receipt.date}</div>
                        <div className='total detail'>${receipt.total}</div>
                        <div className='category detail'>{receipt.category}</div>
                        <div className='description detail'>{receipt.description}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
