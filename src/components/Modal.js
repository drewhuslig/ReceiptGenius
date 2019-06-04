import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NumberFormat from 'react-number-format';

export default class Modal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: ''
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
      this.props.addReceipt(e);
    } 
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
                    <input type='file' name='receiptUpload' ref='fileSelect' className='fileSelect' onChange={e => {this.props.handleChangeFile(e)}} />
                  </div>
                  <br/>
                  <div>
                    Vendor/Retailer*<br/>
                    <input type='text' name='name' ref='name' onChange={e => this.props.handleChangeName(e)}></input>
                  </div>
                  <br/>
                  <div>
                    Transaction Date*<br/>
                    <DatePicker
                    dateFormat='yyy/MM/dd'
                    selected={this.props.startDate} 
                    onChange={this.props.handleChangeDate} /><span className='far fa-calendar'></span>
                  </div>
                  <br/>
                  <div>
                    Receipt total ($USD)*<br/>
                    <NumberFormat thousandSeparator={true} prefix={'$'} ref='total' onValueChange={(values) => {
                      const {formattedValue, value} = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      this.props.handleChangeTotal(value)
                    }}/>
                  </div>
                  <br/>
                  <div className='radio-group'>Category<br/>
                    <input type="radio" className="radio-button" name="category" value='Supplies' id='button1' ref='button1'
                      onChange={this.props.handleChangeOption}/>
                    <label htmlFor="button1" className='radio-label' onClick={e => this.props.handleLabelClick(e, this.refs.button1)}>Supplies</label>
                    <input type="radio" className="radio-button" name="category" value='Subscriptions' id='button2' ref='button2'
                      onChange={this.props.handleChangeOption}/>
                    <label htmlFor="button2" className='radio-label' onClick={e => this.props.handleLabelClick(e, this.refs.button2)}>Subscriptions</label>
                    <input type="radio" className="radio-button" name="category" value='Personal' id='button3' ref='button3'
                      onChange={this.props.handleChangeOption}/>
                    <label htmlFor="button3" className='radio-label' onClick={e => this.props.handleLabelClick(e, this.refs.button3)}>Personal</label>
                  </div>
                  <br/>
                  <div>
                    Description<br></br>
                    <input type='text' name='description' onChange={e => this.props.handleChangeDescription(e)}></input><br/>
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