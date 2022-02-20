const messagesGroup = document.getElementsByClassName('bubbles-date-group')
let messagesLength = messagesGroup[messagesGroup.length - 1].children.length


async function sendMessage(message) {

    try {


        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:3001/send', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("\n###MENSAGEM ENVIADA###")
            }
        }

        xhr.send('message=' + message.replace('📍,', '📍\n'))



    } catch (e) {
        console.log("\n###MENSAGEM NÃO ENVIADA###")
        console.error(e)
    }
}

function formatMessage(piece) {

    if (piece.includes('🚨')) {
        piece = piece.replace(/[🚨]+/g, "");
    }

    if (piece.toLowerCase().includes('atenção')) {
        return `📍${piece}📍`
    }

    if (piece.includes('http')) {
        piece = piece.replace('🎯', '')
        return `🔗${piece}🔗`
    }

    if (piece.toLowerCase().includes('green')) {
        return `✅${piece}✅`
    }
    return piece.replace(' , ', '')
}

let lastMessage = '';

const messagesSent = []

async function main(isGreen = false) {

    const time = setInterval(async () => {

        let currentMessagesGroup = document.getElementsByClassName('bubbles-date-group')
        let currentMessagesLength = currentMessagesGroup[currentMessagesGroup.length - 1].children.length

        if (currentMessagesLength >= messagesLength) {
            if (currentMessagesLength > messagesLength) {
                messagesLength++
            }

            let lastMessageFormatted = await getMessages()



            if (lastMessageFormatted.toLowerCase().includes('confirmada') && lastMessage.toLowerCase().includes('green')) {
                return
            }

            if ((lastMessageFormatted != lastMessage && lastMessageFormatted.length != 0) || lastMessageFormatted.includes('confirmada')) {

                lastMessage = lastMessageFormatted

                if (messagesSent[messagesSent.length - 2]) {
                    if (messagesSent[messagesSent.length - 2] != lastMessageFormatted && messagesSent[messagesSent.length - 1] != lastMessageFormatted) {
                        sendMessage(lastMessage)
                        messagesSent.push(lastMessageFormatted)

                        return
                    }
                    return
                }

                messagesSent.push(lastMessageFormatted)

                sendMessage(lastMessage)
            }

        }

    }, 5000)

}

async function getMessages(isGreen = false) {

    const messages = document.getElementsByClassName('is-in')
    let mindex = (isGreen && !lastMessage.includes('Confirmada')) ? messages.length - 2 : messages.length - 1
    let message = messages[mindex]

    const messageChildren1 = message.children[0]
    const messageChildren2 = messageChildren1.children[0]

    if (messageChildren2.children[0].className.includes('bubble-beside-button')) {
        messageChildren2.removeChild(messageChildren2.children[0])
    }
    message = messageChildren2.children[0].innerText
    let formattedMessage = []
    let emojisGetteds = []

    message.split('\n').forEach(text => {

        formattedMessage.push(formatMessage(text))
    })
    formattedMessage.pop()

    //verifyEmojis 1
    const emojisInMessage = messageChildren2.children[0].children
    let hasEmoji1 = false
    for (let index = 0; index < emojisInMessage.length; index++) {
        const pieceOfMessage = emojisInMessage[index]
        if (pieceOfMessage.className == 'emoji') {
            hasEmoji1 = true

            if (pieceOfMessage.getAttribute('src').includes('26ab')) {
                emojisGetteds.push('⚫️')
                break
            }
            if (pieceOfMessage.getAttribute('src').includes('1f534.png')) {
                emojisGetteds.push('🔴')
                break
            }
        }
    }

    //verifyEmojis2

    const emojisInAttachment = messageChildren2.children[(messageChildren2.children[1].className == 'reply') ? 2 : 1]
    let hasEmoji2 = false
    if (emojisInAttachment.className == 'attachment') {
        for (let index = 0; index < emojisInAttachment.children.length; index++) {
            const pieceOfMessage = emojisInAttachment.children[index]
            if (pieceOfMessage.className == 'emoji') {
                hasEmoji2 = true

                if (pieceOfMessage.getAttribute('src').includes('26ab.png')) {
                    emojisGetteds.push('⚫️')
                    break
                }
                if (pieceOfMessage.getAttribute('src').includes('1f534.png')) {
                    emojisGetteds.push('🔴')
                    break
                }
            }
        }
    }

    if (emojisGetteds.length) {

        emojisGetteds = emojisGetteds.filter(emoji => emoji == '🔴' || emoji == '⚫️')
    }

    let allMessage = `${emojisGetteds[0]}-${formattedMessage}-${emojisGetteds[0]}`;


    if (!emojisGetteds.length) {
        allMessage = allMessage.replace('undefined', '')
        allMessage = allMessage.replace('undefined', '')
    }

    allMessage = allMessage.replace('-', '')
    allMessage = allMessage.replace('-', '')
    allMessage = allMessage.substring(0, allMessage.length - 2)

    allMessage = allMessage.replace(' , ', '\n')
    allMessage = allMessage.replace(',  BLAZEZORD', '\nBLAZEZORD')
    allMessage = allMessage.replace('BLAZEZORD', 'https://blaze.com/pt/games/double')

    if (allMessage.toLowerCase().includes('green') && !isGreen) {
        return await getMessages(true)
    }

    if (allMessage.toLocaleLowerCase().includes("entrada confirmada")) {
        allMessage = allMessage.replace(`${emojisGetteds[0]} Entrada Confirmada,`, `📍 Entrada Confirmada 📍\n`)
        allMessage = allMessage.replace('Entrar no', 'Entrar no ' + emojisGetteds[0] + '\n')
    }

    if (allMessage.includes('Confirmada')) {
        allMessage = allMessage.split('\n')
        allMessage.pop()

        allMessage = allMessage.join('\n')
    }


    return allMessage

}


main()