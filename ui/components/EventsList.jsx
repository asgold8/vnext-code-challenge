import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import {
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  Link
} from 'react-router-dom';

import { TEXTS } from '../../shared/constants';
import { Communities } from '../../collections/communities';

import EventCard from './EventCard';

const EventsList = () => {
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

  return (
    <div>
      {commLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <ul>
            <li key={1}>{TEXTS.DEFAULT_EVENT}</li>
            {events.map(event => (
              <li key={event._id}>
                <Link
                  to={{
                    pathname: `/event/${event._id}`,
                    state: { event },
                  }}
                >
                  {event.name}
                </Link>
              </li>
            ))}
          </ul>
          <Switch>
            <Route path="/event/:eventId" exact>
              <EventCard />
            </Route>
          </Switch>
        </form>
      )}
    </div>
  );
};

export default EventsList;
