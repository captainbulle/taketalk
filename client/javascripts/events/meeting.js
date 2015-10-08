var timerId = 0;
/** The events that meeting template contains */
Template.meeting.events({
    /** A click on talkCancel opens the lineup page or cancels the user's speech */
    'click #talkCancel': function(e) {
        if(e.target.value == "Talk") {
            Router.go('/meeting/' + Session.get("meetingId") + '/lineup');
        } else {
            Speeches.update(Speeches.findOne({user: Session.get("userId"), status: {$in: ["ongoing", "pending"]}})._id, {$set: {status: "done"}});
        }
    },
    /** A click on waitProceed starts or stops the timer */
    'click #waitProceed': function(e) {
        if(e.target.value == "Wait") {
            Meteor.clearInterval(timerId);
            Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {status: "pending"}});
        } else {
            Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "pending"})._id, {$set: {status: "ongoing"}});
            timerId = Meteor.setInterval(function() {
                Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {timeLeft: Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).timeLeft + 1}});
                if(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).timeLeft == Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).time){
                    Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {status: "done"}});
                    Meteor.clearInterval(timerId);
                }
            } , 1000);
        }
    },
    /** A click on next goes to the next speech */
    'click #next': function(e) {
        Meteor.clearInterval(timerId);
        Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: {$in: ["ongoing", "pending"]}})._id, {$set: {status: "done"}});
    },
    /** A click on inviteParticipants opens the invite page */
    'click #inviteParticipants': function(e) {
        Router.go('/meeting/' + Session.get("meetingId") + '/invite');
    },
    /** A click on closeMeeting closes the meeting */
    'click #closeMeeting': function(e) {
        Meetings.update(Session.get("meetingId"), {$set: {status: "done"}});
        Session.set("meetingId", "");
        Session.set("userId", "");
        Router.go("home");
    }
});