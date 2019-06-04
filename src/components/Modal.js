import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NumberFormat from 'react-number-format';

export default class Modal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: '',
      selectedOption: "",
      description: '',
      startDate: new Date()
    }
    
  }
  
  //Calls close modal function and resets message for form
  onCloseModal = (e) => {
    this.setState({message: ""});
    this.refs.form.reset();
    this.props.closeModal(e);
  }

  //Sends call to add receipt to DB
  onAddReceipt = (e) => {
    //Rudimentary form validation if required fields aren't present
    if (this.refs.total.state.numAsString === "" || this.refs.fileSelect.files.length === 0 || this.refs.name.length < 1){
      e.preventDefault();
      this.setState({message: 'Please fill all required feilds!'})
    } else {
      this.setState({message: ""});
      this.refs.form.reset();
      let formData = new FormData()
      formData.append('file', this.state.file);
      formData.append('name', this.state.name);
      formData.append('total', this.state.total);
      formData.append('data', this.state.startDate.toLocaleDateString("en-US"))
      formData.append('category', this.state.selectedOption);
      formData.append('description', this.state.description);
      this.props.addReceipt(e, formData);
    } 
  }

  //Functions to handle form data in modal
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

  //Toggles radio button off if already clicked
  handleLabelClick = (e, button) => {
    if(button.checked){
      e.preventDefault();
      button.checked = false;
      this.setState({selectedOption: ""})
    }
  }

  //Used for number formater
  handleTotal = (e) => {
    this.setState({
      total: e.target.value
    }, function() {
      e.target.value = e.target.value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    })
  }

  //Handles date for date picker
  handleChangeDate = date => {
    this.setState({
      startDate: date
    })
  }


    render(){
        return(
            
            <div className='modal-content'>
              <div className='modal-header clearfix'>
                <div className='modal-title'>Add Receipt</div>
                <span className='closeBtn fas fa-times' onClick={e => this.onCloseModal(e)}></span>
              </div>
              <div className='message'>{this.state.message}</div>
              <div className='modal-form'>
                <form ref='form'>
                  <div>
                    Receipt file*<br/>
                    <input type='file' name='receiptUpload' ref='fileSelect' className='fileSelect' onChange={e => {this.handleChangeFile(e)}} />
                  </div>
                  <br/>
                  <div>
                    Vendor/Retailer*<br/>
                    <input type='text' name='name' ref='name' onChange={e => this.handleChangeName(e)}></input>
                  </div>
                  <br/>
                  <div>
                    Transaction Date*<br/>
                    <DatePicker
                    dateFormat='yyy/MM/dd'
                    selected={this.state.startDate} 
                    onChange={this.handleChangeDate} /><span className='far fa-calendar'></span>
                  </div>
                  <br/>
                  <div>
                    Receipt total ($USD)*<br/>
                    <NumberFormat thousandSeparator={true} prefix={'$'} ref='total' onValueChange={(values) => {
                      const {formattedValue, value} = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      this.handleChangeTotal(value)
                    }}/>
                  </div>
                  <br/>
                  <div className='radio-group'>Category<br/>
                    <input type="radio" className="radio-button" name="category" value='Supplies' id='button1' ref='button1'
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button1" className='radio-label' onClick={e => this.handleLabelClick(e, this.refs.button1)}>Supplies</label>
                    <input type="radio" className="radio-button" name="category" value='Subscriptions' id='button2' ref='button2'
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button2" className='radio-label' onClick={e => this.handleLabelClick(e, this.refs.button2)}>Subscriptions</label>
                    <input type="radio" className="radio-button" name="category" value='Personal' id='button3' ref='button3'
                      onChange={this.handleChangeOption}/>
                    <label htmlFor="button3" className='radio-label' onClick={e => this.handleLabelClick(e, this.refs.button3)}>Personal</label>
                  </div>
                  <br/>
                  <div>
                    Description<br></br>
                    <input type='text' name='description' onChange={e => this.handleChangeDescription(e)}></input><br/>
                  </div>
                  
                  * Indicates a required field<br/>
                  <div className='form-footer'>
                    <button className='float-right btn' onClick={e => this.onAddReceipt(e)}>Add receipt</button>
                    <button className='float-right btn' onClick={e => this.onCloseModal(e)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
        )
    }
}