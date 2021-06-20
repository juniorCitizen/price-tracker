import {JWT, JWTInput} from 'google-auth-library'
import {google, sheets_v4} from 'googleapis'
import {Fetching, FetchingById} from '../appLayer/ParametersRepository'
import {Parameters} from '../domainLayer/Parameters'
import {TradedAssetId} from '../domainLayer/TradedAssetId'

export class ParametersGoogleSheetsRepository
  implements Fetching, FetchingById
{
  private api: sheets_v4.Sheets
  private authClient: JWT
  private sheetAndRange = 'parameters-list!A:K'
  private spreadsheetId: string

  constructor(options: {
    spreadsheetId: string | undefined
    credentials: string | undefined
  }) {
    if (options.spreadsheetId === undefined) {
      const msg = 'Google Sheets spreadsheet id is undefined'
      throw new Error(msg)
    }
    this.spreadsheetId = options.spreadsheetId
    if (options.credentials === undefined) {
      const msg = 'Google API credentials is undefined'
      throw new Error(msg)
    }
    const credentials = JSON.parse(
      options.credentials.replace(/\n/g, '\\n'),
    ) as JWTInput
    this.authClient = google.auth.fromJSON(credentials) as JWT
    this.authClient.scopes = ['https://www.googleapis.com/auth/spreadsheets']
    this.api = google.sheets({version: 'v4', auth: this.authClient})
  }

  async fetchById(tradedAssetId: TradedAssetId): Promise<Parameters | null> {
    const parametersList = await this.fetch()
    const filterPredicate = this.makeFilterPredicate(tradedAssetId)
    const filteredParametersList = parametersList.filter(filterPredicate)
    if (filteredParametersList.length > 1) {
      const reason = `filtering by ${tradedAssetId.value} yielded multiple parameters records`
      const msg = `currupted master data: ${reason}`
      throw new Error(msg)
    }
    if (filteredParametersList.length === 0) {
      return null
    }
    const parameters = filteredParametersList[0]
    if (parameters === undefined) {
      const msg = `parameters item fetched by ${tradedAssetId.value} is undefined`
      throw new Error(msg)
    }
    return parameters
  }

  private makeFilterPredicate(
    tradedAssetId: TradedAssetId,
  ): (i: Parameters) => i is Parameters {
    return function filter(currentItem: Parameters): currentItem is Parameters {
      return currentItem.tradedAssetId === tradedAssetId.value
    }
  }

  async fetch(): Promise<Parameters[]> {
    const response = await this.api.spreadsheets.values.get({
      auth: this.authClient,
      range: this.sheetAndRange,
      spreadsheetId: this.spreadsheetId,
    })
    if (response.status !== 200) {
      const reason = `${response.status} ${response.statusText}`
      const msg = `Failure to fetch data from Google Sheets (reason: ${reason})`
      throw new Error(msg)
    }
    const rows = response.data.values
    if (!Array.isArray(rows)) {
      const msg = `dataset fetched from Google Sheets is not an array of arrays`
      throw new Error(msg)
    }
    const parametersList = rows.reduce(this.reducer.bind(this), [])
    const listOfIds = parametersList.map(parameters => parameters.tradedAssetId)
    if (new Set(listOfIds).size !== listOfIds.length) {
      const reason = 'multiple parameters records has the same traded asset id'
      const msg = `currupted master data: ${reason}`
      throw new Error(msg)
    }
    return parametersList
  }

  private reducer(
    currentSet: Parameters[],
    currentRow: unknown[],
    rowIndex: number,
  ): Parameters[] {
    const ref = `parameters record (index: ${rowIndex})`
    try {
      if (currentRow.length !== 11) {
        const msg = `${ref} does not have exactly 11 elements`
        throw new Error(msg)
      }
      const [
        tradedAssetId,
        siteName,
        siteUrl,
        dataSource,
        dateSelector,
        priceSelector,
        currencyCode,
        decimalPlaces,
        tradedAssetName,
        tradedAssetUnit,
        activeState,
      ] = currentRow
      const parameters = Parameters.create({
        id: tradedAssetId,
        asset: {
          source: dataSource,
          name: tradedAssetName,
          unit: tradedAssetUnit,
        },
        website: {
          name: siteName,
          url: siteUrl,
          dateSelector,
          priceSelector,
        },
        currency: {code: currencyCode, decimals: Number(decimalPlaces)},
        active: Boolean(Number(activeState)),
      })
      currentSet.push(parameters)
      return currentSet
    } catch (error) {
      console.log(`warning: ${ref} skipped`)
      if (error instanceof Error) {
        console.log(`reason: ${error.message}`)
      } else {
        console.log('reason: encountered unexpected error')
        console.error(error)
      }
      return currentSet
    }
  }
}

export default ParametersGoogleSheetsRepository
