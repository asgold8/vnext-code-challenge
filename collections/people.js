import { Mongo } from 'meteor/mongo';

export const People = new Mongo.Collection('people');

People.allow({
  update(userId, doc, fieldNames, modifier) {
    return true;
  }
});