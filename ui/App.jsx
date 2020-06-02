import React from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { TEXTS } from '../shared/constants';
import Events from './components/Events';
import EventSelector from './components/EventSelector';
import EventCard from './components/EventCard';
//import history from './history';

const App = () => {
  const history = useHistory();
  return (
    <div>
      <h1>{TEXTS.HOME_TITLE}</h1>
      {/* <Router history={history}> */}
      <Router>
        <Switch>
          <Route path="/:event?/:eventId?">
            {/* <Route path="/event/:eventId"></Route> */}
            <EventSelector />
            <EventCard />
            {/* <Events /> */}
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
