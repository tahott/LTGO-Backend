import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from '@azure/cosmos';
import {
  hasMatchTitle,
  isArray,
  isMatchFinished,
  shouldMode,
  hasLength,
  hasLeagueResultsKeys,
} from "./utils";
import * as dayjs from 'dayjs';

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { body } = req;

  const [
    hasMatchTitleCheck,
    shouldModeCheck,
    isResultsArray,
    resultsLengthCheck,
  ] = await Promise.all([
    hasMatchTitle(body),
    shouldMode(body?.mode),
    isArray(body.results),
    hasLength(body.results, 2),
  ]);

  if (hasMatchTitleCheck
    && shouldModeCheck
    && isResultsArray
    && resultsLengthCheck
    && body.results.every((e) => hasLeagueResultsKeys(e))
  ) {
    try {
      const container = await client.database('ltgo').container('matches');

      body.id = `${body.match.interval}-${body.match.title}-${body.match.date}`
      body.createdAt = dayjs().format('YYYY-MM-DD');
      body.isFinished = isMatchFinished(body.results);

      req.method === 'POST'
        ? container.items.create(body)
        : container.items.upsert(body)
    
      context.res = {
        status: 200,
        body: `"${body.match.title}" match was created`
      };

      context.done();
    } catch (err) {
      context.res = {
        status: 400,
        body: err.message
      }

      context.done();
    }
  }

  context.res = {
    status: 400,
    body: `Bad Request`
  };

  context.done();
};

export default httpTrigger;