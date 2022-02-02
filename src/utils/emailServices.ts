import sgMail from '@sendgrid/mail';
import logger from '../config/winston';

type Message = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
};

const sendgridAPIKEY = process.env.SENDGRID_API_KEY as string;
const from = process.env.SENDER_EMAIL as string;

const emailHeader = `<header></header>`;
const emailFooter = `<footer><p>If you did not request this, please ignore this email.</p></footer>`;

sgMail.setApiKey(sendgridAPIKEY);

const sgSendEmail = async (msg: Message): Promise<boolean> => {
  sgMail.setApiKey(sendgridAPIKEY);
  try {
    await sgMail.send(msg);
    return true;
  } catch (error: unknown) {
    logger.error(error);
    return false;
  }
};

const sendEmail = async (to: string, subject: string, content: string) => {
  const html = emailHeader + content + emailFooter;
  const email = {
    to,
    from,
    subject,
    html,
  };
  return sgSendEmail(email);
};

const emailTemplate = {
  confirmEmail: (firstName: string, link: string): string =>
    `
  <article>
    <p>Hi ${firstName}</p>
    <p>Thank you for registering into our Devils CRM. Much Appreciated! Just one last step is laying ahead of you...</p>
    <p> Click to verify your email: <a href="${link}"> Confirm your Email</a>  </p>
    <p>Best Regard</p>
    <p>Devils Team</p>
  </article>
  `,

  resetPasswordEmail: (firstName: string, link: string): string =>
    `
  <article>
    <p>Hi ${firstName}</p>
    <p>Click to reset your password: <a href="${link}"> Reset Password</a></p>
    <p>Best Regard</p>
    <p>Devils Team</p>
  </article>
  `,
};

export { sendEmail, emailTemplate };
