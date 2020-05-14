import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory, Link, withRouter, Redirect } from 'react-router-dom';

import { TEXTS } from '../../shared/constants';
import { Communities } from '../../collections/communities';

import EventCard from './EventCard';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const match = useRouteMatch();
  const history = useHistory();

  const [commLoading, events] = useTracker(() => {
    const handle = Meteor.subscribe('communities');
    const comms = Communities.find({}).fetch();
    return [!handle.ready(), comms];
  });

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleEventSelect = e => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.value !== TEXTS.DEFAULT_EVENT) {
      setSelectedEvent({
        id: selectedOption.value,
        name: selectedOption.text,
      });
      history.push(`/event/${selectedOption.value}`);
    }
  };

  return (
    <div>
      {commLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <select className="event-selector" onChange={handleEventSelect}>
            <option>{TEXTS.DEFAULT_EVENT}</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
          <Switch>
            <Route path="event/:eventId" exact>
              <EventCard event={selectedEvent} />
            </Route>
          </Switch>
        </form>
      )}
    </div>
  );
};

export default Events;
