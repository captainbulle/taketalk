/** The events that join template contains */
Template.join.events({
    /** An interaction on input checks if the form is properly filled */
    'input': function(e, t) {
        if(t.find("#participantName").value != "") {
            t.find("#join").disabled = "";
        } else {
            t.find("#join").disabled = "disabled";
        }
    },
    /** A form submission updates the user's name and opens the meeting page */
    'submit form': function(e) {
        e.preventDefault();
        meetingId = Session.get("meetingId");
        console.log(Meetings.findOne({_id: meetingId}));
        if (Meetings.findOne({_id: meetingId}) === undefined) {
            Session.set("joinError", 'The password you entered is incorrect');
            Router.go('/join/'+ Session.get("meetingId") +'/' + Session.get("userId"));
        } else if (Meetings.findOne({_id: meetingId}).password == e.target.password){
            Users.update(Session.get("userId"), {$set: {name: e.target.participantName.value, status: "online"}});
            Router.go('/meeting/' + Session.get("meetingId"));
        }
    }

});

Template.join.helpers({
    joinError: function() { return Session.get('joinError'); }
});

