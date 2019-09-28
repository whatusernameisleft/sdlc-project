let name, amountString, amount, category, button, idInput, _id, outputText

async function submit() {
    name = document.getElementById("itemName").value.trim()
    amountString = document.getElementById("itemAmount").value
    category = document.getElementById("itemCategory").value.trim()
    amount = parseInt(amountString)
    const item = {
        name,
        amount,
        category
    }

    if (!name || !amountString || !category) {
        $('#submitText').css('color', 'red')
        $('#submitText').html('Please do not leave out any blank spaces')
        setTimeout(() => {
            $('#submitText').html('')
        }, 1000)
        return
    } else if (amount < 0) {
        $('#submitText').css('color', 'red')
        $('#submitText').html('Please insert a valid amount')
        setTimeout(() => {
            $('#submitText').html('')
        }, 1000)
        return
    }

    await fetch('/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item
            })
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            console.log(response)
            submitted(response)
        })
}

function submitted(response) {
    const time = moment(response.timestamp).format('MMMM Do YYYY, hh:mm:ss a')
    const submitText = $('#submitText')
    switch (response.type) {
        case 'single':
            const replaced = response.data.item.items_replaced
            const amount = response.data.item.new_amount

            if (amount === 0) {
                submitText.html(`Submitted. ${replaced} item has been removed at ${time}.`)
            } else {
                submitText.html(`Submitted. ${replaced} item has been replaced at ${time}.`)
            }

            setTimeout(() => {
                submitText.html('')
            }, 1000)
            break
        case 'multiple':
            if (response.data.items.length === 0) {
                submitText.html(`Found ${response.data.items.length} matches for item [${name}] under category [${category}]`)
                setTimeout(() => {
                    submitText.html('')
                }, 1000)
                return
            }
            submitText.html(`Found ${response.data.items.length} matches for item [${name}] under category [${category}]`)
            generateTable(response)
            break
    }
}

function generateTable(input) {
    const dataLength = input.data.items.length
    const items = input.data.items

    if (dataLength > 0) {
        const tHead = document.createElement("thead")
        const hRow = document.createElement("tr")
        const tBody = document.createElement("tbody")
        const div = $('#multipleResults')
        button = document.createElement('button')
        idInput = document.createElement('input')
        button.innerHTML = 'Submit'
        idInput.type = 'text'
        outputText = document.createElement('span')
        let column = []
        const table = document.createElement("table")

        table.style.width = '50%';
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');

        items.forEach(item => {
            for (let key in item) {
                if (column.indexOf(key) === -1) {
                    column.push(key)
                }
            }
        })

        column.forEach(col => {
            const th = document.createElement("th")
            th.innerHTML = col
            hRow.appendChild(th)
        })
        tHead.appendChild(hRow);
        table.appendChild(tHead)

        items.forEach(item => {
            const bRow = document.createElement("tr")

            column.forEach(col => {
                const td = document.createElement("td")
                if (col == "timestamp") {
                    td.innerHTML = moment(item[col]).format("MMMM Do YYYY, hh:mm:ss a")
                } else {
                    td.innerHTML = item[col]
                }
                bRow.appendChild(td)
            })
            tBody.appendChild(bRow)
        })
        table.appendChild(tBody)

        div.html('')
        div.append(table)
        div.append('<br><span style="color:green">Input the id of the item you want to edit</span><br>')
        div.append(idInput)
        div.append(button)
        div.append('<br>')
        div.append(outputText)

        button.onclick = async () => {
            _id = idInput.value.trim()

            if (!_id) {
                const text = document.createTextNode('Please input a valid id')
                outputText.style = 'color:red'
                outputText.appendChild(text)
                setTimeout(() => {
                    outputText.innerHTML = ''
                }, 1000)
            } else {
                const item = {
                    name,
                    amount,
                    category,
                    _id
                }

                await fetch('/edit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            item
                        })
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(response => {
                        console.log(response)
                        idSubmitted(response)
                    })

            }
            console.log(_id)
        }
    }
}

function idSubmitted(response) {
    const time = moment(response.timestamp).format('MMMM Do YYYY, hh:mm:ss a')
    outputText.style = 'color:green'
    switch (response.type) {
        case 'single':
            const replaced = response.data.item.items_replaced
            if (replaced == 1) {
                outputText.appendChild(document.createTextNode(`Submitted. ${replaced} item has been replaced at ${time}.`))
            } else {
                outputText.appendChild(document.createTextNode(`Submitted. ${replaced} items have been replaced at ${time}.`))
            }
            setTimeout(() => {
                $('#multipleResults').html('')
                $('#submitText').html('')
            }, 1000)
            break
        case 'multiple':
            if (response.data.items.length === 0) {
                outputText.appendChild(document.createTextNode('Please insert a valid id'))
                setTimeout(() => {
                    outputText.innerHTML = ''
                }, 1000)
                return
            }
            break
    }
}