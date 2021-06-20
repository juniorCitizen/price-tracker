import {JWT, JWTInput} from 'google-auth-library'
import {google, sheets_v4} from 'googleapis'
import {
  Existence,
  Fetching,
  Persistence,
} from '../appLayer/PriceRecordRepository'
import {FetchFilter} from '../domainLayer/FetchFilter'
import {PriceRecord, PriceRecordDS} from '../domainLayer/PriceRecord'
import {TradedAssetId} from '../domainLayer/TradedAssetId'

export class PriceRecordGoogleSheetsRepository
  implements Existence, Fetching, Persistence
{
  private api: sheets_v4.Sheets
  private authClient: JWT
  private spreadsheetId: string
  constructor(options: {
    spreadsheetId: string | undefined
    credentials: string | undefined
  }) {
    if (options.spreadsheetId === undefined) {
      const msg = 'spreadsheet id is undefined'
      throw new Error(msg)
    }
    this.spreadsheetId = options.spreadsheetId
    if (options.credentials === undefined) {
      const msg = 'API credentials is undefined'
      throw new Error(msg)
    }
    const credentials = JSON.parse(
      options.credentials.replace(/\n/g, '\\n'),
    ) as JWTInput
    this.authClient = google.auth.fromJSON(credentials) as JWT
    this.authClient.scopes = ['https://www.googleapis.com/auth/spreadsheets']
    this.api = google.sheets({version: 'v4', auth: this.authClient})
  }

  private async getSheets(): Promise<sheets_v4.Schema$Sheet[]> {
    try {
      const options = {spreadsheetId: this.spreadsheetId}
      const response = await this.api.spreadsheets.get(options)
      if (response.status !== 200) {
        const msg = `${response.status} ${response.statusText}`
        throw new Error(msg)
      }
      if (response.data.sheets === undefined) {
        const msg = 'undefined spreadsheet properties'
        throw new Error(msg)
      }
      return response.data.sheets
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to get spreadsheet properties (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  private async getSheetId(sheetName: string): Promise<number> {
    try {
      const sheets = await this.getSheets()
      for (const sheet of sheets) {
        if (sheet.properties === undefined) break
        if (sheet.properties.title === sheetName) {
          const sheetId = sheet.properties?.sheetId
          if (typeof sheetId !== 'number') {
            const msg = 'does not have a valid sheet id'
            throw new Error(msg)
          }
          return sheetId
        }
      }
      const msg = 'does not exist in spreadsheet'
      throw new Error(msg)
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to get sheet id from "${sheetName}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  private async sortByDate(
    sheetNameOrId: string | number,
    order: 'ascending' | 'descending' = 'ascending',
  ): Promise<void> {
    const sheetId =
      typeof sheetNameOrId === 'number'
        ? sheetNameOrId
        : await this.getSheetId(sheetNameOrId)
    const range = {sheetId, startRowIndex: 1, endColumnIndex: 2}
    const sortOrder = order === 'ascending' ? 'ASCENDING' : 'DESCENDING'
    const sortSpecs = [{dimensionIndex: 0, sortOrder}]
    try {
      const requestBody = {
        requests: [{sortRange: {range, sortSpecs}}],
      }
      const response = await this.api.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody,
      })
      if (response.status !== 200) {
        const msg = `${response.status} ${response.statusText}`
        throw new Error(msg)
      }
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to sort ${sheetNameOrId} (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  async exists(
    sheetName: TradedAssetId,
    priceRecordValue: PriceRecordDS,
  ): Promise<boolean> {
    try {
      let dataset: PriceRecordDS[]
      let pageNumber = 1
      do {
        dataset = await this.fetch(
          sheetName,
          FetchFilter.create({
            order: 'descending',
            pageNumber,
            pageSize: 500,
          }),
        )
        if (dataset.some(data => data.date === priceRecordValue.date)) {
          return true
        }
        pageNumber++
      } while (dataset.length > 0)
      return false
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to determine existence of data on ${priceRecordValue.date} from "${sheetName.value}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    } finally {
      await this.sortByDate(sheetName.value, 'ascending')
    }
  }

  private getRange(page = 1, pageSize: number | undefined = undefined): string {
    if (page > 1 && typeof pageSize !== 'number') {
      const msg = 'page size must be defined to paginate'
      throw new Error(msg)
    }
    const startRow = (page - 1) * (pageSize ?? 0) + 2
    const endRow =
      typeof page === 'number' && typeof pageSize === 'number'
        ? startRow + pageSize - 1
        : ''
    return `A${startRow}:B${endRow}`
  }

  async fetch(
    sheetName: TradedAssetId,
    filter: FetchFilter = FetchFilter.create({
      order: 'ascending',
      pageNumber: 1,
      pageSize: undefined,
    }),
  ): Promise<PriceRecord[]> {
    try {
      const {
        order = 'ascending',
        pageNumber = 1,
        pageSize = undefined,
      } = filter.value
      const range = this.getRange(pageNumber, pageSize)
      const sheetAndRange = `${sheetName.value}!${range}`
      if (order !== 'none') {
        await this.sortByDate(sheetName.value, order)
      }
      const response = await this.api.spreadsheets.values.get({
        range: sheetAndRange,
        spreadsheetId: this.spreadsheetId,
      })
      if (response.status !== 200) {
        const {status, statusText} = response
        const msg = `${status} ${statusText}`
        throw new Error(msg)
      }
      const rows = response.data.values
      if (!Array.isArray(rows)) {
        return []
      }
      return rows.reduce(this.reduceRows.bind(this), [])
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to fetch from "${sheetName.value}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  private reduceRows(
    currentSet: PriceRecord[],
    currentRow: unknown[],
    rowIndex: number,
  ): PriceRecord[] {
    const ref = `price record (index: ${rowIndex})`
    try {
      if (currentRow.length !== 2) {
        const msg = `${ref} does not have exactly 2 elements`
        throw new Error(msg)
      }
      const [date, _price] = currentRow
      const price = Number(_price)
      if (Number.isNaN(price)) {
        const msg = `trading price is not a number`
        throw new Error(msg)
      }
      currentSet.push(PriceRecord.create({date, price}))
      return currentSet
    } catch (error) {
      if (error instanceof Error) {
        console.log(`warning: ${ref} is skipped`)
        console.log(`reason: ${error.message}`)
        return currentSet
      }
      throw error
    }
  }

  async persist(
    sheetName: TradedAssetId,
    priceRecordValue: PriceRecordDS,
  ): Promise<void> {
    try {
      const response = await this.api.spreadsheets.values.append({
        range: `${sheetName.value}!A2:B`,
        spreadsheetId: this.spreadsheetId,
        valueInputOption: 'RAW',
        requestBody: {
          majorDimension: 'ROWS',
          values: [[priceRecordValue.date, priceRecordValue.price]],
        },
      })
      if (response.status !== 200) {
        const msg = `${response.status} ${response.statusText}`
        throw new Error(msg)
      }
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to persist record to "${sheetName.value}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    } finally {
      await this.sortByDate(sheetName.value, 'ascending')
    }
  }
}

export default PriceRecordGoogleSheetsRepository
