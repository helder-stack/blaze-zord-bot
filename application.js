require('dotenv/config');
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require("fs")
const bp = require('body-parser')

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())

require('dotenv').config();

const wa = require('@open-wa/wa-automate');



let client = wa.create({
    sessionId: `${Date.now()}`,
    multiDevice: true, //required to enable multiDevice support
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: false,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0,
    sessionDataPath: './sessions'
}).then(connected => client = connected).catch(e=> console.log("Desconectado"))


app.post("/send", async (req, res) => {

        client.sendText(process.env.whatsapp_chat_id, req.body.message).then(s => console.log("Mensagem enviada")).catch(e=> console.log("Não enviada", e));
        res.sendStatus(200)
})

app.listen(3001, async (error) => {
    if (!error) {
        console.log("Server is running...")
    }


})




/*
    PASSO A PASSO DE COMO RODAR O PROGRAMA.

    1- RODE O YARN --ignore-engines
    2 - node application
    3 - copie o seguinte código depois que o wa conectar:

       


    4 - abra o chat que deseja pegar as mensagens no telegram
    5 - Aperte Ctrl+shift+I 
    6 - cole o código no console
*/