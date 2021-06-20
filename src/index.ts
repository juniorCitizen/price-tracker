import express from 'express'
import expressHandlebars from 'express-handlebars'
import helmet from 'helmet'
import morgan from 'morgan'
import {ExecutionLogEntryArrayRepository as ExecutionLogEntryRepository} from './adapterLayer/ExecutionLogEntryArrayRepository'
import {ParametersGoogleSheetsRepository as ParametersRepository} from './adapterLayer/ParametersGoogleSheetsRepository'
import {PriceRecordGoogleSheetsRepository as PriceRecordRepository} from './adapterLayer/PriceRecordGoogleSheetsRepository'
import {SubscriberArrayRepository as SubscriberRepository} from './adapterLayer/SubscriberArrayRepository'
import enableCollectAll from './CollectData/enableAllAssetsDataCollection'
import enableCollectOne from './CollectData/enableSingleAssetDataCollection'
import enableLogDisplay from './DisplayExecutionLogEntries'
import executionLogEntryArray from './infraLayer/executionLogEntryArray'
import subscriberArray from './infraLayer/subscriberArray'
import enableRegistration from './ProcessRegistration'
import enableReporting from './ReportPricing'
import startWebServer from './StartWebServer'

void (() => {
  try {
    const app = express()
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(express.static('public'))
    app.engine('handlebars', expressHandlebars())
    app.set('view engine', 'handlebars')
    const subscriberRepository = new SubscriberRepository(subscriberArray, {
      maxRecordLimit: 2,
    })
    app.get('/', (_req, res) => {
      res.render('index')
    })
    enableRegistration('/subscribe', 'post', {
      app,
      repository: subscriberRepository,
    })
    const executionLogEntryRepository = new ExecutionLogEntryRepository(
      executionLogEntryArray,
    )
    enableLogDisplay('/logs', 'get', {
      app,
      executionLogEntryRepository,
      subscriberRepository,
    })
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
      connectionString: process.env['SMTP_CON_STR'],
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
