import React, { forwardRef } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import MaterialTable from 'material-table';
import { moment } from 'meteor/momentjs:moment';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import { People } from '../../collections/people';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const FIVE_SECONDS = 5 * 1000;

const EventCard = props => {
  const { eventId } = useParams();

  const [
    pplLoading,
    people,
    checkedIn,
    checkedInByCompany,
    notCheckedIn,
  ] = useTracker(() => {
    if (eventId) {
      const handle = Meteor.subscribe('people');
      const p = People.find({ communityId: eventId }).fetch();
      const cI = People.find({
        communityId: eventId,
        checkInDate: { $ne: null },
        checkOutDate: { $eq: null },
      }).fetch();
      const cICount = cI.length;

      const cIBC = _.countBy(
        cI.filter(person => person.companyName),
        'companyName'
      );
      const cIBCObject = Object.keys(cIBC).map(x => ({
        companyName: x,
        count: cIBC[x],
      }));

      const nCI = People.find({
        communityId: eventId,
        checkInDate: { $eq: null },
        checkOutDate: { $eq: null },
      }).count();

      return [!handle.ready(), p, cICount, cIBCObject, nCI];
    }
    return [null, null, null, null, null];
  });

  const concatCompanyAttendees = cIBC => {
    const cIBCString = `${cIBC
      .map(c => `${c.companyName}: (${c.count})`)
      .join(', ')}`;
    return cIBCString;
  };

  const handleCheckInOut = (_id, action) => {
    if (action === 'checkIn') {
      People.update(_id, { $set: { checkInDate: moment().format() } });
    }
    if (action === 'checkOut') {
      People.update(_id, { $set: { checkOutDate: moment().format() } });
    }
    if (action === 'reset') {
      People.update(_id, { $set: { checkOutDate: null, checkInDate: null } });
    }
  };

  const renderCheckInOutButton = person => {
    if (!person.checkInDate) {
      return (
        <button className="action-table-button" onClick={() => handleCheckInOut(person._id, 'checkIn')}>
          {`Check-in ${person.fullName}`}
        </button>
      );
    }
    if (moment().diff(person.checkInDate, 'seconds') <= 5) {
      setTimeout(() => renderCheckInOutButton(person), FIVE_SECONDS);
    }
    if (!person.checkOutDate) {
      return (
        <button className="action-table-button" onClick={() => handleCheckInOut(person._id, 'checkOut')}>
          {`Check-out ${person.fullName}`}
        </button>
      );
    }
    if (person.checkInDate && person.checkOutDate) {
      return (
        <button className="action-table-button" onClick={() => handleCheckInOut(person._id, 'reset')}>
          {`Reset ${person.fullName}`}
        </button>
      );
    }
    return null;
  };

  return (
    <div>
      {eventId && !pplLoading ? (
        <>
          <div style={{ backgroundColor: 'lightgray' }}>
            <List>
              <ListItem>
                <Typography
                  variant="h1"
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
                >
                  Event Summary
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <Typography>
                  People in the event right now: {checkedIn};
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <Typography>
                  {`People by company in the event right now: ${concatCompanyAttendees(
                    checkedInByCompany
                  )};`}
                </Typography>
              </ListItem>
              <ListItem>
              <ListItemIcon>
                <ChevronRight />
              </ListItemIcon>
                <Typography>People not checked-in: {notCheckedIn};</Typography>
              </ListItem>
            </List>
          </div>
          <MaterialTable
            icons={tableIcons}
            title="Attendees"
            columns={[
              { title: 'Name', field: 'fullName' },
              { title: 'Company', field: 'companyName' },
              { title: 'Title', field: 'title' },
              { title: 'Check-In', field: 'checkInDateFormatted' },
              { title: 'Check-Out', field: 'checkOutDateFormatted' },
              {
                title: 'Action',
                render: rowData => renderCheckInOutButton(rowData),
              },
            ]}
            data={people.map(person => ({
              fullName: `${person.firstName} ${person.lastName}`,
              checkInDateFormatted: person.checkInDate
                ? moment(person.checkInDate).format('MM/DD/YYYY, HH:mm')
                : 'N/A',
              checkOutDateFormatted: person.checkOutDate
                ? moment(person.checkOutDate).format('MM/DD/YYYY, HH:mm')
                : 'N/A',
              ...person,
            }))}
          />
        </>
      ) : null}
    </div>
  );
};

export default EventCard;
