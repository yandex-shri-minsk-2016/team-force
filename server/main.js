import { Accounts } from 'meteor/accounts-base';
import utils from './../lib/utils';
import Parser from './../lib/parser';
import Email from './email';
import moment from 'moment';

Tasks = new Meteor.Collection('tasks');
SSR.compileTemplate('email', Assets.getText('email.html'));

Date.prototype.dayOfYear = function() {
    let newDate = new Date(this);
    newDate.setMonth(0, 0);
    return Math.round((this - newDate) / 8.64e7);
};

Meteor.methods({
    addTask: (task) => {
        return addTask(task);
    },

    sendEmail: (to, user, data, shopName) => {
        return Email.send(to, SSR.render('email', { user, data, shopName }));
    },

    whoiam: () => {
        return Meteor.user();
    },

    appendItemFromLink: (poolId, userId, url) => {
        return Parser(url, utils.getHost(url)).parse()
            .then(item => {
                item.price = utils.getPriceFromString(item.price);
                item.description = item.descr;
                item.link = url;
                delete item.descr;
                return Pools.appendItemForUser(poolId, userId, item).then((itemId) => {
                    const item = Items.findOne(itemId);
                    const user = Meteor.users.findOne(userId);
                    Feeds.notifyEveryoneInPool(poolId, {
                        userId:    user._id,
                        ownerId:   user._id,
                        companyId: user.profile.company,
                        type:      'cutlery',
                        message:   ` добавил в #pool{${poolId}}, #item{${itemId}} на сумму ${utils.getPriceWithFormat(item.price)}`
                    });
                });
            });
    },

    extension: (currentUserId, company) => {
        return {
            currentUser: Meteor.user(),
            currentUsermail: utils.getUsermail(Meteor.userId()),
            feedsUnseenCount: Feeds.find({ ownerId: currentUserId, seen: false }).count(),
            paidOrdersPrice: utils.getPriceWithFormat(Orders.getOrderIsPaidPriceForUser(currentUserId, false)),
            poolsWithDates: (() => {

                const pipeline = [
                    {
                        $match: {
                            companyId: company
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            shop: 1,
                            address: 1,
                            time: 1,
                            distance: 1,
                            ownerId: 1,
                            state: 1,
                            companyId: 1,
                            dayOfYear: {
                                $dayOfYear: '$time'
                            }
                        }
                    },
                    {
                        $match: {
                            dayOfYear: {
                                $gte: new Date().dayOfYear()
                            }
                        }
                    },
                    {
                        $sort: {
                            dayOfYear: 1,
                            time: 1
                        }
                    }
                ];

                const PoolsCompanyWithPrice = Pools
                        .aggregate(pipeline)
                        .map(pool => {
                            const poolPrice = Pools.getPoolPrice(pool._id);
                            pool.poolPrice = utils.getPriceWithFormat(poolPrice);
                            pool.userCount = Orders.find({ poolId: pool._id }).count();

                            const tDelivery = pool.distance / utils.MEAN_SPEED;
                            const tCooking  = poolPrice > 0 ? utils.MEAN_TCOOK * Math.pow(Math.log(poolPrice) / Math.log(utils.MEAN_PRICE), 4) : 0;
                            pool.timeDelivery = (tDelivery + tCooking) ? (tDelivery + tCooking) : 0;

                            pool.time = moment(pool.time).format('HH:mm');
                            pool.timeDiff = (pool.timeDelivery > 0) ? `(+${moment(pool.timeDelivery, 'X').diff(0, 'minutes')} мин)` : '';
                            pool.owner = utils.getUsermail(pool.ownerId);

                            return pool;
                        });

                let PoolsWithDates = {};

                PoolsCompanyWithPrice.forEach(pool => {
                    if (!PoolsWithDates[pool.dayOfYear]) {
                        PoolsWithDates[pool.dayOfYear] = [pool];
                    }else {
                        PoolsWithDates[pool.dayOfYear].push(pool);
                    }
                });

                return Object.keys(PoolsWithDates).map(date => {
                    return {
                        date: date === moment(new Date()).format('DDD') ? 'Сегодня' : moment(date, 'DDD').format('DD.MM.YYYY'),
                        pools: PoolsWithDates[date]
                    };
                });
            })()
        };
    }
});

