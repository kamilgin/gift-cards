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
      {options.map(option => option === '-1' ? false : <option key={option}>{option}</option>)}
    </select>
  </div>
);

const AmountRadioGroup = ({ name, options, radioStyle, handleChange, selectedValue }) => (
  <div id={`radio-group-${name}`} className={`radio-group ${radioStyle}`}>
    {options.map(option => (
      <div className={`radio-btn-${name}`} key={option}>
        <input
          type='radio'
          id={`radio-btn-amount-${option}`}
          value={option}
          checked={selectedValue === option}
          onChange={handleChange}
        />
        <label className='radio-btn-label' htmlFor={`radio-btn-amount-${option}`}>
          {option}
        </label>
      </div>
    ))}
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
    inputs = <div>
      <AmountRadioGroup 
        name='amount'
        options={cardDenominations}
        radioStyle='amount-buttons'
        selectedValue={value}
        handleChange={handleChange}
      />
      <Input 
        label={label}
        type={type}
        id={'amount-text-field'}
        value={value}
        handleChange={handleChange}
      />
    </div>;
  } else {
    inputs = <AmountRadioGroup
      name='amount'
      options={cardDenominations}
      radioStyle='amount-buttons'
      selectedValue={value}
      handleChange={handleChange}
    />
  }
  return inputs;
}

class GiftCardForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.updateSelection(e);
  }

  handleSubmit(e) {
    e.preventDefault();
    
  }

  render() {
    return (
      <form id='gift-card-form' onSubmit={this.handleSubmit}>
        <AmountInput 
          label='Amount'
          type='number'
          id='amount'
          value={this.props.selectedAmount}
          handleChange={this.handleChange}
          cardDenominations={this.props.cardDenominations}
        />
        <Select
          label='Quantity'
          type='number'
          id='quantity'
          value={this.props.selectedQuantity}
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
    this.handleFilter = this.handleFilter.bind(this);
  }

  handleChange(e) {
    this.props.onCardSelect(e);
  }

  handleFilter(e) {
    this.props.onFilter(e);
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
            return (
              <button 
                className={`btn btn_filter ${this.props.filterActive === category ? 'filter-active' : ''}`}
                key={category}
                value={category}
                onClick={this.handleFilter}
              >
                {category}
              </button>);
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

const CardsList = [
  ["10000", "Plain red card", ["25", "50", "100", "-1"], [], 'card1.png'],
  ["10001", "$100 Card - Potatoes", ["100"], ['Fixed Amount'], 'card2.png'],
  ["10002", "Grilled Fish Card", ["-1"], ['Custom Amount'], 'card3.png'],
  ["10003", "Salmon & Asparagus Card", ["25", "50", "100"], ['Fixed Amount', 'Birthday'], 'card4.png'],
  ["10004", "Birthday Card", ["25", "50", "100", "150", "200", "-1"], ['Birthday', 'Custom Amount'], 'card5.png'],
  ["10005", "Plain Potatoes Card", ["5", "10", "25", "50"], ['Fixed Amount'], 'card6.png']
];

class GiftCardStore extends Component {
  constructor(props) {
    super(props);
    let firstCard = CardsList[0];
    this.state = {
      'cardsList': CardsList,
      'filteredCardsList': CardsList,
      'cardParamID': firstCard[0],
      'cardParamTitle': firstCard[1],
      'cardParamDenominations': firstCard[2],
      'cardParamCategory': firstCard[3],
      'cardParamImage': firstCard[4],
      'selected-amount': '',
      'selected-quantity': '',
      'selected-cardImage': '',
      'selected-msgTo': '',
      'selected-msgFrom': '',
      'selected-msgText': '',
      'filterActive': ''
    };
    this.handleCardSelect = this.handleCardSelect.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  handleCardSelect(e) {
    this.setState({
      cardParamID: e.target.dataset.cardId,
      cardParamTitle: e.target.dataset.cardTitle,
      cardParamDenominations: e.target.dataset.cardDenominations.split(','),
      cardParamImage: e.target.dataset.cardImage
    })
  }

  handleCardSettings(e) {
    this.setState({
      'selected-amount': e.target.value
    });
  }

  handleFilter(e) {
    let filterBtn = e.target;
    let category = filterBtn.value;
    let filteredCardsList = CardsList.filter(card => card[3].indexOf(category));
    filterBtn.classList.add('active-filter');
    this.setState({
      'filterActive': category,
      'filteredCardsList': filteredCardsList
    });
  }

  render() {
    let categoryListFull = this.state.cardsList.map(card => card[3]).flat();
    let cardCategories = categoryListFull.filter((value, index) => categoryListFull.indexOf(value) === index);
    cardCategories.unshift('All Cards');

    return (<div id='container__gift-card-form' className='container1024'>
      <GiftCardBrowser 
        cardsList={this.state.filteredCardsList}
        cardCategories={cardCategories}
        filterActive={this.state.filterActive}
        onCardSelect={this.handleCardSelect}
        onFilter={this.handleFilter}
        cardTitle={this.state.cardParamTitle}
        cardImage={this.state.cardParamImage}
      />
      <GiftCardForm 
        updateSelection={this.handleCardSelect}
        cardDenominations={this.state.cardParamDenominations}
      />
    </div>);
  }
}

const wrapper = document.getElementById('container__app');
wrapper ? ReactDOM.render(<GiftCardStore />, wrapper) : false;
