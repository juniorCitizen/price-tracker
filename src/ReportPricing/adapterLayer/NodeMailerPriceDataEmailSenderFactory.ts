import {Address} from 'nodemailer/lib/mailer'
import {Subscriber} from '../../domainLayer/Subscriber'
import {ReportPresenter} from '../appLayer/ReportPresenter'
import {ReportPresenterFactory} from '../appLayer/ReportPresenterFactory'
import NodeMailerPriceDataEmailSender from './NodeMailerPriceDataEmailSender'

export class NodeMailerPriceDataEmailSenderFactory
  implements ReportPresenterFactory
{
  constructor(
    private connectionString: string | undefined,
    private sender: Address,
  ) {}

  make(recipient: Subscriber): ReportPresenter {
    return new NodeMailerPriceDataEmailSender(
      this.connectionString,
      this.sender,
      {
        name: recipient.name,
        address: recipient.email,
      },
    )
  }
}
