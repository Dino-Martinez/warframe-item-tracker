import React from 'react';
import './SearchPage.css';
import {Link} from 'react-router-dom';

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
      <div className="jumbotron form-group">
        <input type="text"  className="form-control" value={this.state.query} onChange={this.updateQuery} />
        <Link to ={"/items/"+this.state.query} >search</Link>
      </div>


    );
  }
}

export default SearchPage;
