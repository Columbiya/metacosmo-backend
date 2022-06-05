import { v4 as uuidv4, } from 'uuid'
import models from '../models/models.js';
import ApiError from './../error/ApiError.js';
import nodemailer from 'nodemailer'
import * as fs from 'fs/promises'
import { existsSync, unlink } from 'fs';
import path from 'path';

class EmailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            service: "Mail.ru",
            host: "smtp.mail.ru",
            port: 993,
            secure: false,
            auth: {
                user: "support@metacosmo.space",
                pass: "t#doiEyYPT33"
            }
        })
    }

    async getEmailsWithTxt() {
        const __dirname = path.resolve()
        if (existsSync(path.resolve(__dirname, 'emails-database', 'database.txt'))) {
            fs.unlink(path.resolve(__dirname, 'emails-database', 'database.txt'), (err) => {
                if (err) throw err
            })
        }

        let i = 0
        let step = 20
        let offset = step * i
        let count
        do {
            const emails = await models.Email.findAndCountAll({offset, limit: step})
            count = emails.count
            const fd = await fs.open(path.resolve(__dirname, 'emails-database', 'database.txt'), 'a')
            emails.rows.forEach(email => {
                if (!email.isActivated) return

                fs.appendFile(fd, email.email + "\n", (err) => {
                    if (err) throw err
                })
            })
            i++;
            offset = step * i
        } while(offset < count)
    }

    async broadcast(element, isNews) {
        const step = 20
        let i = 0
        let offset = step * i
        let check = {rows: [{isActivated: true, email: 'webdev.columbiya@mail.ru'}]}
        let emails = check.rows.length ? check: await models.Email.findAndCountAll({offset, limit: step})
        const count = emails.count

        do {
            emails.rows.forEach(async item => {
                if (!item.isActivated) return

                const date = new Date(element.createdAt)
                const day = date.getDate() < 10 ? `0${date.getDate()}`: date.getDate()
                const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1
                const year = date.getFullYear()

                let letter

                if (isNews) {
                    letter = `
                    <!DOCTYPE html
                    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>metacosmo</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap" rel="stylesheet" />
                    <style type="text/css">
                        body {
                            width: 100% !important;
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                            line-height: 100%;
                        }
                
                        [style*="Montserrat"] {font-family: 'Montserrat', arial, sans-serif !important;}
                
                        img {
                            outline: none;
                            text-decoration: none;
                            border:none;
                            -ms-interpolation-mode: bicubic;
                            max-width: 100%!important;
                            margin: 0;
                            padding: 0;
                            display: block;
                        }
                    
                        table td {
                            border-collapse: collapse;
                        }
                    
                        table {
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                        }
                    </style>
                </head>
                
                <body style="margin: 0; padding: 0;">
                    <div style="font-size:0px;font-color:#ffffff;opacity:0;visibility:hidden;width:0;height:0;display:none;">Metacosmo letter</div>
                    <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
                        <tr>
                            <td align="left" bgcolor="#00204c" style="padding-top: 10px; padding-bottom: 10px;">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td>
                                            <a href="https://metacosmo.space">
                                                <img src="https://admin.metacosmo.space/metacosmo-logo.png" alt="logo" />
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td>
                                            <h3 style="text-transform: uppercase; color: #009ff6; font-size: 72px; font-family: verdana, arial, sans-serif, 'Montserrat';">NEWS</h3>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td align="left" valign="top" width="400">
                                            <a href="https://admin.metacosmo.space/news/${element.id}" style="display: block;" width="400" height="400">
                                                <img src="http://localhost:5000/${element.img}" width="400" alt="content" />
                                            </a>
                                        </td>
                                        <td id="text" align="center" style="padding-left: 50px; vertical-align: middle;">
                                            <table class="table-400" cellpadding="0" cellspacing="0" width="400" align="center">
                                                <tr>
                                                    <td align="center">
                                                        <h3 style="text-transform: uppercase; font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 36px; line-height: 72px; margin: 0; margin-bottom: 0">
                                                            <span style="color: #009ff6">${element.subtitle.split('|||')[0]}</span>
                                                        </h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 24px; line-height: 36px; margin-top: 40px; font-weight: 700;">${element.subtitle.split('|||')[1]}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 24px; line-height: 36px; margin-bottom: 30px; font-weight: 700;">${element.title}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <a href="https://metacosmo.space/news/${element.id}" style="font-family: verdana, arial, sans-serif, 'Montserrat'; width: 200px; text-align: center; font-weight: 600; text-transform: uppercase; font-size: 26px; text-decoration: none; color: #000000; display: block; padding-top: 25px; padding-bottom: 25px; padding-right: 40px; padding-left: 40px; border-top: 1px solid #000000; border-right: 1px solid #000000; border-left: 1px solid #000000; border-bottom: 1px solid #000000;" title="Check it out">
                                                            learn more
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>	
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td align="left" width="500" style="padding-top: 170px; padding-bottom: 70px;">
                                            <table cellpadding="0" cellspacing="0" width="500" align="center">
                                                <tr>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://twitter.com/CosmoFund">
                                                                        <img src="https://admin.metacosmo.space/twitter.png" alt="twitter" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://twitter.com/CosmoFund" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">twitter</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://discord.gg/xZE76828j5">
                                                                        <img src="https://admin.metacosmo.space/discord.png" alt="discord" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://discord.gg/xZE76828j5" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">discord</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://t.me/CosmoFundChannel">
                                                                        <img src="https://admin.metacosmo.space/telegram.png" alt="telegram" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://t.me/CosmoFundChannel" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">telegram</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://www.instagram.com/CosmoFundArt/">
                                                                        <img src="https://admin.metacosmo.space/instagram.png" alt="instagram" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://www.instagram.com/CosmoFundArt/" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">instagram</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://cosmofund.medium.com">
                                                                        <img src="https://admin.metacosmo.space/medium.png" alt="medium" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://cosmofund.medium.com" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">medium</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 70px;">
                                            <table cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-family: Verdana; font-size: 18px; line-height: 36px; text-transform: uppercase;">You have received this email because you are subscribed to the metacosmo mailing list</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <a style="font-family: Verdana; font-size: 18px; line-height: 36px; text-transform: uppercase; color: #000000;" href="https://admin.metacosmo.space/api/emails/unsubscribe/${item.unsubscribeLink}}">click here to unsubscribe</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                
                </html>
                    `
                }
                else {
                    letter = `
                    <!DOCTYPE html
                    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>metacosmo</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap" rel="stylesheet" />
                    <style type="text/css">
                        body {
                            width: 100% !important;
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                            line-height: 100%;
                        }
                
                        [style*="Montserrat"] {font-family: 'Montserrat', arial, sans-serif !important;}
                
                        img {
                            outline: none;
                            text-decoration: none;
                            border:none;
                            -ms-interpolation-mode: bicubic;
                            max-width: 100%!important;
                            margin: 0;
                            padding: 0;
                            display: block;
                        }
                    
                        table td {
                            border-collapse: collapse;
                        }
                    
                        table {
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                        }
                    </style>
                </head>
                
                <body style="margin: 0; padding: 0;">
                    <div style="font-size:0px;font-color:#ffffff;opacity:0;visibility:hidden;width:0;height:0;display:none;">Metacosmo letter</div>
                    <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
                        <tr>
                            <td align="left" bgcolor="#00204c" style="padding-top: 10px; padding-bottom: 10px;">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td>
                                            <a href="https://metacosmo.space">
                                                <img src="https://admin.metacosmo.space/metacosmo-logo.png" alt="logo" />
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td align="center">
                                            <h3 style="text-transform: uppercase; color: #009ff6; font-size: 72px; font-family: verdana, arial, sans-serif, 'Montserrat';">ARTICLE</h3>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#fff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td align="left" width="300">
                                            <table cellpadding="0" cellspacing="0" width=400" height="400" align="center">
                                                <tr>
                                                    <td bgcolor="#009ff6" style="height: 60px; font-size: 18px; color: #ffffff; padding-right: 30px; font-weight: 800; padding-left: 30px; font-family: verdana, arial, sans-serif, 'Montserrat'; padding-top: 10px; padding-bottom: 10px;" align="left">${new URL(element.address).hostname}</td>
                                                    <td bgcolor="#009ff6" style="height: 60px; font-size: 18px; color: #ffffff; font-weight: 800; padding-right: 30px; padding-left: 30px; font-family: verdana, arial, sans-serif, 'Montserrat'; padding-top: 10px; padding-bottom: 10px;" align="right">${day} / ${month} / ${year}</td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#edefee" style="vertical-align: top; height: 230px;" colspan="2">
                                                        <h3 style="font-size: 24px; line-height: 24px; font-family: verdana, arial, sans-serif, 'Montserrat'; margin-right: 30px; margin-left: 30px; margin-top: 30px;">${element.title}</h3>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#edefee" colspan="2" style="padding-right: 30px; padding-left: 30px;">
                                                        <a href="https://metacosmo.space/articles/${element.id}" style="text-transform: uppercase; font-size: 24px; text-decoration: none; margin-bottom: 30px; display: block; color: #000000; font-family: verdana, arial, sans-serif, 'Montserrat';">read article</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>	
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff">
                                <table class="table-800" cellpadding="0" cellspacing="0" width="800" align="center">
                                    <tr>
                                        <td align="left" width="500" style="padding-top: 170px; padding-bottom: 70px;">
                                            <table cellpadding="0" cellspacing="0" width="500" align="center">
                                                <tr>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://twitter.com/CosmoFund">
                                                                        <img src="https://admin.metacosmo.space/twitter.png" alt="twitter" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://twitter.com/CosmoFund" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">twitter</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://discord.gg/xZE76828j5">
                                                                        <img src="https://admin.metacosmo.space/discord.png" alt="discord" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://discord.gg/xZE76828j5" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">discord</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://t.me/CosmoFundChannel">
                                                                        <img src="https://admin.metacosmo.space/telegram.png" alt="telegram" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://t.me/CosmoFundChannel" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">telegram</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://www.instagram.com/CosmoFundArt/">
                                                                        <img src="https://admin.metacosmo.space/instagram.png" alt="instagram" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://www.instagram.com/CosmoFundArt/" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">instagram</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td align="center">	
                                                        <table cellpadding="0" cellspacing="0" width="140" align="center">
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://cosmofund.medium.com">
                                                                        <img src="https://admin.metacosmo.space/medium.png" alt="medium" />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <a href="https://cosmofund.medium.com" style="color: #000000; text-decoration: none;">
                                                                        <p style="font-family: verdana, arial, sans-serif, 'Montserrat'; font-size: 18px; line-height: 30px; text-transform: uppercase;">medium</p>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 70px;">
                                            <table cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-family: Verdana; font-size: 18px; line-height: 36px; text-transform: uppercase;">You have received this email because you are subscribed to the metacosmo mailing list</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center">
                                                        <a style="font-family: Verdana; font-size: 18px; line-height: 36px; text-transform: uppercase; color: #000000;" href="https://admin.metacosmo.space/api/emails/unsubscribe/${item.unsubscribeLink}">click here to unsubscribe</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                
                </html>
                    `
                }

                const message = await this.sendMail({email: item.email, subject: `There's a new article on metacosmo.space`,
                                from: process.env.SUPPORT_MAIL,
                                html: letter
                            })
                console.log(message.messageId)
            })
            i++
            offset = step * i
            emails = check.rows.length ? check: await models.Email.findAndCountAll({offset, limit: step})
        } while (offset < count)
    }

    async subscribe(email, ip, bannedIps) {
        if (!email) {
            throw ApiError.badRequest('No email specified')
        }

        const candidate = await models.Email.findOne({where: {email}})
        if (candidate) {
            throw ApiError.badRequest(`There's an email subscribed with what you just typed in. Look at your emails to activate the subscription if they dont come up`)
        }

        if (bannedIps.includes(ip)) {
            throw ApiError.forbidden('5 minutes timeout')
        }

        const unsubscribeLink = uuidv4()
        const verifyLetter = `
        <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>metacosmo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap" rel="stylesheet" />
        <style type="text/css">
            body {
                width: 100% !important;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                margin: 0;
                padding: 0;
                line-height: 100%;
            }
    
            [style*="Montserrat"] {font-family: 'Montserrat', arial, sans-serif !important;}
    
            img {
                outline: none;
                text-decoration: none;
                border:none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%!important;
                margin: 0;
                padding: 0;
                display: block;
            }
        
            table td {
                border-collapse: collapse;
            }
        
            table {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
        </style>
    </head>
    
    <body style="margin: 0; padding: 0;">
        <div style="font-size:0px;font-color:#ffffff;opacity:0;visibility:hidden;width:0;height:0;display:none;">Metacosmo letter</div>
        <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
            <tr>
                <td>
                    <a href="https://metacosmo.space/activate/${unsubscribeLink}">
                        <img src="https://admin.metacosmo.space/Metacosmo-mail-verify.jpg" alt="metacosmo activate image" />
                    </a>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
        `
        const message = await this.sendMail({
              email, 
              from: process.env.SUPPORT_MAIL,
              subject: "activate the subscription on metacosmo.space", 
              html: verifyLetter,
        })

        console.log(message.messageId)

        const createdEmail = await models.Email.create({ email, unsubscribeLink })
        return createdEmail
    }

    async unsubscribe(link) {
        if (!link) {
            throw ApiError.badRequest('Не указана ссылка, по которой отписываться от рассылки')
        }

        const candidate = await models.Email.findOne({where: { link }})

        if (!candidate) {
            throw ApiError.badRequest('Email c такой ссылкой отписки не существует')
        }

        await candidate.destroy()
        return candidate
    }

    async activate(link) {
        if (!link) {
            throw ApiError.badRequest('Не указана ссылка по которой email нужно активировать')
        }

        const candidate = await models.Email.findOne({where: { unsubscribeLink: link }})

        if (!candidate) {
            throw ApiError.badRequest('Email c такой ссылкой отписки не существует')
        }

        candidate.isActivated = true
        await candidate.save()
        return candidate
    }

    async sendMail({ email = "", text = "", html = "", subject = "", from = "" }) {
        return await this.transport.sendMail({
            from,
            to: email,
            subject,
            text,
            html
        })
    }

}

export default new EmailService()