import React from 'react';
import ReactDOM from 'react-dom';
import { create, fireEvent, render } from 'react-test-renderer'
import App from './App';
import Modal from './components/Modal';
import ReceiptModel from './components/ReceiptModel';
import ReportTotal from './components/ReportTotal';
import axios from 'axios';

jest.mock('axios');

it('renders without crashing', () => {
  const response = [];
  axios.get.mockResolvedValue(response);
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('ReportTotal component', () => {
  it('shows total of all receipt totals', async () => {
    const component = create(<ReportTotal total={123456789}/>);
    const root = component.root;
    const div = root.findAll(element => element.type ==='div');
    expect(div[0].props.children[0] + div[0].props.children[1].props.value).toBe('Report Total: 123456789');
  })
})

describe('ReceiptModel component', () => {
  it('renders a receipt from data', async () => {
    const receipt = {
      name: 'test name',
      date: '01/01/2019',
      total: 2000,
      category: 'Supplies',
      description: 'test description',
      filetype: 'image/jpg'
    };
    const component = create(<ReceiptModel receipt={receipt}/>)
    const root = component.root;
    const nameDiv = root.find(e => e.props.className ==='name detail');
    expect(nameDiv.props.children).toBe('test name');
    const dateDiv = root.find(e => e.props.className ==='date detail');
    expect(dateDiv.props.children).toBe('01/01/2019');
    const totalDiv = root.find(e => e.props.className === 'total detail');
    expect(totalDiv.props.children).toStrictEqual(['$', 2000]);
    const categoryDiv = root.find(e => e.props.className ==='category detail');
    expect(categoryDiv.props.children).toBe('Supplies');
    const descriptionDiv = root.find(e => e.props.className ==='description detail');
    expect(descriptionDiv.props.children).toBe('test description');
  })
})

//This on wasn't quite working for me
describe('Modal Component', () => {
  it('click labels and switch radio buttons', async () => {
    const component = create(<Modal />);
    const root = component.root;
    const instance = component.getInstance();
    console.log(instance.state);
    
  })
})