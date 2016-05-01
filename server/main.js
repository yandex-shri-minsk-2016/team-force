import { Accounts } from 'meteor/accounts-base';
import utils from './../lib/utils';
import Email from './email';

Tasks = new Meteor.Collection('tasks');
SSR.compileTemplate('email', Assets.getText('email.html'));

Meteor.methods({
    addTask: (task) => {
        return addTask(task);
    },

    sendEmail: (to, user, data, shopName) => {
        return Email.send(to, SSR.render('email', { user, data, shopName }));
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
        Pools.changePoolState(data.poolId, utils.POOL_STATE.SUMMARY);
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
    if (options.profile) {
        user.profile = options.profile;
        try {
            Company.add({ title: user.profile.company });
        }catch (err) {
            throw new Error(err);
        }
    }

    return user;
});
