import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Input = ({ label, type, id, value, handleChange }) => (
  <div className='form-group'>
    <label className='form-label' htmlFor={id}>{label}</label>
    <input
      type={type}
      className='form-field'
      id={id}
      value={value}
      onChange={handleChange}
      required
    />
  </div>
);

const Select = ({ label, id, value, options, handleChange }) => (
  <div className='form-group'>
    <label className='form-label' htmlFor={id}>{label}</label>
    <select
      className='form-field'
      id={id}
      value={value}
      onChange={handleChange}
      required
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  </div>
);

// Input.propTypes = {
//   label: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   handleChange: PropTypes.func.isRequired
// }

const AmountInput = ({label, type, id, value, handleChange, cardDenominations}) => {
  let custom = cardDenominations.indexOf('-1') >= 0 ? true : false;
  let customOnly = custom && cardDenominations.length === 1 ? true : false;
  let inputs;

  if(customOnly) {
    inputs = <Input 
      label={label}
      type={type}
      id={id}
      value={value}
      handleChange={handleChange}
    />;
  } else if(custom) {
    inputs = <div><Input 
      label={label}
      type={type}
      id={'amount-text-field'}
      value={value}
      handleChange={handleChange}
    /><Select 
      id={id}
      value={value}
      handleChange={handleChange}
      options={cardDenominations}
    /></div>;
  } else {
    cardDenominations.map((amount) => {
      inputs = <Select 
        id={id}
        value={value}
        handleChange={handleChange}
        options={cardDenominations}
      />
    });
  }
  return inputs;
}

class GiftCardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      quantity: '',
      cardImage: '',
      msgTo: '',
      msgFrom: '',
      msgText: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <form id='gift-card-form' onSubmit={this.handleSubmit}>
        <AmountInput 
          label='Amount'
          type='number'
          id='amount'
          value={this.state.amount}
          handleChange={this.handleChange}
          cardDenominations={['5','-1']}
        />
        <Select
          label='Quantity'
          type='number'
          id='quantity'
          value={this.state.quantity}
          options={[1,2,3,4,5,6,7,8,9,10]}
          handleChange={this.handleChange}
        />
        <input type='submit' className='btn btn-submit' value='Add to Cart'/>
      </form>
    );
  }
}

class GiftCardBrowser extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onCardSelect(event);
  }

  render() {
    return(
      <section id="card_browser__container">
        <div id="card_preview__container">
          <img
            className='card_preview__image'
            alt={this.props.cardTitle}
            src={'/src/images/' + this.props.cardImage}
          />
        </div>
        <div id="card_category__container">
          {this.props.cardCategories.map((category) => {
            return <button className='btn btn_category' key={category} value={category}>{category}</button>
          })}
        </div>
        <div id="cards__container">
          {this.props.cardsList.map((card) => {
            let cardID = card[0];
            let cardTitle = card[1];
            let cardDenominations = card[2]
            let cardImage = card[4];

            return (
              <div className='card' key={cardID} >
                <input 
                  id={cardID} 
                  type='radio' 
                  name='cardOptions' 
                  className='card_option' 
                  onChange={this.handleChange} 
                  data-card-id={cardID}
                  data-card-title={cardTitle}
                  data-card-denominations={cardDenominations}
                  data-card-image={cardImage}
                />
                <label htmlFor={cardID}>
                  <img id={'card_image_' + cardID} src={'/src/images/' + cardImage} />
                  <span className='cardTitle'>{cardTitle}</span>
                </label>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

let cardsList = [
  ["10000", "Plain red card", [25, 50, 100, -1], [], 'card1.png'],
  ["10001", "$100 Card - Potatoes", [100], ['Fixed Amount'], 'card2.png'],
  ["10002", "Grilled Fish Card", [-1], ['Custom Amount'], 'card3.png'],
  ["10003", "Salmon & Asparagus Card", [25, 50, 100], ['Fixed Amount'], 'card4.png'],
  ["10004", "Birthday Card", [25, 50, 100, 150, 200, -1], ['Birthday', 'Custom Amount'], 'card5.png'],
  ["10005", "Plain Potatoes Card", [5, 10, 25, 50], ['Fixed Amount'], 'card6.png']
];
let categoryListFull = cardsList.map(card => card[3]).flat();
let cardCategories = categoryListFull.filter((value, index) => categoryListFull.indexOf(value) === index);

class GiftCardStore extends Component {
  constructor(props) {
    super(props);
    let firstCard = this.props.cardsList[0];
    this.state = {
      'cardParamID': firstCard[0],
      'cardParamTitle': firstCard[1],
      'cardParamDenominations': firstCard[2],
      'cardParamCategory': firstCard[3],
      'cardParamImage': firstCard[4]
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      'cardParamID': event.target.dataset.cardId,
      'cardParamTitle': event.target.dataset.cardTitle,
      'cardParamDenominations': event.target.dataset.cardDenominations,
      'cardParamImage': event.target.dataset.cardImage
    })
  }

  render() {
    return (<div id='container__gift-card-form' className='container1024'>
      <GiftCardBrowser 
        cardsList={cardsList}
        cardCategories={cardCategories}
        onCardSelect={this.handleChange}
        cardTitle={this.state.cardParamTitle}
        cardImage={this.state.cardParamImage}
      />
      <GiftCardForm />
    </div>);
  }
}

const wrapper = document.getElementById('container__app');
wrapper ? ReactDOM.render(<GiftCardStore cardsList={cardsList}/>, wrapper) : false;
