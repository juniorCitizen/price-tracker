import {FetchFilter} from '../../domainLayer/FetchFilter'
import {PriceData} from '../../domainLayer/PricingData'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {HttpResponder} from './HttpResponder'
import {ParametersRepoistory} from './ParametersRepository'
import {PriceRecordRepository} from './PriceRecordRepsitory'
import {ReportPresenter} from './ReportPresenter'

export class PricingReporter {
  private reportDataset: PriceData[] = []

  constructor(
    private parametersRepository: ParametersRepoistory,
    private priceRecordRepository: PriceRecordRepository,
    private reportPresenter: ReportPresenter,
    private httpResponder: HttpResponder,
  ) {}

  async report(): Promise<void> {
    try {
      const listOfParameters = await this.parametersRepository.fetch()
      if (listOfParameters.length === 0) {
        const reason = 'no parameters for reportable asset found'
        const msg = `no pricing date to report (${reason})`
        this.httpResponder.noContent(msg)
        return
      }
      for (const parameters of listOfParameters) {
        const [latest, previous] = await this.priceRecordRepository.fetch(
          TradedAssetId.create(parameters.tradedAssetId),
          FetchFilter.create({order: 'descending', pageNumber: 1, pageSize: 2}),
        )
        if (latest !== undefined) {
          const reportData = PriceData.create({
            parameters,
            latest,
            previous,
          })
          this.reportDataset.push(reportData)
        }
      }
      if (this.reportDataset.length === 0) {
        const reason = 'no pricing data from any reportable assets'
        const msg = `no pricing date to report (${reason})`
        this.httpResponder.noContent(msg)
        return
      }
      await this.reportPresenter.send(this.reportDataset)
      this.httpResponder.ok()
    } catch (error) {
      this.httpResponder.report(error)
    }
  }
}

export default PricingReporter
