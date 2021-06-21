import {HttpResponder} from './HttpResponder'

export interface HttpResponderFactory {
  make(): HttpResponder
}
