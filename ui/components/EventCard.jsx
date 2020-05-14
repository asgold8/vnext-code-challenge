import React from 'react';
import { useLocation } from 'react-router-dom';
import { withTracker,useTracker } from 'meteor/react-meteor-data';
import { People } from '../../collections/people';

const EventCard = props => {
  const location = useLocation();
  const event = location.state ? location.state.event : null;

  const [pplLoading,people] = useTracker(() => {
      if(event){
    const handle = Meteor.subscribe('people');
    const p = People.find({communityId: event._id}).fetch();    
    return [!handle.ready(),p];
      }
      return [null,null];
  });

  return (
    <div>
      {event && !pplLoading ? (
        <>
          <h2>{event.name}</h2>
          <ul>
            {people.map(person => (
              <li key={person._id}>{person.firstName}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
};

export default EventCard;
