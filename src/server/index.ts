import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import ExecutionLogRepository from './adapterLayer/ExecutionLogArrayRepository'
import PriceRecordRepository from './adapterLayer/PriceRecordGoogleSheetsRepository'
import SubscriberRepository from './adapterLayer/SubscriberArrayRepository'
import TrackedAssetRepository from './adapterLayer/TrackedAssetGoogleSheetsRepository'
import enableCollectAll from './CollectData/enableCollectAll'
import enableCollectOne from './CollectData/enableCollectOne'
import executionLogArray from './infraLayer/executionLogRepoEntryArray'
import stringifyDate from './infraLayer/stringifyDate'
import subscriberArray from './infraLayer/subscriberRepoEntryArray'
import enableRegistration from './ProcessRegistration'
import enableReporting from './ReportPricing'
import startWebServer from './StartWebServer'

void (() => {
  try {
    const PORT = process.env['PORT'] || '3000'
    const isProd = (process.env['NODE_ENV'] || 'development') === 'production'
    const app = express()
    app.use(helmet())
    app.use(morgan(isProd ? 'combine' : 'dev'))
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    const executionLogRepository = new ExecutionLogRepository(executionLogArray)
    const googleSheetsOpts = {
      spreadsheetId: process.env['SPREADSHEET_ID'],
      credentials: process.env['GOOGLE_API_CREDENTIALS'],
    }
    const priceRecordRepository = new PriceRecordRepository(googleSheetsOpts)
    const subscriberRepository = new SubscriberRepository(subscriberArray, 2)
    const trackedAssetRepository = new TrackedAssetRepository(googleSheetsOpts)
    enableRegistration('/subscribe', 'post', {
      app,
      subscriberRepository,
    })
    enableCollectOne('/collect-data/asset-id/:assetId', 'post', {
      app,
      stringifyDate,
      executionLogRepository,
      priceRecordRepository,
      subscriberRepository,
      trackedAssetRepository,
    })
    enableCollectAll('/collect-data/all', 'post', {
      app,
      stringifyDate,
      executionLogRepository,
      priceRecordRepository,
      subscriberRepository,
      trackedAssetRepository,
    })
    enableReporting('/report', 'post', {
      connectionString: process.env['SMTP_CONNECTION_STRING'],
      emailSenderName: process.env['EMAIL_SENDER_NAME'],
      emailSenderAddress: process.env['EMAIL_SENDER_ADDRESS'],
      app,
      priceRecordRepository,
      subscriberRepository,
      trackedAssetRepository,
    })
    startWebServer(app, PORT)
  } catch (error) {
    console.error(error)
  }
})()
