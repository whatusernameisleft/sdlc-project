(async () => {
    const response = await fetch("/items")
    const data = await response.json()
    const dataLength = data.length
    const tHead = document.createElement("thead")
    const hRow = document.createElement("tr")
    const tBody = document.createElement("tbody")
    const table = document.getElementById("table")
    const div = $('#itemTable')
    let column = []

    if (dataLength > 0) {
        data.forEach(item => {
            for (let key in item) {
                if (column.indexOf(key) === -1) {
                    column.push(key)
                }
            }
        })


        column.forEach(col => {
            if (col == '_id') return;
            const th = document.createElement("th")
            th.innerHTML = col
            hRow.appendChild(th)
        })
        tHead.appendChild(hRow);
        table.appendChild(tHead)

        data.forEach(item => {
            const bRow = document.createElement("tr")

            column.forEach(col => {
                if (col == '_id') return;
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
    } else {
        div.html("There is nothing here.")
    }
    console.log(data)
})()