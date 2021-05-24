import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from '@azure/cosmos';
import {
  post, patch,
} from './functions';
import {
  hasMatchTitle,
  shouldMode,
  hasLeagueResultsKeys,
  matchResultsValidity,
} from "./utils";

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const container = await client.database('ltgo').container('matches');

  if (req.method === 'GET') {
    const { resources } = await container.items.query(`
      SELECT
        c.id,
        c.isFinished
      FROM c
    `).fetchAll();

    context.res = {
      status: 200,
      body: resources,
    }

    context.done();
  }

  const { body } = req;

  const [
    hasMatchTitleCheck,
    shouldModeCheck,
    isMatchResults
  ] = await Promise.all([
    hasMatchTitle(body),
    shouldMode(body?.mode),
    matchResultsValidity(body.results),
  ]);

  if (hasMatchTitleCheck
    && shouldModeCheck
    && isMatchResults
    && body.results.every((e) => hasLeagueResultsKeys(e))
  ) {
    try {
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