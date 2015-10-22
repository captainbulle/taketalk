/** The events that create template contains */
Template.create.events({

    /** create new input when the last is filled */
    'keyup .participantsEmails': function(e) {
        var input = e.target
        var rank = input.parentElement.getAttribute('rank')
        var inputs = input.parentElement.parentElement.children

        if (input.value.length > 0) {
            var findInput = false
            for (i = 1; i < inputs.length; i++) {
                if (inputs[i].getAttribute('rank') == parseInt(rank) + 1) {
                    findInput = true;
                }
            }
            if (!findInput) {
                var newInput = input.parentElement.cloneNode(true);
                newInput.children[0].value = ""
                newInput.setAttribute('rank', parseInt(rank) + 1)
                input.parentElement.parentElement.appendChild(newInput)
            }
        }
    },

    'keyup .ordreDuJour': function(e) {
        var input = e.target;
        var rank = input.parentElement.getAttribute('rank');
        var inputs = input.parentElement.parentElement.children;
		
        if (input.value.length > 0) {
            var findInput = false
            for (i = 1; i < inputs.length; i++) {
                if (inputs[i].getAttribute('rank') == parseInt(rank) + 1) {
                    findInput = true;
                }
            }
            if (!findInput) {
                var newInput = input.parentElement.cloneNode(true);
                newInput.children[0].value = ""
                newInput.setAttribute('rank', parseInt(rank) + 1)
                input.parentElement.parentElement.appendChild(newInput)
            }
        }
    },
	
	'keyup .ordreDuJourTemps': function(e) {
		var input = e.target;
		if(isNaN(input.value)){
			input.value = input.value.substr(0,input.value.length-1);
		}
	},

    /** A form submission creates a meeting, invites participants and opens the meeting page */
    'submit form': function(e) {
        e.preventDefault();
        var ordreInputs = e.target.ordreDuJour
        var ordres = []
        var ordreTimeInputs = e.target.ordreDuJourTemps
        var ordreTimes = []
        var participantsInputs = e.target.participantsEmails
        var participantsEmails = []

        for (i = 0; i < participantsInputs.length; i++) {
            if (participantsInputs[i].value != "") {
                participantsEmails.push(participantsInputs[i].value)
            }
        }
        for (i = 0; i < ordreInputs.length; i++) {
            if (ordreInputs[i].value != "") {
                ordres.push(ordreInputs[i].value)
                ordreTimes.push(ordreTimeInputs[i].value)
            }
        }

        var meetingId = Meetings.insert({   name: e.target.meetingName.value,
                                            status: "ongoing",
                                            ordres: ordres,
                                            ordreTimes: ordreTimes});
        var userId = Users.insert({ name: e.target.animatorName.value,
                                    email: e.target.animatorEmail.value,
                                    type: "animator",
                                    status: "online",
                                    meeting: meetingId});
        localStorage.setItem(meetingId, meetingId);
        Session.set("meetingId", meetingId);
        Session.set("userId", userId);
        Session.set("ordres", ordres);
        Session.set("ordreTimes", ordreTimes);
        Meteor.call('sendEmail',
                    e.target.animatorEmail.value,
                    'noreply@taketalk.com',
                    'TakeTalk session created',
                    'You have just created a session of TakeTalk. \nHere is the link : taketalk.meteor.com/join/'
                    + meetingId +
                    "/" + userId);

        for(var i = 0; i < participantsEmails.length; i++) {
            userId = Users.insert({name: 'participant pending', email: participantsEmails[i], type: "participant", status: "pending", meeting: meetingId});
            Meteor.call('sendEmail', participantsEmails[i], 'noreply@taketalk.com', 'TakeTalk invitation', 'You are invited to a session of TakeTalk. \nPlease follow this link : taketalk.meteor.com/join/' + meetingId + '/' + userId);
        }
        Router.go('/meeting/' + meetingId);
    }
});
