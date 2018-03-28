import { Template } from 'meteor/templating';
import { Messages } from '../api/mongo.js';
import { Users } from '../api/mongo.js';
import './message.js';
import './body.html';
import './user.html';

Template.body.onCreated(function() {
  this.login = new ReactiveVar( false );
  this.loggedInUser = new ReactiveVar("");
  this.receiver = new ReactiveVar("");
  this.messages = new ReactiveVar({});
});

Template.body.helpers({
  login: function() {
    return Template.instance().login.get();
  },
  loggedInUser: function() {
    return Template.instance().loggedInUser.get();
  },
  receiver : function () {
    return Template.instance().receiver.get();
  },
  messages : function () {
    return Messages.find({ $or : [ 
                                    { sender : Template.instance().loggedInUser.get(), receiver : Template.instance().receiver.get() } , 
                                    { sender : Template.instance().receiver.get(), receiver : Template.instance().loggedInUser.get() } 
                                  ] 
                          },{ sort : { createdAt : -1 }}).fetch();
  },
  users() {
    return Users.find({ username : { $ne : Template.instance().loggedInUser.get() } });
  },
});

Template.body.events({
  'submit .new-message'(event) {
    
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    if( Template.instance().receiver.get() !== "")
    {
      Messages.insert({
        text,
        sender: Template.instance().loggedInUser.get(),
        receiver: Template.instance().receiver.get(),
        createdAt: new Date(),
      });
    }
    // Clear form
    target.text.value = "";
  },
  'click .user'(event, template){
    event.preventDefault();

    const target = event.target;
    template.receiver.set(target.innerHTML);
  },
  'click .logout' (event, template){

    event.preventDefault();

    template.receiver.set("");
    template.loggedInUser.set("");
    template.login.set(false);
  },
  'click .create-account'(event, template){
  
    // stop default event from occurring
    event.preventDefault();

    // Get value from form element
    const target = document.getElementById('username');
    const username = target.value;

    const users = Users.find({ "username" : username }).fetch();
  
    console.log(users);
    // check the user is logged in
    if( users[0] )
    {
      target.value = "";
      return document.getElementById('errorMessage').innerHTML = "Error: Username already exists";
    }
    else 
    {
      Users.insert({
        username,
        createdAt: new Date(),
      });
      
      template.login.set(true);
      template.loggedInUser.set(username);

    }
  },
  'click .login'(event, template) {
    
    //stop default event form occurring
    event.preventDefault();

    // Get Value from form element
    const target = document.getElementById('username');
    const username = target.value;

    const users = Users.find({ "username" : username }).fetch();
  
    // check the user is logged in
    console.log(users);
    if( users.length > 0 )
    {
      template.login.set(true);
      template.loggedInUser.set(username);
    } 
    else 
    {
      document.getElementById('errorMessage').innerHTML = "Error: Username does not exist";
      target.value = "";
    }

  },
});
