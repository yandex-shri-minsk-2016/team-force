import { Meteor } from 'meteor/meteor';

FlowRouter.route('/', {
    action: function(params, queryParams) {
        if (Meteor.user()){
            BlazeLayout.render('App', {main: 'appPools', content: params});
        }else{
            FlowRouter.go('/login');
        }
    }
});

FlowRouter.route('/login', {
    action: function(params, queryParams) {
        BlazeLayout.render('App', {main: 'appLogin', content: params});
    }
});

FlowRouter.route('/pool/add', {
    action: function(params, queryParams) {
        BlazeLayout.render('App', {main: 'appPoolAdd', content: params});
    }
});

FlowRouter.route('/pool/:postId/edit', {
    action: function(params, queryParams) {
        BlazeLayout.render('App', {main: 'appPoolEdit', content: params});
    }
});

FlowRouter.route('/pool/:postId', {
    action: function(params, queryParams) {
        BlazeLayout.render('App', {main: 'appPool', content: params});
    }
});