Meteor.startup(() => {
    Tasks.find().forEach((task) => {
        if (task.date <= new Date()) {
            taskFunctions[task.name](task.options);
        } else {
            addTask(task, task._id);
        }
    });
    SyncedCron.start();
});

const taskFunctions = {
    setSummary: (data) => {
        Pools.changePoolState(data.poolId, utils.POOL_STATE.SUMMARY)
            .then(poolId => {
                if (poolId) {
                    const pool = Pools.findOne(poolId);
                    const user = Meteor.users.findOne(pool.ownerId);

                    Feeds.notifyEveryoneInPool(pool._id, {
                        userId:   user._id,
                        ownerId:  user._id,
                        companyId:user.profile.company,
                        type:     'remove-sign',
                        message:  ` сменил статус #pool{${pool._id}} на 'предзаказ'.`
                    }, false);
                }
            });
    }
};

/**
 * Добавляет новую задачу, либо запускает, не добавляя, если время уже прошло
 * @params {Object} task задача с отложенным выполнением
 * @params {Number} id идентификатор задачи в коллекции, если не передан она
 * добавится в коллекцию автоматически
 **/
function addTask(task, id = Tasks.insert(task)) {
    if (task.date <= new Date()) {
        taskFunctions[task.name](task.options);
    } else {
        SyncedCron.add({
            name: id,
            schedule: (parser) => {
                return parser.recur().on(task.date).fullDate();
            },

            job: () => {
                taskFunctions[task.name](task.options);
                Tasks.remove(id);
                SyncedCron.remove(id);
                return id;
            }
        });
    }
}

Accounts.onCreateUser(function(options, user) {
    user.profile = {
        username: '',
        phone:    '',
        address:  '',
        company:  ''
    };

    if (options.profile.company) {
        let companyTitle = options.profile.company;
        try {
            Company.add({ title: companyTitle });
        }catch (err) {
            throw new Error(err);
        }

        user.profile.company = Company.findOne({ title: companyTitle })._id;
    }

    return user;
});

Meteor.publish('PoolsCompany', (company) => {
    return Pools.find({ companyId: company });
});

Meteor.publish('OrdersCompany', company => {
    // @FIXME company related
    return Orders.find();
});

Meteor.publish('PoolsOne', poolId => {
    return Pools.find({ _id: poolId });
});

Meteor.publish('PoolsList', () => {
    return Pools.find();
});

Meteor.publish('PoolsCompanyByDate', function(company) {
    ReactiveAggregate(this, Pools, [
        {
            $match: {
                companyId: company
            }
        },
        {
            $project: {
                _id: 1,
                shop: 1,
                address: 1,
                time: 1,
                distance: 1,
                ownerId: 1,
                state: 1,
                companyId: 1,
                dayOfYear: {
                    $dayOfYear: '$time'
                }
            }
        },
        {
            $match: {
                dayOfYear: {
                    $gte: new Date().dayOfYear()
                }
            }
        },
        {
            $sort: {
                dayOfYear: 1,
                time: 1
            }
        }
    ]);
});

Meteor.publish('PoolsListOwner', userId => {
    return Pools.find({ ownerId: userId });
});

Meteor.publish('OrdersListOwner', userId => {
    return Orders.find({ userId: userId });
});

Meteor.publish('PoolsOrders', poolId => {
    return Orders.find({ poolId: poolId });
});

Meteor.publish('OrdersItems', () => {
    /*
    let itemsIds = [];
    Orders.find({ poolId: poolId }).fetch().forEach(order => {
        order.items.forEach(item => {
            itemsIds.push({ _id: item.id });
        });
    });

    // @TODO autoreload!

    if (itemsIds.length) {
        return Items.find({ $or: itemsIds });
    }else {
        return Items.find({ _id: 'emptyquery' });
    }
    */

    return Items.find();

});

Meteor.publish('Feeds', companyId => {
    return Feeds.find({ companyId: companyId }, { sort: { created: -1 } });
});

Meteor.publish('company', () => {
    return Company.find();
});

Meteor.publish('usersData', function() {
    if (this.userId) {
        return Meteor.users.find({}, {
            fields: {
                _id: 1,
                emails: 1,
                profile: 1
            }
        });
    } else {
        this.ready();
    }
});
