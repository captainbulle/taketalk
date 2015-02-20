Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/documentation', {
  name: 'documentation'
});

Router.route('/tutorial', {
  name: 'tutorial'
});

Router.route('/downloads', {
  name: 'downloads'
});

Router.route('/create', {
  name: 'create'
});

Router.route('/meeting/:_meetingId', {
  name: 'meeting',
  data: function() {
    var meeting = Meetings.findOne({_id: this.params._meetingId}).name;
	var users = [];
	Users.find({meeting: this.params._meetingId}).forEach(function(doc) {
	  users.push({name: doc.name});
	});
	var speeches = [];
	Speeches.find({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}).forEach(function(doc) {
	  var minutesLeft = doc.timeLeft.getMinutes();
	  var secondsLeft = doc.timeLeft.getSeconds();
	  var minutes = doc.time.getMinutes();
	  var seconds = doc.time.getSeconds();
	  if(secondsLeft < 10) {
		secondsLeft = "0" + seconds;
	  }
	  if(seconds < 10) {
		seconds = "0" + seconds;
	  }
  	  speeches.push({user: Users.findOne({_id: doc.user}).name, timeLeft: minutesLeft + ":" + secondsLeft, time: minutes + ":" + seconds, subject: doc.subject, status: doc.status == "ongoing"});
	});
	var isAnimator = Users.findOne({_id: Session.get("userId")}).type == "animator";
	var talk = "";
	if(Speeches.findOne({user: Session.get("userId"), status: {$in: ["ongoing", "pending"]}}) == undefined) {
	  talk = "Talk";
	} else {
	  talk = "Cancel talk";
	}
	var proceed = "";
	if(Speeches.findOne({meeting: this.params._meetingId, status: "ongoing"}) == undefined) {
	  proceed = "Proceed";
	} else {
      proceed = "Wait";
	}
	var disabled = "";
	if(Speeches.findOne({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}) == undefined) {
	  disabled = "disabled";
	} else {
  	  disabled = "";
	}
    return {
	  meeting: meeting,
      users: users,
      speeches: speeches,
	  isAnimator: isAnimator,
	  talk: talk,
	  proceed: proceed,
	  disabled: disabled
    };
  }
});

Router.route('/join/:_meetingId/:_userId', {
  name: 'join',
  data: function() {
	if((Session.equals("meetingId", this.params._meetingId) && Session.equals("userId", this.params.userId)) || Users.findOne({_id: this.params._userId})) {
      Router.go('/meeting/' + this.params._meetingId);    
    } else {
      Session.set("meetingId", this.params._meetingId); 
      Session.set("userId", this.params._userId);    
    };
	return {};
  }
});

Router.route('/meeting/:_meetingId/lineup', {
  name: 'lineup'
});

Router.route('/meeting/:_meetingId/invite', {
  name: 'invite'
});