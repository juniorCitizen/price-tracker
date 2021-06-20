import {
  PresenterFactory,
  RegistrationProcessor,
  Repository,
} from '../appLayer/RegistrationProcessor'

export class RegistrationProcessorDriver {
  constructor(
    private repository: Repository,
    private presenterFactory: PresenterFactory,
  ) {}

  processRegistration(requestModel: unknown): void {
    const registrationProcessor = new RegistrationProcessor(
      this.repository,
      this.presenterFactory.make(),
    )
    registrationProcessor.processRegistration(requestModel)
  }
}

export default RegistrationProcessorDriver
