import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Axios from 'axios';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      total: 0,
      startDate: new Date(),
      data: [],
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

  componentDidMount = () => {
    
  }

  calculateTotal = (data) => {
    let t = 0;
    data.forEach(element => {
      t += element.total;
    });
    this.setState({total: parseFloat(t).toFixed(2)})
  }

  handleChange = date => {
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
        this.setState({data: res.data})
      })
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
    this.refs.form.reset();
  }

  outsideClick = (e) => {
    const modal = this.refs.modal;
    if (e.target ===  modal){
      e.preventDefault();
      modal.style.display = 'none';
      this.refs.form.reset();
    }
  }

  handleChangeOption = (changeEvent) => {
    this.setState({
      selectedOption: changeEvent.target.value
    }, () => {
      console.log(this.state);
    })
  }

  handleChangeFile = (e) => {
    this.setState({file: e.target.files[0]})
  }
  
  addReceipt = (e) => {
    this.closeModal(e)
    let formData = new FormData()
    formData.append('file', this.state.file);
    formData.append('name', this.state.name);
    formData.append('total', this.state.total);
    formData.append('data', this.state.startDate.toLocaleDateString("en-US"))
    formData.append('category', this.state.selectedOption);
    formData.append('description', this.state.description);
    this.refs.form.reset();
    Axios.post('/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      this.setState({data: res.data});
    })
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
                <form ref='form'>
                  <div>
                    Receipt file*<br/>
                    <input type='file' name='receiptUpload' ref='fileSelect' className='fileSelect' onChange={e => {this.handleChangeFile(e)}} />
                  </div>
                  <br/>
                  <div>
                    Vendor/Retailer*<br/>
                    <input type='text' name='name' onChange={e => this.setState({name: e.target.value})}></input>
                  </div>
                  <br/>
                  <div>
                    Transaction Date*<br/>
                    <DatePicker
                    dateFormat='yyy/MM/dd'
                    selected={this.state.startDate} 
                    onChange={this.handleChange} /><span className='far fa-calendar'></span>
                  </div>
                  <br/>
                  <div>
                    Receipt total ($USD)*<br/>
                    <input type='number' name='total' onChange={e => this.setState({total: e.target.value})}></input>
                  </div>
                  <br/>
                  <div className='radio-group'>Category<br/>
                    <input type="radio" className="radio-button" name="category" value='Supplies' id='button1'
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button1" className='radio-label'>Supplies</label>
                    <input type="radio" className="radio-button" name="category" value='Subscriptions' id='button2' 
                      checked={this.state.selectedOption === 'Subscriptions'} 
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button2" className='radio-label'>Subscriptions</label>
                    <input type="radio" className="radio-button" name="category" value='Personal' id='button3' 
                      checked={this.state.selectedOption === 'Personal'} 
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button3" className='radio-label'>Personal</label>
                  </div>
                  <br/>
                  <div>
                    Description<br></br>
                    <input type='text' name='description' onChange={e => this.setState({description: e.target.value})}></input><br/>
                  </div>
                  
                  * Indicates a required field<br/>
                  <div className='form-footer'>
                    <button className='float-right btn' onClick={e => this.addReceipt(e)}>Add receipt</button>
                    <button className='float-right btn' onClick={e => this.closeModal(e)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <hr></hr>

          <div className='container'>
            {this.state.data.map(receipt => {
                return (
                  <div className='grid-item receipt' key={receipt.id}>
                    <div className='remove-item'>
                      <button className='remove-item-btn' onClick={(e) => this.removeItem(receipt.id, e)}><i className='fas fa-trash'></i></button>
                    </div>
                    <div className='receipt-container'>
                      
                      <div className='gird-item file-img-container'>
                        <i className={this.getFileType(receipt.type)}></i>
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
