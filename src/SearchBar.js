import React from 'react';
import './SearchBar.css';
import { Link, withRouter } from 'react-router-dom';
import icon from './img/search-icon.png';
import Autosuggest from 'react-autosuggest'

let item_list = {}

const getSuggestions = ((value) => {
  console.log(value)
  if(!value) return []
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : item_list.filter(item =>
    item.name.toLowerCase().slice(0, inputLength) === inputValue
  ).slice(0, 6);
});

const getSuggestionValue = ((suggestion) => suggestion.name)

const renderSuggestion = ((suggestion) => (
  /**
    * @param {string} suggestion
    */
  <div className="suggestion" >{suggestion.name}</div>
))


class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      enterPressed: false,
      suggestions: [],
    };

    this.onChange = (event, {newValue}) => {
      newValue = newValue.replace("&","and")
      this.setState({ value: newValue });
    }
    this.updateQuery = this.updateQuery.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.retrieveAllItems()
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentDidUpdate(prevProps, prevState) {
    /**
    * @param {dict, dict} props
    */
    if(prevState.enterPressed !== this.state.enterPressed) {
      this.setState({ enterPressed: false })
    }
  }
  async retrieveAllItems() {
    const result = await fetch('/api/items');
    const json = await result.json();
    item_list = json
  }

  handleKeyDown(event) {
    /**
     * @param {event} event
     */
    const code = (event.keyCode ? event.keyCode : event.which);
    if (code === 13) {
      this.setState({ enterPressed: true });
    }
  }

  updateQuery(event, {newValue}) {
    /**
     * @param {event} event
     */
    this.setState({ query: newValue });
  }

  onSuggestionsFetchRequested = (({value}) => {
    /**
     * @param {string} value
     */
    this.setState({ suggestions : getSuggestions(value) })
  })

  onSuggestionsClearRequested = (() =>{
    /**
     * This function clears the suggestions when we click out of the search bar
     */
    this.setState({ suggestions : [] })
  })

  render() {
    /*This will give me something to avoid dom warnings*/
    const url = window.location.href;
    const newQuery = url.substring(30);
    const { value, enterPressed, suggestions } = this.state;

    if(enterPressed && value && value !== newQuery && value.trim() !== "") {
      this.props.history.push("/items/" + value);
    }

    const inputProps = {
      placeholder: "Search and Item",
      value,
      onChange: this.onChange
    }
    return(
      <div>
        <div className="jumbotron autosuggest-container">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <Link to={"/items/" + value} ><img src={icon} height="30" width="30" alt="Search Button"></img></Link>
        </div>
      </div>

    );
  }
}

export default withRouter(SearchBar);
