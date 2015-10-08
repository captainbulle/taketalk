/** The configuration for the main layout */
Router.configure({
  layoutTemplate: 'mainLayout'
});

/** The route to the home page */
Router.route('/', {
  name: 'home'
});

/** The route to the documentation page */
Router.route('/documentation', {
  name: 'documentation'
});

/** The route to the global page */
Router.route('/documentation/global', {
  name: 'global'
});

/** The route to the clientjavascriptseventsjs page */
Router.route('/documentation/clientjavascriptseventsjs', {
  name: 'clientjavascriptseventsjs'
});

/** The route to the collectionsMeetingsjs page */
Router.route('/documentation/collectionsMeetingsjs', {
  name: 'collectionsMeetingsjs'
});

/** The route to the collectionsSpeechesjs page */
Router.route('/documentation/collectionsSpeechesjs', {
  name: 'collectionsSpeechesjs'
});

/** The route to the collectionsUsersjs page */
Router.route('/documentation/collectionsUsersjs', {
  name: 'collectionsUsersjs'
});

/** The route to the tutorial page */
Router.route('/tutorial', {
  name: 'tutorial'
});

/** The route to the downloads page */
Router.route('/downloads', {
  name: 'downloads'
});

/** The route to the create page */
Router.route('/create', {
  name: 'create'
});

/** The route to the meeting page */
Router.route('/meeting/:_meetingId', {
  name: 'meeting',
  data: function() {
    var meeting = Meetings.findOne({_id: this.params._meetingId, status: "ongoing"}).name;
    var users = [];
    Users.find({meeting: this.params._meetingId}).forEach(function(doc) {
      users.push({name: doc.name});
    });

    var speeches = [];
    Speeches.find({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}).forEach(function(doc) {
      var minutesLeft = Math.floor(doc.timeLeft / 60);
      var secondsLeft = doc.timeLeft % 60;
      var minutes = Math.floor(doc.time / 60);
      var seconds = doc.time % 60;

      if(secondsLeft < 10) {
        secondsLeft = "0" + secondsLeft;
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
    }

    return {
      meeting:    meeting,
      users:      users,
      speeches:   speeches,
      isAnimator: isAnimator,
      talk:       talk,
      proceed:    proceed,
      disabled:   disabled
    };
  }
});

/** The route to the join page */
Router.route('/join/:_meetingId/:_userId', {
  name: 'join',
  data: function() {
    Session.set("meetingId", this.params._meetingId); 
    Session.set("userId", this.params._userId);  
    if(localStorage.getItem(this.params._meetingId) != null) {
      Router.go('/meeting/' + this.params._meetingId);    
    } else {
      localStorage.setItem(this.params._meetingId, this.params._meetingId);
    }
    return {};
  }
});

/** The route to the lineup page */
Router.route('/meeting/:_meetingId/lineup', {
  name: 'lineup'
});

/** The route to the invite page */
Router.route('/meeting/:_meetingId/invite', {
  name: 'invite'
});