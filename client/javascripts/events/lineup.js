/** The events that lineup template contains */
Template.lineup.events({
    /** A click on cancelLineup goes back to the meeting page */
    'click #cancelLineup': function(e) {
        e.preventDefault();
        Router.go('/meeting/' + Session.get("meetingId"));
    },
    /** A click on lineup creates a speech and goes back to the meeting page */
    'click #lineUp': function(e, t) {
        e.preventDefault();
        var submitTime = t.find(".timeButton:checked").value;
        if (submitTime == 'rapide') {
            submitTime = "intervention rapide"
        }
        if (submitTime == 'plus') {
            submitTime = "plus de 10 minutes"
        }

        if (isNaN(submitTime)) {
            Speeches.insert({
                subject: t.find("#subject").value,
                timeLeft: 0,
                time: 0,
                timeString: submitTime,
                status: "pending",
                user: Session.get("userId"),
                meeting: Session.get("meetingId")
            });
            console.log('not a number')
        } else {
            Speeches.insert({
                subject: t.find("#subject").value,
                timeLeft: 0,
                time: submitTime,
                timeString: "",
                status: "pending",
                user: Session.get("userId"),
                meeting: Session.get("meetingId")
            });
            console.log('number')
        }


        Router.go('/meeting/' + Session.get("meetingId"));
    }
});

Template.lineup.helpers ({
    guests: function () {
        var names = new Array(Meteor.user.guests.length);
        for (i = 0; i < Meteor.user.guests.length; i++) {
            names[i] = {"name" : Meteor.user.guests[i]};
        }

        return names;
    }
});