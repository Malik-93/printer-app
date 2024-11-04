import ngrok, { NgrokClientError } from 'ngrok'
import { port } from '../constants'
import logger from '../logger'
class Ngrok {
  public async init(): Promise<string | undefined> {
    try {
      logger.info(`[ngrok] -> Initializing tunnel...`)
      console.log(`\x1b[33m [ngrok] -> Initializing tunnel... \x1b[0m \n`)
      const tunnel_url = await ngrok.connect({
        proto: 'http',
        addr: port,
        region: `us`,

        onStatusChange(status: string) {
          console.log(`\x1b[32m [ngrok].onStatusChange -> ${status} \x1b[0m] \n`)
          logger.info(`[ngrok].onStatusChange -> ${status}`)
        },
        onLogEvent(logEventMessage: string) {
          // console.log(`[ngrok].onLogEvent -> ${logEventMessage}`);
          logger.info(`[ngrok].onLogEvent -> ${logEventMessage}`)
        },
        onTerminated() {
          console.log(
            `\x1b[36m [ngrok].onTerminated -> Tunnel terminated! \x1b[0m \n`,
          )
          logger.info(`[ngrok].onTerminated -> Tunnel terminated!`)
          console.log(
            '\x1b[35m Suggestion: Please close and re-open the app. Thanks!! \x1b[0m \n',
          )
        },
      })
      logger.info(`[ngrok].connect -> tunnel started at: ${tunnel_url}`)
      console.log(
        `\x1b[34m [ngrok].connect -> tunnel started at: ${tunnel_url}] \x1b[0m \n`,
      )
      return tunnel_url as string
    } catch (error: NgrokClientError | any) {
      logger.error(`[ngrok].error -> ${error}`)
      console.log(
        `\x1b[31m [ngrok].error -> ${error} \x1b[0m \n`,
      )
    }
  }
  public async kill() {
    try {
      console.log('[ngrok] -> killing tunnel on app exit \n')
      logger.info('[ngrok] -> killing tunnel on app exit')

      await ngrok.kill()

      console.log('[ngrok] -> tunnel exited \n')
      logger.info('[ngrok] -> tunnel exited')
    } catch (error) {
      logger.error(`[ngrok].kill -> error: ${JSON.stringify(error)}`)
      console.log(`[ngrok].kill -> error: ${JSON.stringify(error)} \n`)
    }
  }
  public async getVersion() {
    try {
      return await ngrok.getVersion();
    } catch (error) {
      console.log(`[ngrok].getVersion -> error: ${JSON.stringify(error)} \n\n`)
    }
  }
}
export default new Ngrok()
