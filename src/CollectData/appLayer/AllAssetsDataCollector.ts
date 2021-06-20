import {NoWorkableParameters} from '../../appLayer/errors'
import {Parameters} from '../../domainLayer/Parameters'
import DataCollector, {
  DataScrapingFailure,
  RecordAlreadyExists,
} from './DataCollector'

export class AllAssetsDataCollector extends DataCollector {
  private async fetchParameterList(): Promise<Parameters[]> {
    const parametersList = await this.parametersRepository.fetch()
    if (parametersList.length === 0) {
      const msg = 'found no workable data collection parameters'
      throw new NoWorkableParameters(msg)
    }
    return parametersList
  }

  async collectData(): Promise<void> {
    try {
      const parametersList = await this.fetchParameterList()
      for (const parameters of parametersList) {
        if (!parameters.activeStatus) {
          const msg = `${parameters.siteName} has been marked to prevent data collection`
          this.log(parameters, false, msg)
          continue
        }
        try {
          const priceRecordData = await this.scrapeWebsite(parameters)
          await this.persistData(priceRecordData, parameters)
        } catch (error) {
          let msg: string
          if (error instanceof DataScrapingFailure) {
            msg = `unable to scrape data from ${parameters.siteName} (${error.message})`
          }
          if (error instanceof RecordAlreadyExists) {
            msg = `no need to update (${error.message})`
            this.log(parameters, true, msg)
            continue
          }
          if (error instanceof Error) {
            msg = `encountered unexpected error (${error.message})`
          } else {
            msg = 'encountered unrecognized error'
          }
          this.log(parameters, false, msg)
          continue
        }
        this.log(parameters, true)
      }
      this.httpResponder.ok('data collection completed')
    } catch (error) {
      if (error instanceof NoWorkableParameters) {
        this.httpResponder.notFound(error.message)
        return
      }
      this.httpResponder.report(error)
    }
  }
}

export default AllAssetsDataCollector
