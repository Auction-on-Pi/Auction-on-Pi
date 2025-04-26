import { Switch, Route } from 'react-router-dom';
import Home from './components/Home'; // Adjust path as needed
import AuctionApp from './components/AuctionApp'; // Adjust path

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/app" component={AuctionApp} />
      </Switch>
    </div>
  );
}

export default App;
