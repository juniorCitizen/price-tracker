import {Sending} from '../../appLayer/Presenter'
import {PriceData} from '../../domainLayer/PricingData'

export type ReportPresenter = Sending<PriceData[]>
