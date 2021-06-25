import Mail from 'nodemailer/lib/mailer'
import NodemailerEmailSender from '../adapterLayer/NodemailerEmailSender'
import {PricingReport} from '../domainLayer/PricingReport'
import {FailedToPresentReport, ReportPresenter} from './PricingReporter'

export class NodemailerPricingReportEmailSender
  extends NodemailerEmailSender<PricingReport[]>
  implements ReportPresenter
{
  async send(pricingReports: PricingReport[]): Promise<void> {
    try {
      const textMessageBody = pricingReports.map(r => r.summary).join('\n')
      const mailOptions = this.makeMailOptions(textMessageBody)
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      if (error instanceof Error) {
        const {response} = error as Error & {response: unknown}
        if (typeof response === 'string') {
          throw new FailedToPresentReport(response)
        }
      }
      throw error
    }
  }

  private makeMailOptions(messageBody: string): Mail.Options {
    const timeOfReport = new Date().toLocaleString()
    return {
      from: this.sender,
      sender: this.sender.name,
      replyTo: this.sender.address,
      to: this.recipient,
      subject: `${timeOfReport} 最新交易價格通報`,
      text: messageBody,
    }
  }
}

export default NodemailerPricingReportEmailSender
