import React from 'react';
import ReactDOM from 'react-dom';
import { create } from 'react-test-renderer'
import App from './App';
import Modal from './components/Modal';
import ReceiptModel from './components/ReceiptModel';
import ReportTotal from './components/ReportTotal';
import axios from 'axios';

jest.mock('axios');

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

describe('ReportTotal component', () => {
  it('shows total of all receipt totals', async () => {
    const component = create(<ReportTotal total={123456789}/>);
    const root = component.root;
    const div = root.findAll(element => element.type ==='div');
    console.log(div[0].props.children[1].props.value);
    expect(div[0].props.children[0] + div[0].props.children[1].props.value).toBe('Report Total: 123456789');
  })
})
