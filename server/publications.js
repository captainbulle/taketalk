Meteor.publish("insertMeeting", function(meetingName){
  return Meetings.insert({name: meetingName, status: "ongoing"});
});

Meteor.publish("findMeeting", function(id){
  return Meetings.findOne({_id: id});
});

Meteor.publish("updateMeeting", function(id){
  return Meetings.update({_id: id}, {status: "done"});
});

Meteor.publish("insertUser", function(name, email, type, status, meetingId){
  return Users.insert({name: name, email: email, type: type, status: status, meeting: meetingId});
});

Meteor.publish("findUser", function(id){
  return Users.findOne({_id: id});
});

Meteor.publish("updateUser", function(id, name){
  return Meetings.update({_id: id}, {name: name});
});

Meteor.publish("insertSpeech", function(subject, timeLeft, time, userId, meetingId){
  return Users.insert({subject: subject, timeLeft: timeLeft, time: time, status: "pending", user: userId, meeting: meetingId});
});

Meteor.publish("findSpeech", function(id){
  return Meetings.findOne({_id: id});
});

Meteor.publish("updateSpeech", function(id){
  return Meetings.update({_id: id}, {status: "done"});
});
