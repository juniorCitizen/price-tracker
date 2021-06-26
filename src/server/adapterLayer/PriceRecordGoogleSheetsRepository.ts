import {NumericValue} from '../appLayer/NumericValue'
import {
  Existence,
  Fetching,
  Persistence,
} from '../appLayer/PriceRecordRepository'
import {StringValue} from '../appLayer/StringValue'
import {AssetId} from '../domainLayer/AssetId'
import {FetchFilter} from '../domainLayer/FetchFilter'
import {PriceRecord} from '../domainLayer/PriceRecord'
import {PricingData} from '../domainLayer/PricingData'
import {GoogleSheetsRepository} from './GoogleSheetsRepository'

export class PriceRecordGoogleSheetsRepository
  extends GoogleSheetsRepository
  implements Existence, Fetching, Persistence
{
  constructor(options: {
    spreadsheetId: string | undefined
    credentials: string | undefined
  }) {
    super(options)
  }

  private getRange(parameters: {
    pageNumber?: number
    pageSize?: number | undefined
  }): string {
    const {pageNumber = 1, pageSize = undefined} = parameters
    const startRow = (pageNumber - 1) * (pageSize ?? 0) + 2
    const endRow = pageSize !== undefined ? startRow + pageSize - 1 : ''
    return `A${startRow}:B${endRow}`
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
    const sortRange = {range, sortSpecs}
    try {
      const requestBody = {requests: [{sortRange}]}
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
        const msg = `failed to sort ${sheetNameOrId} (${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  async exists(assetId: AssetId, pricingData: PricingData): Promise<boolean> {
    const sheetNameValue = assetId.value
    const dateValue = pricingData.date.value
    let dataset: PriceRecord[]
    let pageNumber = 1
    const filter = FetchFilter.create({
      order: 'descending',
      pageNumber,
      pageSize: 500,
    })
    try {
      do {
        dataset = await this.fetch(assetId, filter)
        if (dataset.some(data => data.date.value === dateValue)) {
          return true
        }
        pageNumber++
      } while (dataset.length > 0)
      return false
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to determine existence of data on ${dateValue} from "${sheetNameValue}" (${reason})`
        throw new Error(msg)
      }
      throw error
    } finally {
      await this.sortByDate(sheetNameValue, 'ascending')
    }
  }

  async fetch(
    assetId: AssetId,
    filter: FetchFilter = FetchFilter.create({
      order: 'ascending',
      pageNumber: 1,
    }),
  ): Promise<PriceRecord[]> {
    const sheetNameValue = assetId.value
    try {
      const {order, pageNumber, pageSize} = filter.value
      const range = this.getRange({pageNumber, pageSize})
      const sheetAndRange = `${sheetNameValue}!${range}`
      if (order !== 'none') {
        await this.sortByDate(sheetNameValue, order)
      }
      const response = await this.api.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetAndRange,
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
      return rows.reduce(this.makeReduce(assetId), [])
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to fetch from "${sheetNameValue}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  private makeReduce(
    assetId: AssetId,
  ): (
    currentSet: PriceRecord[],
    currentRow: unknown[],
    rowIndex: number,
  ) => PriceRecord[] {
    return (currentSet, currentRow, rowIndex) => {
      try {
        const mapped = this.map(assetId, currentRow)
        currentSet.push(mapped)
        return currentSet
      } catch (error) {
        if (error instanceof Error) {
          const reason = error.message
          const msg = `warning: row index ${rowIndex} has been skipped (${reason})`
          console.log(msg)
          return currentSet
        }
        throw error
      }
    }
  }

  private map(assetId: AssetId, row: unknown[]): PriceRecord {
    const [rawDate, rawPrice] = row
    return PriceRecord.create({
      assetId: assetId.value,
      date: StringValue.create(rawDate).value,
      price: NumericValue.create(rawPrice).value,
    })
  }

  async persist(assetId: AssetId, pricingData: PricingData): Promise<void> {
    const sheetNameValue = assetId.value
    const dateValue = pricingData.date.value
    const priceValue = pricingData.price.value
    try {
      const response = await this.api.spreadsheets.values.append({
        range: `${sheetNameValue}!A2:B`,
        spreadsheetId: this.spreadsheetId,
        valueInputOption: 'RAW',
        requestBody: {
          majorDimension: 'ROWS',
          values: [[dateValue, priceValue]],
        },
      })
      if (response.status !== 200) {
        const msg = `${response.status} ${response.statusText}`
        throw new Error(msg)
      }
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to persist record to "${sheetNameValue}" (reason: ${reason})`
        throw new Error(msg)
      }
      throw error
    } finally {
      await this.sortByDate(sheetNameValue, 'ascending')
    }
  }
}

export default PriceRecordGoogleSheetsRepository
