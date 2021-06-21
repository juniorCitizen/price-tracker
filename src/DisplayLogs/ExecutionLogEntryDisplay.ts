import {ExecutionLogEntryRepository} from './ExecutionLogEntryRepository'
import {HttpResponder} from './HttpResponder'

export class ExecutionLogEntryDisplay {
  constructor(
    private executeLogEntryDisplay: ExecutionLogEntryRepository,
    private httpResponder: HttpResponder,
  ) {}

  displayExecutionLogEntries(): void {
    try {
      const logEntries = this.executeLogEntryDisplay.fetch()
      this.httpResponder.ok(logEntries)
    } catch (error) {
      this.httpResponder.report(error)
    }
  }
}

export default ExecutionLogEntryDisplay
