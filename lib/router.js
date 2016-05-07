import utils from './utils';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'page404'
});

Router.route('/', function() {
    if (Meteor.user()) {
        this.wait(Meteor.subscribe('PoolsCompany', Meteor.user().profile.company));
        this.wait(Meteor.subscribe('OrdersCompany'));        // @FIXME insecure
        this.wait(Meteor.subscribe('OrdersItems'));
        this.render('appPools');
    }else {
        Router.go('/login');
    }
}, { name: 'index' });

Router.route('/profile', function() {
    this.wait(Meteor.subscribe('company'));
    if (Meteor.user()) {
        this.render('appProfile');
    }else {
        Router.go('/login');
    }
}, { name: 'profile' });

Router.route('/history', function() {
    this.wait(Meteor.subscribe('PoolsListOwner', Meteor.userId()));
    this.wait(Meteor.subscribe('OrdersListOwner', Meteor.userId()));
    this.wait(Meteor.subscribe('OrdersItems', this.params.poolId));
    if (this.ready()) {
        if (Meteor.user()) {
            this.render('appHistory');
        }else {
            Router.go('/login');
        }
    }else {
        this.render('loading');
    }
}, { name: 'history' });

Router.route('/feeds', function() {
    if (Meteor.user()) {
        this.render('appFeeds');
    }else {
        Router.go('/login');
    }
}, { name: 'feeds' });

Router.route('/login', function() {
    this.wait(Meteor.subscribe('company'));
    if (!Meteor.user()) {
        this.render('appLogin');
    } else {
        Router.go('/');
    }
}, { name: 'login' });

Router.route('/pool/add', function() {
    let userProfile = Meteor.user().profile;
    if (!userProfile.username || !userProfile.phone || !userProfile.address) {
        throwNotification('danger', 'Для создания пула нужно заполнить Имя, Телефон и Адрес');
        Router.go('/profile');
    }else {
        this.wait(Meteor.subscribe('PoolsList'));

        if (this.ready()) {
            this.render('appPoolAdd');
        }else {
            this.render('loading');
        }
    }
}, { name: 'pool_add' });

Router.route('/pool/:poolId', function() {
    this.wait(Meteor.subscribe('PoolsOne', this.params.poolId));
    this.wait(Meteor.subscribe('PoolsOrders', this.params.poolId));
    this.wait(Meteor.subscribe('OrdersItems', this.params.poolId));
    if (this.ready()) {
        const pool = Pools.findOne({ _id: this.params.poolId });
        const data = { data: pool };

        if (pool) {
            switch (pool.state) {
                case utils.POOL_STATE.PENDING:
                    this.render('appPoolPending', data);
                    break;

                case utils.POOL_STATE.SUMMARY:
                    if (pool.ownerId === Meteor.userId()) {
                        this.render('appPoolSummary', data);
                    }else {
                        this.render('appPoolArchived', data);
                    }

                    break;

                case utils.POOL_STATE.ARCHIVED:
                    this.render('appPoolArchived', data);
                    break;

                default:
                    throw new Error('Invalid pool');
            }
        }else {
            throw new Error('Pool not found');
        }
    }else {
        this.render('loading');
    }
}, { name: 'pool' });

function requireAuth() {
    if (!Meteor.user()) {
        this.render('page403');
    } else {
        this.wait(Meteor.subscribe('Feeds', Meteor.userId()));
        this.next();
    }
}

Router.onBeforeAction(requireAuth, { only: 'pool_add' });

Router.before(function() {
    clearNotification();
    this.next();
});
