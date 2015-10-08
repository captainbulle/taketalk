/** The events that lineup template contains */
Template.lineup.events({
    /** An interaction on input checks if the form is properly filled */
    'input': function(e, t) {
        var regex = new RegExp("([0-9]|10)+");
        if(t.find("#subject").value != "" && t.find("#time").value >= 1 && t.find("#time").value <= 10) {
            t.find("#lineup").disabled = "";
        } else {
            t.find("#lineup").disabled = "disabled";
        }
    },
    /** A click on cancelLineup goes back to the meeting page */
    'click #cancelLineup': function(e) {
        e.preventDefault();
        Router.go('/meeting/' + Session.get("meetingId"));
    },
    /** A click on lineup creates a speech and goes back to the meeting page */
    'click #lineup': function(e, t) {
        e.preventDefault();
        Speeches.insert({subject: t.find("#subject").value, timeLeft: 0, time: t.find("#time").value * 60, status: "pending", user: Session.get("userId"), meeting: Session.get("meetingId")});
        Router.go('/meeting/' + Session.get("meetingId"));
    }
});