import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Select, MenuItem } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { TEXTS } from '../../shared/constants';
import { Communities } from '../../collections/communities';

const EventSelector = () => {
  const location = useLocation();
  const { eventId } = useParams();
  const isLandingPage = location.pathname === '/' ? '1': null;
  const [selectedEvent, setSelectedEvent] = useState(isLandingPage || eventId);

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
            onChange={e => setSelectedEvent(e.target.value)}
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
                <h2>{event.name}</h2>
              </MenuItem>
            ))}
            <MenuItem key={1} value={1}>
            <h2>{TEXTS.DEFAULT_EVENT}</h2>
            </MenuItem>
          </Select>
          {/* <h2>{events.find(event => event._id === selectedEvent)?.name}</h2> */}
        </form>
      )}
    </div>
  );
};

export default EventSelector;
