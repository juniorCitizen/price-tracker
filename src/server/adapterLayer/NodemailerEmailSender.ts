import nodemailer from 'nodemailer'
import {Address} from 'nodemailer/lib/mailer'
import {Sending} from '../appLayer/Presenter'

export abstract class NodemailerEmailSender<PAYLOAD>
  implements Sending<PAYLOAD>
{
  protected transporter

  constructor(
    connectionString: string | undefined,
    protected sender: Address,
    protected recipient: Address,
  ) {
    try {
      this.transporter = nodemailer.createTransport(connectionString)
    } catch (error) {
      if (error instanceof Error) {
        const msg = `fail to initialize Nodemailer(${error.message})`
        throw new Error(msg)
      }
      throw error
    }
  }

  abstract send(payload: PAYLOAD): Promise<void>
}

export default NodemailerEmailSender
