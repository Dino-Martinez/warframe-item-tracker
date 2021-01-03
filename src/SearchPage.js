import React from 'react';
import './SearchPage.css';
import {Link} from 'react-router-dom';
import icon from './img/search-icon.png';

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      query: ""
    };
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery(event) {
    this.setState({
      query: event.target.value
    });
  }
  
  render() {
    return(
      <div>
        <h1 className="jumbotron" >Warframe Scraper</h1>
        <div className="jumbotron form-group">
          <input type="text"  className="form-control" value={this.state.query} onChange={this.updateQuery} />
          <Link to ={"/items/"+this.state.query} ><img src={icon} height="30" width="30" alt="Search Button"></img></Link>
        </div>
      </div>
    );
  }
}

export default SearchPage;
