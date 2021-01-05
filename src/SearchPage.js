import React from 'react';
import './SearchPage.css';
import SearchBar from './SearchBar';



class SearchPage extends React.Component {
  render() {
    return(
      <div>
        <h1 className="jumbotron">Warframe Scraper</h1>
        <SearchBar />
      </div>
    );
  }
}

export default SearchPage;
