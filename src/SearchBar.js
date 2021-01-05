import React from 'react';
import './SearchBar.css';
import { Link, withRouter } from 'react-router-dom';
import icon from './img/search-icon.png';

class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      query: "",
      enterPressed: false,
    };
    this.updateQuery = this.updateQuery.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.enterPressed !== this.state.enterPressed) {
      this.setState({enterPressed: false})
    }
  }

  handleKeyDown(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) {
      this.setState({ enterPressed: true });
    }
  }

  updateQuery(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    /*This will give me something to avoid dom warnings*/
    const url = window.location.href;
    const newQuery = url.substring(30);
    

    if(this.state.enterPressed && this.state.query !== newQuery) {
      this.props.history.push("/items/" + this.state.query);
    }
    
    return(
      <div>
        <div className="jumbotron form-group">
          <input type="text"  className="form-control" value={this.state.query} onChange={this.updateQuery} />
          <Link to ={"/items/" + this.state.query} ><img src={icon} height="30" width="30" alt="Search Button"></img></Link>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchBar);
