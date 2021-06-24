import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import {ExecutionLogEntryArrayRepository as ExecutionLogEntryRepository} from './adapterLayer/ExecutionLogEntryArrayRepository'
import {ParametersGoogleSheetsRepository as ParametersRepository} from './adapterLayer/ParametersGoogleSheetsRepository'
import {PriceRecordGoogleSheetsRepository as PriceRecordRepository} from './adapterLayer/PriceRecordGoogleSheetsRepository'
import {SubscriberArrayRepository as SubscriberRepository} from './adapterLayer/SubscriberArrayRepository'
import enableCollectAll from './CollectData/enableAllAssetsDataCollection'
import enableCollectOne from './CollectData/enableSingleAssetDataCollection'
import executionLogEntryArray from './infraLayer/executionLogEntryArray'
import subscriberArray from './infraLayer/subscriberArray'
import enableRegistration from './ProcessRegistration'
import enableReporting from './ReportPricing'
import startWebServer from './StartWebServer'

void (() => {
  try {
    const isProd = (process.env['NODE_ENV'] || 'development') === 'production'
    const app = express()
    app.use(helmet())
    app.use(morgan(isProd ? 'combine' : 'dev'))
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    const subscriberRepository = new SubscriberRepository(subscriberArray, {
      maxRecordLimit: 2,
    })
    enableRegistration('/subscribe', 'post', {
      app,
      subscriberRepository,
    })
    const executionLogEntryRepository = new ExecutionLogEntryRepository(
      executionLogEntryArray,
    )
    const googleSheetsOpts = {
      spreadsheetId: process.env['SPREADSHEET_ID'],
      credentials: process.env['GOOGLE_API_CREDENTIALS'],
    }
    const parametersRepository = new ParametersRepository(googleSheetsOpts)
    const priceRecordRepository = new PriceRecordRepository(googleSheetsOpts)
    enableCollectOne('/collect-data/asset-id/:assetId', 'post', {
      app,
      executionLogEntryRepository,
      parametersRepository,
      priceRecordRepository,
      subscriberRepository,
    })
    enableCollectAll('/collect-data/all', 'post', {
      app,
      executionLogEntryRepository,
      parametersRepository,
      priceRecordRepository,
      subscriberRepository,
    })
    enableReporting('/report', 'post', {
      connectionString: process.env['SMTP_CONNECTION_STRING'],
      emailSenderName: process.env['EMAIL_SENDER_NAME'],
      emailSenderAddress: process.env['EMAIL_SENDER_ADDRESS'],
      app,
      parametersRepository,
      priceRecordRepository,
      subscriberRepository,
    })
    startWebServer(app, process.env['PORT'])
  } catch (error) {
    console.error(error)
  }
})()
