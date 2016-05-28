class AutoOrder {
    static order(to, user, data) {
        if (to in Sender)
            return Sender[to](user, data);
    }
}

const Sender = {
    'wok.by': (user, data) => {
        // return new Promise((resolve, reject) => {
            const headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'ru,en;q=0.8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Host': 'wok.by',
                'Origin': 'http://wok.by',
                'Referer': 'http://wok.by/menu/full/starters',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 YaBrowser/16.6.1.7469 (beta) Yowser/2.5 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            };
            const link = 'http://wok.by/assets/components/minishop2/action.php';
            const address = user.address.split(',');

            for (let row of data) {
                let data = HTTP.get(row.link).content;
                const idRegExp = new RegExp("<input type=\"hidden\" name=\"id\" value=\"(\\d+)\" \/>");
                const id = idRegExp.exec(data)[1];
                HTTP.post(link, {
                    'headers': headers,
                    'data': {
                        'action': 'cart/add',
                        'id': id,
                        'count': row.count,
                        'ctx': 'web'
                    }
                });
            }

            const buyerInfo = {
                'street': address[0],
                'building': parseInt(address[1]),
                'room': parseInt(address[2]),
                'email': user.email,
                'phone': user.phone
            };
            for (let key in buyerInfo) {
                HTTP.post(link, {
                    'headers': headers,
                    'data': {
                        'action': 'order/add',
                        'key': key,
                        'value': buyerInfo[key],
                        'ctx': 'web'
                    }
                });
            }

            HTTP.post(link, {
                'headers': headers,
                'data': {
                    'action': 'order/submit',
                    'ctx': 'web'
                }
            });
            console.log('Заказ отправлен');
        // });
    }
};

module.exports = AutoOrder;
