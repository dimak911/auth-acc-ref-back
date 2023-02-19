import nodemailer, { TransportOptions } from "nodemailer";
import {
  SMTP_HOST as HOST,
  SMTP_PORT,
  EMAIL_LOGIN,
  EMAIL_PASSWORD,
  API_URL,
} from "../config/default";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: EMAIL_LOGIN,
        pass: EMAIL_PASSWORD,
      },
    } as TransportOptions);
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: EMAIL_LOGIN,
      to,
      subject: `Account activation on ${API_URL}`,
      text: "",
      html: `
              <div>
                <h1>
                  To activate your account <a href="${link}" target="_blank">Click here</a>  
                </h1>
              </div>
            `,
    });
  }
}

export default new MailService();
