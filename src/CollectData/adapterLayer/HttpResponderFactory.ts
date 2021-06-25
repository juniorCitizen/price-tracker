import {HttpResponder} from '../appLayer/DataCollector'

export interface HttpResponderFactory {
  make(): HttpResponder
}
