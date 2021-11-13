const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '2145020064:AAE13AmegdiY46lcPZQnekRr310_QTB9eGk'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадал цифру от 0 до 9, а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/11.webp')
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай число'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/4.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаюб попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
           return  startGame(chatId)
        }

        if (data === chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/1.webp')
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/23.webp')
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()