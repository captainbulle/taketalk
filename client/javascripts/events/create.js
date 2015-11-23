/** The events that create template contains */
Template.create.events({

    /** create new input when the last is filled */
    'keyup .participant-email-input': function(e) {
        var input = $(e.target);

        if (input.val().length > 0) {
            var rank = input.parents(".participant-email")[0].getAttribute('rank');
            var form = input.parents("#create-form");
            var nextRank = parseInt(rank) + 1;

            if ($(form).find('.participant-email[rank="'+nextRank+'"]').length < 1) {
                var newInput = $(input.parents(".participant-email")[0].cloneNode(true));
                newInput.find(".participant-email-input").val("");
                newInput.attr('rank', nextRank);
                $(input.parents(".participant-email-group")[0]).append(newInput)
            }
        }
    },

    'keyup .agenda-name-input': function(e) {
        var input = $(e.target);

        if (input.val().length > 0) {
            var rank = input.parents(".agenda-group")[0].getAttribute('rank');
            var form = input.parents("#create-form");
            var nextRank = parseInt(rank) + 1;

            if ($(form).find('.agenda-group[rank="'+nextRank+'"]').length < 1) {
                var newInput = $(input.parents(".agenda-group")[0].cloneNode(true));
                newInput.find(".agenda-name-input").val("");
                newInput.find(".agenda-time-input").val("");
                newInput.attr('rank', nextRank);
                $(input.parents(".agenda-group")[0]).after(newInput)
            }
        }
    },

    /** A form submission creates a meeting, invites participants and opens the meeting page */
    'submit form': function(e) {
        e.preventDefault();
        var ordreInputs = e.target.ordreDuJour;
        var ordres = [];
        var ordreTimeInputs = e.target.ordreDuJourTemps;
        var ordreTimes = [];
        var participantsInputs = e.target.participantsEmails;
        var participantsEmails = [];

        for (i = 0; i < participantsInputs.length; i++) {
            if (participantsInputs[i].value != "") {
                participantsEmails.push(participantsInputs[i].value);
            }
        }
        for (i = 0; i < ordreInputs.length; i++) {
            if (ordreInputs[i].value != "") {
                ordres.push(ordreInputs[i].value);
                ordreTimes.push(ordreTimeInputs[i].value);
            }
        }
        console.log('emails :'+participantsEmails);
        console.log('ordre:'+ordres);
        console.log('times:'+ordreTimes);

        var pass = Math.floor((Math.random() * 10000) + 1);
        if(pass < 10){
            pass = '000' + pass;
        }else if(pass < 100){
            pass = '00' + pass;
        }else if(pass < 1000){
            pass = '0' + pass;
        }

        var meetingId = Meetings.insert({
            name: e.target.meetingName.value,
            status: "ongoing",
            ordres: ordres,
            ordreTimes: ordreTimes,
            password: pass
        });

        var userId = Users.insert({
            name: e.target.animatorName.value,
            email: e.target.animatorEmail.value,
            type: "animator",
            status: "online",
            meeting: meetingId
        });

        localStorage.setItem(meetingId, meetingId);
        Session.set("meetingId", meetingId);
        Session.set("userId", userId);
        Session.set("ordres", ordres);
        Session.set("ordreTimes", ordreTimes);
        Meteor.call('sendEmail',
            e.target.animatorEmail.value,
            'noreply@taketalk.com',
            'TakeTalk session created',
            'You have just created a session of TakeTalk. \n' +
            'Here is the link : taketalk.meteor.com/join/' + meetingId + '/' + userId +
            'If you quit the meeting and want to return here is the password : ' + meetingId.password
        );

        for(var i = 0; i < participantsEmails.length; i++) {
            userId = Users.insert({name: 'participant pending', email: participantsEmails[i], type: "participant", status: "pending", meeting: meetingId});
            Meteor.call('sendEmail', participantsEmails[i], 'noreply@taketalk.com', 'TakeTalk invitation', 'You are invited to a session of TakeTalk. \nPlease follow this link : taketalk.meteor.com/join/' + meetingId + '/' + userId);
        }
        Router.go('/meeting/' + meetingId);
    }
});
