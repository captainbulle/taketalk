/** The events that home template contains */
Template.home.events({
    /** A click on #open opens the create page */
    'click #open': function(e){
        Router.go('create');
    }
});