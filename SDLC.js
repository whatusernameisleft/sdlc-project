const express = require('express');
const app = express();
const Datastore = require("nedb")
const db = new Datastore({
    filename: "itemDatabase.db"
})
db.loadDatabase()
const orderdb = new Datastore({
    filename: 'orderDatabase.db'
})
orderdb.loadDatabase()
const minimum = {
    default: 50,
    pringles: {
        default: 70
    },
    crisps: {
        spicy: 60,
        bbq: 90,
        default: 90
    }
}

app.use(express.static('public'));
app.use(express.json({
    limit: "1mb"
}))

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/index.html');
});

app.get('/list', (request, response) => {
    response.sendFile(__dirname + '/views/list.html');
});

app.get("/items", (request, response) => {
    db.find({}, (err, data) => {
        if (err) {
            response.end()
            return
        }
        response.json(data)
    })
})

app.get('/edit', (request, response) => {
    response.sendFile(__dirname + '/views/edit.html')
})

app.get('/orders', (request, response) => {
    response.sendFile(__dirname + '/views/orders.html')
})

app.get('/orderlist', (request, response) => {
    orderdb.find({}, (err, data) => {
        if (err) {
            response.end()
            return
        }
        response.json(data)
    })
})

setInterval(() => {
    let categories = []
    let items = []
    db.find({}, (err, found) => {
        found.forEach(item => {
            if (categories.indexOf(item.category) === -1) {
                categories.push(item.category)
                let obj = {}
                obj[item.name] = item.amount
                items.push(obj)
            } else {
                if (!(item.name in items[categories.indexOf(item.category)])) {
                    items[categories.indexOf(item.category)][item.name] = item.amount
                } else {
                    items[categories.indexOf(item.category)][item.name] += item.amount
                }
            }
        })
        categories.forEach(category => {
            const index = categories.indexOf(category)
            const entries = Object.entries(items[index])
            for (const [name, amount] of entries) {
                let min
                if (!(category in minimum)) {
                    min = minimum.default
                } else {
                    if (!(name in minimum[category])) {
                        if (!('default' in minimum[category])) {
                            min = minimum.default
                        } else {
                            min = minimum[category].default
                        }
                    } else {
                        min = minimum[category][name]
                    }
                }
                if (amount < min) {
                    const item = {
                        name,
                        amount: 100,
                        category,
                        timestamp: Date.now()
                    }
                    db.insert(item)
                    orderdb.insert(item)
                }
            }
        })
    })
}, 60000)

app.post("/items", (request, response) => {
    const item = request.body.item
    item.timestamp = Date.now()
    db.insert(item)
    response.json({
        status: "success",
        data: {
            item: {
                name: item.name,
                amount: item.amount,
                category: item.category
            }
        },
        timestamp: item.timestamp
    })
})

app.post('/edit', (request, response) => {
    const item = request.body.item
    item.timestamp = Date.now()
    let query
    item._id ? query = {
        name: item.name,
        category: item.category,
        _id: item._id
    } : query = {
        name: item.name,
        category: item.category
    }
    db.find(query, (err, found) => {
        if (found.length === 1) {
            if (item.amount === 0) {
                db.remove(query, {}, (err, numRemoved) => {
                    item.itemsReplaced = numRemoved
                    response.json({
                        status: "success",
                        type: 'single',
                        data: {
                            item: {
                                name: item.name,
                                new_amount: item.amount,
                                category: item.category,
                                items_replaced: item.itemsReplaced
                            }
                        },
                        timestamp: item.timestamp
                    })
                })
            } else {
                db.update(query, item, {}, (err, numReplaced) => {
                    item.itemsReplaced = numReplaced
                    response.json({
                        status: "success",
                        type: 'single',
                        data: {
                            item: {
                                name: item.name,
                                new_amount: item.amount,
                                category: item.category,
                                items_replaced: item.itemsReplaced
                            }
                        },
                        timestamp: item.timestamp
                    })
                })
            }
        } else {
            response.json({
                status: 'success',
                type: 'multiple',
                data: {
                    items: found
                },
                timestamp: Date.now()
            })
        }
    })
})

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});