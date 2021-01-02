import './App.css';
import './bootstrap.min.css';
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SearchPage from './SearchPage';

function App() {
  return (
    <Router>
      <Header />
      <Route exact path="/" component={SearchPage} />
      <Footer />
    </Router>
  );
}

export default App;
