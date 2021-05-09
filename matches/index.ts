import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from '@azure/cosmos'
import { hasMatchTitle, isArray, isFinished, shouldMode } from "./utils";
import * as dayjs from 'dayjs';

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { body } = req;

  /**
   * body - match key/value check
   * body - mode key/value check
   */
  const [
    hasMatchTitleCheck,
    shouldModeCheck,
    resultsTypeCheck
  ] = await Promise.all([
    hasMatchTitle(body),
    shouldMode(body?.mode),
    isArray(body.results),
  ])

  if (hasMatchTitleCheck && shouldModeCheck && resultsTypeCheck) {
    /**
     * 완료 된 시합은 DB, 미완료는 큐?
     */
    const container = await client.database('ltgo').container('matches');

    body.id = `${body.match.interval}-${body.match.title}-${body.match.date}`
    body.createdAt = dayjs().format('YYYY-MM-DD');
    body.isFinished = isFinished(body.reults);
    container.items.create(body);
  
    context.res = {
      status: 200,
      body: `"${body.match.name}" match was created`
    }
  }

  context.done()
};

export default httpTrigger;