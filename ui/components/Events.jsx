import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import {
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  Link,
  useLocation,
} from 'react-router-dom';
import {Select, MenuItem, InputLabel,FormControl } from '@material-ui/core';

import { TEXTS } from '../../shared/constants';
import { Communities } from '../../collections/communities';

import EventCard from './EventCard';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState("1");

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  console.log(location);

  const [commLoading, events] = useTracker(() => {
    const handle = Meteor.subscribe('communities');
    const comms = Communities.find({}).fetch();
    return [!handle.ready(), comms];
  });

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <div>
      {commLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Select
            labelId="event-selector-label"
            id="event-selector"
            displayEmpty
            value={selectedEvent}
            onChange={e=>(setSelectedEvent(e.target.value))}
          >
            {events.map(event => (
              <MenuItem
                component={Link}
                to={{
                  pathname: `/event/${event._id}`,
                  state: { event },
                }}
                key={event._id}
                value={event._id}
              >
                <h1>{event.name}</h1>
              </MenuItem>
            ))}
            <MenuItem key={1} value={1}><h1>{TEXTS.DEFAULT_EVENT}</h1></MenuItem>
          </Select>
          <Switch>
            <Route path="/event/:eventId" >
              <EventCard />
            </Route>
          </Switch>
        </form>
      )}
    </div>
  );
};

export default Events;
