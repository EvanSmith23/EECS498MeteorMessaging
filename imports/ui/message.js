import { Template } from 'meteor/templating';
import { Messages } from '../api/mongo.js';
import './message.html';

Template.message.events({
  'click .delete'() {
    Messages.remove(this._id);
  },
});
