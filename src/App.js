import './App.css';
import './bootstrap.min.css';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SearchPage from './SearchPage';
import WatchList from './WatchList';
import ItemInfo from './ItemInfo';

function App() {
  return (
    <Router>
      <Header />
      <Route exact path="/" component={SearchPage} />
      <Route path="/watchlist" component={WatchList}/>
      <Route path="/items/:itemName" component={ItemInfo}/>
      <Footer />
    </Router>
  );
}

export default App;
