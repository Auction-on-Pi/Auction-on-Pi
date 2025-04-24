import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AuctionList from './components/AuctionList';
import AuctionDetail from './components/AuctionDetail';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route exact path="/" component={AuctionList} />
        <Route path="/auction/:id" component={AuctionDetail} />
      </Switch>
    </Router>
  );
}

export default App;
