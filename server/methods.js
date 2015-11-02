/**
 * This methods alows us to send an e-mail to someone
 * @param {string} to - The receiver's e-mail
 * @param {string} from - The sender's e-mail
 * @param {string} subject - The e-mail's header 
 * @param {string} text - The e-mail's body
*/
Meteor.methods({
  sendEmail: function(to, from, subject, text) {
    check([to, from, subject, text], [String]);
    this.unblock();
    Email.send({to: to, from: from, subject: subject, text: text});
  },

  resetAll: function() {
      Speeches.remove({});
      Users.remove({});
      Meetings.remove({});
  }
});