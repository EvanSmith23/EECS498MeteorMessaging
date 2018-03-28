import { Mongo } from 'meteor/mongo';

export const Messages = new Mongo.Collection('messages');
export const Users = new Mongo.Collection('users');

