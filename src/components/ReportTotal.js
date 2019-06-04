import React from 'react';
import NumberFormat from 'react-number-format';

export default class ReportTotal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            total: 0
        }
    }

    render(){
        return (
            <div className='report-total'>
              Report Total: <NumberFormat value={this.state.total || this.props.total} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
        )
    }
}