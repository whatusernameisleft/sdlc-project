(async () => {
    const response = await fetch("/orderlist")
    const data = await response.json()
    const dataLength = data.length
    const tHead = document.createElement("thead")
    const hRow = document.createElement("tr")
    const tBody = document.createElement("tbody")
    const div = $('#itemTable')
    let column = []

    if (dataLength > 0) {
        const table = document.createElement("table")
        table.style.width = '50%';
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');

        data.forEach(item => {
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

        data.forEach(item => {
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
    } else {
        div.html("There is nothing here.")
    }
    console.log(data)
})()