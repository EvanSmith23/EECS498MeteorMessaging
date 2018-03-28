import { Template } from 'meteor/templating';
import { Messages } from '../api/mongo.js';
import { Users } from '../api/mongo.js';
import './message.js';
import './body.html';
import './user.html';

Template.body.helpers({
  messages() {
    return Messages.find({}, { sort : { createdAt : -1 } });
  },
  users() {
    return Users.find({});
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
    Messages.insert({
      text,
      sender: "Evan",
      receiver: "Mike",
      createdAt: new Date(),
    });

    // Clear form
    target.text.value = "";
  },
  'click .create-account'(event){
  
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
      
      console.log('here');

      return {
        login : true,
      };
      //document.getElementById('container').innerHTML = '<header><h1>Conversation</h1></header><form class="new-message"><input type="text" name="text" placeholder="new message"><input type="submit" name="submit" value="Send"></form><br/><br/><ul>{{#each messages}}{{> message }}{{/each}}</ul>';      
    }
  },
  'click .login'(event) {
    
    //stop default event form occurring
    event.preventDefault();

    // Get Value from form element
    const target = document.getElementById('username');
    const username = target.value;

    const users = Users.find({ "username" : username }).fetch();
  
    // check the user is logged in
    if( users )
    {
      return document.getElementById('container').innerHTML = '<header><h1>Conversation</h1></header><form class="new-message"><input type="text" name="text" placeholder="new message"><input type="submit" name="submit" value="Send"></form><br/><br/><ul>{{#each messages}}{{> message }}{{/each}}</ul>';      
    } 
    else 
    {
      document.getElementById('errorMessage').innerHTML = "Error: Username does not exist";
      target.text.value = "";
    }

  },
});
