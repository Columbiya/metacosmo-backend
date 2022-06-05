import emailService from "./emailService.js"
import path from 'path'

let throttling = []

class EmailController {

    async subscribe(req, res, next) {
        try {
            const { email } = req.body
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            const createdEmail = await emailService.subscribe(email, ip, throttling)

            throttling.push(ip)
            setTimeout(() => {
                throttling = throttling.filter(item => ip !== item)
            }, 300000)

            return res.json(createdEmail)
        } catch(e) {
            next(e)
        }
    }

    async getAllWithTxt(req, res, next) {
        try {
            await emailService.getEmailsWithTxt()
            const __dirname = path.resolve()
            const pathToFile = path.resolve(__dirname, 'emails-database', 'database.txt')
            return res.download(pathToFile)
        } catch(e) {
            next(e)
        }
    }

    async unsubscribe(req, res, next) {
        try {
            const { link } = req.params
            const unsubscribedEmail = await emailService.unsubscribe(link)
            return res.json(unsubscribedEmail)
        } catch(e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params
            const activatedEmail = await emailService.activate(link)
            return res.json(activatedEmail)
        } catch(e) {
            next(e)
        }
    }

    async sendFeedback(req, res, next) {
        try {
            const { email, name, specialization, howYouCanHelp, telegram } = req.body
            const html = `
                <p>Email to get in touch: ${email}</p>
                <p>Name: ${name}</p>
                <p>Specialization: ${specialization}</p>
                <p>How they can help create a new world: ${howYouCanHelp}</p>
                <p>Their telegram: ${telegram}</p>
            `
            const sentMessage = await emailService.sendMail({ email: 'support@metacosmo.space', from: 'support@metacosmo.space', html, subject: 'New feedback on become a dev on metacosmo.space' })
            return res.json(sentMessage.messageId)
        } catch(e) {
            next(e)
        }
    }

}

export default new EmailController()