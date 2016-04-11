import { Meteor } from 'meteor/meteor';

FlowRouter.route('/', {
    name: 'index',
    action (params, queryParams) {
        if (Meteor.user()){
            BlazeLayout.render('App', {main: 'appPools', content: params});
        }else{
            FlowRouter.go('/login');
        }
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action (params, queryParams) {
        if (!Meteor.user()){
            BlazeLayout.render('App', {main: 'appLogin', content: params});
        }else{
            FlowRouter.go('/');
        }
    }
});

FlowRouter.route('/pool/add', {
    name: 'pool_add',
    action (params, queryParams) {
        BlazeLayout.render('App', {main: 'appPoolAdd', content: params});
    }
});

FlowRouter.route('/pool/:postId/edit', {
    name: 'pool_edit',
    action (params, queryParams) {
        BlazeLayout.render('App', {main: 'appPoolEdit', content: params});
    }
});

FlowRouter.route('/pool/:postId', {
    name: 'pool',
    action (params, queryParams) {
        BlazeLayout.render('App', {main: 'appPool', content: params});
    }
});
