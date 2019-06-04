import React from 'react';

export default class ReceiptModel extends React.Component {

    render(){
        return(
            <div className='grid-item receipt' key={this.props.receipt.id}>
                    <div className='remove-item'>
                      <button className='remove-item-btn' onClick={(e) => this.props.removeItem(this.props.receipt.id, e)}><i className='fas fa-trash'></i></button>
                    </div>
                    <div className='receipt-container'>
                      
                      <div className='gird-item file-img-container'>
                        <i className={this.props.getFileType(this.props.receipt.type)}></i>
                      </div>
                      <div className='grid-item details'>
                        <div className='name detail'>{this.props.receipt.name}</div>
                        <div className='date detail'>{this.props.receipt.date}</div>
                        <div className='total detail'>${this.props.receipt.total}</div>
                        <div className='category detail'>{this.props.receipt.category}</div>
                        <div className='description detail'>{this.props.receipt.description}</div>
                      </div>
                    </div>
                  </div>
        )
    }
}