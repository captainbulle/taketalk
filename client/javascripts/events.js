Template.home.events({
  'click #open': function(e){
    Router.go('create');
  }
});

Template.create.events({
  'input': function(e, t) {
	var regexa = new RegExp("^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$");
	var regexp = new RegExp("(^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4})\n*");
	if(t.find("#animatorName").value != "" && regexa.test(t.find("#animatorEmail").value) && t.find("#meetingName").value != "" && regexp.test(t.find("#participantsEmails").value)) {
		t.find("#create").disabled = "";
	} else {
		t.find("#create").disabled = "disabled";
	}
  },
  'submit form': function(e) { 
    e.preventDefault();
    var meetingId = Meetings.insert({name: e.target.meetingName.value, status: "ongoing"});
    var userId = Users.insert({name: e.target.animatorName.value, email: e.target.animatorEmail.value, type: "animator", status: "online", meeting: meetingId});
    var participantsEmails = e.target.participantsEmails.value.split('\n');
	Session.set("meetingId", meetingId); 
    Session.set("userId", userId);    
    Meteor.call('sendEmail', e.target.animatorEmail.value, 'noreply@taketalk.com', 'TakeTalk session created', 'You have just created a session of TakeTalk. \nHere is the link : taketalk.meteor.com/meeting/' + meetingId);
    for(var i = 0; i < participantsEmails.length; i++) {
      userId = Users.insert({name: 'participant pending', email: participantsEmails[i], type: "participant", status: "pending", meeting: meetingId});
      Meteor.call('sendEmail', participantsEmails[i], 'noreply@taketalk.com', 'TakeTalk invitation', 'You are invited to a session of TakeTalk. \nPlease follow this link : taketalk.meteor.com/join/' + meetingId + '/' + userId);
    }
    Router.go('/meeting/' + meetingId);
  }
});

Template.join.events({
  'input': function(e, t) {
    if(t.find("#participantName").value != "") {
  	  t.find("#join").disabled = "";
    } else {
  	  t.find("#join").disabled = "disabled";
    }
  },
  'submit form': function(e) {
    e.preventDefault();
    Users.update({_id: Session.get("userId")}, {name: e.target.participantName.value, status: "online"});
    Router.go('/meeting/' + Session.get("meetingId"));
  }
});

Template.meeting.events({
  'click #talkCancel': function(e) {
	if(e.target.value == "Talk") {
	  Router.go('/meeting/' + Session.get("meetingId") + '/lineup');
	} else {
	  Speeches.update(Speeches.findOne({user: Session.get("userId"), status: {$in: ["ongoing", "pending"]}})._id, {$set: {status: "done"}});
	}
  },
  'click #waitProceed': function(e) {
  	var timerId = "";
  	if(e.target.value == "Wait") {
	  Meteor.clearInterval(timerId);
	  Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {status: "pending"}});
  	} else {
	  Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "pending"})._id, {$set: {status: "ongoing"}});
	  timerId = Meteor.setInterval(function() {
	    if(Speeches.findOne({meeting: Seesion.get("meetingId"), status: "ongoing"}).timeLeft.getMilliseconds() === 0){
		  Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {status: "done"}});
		} else {
			Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"})._id, {$set: {timeLeft: newDate(Speeches.findOne({meeting: Session.get("meetingId"), status: "ongoing"}).timeLeft.getMilliseconds() - 1000)}});
	    }		
	  }, 1000);
  	}
  },
  'click #next': function(e) {
    Speeches.update(Speeches.findOne({meeting: Session.get("meetingId"), status: {$in: ["ongoing", "pending"]}})._id, {$set: {status: "done"}});
    Blaze.render(meeting);
  },
  'click #inviteParticipants': function(e) {
    Router.go('/meeting/' + Session.get("meetingId") + '/invite');
  },
  'click #closeMeeting': function(e) {
  	Meetings.update(Session.get("meetingId"), {$set: {status: "done"}});
    Session.set("meetingId", ""); 
    Session.set("userId", "");  
    Router.go("home");
  }
});

Template.lineup.events({
  'input': function(e, t) {
  	var regex = new RegExp("([0-9]|10)+");
    if(t.find("#subject").value != "" && regex.test(t.find("#time").value)) {
      t.find("#lineup").disabled = "";
    } else {
      t.find("#lineup").disabled = "disabled";
    }
  },
  'click #cancelLineup': function(e) {
    e.preventDefault();
    Router.go('/meeting/' + Session.get("meetingId"));
  },
  'click #lineup': function(e, t) {
    e.preventDefault();
    Speeches.insert({subject: t.find("#subject").value, timeLeft: new Date(0, 0, 0, 0, t.find("#time").value, 0), time: new Date(0, 0, 0, 0, t.find("#time").value, 0), status: "pending", user: Session.get("userId"), meeting: Session.get("meetingId")});
    Router.go('/meeting/' + Session.get("meetingId"));
  }
});

Template.invite.events({
  'input textarea': function(e, t) {
  	if(t.find("#newParticipantsEmails").value != "") {
  		t.find("#invite").disabled = "";
  	} else {
  		t.find("#invite").disabled = "disabled";
  	}
  },
  'click #cancelInvite': function(e) {
    e.preventDefault();
    Router.go('/meeting/' + Session.get("meetingId"));
  },
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