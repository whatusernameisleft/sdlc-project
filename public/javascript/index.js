async function submit() {
    const name = document.getElementById("itemName").innerHTML.trim()
    const amountString = document.getElementById("itemAmount").innerHTML
    const category = document.getElementById("itemCategory").innerHTML.trim()
    const amount = parseInt(amountString)
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
    } else if (amount == 0 || amount < 0) {
        $('#submitText').css('color', 'red')
        $('#submitText').html('Please insert a valid amount')
        setTimeout(() => {
            $('#submitText').html('')
        }, 1000)
        return
    }

    await fetch('/items', {
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
            submitted()
        })
}

function submitted() {
    $('#submitText').css('color', 'green')
    $('#submitText').html('Submitted')
    setTimeout(() => {
        $('#submitText').html('')
    }, 1000)
}