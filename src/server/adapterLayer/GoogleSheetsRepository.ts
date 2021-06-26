import {JWT, JWTInput} from 'google-auth-library'
import {google, sheets_v4} from 'googleapis'

export abstract class GoogleSheetsRepository {
  private authClient: JWT
  protected spreadsheetId: string
  protected api: sheets_v4.Sheets

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
      const {data, status, statusText} = response
      if (status !== 200) {
        const msg = `${status} ${statusText}`
        throw new Error(msg)
      }
      const {sheets} = data
      if (sheets === undefined) {
        const msg = 'spreadsheet properties is undefined'
        throw new Error(msg)
      }
      return sheets
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to get spreadsheet properties (${reason})`
        throw new Error(msg)
      }
      throw error
    }
  }

  protected async getSheetId(sheetName: string): Promise<number> {
    try {
      const sheets = await this.getSheets()
      for (const sheet of sheets) {
        if (sheet.properties === undefined) {
          continue
        }
        if (sheet.properties.title === sheetName) {
          const sheetId = sheet.properties.sheetId
          if (typeof sheetId !== 'number') {
            const msg = `sheet id value of "${sheetName}" is not a number`
            throw new Error(msg)
          }
          return sheetId
        }
      }
      const msg = `"${sheetName}" does not exist in spreadsheet`
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
}
