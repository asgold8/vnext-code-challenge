import React, { forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import MaterialTable from 'material-table';
import { People } from '../../collections/people';
import { Communities } from '../../collections/communities';

import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';

// const tableIcons = {
//   Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
//   Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
//   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
//   Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
//   DetailPanel: forwardRef((props, ref) => (
//     <ChevronRight {...props} ref={ref} />
//   )),
//   Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
//   Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
//   Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
//   FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
//   LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
//   NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
//   PreviousPage: forwardRef((props, ref) => (
//     <ChevronLeft {...props} ref={ref} />
//   )),
//   ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
//   Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
//   SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
//   ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
//   ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
// };

const EventCard = props => {
  // const location = useLocation();
  const { eventId } = useParams();
  // const event = location.state ? location.state.event : null;
  // const [event, setEvent] = React.useState(null);
  // if (location.state && !event) {
  //   setEvent(location.state.event);
  // }
  // if(!event && location.pathname.includes('/event/')){
  //   event = useTracker(()=> {
  //     const handle = Meteor.subscribe('communities');
  //     const eventId = (location.pathname.split('/'));
  //     const comms = Communities.find({}).fetch();
  //     return
  //   });
  // }

  const [pplLoading, people] = useTracker(() => {
    if (eventId) {
      const handle = Meteor.subscribe('people');
      const p = People.find({ communityId: eventId }).fetch();
      return [!handle.ready(), p];
    }
    return [null, null];
  });

  return (
    <div>
      {eventId && !pplLoading ? (
        <>
          <ul>
            {people.map(person => (
              <li key={person._id}>{person.firstName}</li>
            ))}
          </ul>
        </>
        // <MaterialTable
        //   //icons={tableIcons}
        //   title="Attendees"
        //   columns={[
        //     { title: 'Name', field: 'fullName' },
        //     { title: 'Company', field: 'companyName' },
        //     { title: 'Title', field: 'title' },
        //     { title: 'Check-In', field: 'checkInDate' },
        //     { title: 'Check-Out', field: 'checkOutDate' },
        //   ]}
        //   data={people.map(person => ({
        //     fullName: `${person.firstName} ${person.lastName}`,
        //     ...person,
        //   }))}
        // />
      ) : null}
    </div>
  );
};

export default EventCard;
