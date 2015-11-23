/** The configuration for the main layout */
Router.configure({
  layoutTemplate: 'layout'
});

/** The route to the home page */
Router.route('/', {
  name: 'home'
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
      // ajout d'un meeting pour les test
      var id = 'test';
      if (this.params._meetingId == id && Meetings.findOne({_id: id, status: "ongoing"}) === undefined) {
          Meteor.call('resetAll');

          Meetings.insert({
              name: 'test',
              status: "ongoing",
              ordres: ['ordre1', 'ordre2', 'ordre3'],
              ordreTimes: [90, 130, 268],
              password: '0000',
              _id: id
          });
          Users.insert({ name:'testAnimator',
              email: 'testAnimator@gmail.com',
              type: "animator",
              status: "online",
              meeting: id,
              _id: 'testAnimator'
          });

          Session.set("meetingId", id);
          Session.set("ordres", ['ordre1', 'ordre2', 'ordre3']);
          Session.set("ordreTimes", [90, 130, 268]);
          Session.set("userId", 'testAnimator');
      } // FIN ajout meeting test
      else{
          Session.set("meetingId", this.params._meetingId);
      }

    var meeting = Meetings.findOne({_id: this.params._meetingId, status: "ongoing"});
    if(meeting === undefined){
        console.log('undefined meeting...');
    }

    var users = [];
    Users.find({meeting: this.params._meetingId}).forEach(function(user) {
        users.push({name: user.name});
    });

    var speeches = [];
	var index = 0;
    Speeches.find({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}).forEach(function(speech) {
        var minutesLeft = Math.floor(speech.timeLeft / 60);
        var secondsLeft = speech.timeLeft % 60;
        var minutes = Math.floor(speech.time / 60);
        var seconds = speech.time % 60;

        if(secondsLeft < 10) {
            secondsLeft = "0" + secondsLeft;
        }
        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        speeches.push({
            user: Users.findOne({_id: speech.user}).name,
            timeLeft: minutesLeft + ":" + secondsLeft,
            timeString: speech.timeString,
            time: minutes + ":" + seconds,
            orderChoose: speech.orderChoose,
            subject: speech.subject,
            status: speech.status == "ongoing",
            id: speech._id,
			rank : index
		});
			
		index++;

    });

    var user = Users.findOne({_id: Session.get("userId")});
    var isAnimator = false;
    if(user !== undefined){
        if(user.type == "animator") isAnimator = true;
    }

    var talk = "Talk";
    /*var talk = "Cancel talk";
    if(Speeches.findOne({user: Session.get("userId"), status: {$in: ["ongoing", "pending"]}}) == undefined) {
      talk = "Talk";
    }*/

    var proceed = "Wait";
    if(Speeches.findOne({meeting: this.params._meetingId, status: "ongoing"}) == undefined) {
      proceed = "Proceed";
    }

    var disabled = "";
    if(Speeches.findOne({meeting: this.params._meetingId, status: {$in: ["ongoing", "pending"]}}) == undefined) {
      disabled = "disabled";
    }

      Speeches.find({user: Session.get("userId")}).observe({
          removed: function(speech) {
              if (!isAnimator) {
                  $("#speech-delete-modal").modal("show");
              }
          }
      });

    return {
      meeting:    meeting.name,
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
        var meeting = Meetings.findOne({_id: this.params._meetingId});
        if(meeting === undefined){
            console.log('meeting undefined');
            Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
        }

        var user = Users.findOne({_id: this.params._userId});
        if(user === undefined){
            console.log('user undefined');
            Router.configure({layoutTemplate: 'layout', notFoundTemplate: '404'});
        }

        Session.set("meetingId", this.params._meetingId);
        Session.set("userId", this.params._userId);

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