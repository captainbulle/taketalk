/** The events that invite template contains */
Template.invite.events({
    /** An interaction on input checks if the form is properly filled */
    'input textarea': function(e, t) {
        if(t.find("#newParticipantsEmails").value != "") {
            t.find("#invite").disabled = "";
        } else {
            t.find("#invite").disabled = "disabled";
        }
    },
    /** A click on cancelInvite goes back to the meeting page */
    'click #cancelInvite': function(e) {
        e.preventDefault();
        Router.go('/meeting/' + Session.get("meetingId"));
    },
    /** A click on invite invites new participants and goes back to the meeting page */
    'click #invite': function(e, t) {
        e.preventDefault();
        var participantsEmails = t.find("#newParticipantsEmails").value.split('\n');
        var userId = "";
        for(var i = 0; i < participantsEmails.length; i++) {
            userId = Users.insert({name: 'participant pending', email: participantsEmails[i], type: "participant", status: "pending", meeting: Session.get("meetingId")});
            Meteor.call('sendEmail', participantsEmails[i], 'noreply@taketalk.com', 'TakeTalk invitation', 'You are invited to a session of TakeTalk. \nPlease follow this link : taketalktest.meteor.com/join/' + Session.get("meetingId") + '/' + userId);
        };
        Router.go('/meeting/' + Session.get("meetingId"));
    }
});