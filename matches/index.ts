import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from '@azure/cosmos';
import {
  post, patch,
} from './functions';
import {
  hasMatchTitle,
  isArray,
  shouldMode,
  hasLength,
  hasLeagueResultsKeys,
} from "./utils";

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

      const result = req.method === 'POST'
        ? await post(body, container)
        : await patch(body, container)

      context.res = {
        status: 200,
        body: result,
      };

      context.done();
    } catch (err) {

      context.res = {
        status: 400,
        body: err
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