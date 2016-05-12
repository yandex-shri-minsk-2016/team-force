import utils from './utils';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'page404'
});

Router.route('/', function() {
    this.wait(Meteor.subscribe('usersData'));
    this.wait(Meteor.subscribe('PoolsCompanyByDate', Meteor.user().profile.company));
    this.wait(Meteor.subscribe('OrdersCompany')); // @FIXME insecure
    this.wait(Meteor.subscribe('OrdersItems'));
    if (this.ready()) {
        this.render('appPools');
    }else {
        this.render('loading');
    }
}, { name: 'index' });

Router.route('/profile', function() {
    this.wait(Meteor.subscribe('company'));
    if (this.ready()) {
        this.render('appProfile');
    }else {
        this.render('loading');
    }
}, { name: 'profile' });

Router.route('history/:poolsLimit?', function() {
    this.wait(Meteor.subscribe('PoolsListOwner', Meteor.userId()));
    this.wait(Meteor.subscribe('OrdersCompany', Meteor.userId()));
    this.wait(Meteor.subscribe('OrdersItems'));
    if (this.ready()) {
        this.render('appHistory', {
            data: () => {
                const poolsLimit = parseInt(this.params.poolsLimit) || utils.ITEMS_PER_PAGE;
                const allPoolsCount = Pools.find().count();
                return {
                    poolsLimit: poolsLimit,
                    nextPath: Math.min(poolsLimit + utils.ITEMS_PER_PAGE, allPoolsCount),
                    hasMore: allPoolsCount > poolsLimit
                };
            }
        });
    }else {
        this.render('loading');
    }
}, { name: 'history' });

Router.route('/debts/:ordersLimit?', function() {
    this.wait(Meteor.subscribe('usersData'));
    this.wait(Meteor.subscribe('PoolsCompany', Meteor.user().profile.company));
    this.wait(Meteor.subscribe('OrdersListOwner', Meteor.userId()));
    this.wait(Meteor.subscribe('OrdersItems', this.params.poolId));
    if (this.ready()) {
        if (Meteor.user()) {
            this.render('appDebts', {
                data: () => {
                    const ordersLimit = parseInt(this.params.ordersLimit) || utils.ITEMS_PER_PAGE;
                    const allOrdersCount = Orders.find().count();
                    return {
                        ordersLimit: ordersLimit,
                        nextPath: Math.min(ordersLimit + utils.ITEMS_PER_PAGE, allOrdersCount),
                        hasMore: allOrdersCount > ordersLimit
                    };
                }
            });
        }else {
            Router.go('/login');
        }
    }else {
        this.render('loading');
    }
}, { name: 'debts' });

Router.route('/feeds', function() {
    this.render('appFeeds');
}, { name: 'feeds' });

Router.route('/login', function() {
    if (!Meteor.user()) {
        this.wait(Meteor.subscribe('company'));
        if (this.ready()) {
            this.render('appLogin');
        }else {
            this.render('loading');
        }
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
    this.wait(Meteor.subscribe('usersData'));
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
        Router.go('/login');
    } else {
        this.wait(Meteor.subscribe('Feeds', Meteor.userId()));
        this.next();
    }
}

Router.onBeforeAction(requireAuth, { except: 'login' });

Router.before(function() {
    clearNotification();
    this.next();
});
