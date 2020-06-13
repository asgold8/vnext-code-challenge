import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TEXTS } from '../shared/constants';
import EventSelector from './components/EventSelector';
import EventCard from './components/EventCard';
import './App.css';

const App = () => {
  return (
    <div>
      <h1>{TEXTS.HOME_TITLE}</h1>
      <Router>
        <Switch>
          <Route path="/:event?/:eventId?">
            <EventSelector />
            <EventCard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
