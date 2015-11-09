/** The events that lineup template contains */
Template.lineup.events({
    /** A click on cancelLineup goes back to the meeting page */
    'click #cancelLineup': function(e) {
        e.preventDefault();
        Router.go('/meeting/' + Session.get("meetingId"));
    },

    /** A click on lineup creates a speech and goes back to the meeting page */
    'click .lineUp': function(e, t) {
        e.preventDefault();
		var order = t.find("#order").value;
        var submitTime = t.find(".timeButton:checked").value;
        var userId = $(e.target).attr("user-id");

		/* // If no keyword -> The subject is "Unknow"
		if(t.find("#keywords").value == ""){
			t.find("#keywords").value = "Unknow";
		}*/
		
        if (submitTime == 'rapide') {
            submitTime = "intervention rapide"
        }
        if (submitTime == 'plus') {
            submitTime = "plus de 10 minutes"
        }

        if (isNaN(submitTime)) {
            Speeches.insert({
                subject: t.find("#keywords").value,
                timeLeft: 0,
                time: 0,
				orderChoose: order,
                timeString: submitTime,
                status: "pending",
                user: userId,
                meeting: Session.get("meetingId")
            });
        } else {
            Speeches.insert({
                subject: t.find("#keywords").value,
                timeLeft: 0,
                time: submitTime,
				orderChoose: order,
                timeString: "",
                status: "pending",
                user: userId,
                meeting: Session.get("meetingId")
            });
        }
        Router.go('/meeting/' + Session.get("meetingId"));
    }
});

Template.lineup.helpers ({
    guests: function () {
        guests = Session.get("guests");
        var names = new Array(guests.length);

        for (i = 0; i < guests.length; i++) {
            names[i] = {"name" : guests[i]};
        }

        return names;
    },

    ordres: function () {
        return Session.get("ordres");
    },

    hasGuest: function () {
        if (Session.get("guests") === undefined) {
            return false;
        }
        return Session.get("guests").length > 0;
    }
});