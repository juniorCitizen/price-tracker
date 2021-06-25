import {Address} from 'nodemailer/lib/mailer'
import {Subscriber} from '../domainLayer/Subscriber'
import NodemailerPricingReportEmailSender from './NodemailerPricingReportEmailSender'
import {ReportPresenter} from './PricingReporter'
import {ReportPresenterFactory} from './PricingReporterDriver'

export class NodemailerPricingReportEmailSenderFactory
  implements ReportPresenterFactory
{
  constructor(
    private connectionString: string | undefined,
    private sender: Address,
  ) {}

  make(subscriber: Subscriber): ReportPresenter {
    return new NodemailerPricingReportEmailSender(
      this.connectionString,
      this.sender,
      {
        name: subscriber.name.value,
        address: subscriber.email.value,
      },
    )
  }
}

export default NodemailerPricingReportEmailSenderFactory
