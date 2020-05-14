import { Meteor } from 'meteor/meteor';
import { loadInitialData } from './initial-data';
import { Communities } from '../collections/communities';
import { People } from '../collections/people';

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
  Meteor.publish('communities', () => Communities.find());
  Meteor.publish('people', () => People.find());
});
