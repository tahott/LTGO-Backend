import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from '@azure/cosmos'

import { idPatternCheck } from './utils'

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const methodGet = async function (context: Context, req: HttpRequest) {
  const { id } = req.params;

  if (!idPatternCheck(id)) {
    context.res = {
      status: 400,
      body: 'Bad Request',
    }
    context.done();
  }

  const container = await client.database('ltgo').container('students');
  const { resource } = await container.item(id, id).read()

  if (!resource) {
    context.res = {
      status: 404,
      body: 'Not Found',
    }
    context.done();
  }

  context.res = {
    status: 200,
    body: {
      name: resource.name,
      birth: resource.birth,
      group: resource.group,
    }
  }
}

const methodPatch = async function (context: Context, req: HttpRequest) {
  const { id } = req.params;
  const { group: g } = req.body;

  if (!g || !idPatternCheck(id)) {
    context.res = {
      status: 400,
      body: 'Bad Request',
    }
    context.done();
  }

  const container = await client.database('ltgo').container('students');
  const { resource: res } = await container.item(id, id).read();

  if (!res) {
    context.res = {
      status: 404,
      body: 'Not Found',
    }
    context.done();
  }

  const { resource } = await container.items.upsert(Object.assign(res, { group: g }))

  const { name, birth, group } = resource;

  context.res = {
    body: {
      name,
      birth,
      group,
    }
  }
}

const methodDelete = async function (context: Context, req: HttpRequest) {
  const { id } = req.params;

  if (!idPatternCheck(id)) {
    context.res = {
      status: 400,
      body: 'Bad Request',
    }
    context.done();
  }

  const container = await client.database('ltgo').container('students');
  const item = await container.item(id, id);
  await item.delete();

  context.done();
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  req.method === 'GET'
    ? await methodGet(context, req)
    : req.method === 'PATCH'
      ? await methodPatch(context, req)
      : await methodDelete(context, req)
};

export default httpTrigger;