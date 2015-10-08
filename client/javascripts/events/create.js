/** The events that create template contains */
Template.create.events({
    /** An interaction on input checks if the form is properly filled */
    'input': function(e, t) {
        var regexa = new RegExp("^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$");
        var regexp = new RegExp("^([a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}\n*)+$");
        //var regexa = new RegExp("^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$");
        //var regexp = new RegExp("^((([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\n*)+$");
        if(t.find("#animatorName").value != "" && regexa.test(t.find("#animatorEmail").value) && t.find("#meetingName").value != "" && regexp.test(t.find("#participantsEmails").value)) {
            t.find("#create").disabled = "";
        } else {
            t.find("#create").disabled = "disabled";
        }
    },
    /** A form submission creates a meeting, invites participants and opens the meeting page */
    'submit form': function(e) {
        e.preventDefault();
        var meetingId = Meetings.insert({name: e.target.meetingName.value, status: "ongoing"});
        var userId = Users.insert({name: e.target.animatorName.value, email: e.target.animatorEmail.value, type: "animator", status: "online", meeting: meetingId});
        var participantsEmails = e.target.participantsEmails.value.split('\n');
        localStorage.setItem(meetingId, meetingId);
        Session.set("meetingId", meetingId);
        Session.set("userId", userId);
        Meteor.call('sendEmail', e.target.animatorEmail.value, 'noreply@taketalk.com', 'TakeTalk session created', 'You have just created a session of TakeTalk. \nHere is the link : taketalk.meteor.com/join/' + meetingId + "/" + userId);
        for(var i = 0; i < participantsEmails.length; i++) {
            userId = Users.insert({name: 'participant pending', email: participantsEmails[i], type: "participant", status: "pending", meeting: meetingId});
            Meteor.call('sendEmail', participantsEmails[i], 'noreply@taketalk.com', 'TakeTalk invitation', 'You are invited to a session of TakeTalk. \nPlease follow this link : taketalk.meteor.com/join/' + meetingId + '/' + userId);
        }
        Router.go('/meeting/' + meetingId);
    }
});