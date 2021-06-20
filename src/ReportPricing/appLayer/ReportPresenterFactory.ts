import {Subscriber} from '../../domainLayer/Subscriber'
import {ReportPresenter} from './ReportPresenter'

export interface ReportPresenterFactory {
  make(subscriber: Subscriber): ReportPresenter
}
