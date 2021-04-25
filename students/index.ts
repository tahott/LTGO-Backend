import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from '@azure/cosmos'

import {
  allowedKorean,
  birthValid,
} from './utils'

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const methodGet = async function (context: Context, req: HttpRequest) {
  const container = await client.database('ltgo').container('students');

  const { resources } = await container.items.query(`
    select
      c["name"],
      c["birth"],
      c["group"]
    from c
  `).fetchAll()

  context.res = {
    status: 200,
    body: resources,
  }
}

const methodPost = async function (context: Context, req: HttpRequest) {
  const {
    name, birth, group, registrationDate
  } = req.body

  const container = await client.database('ltgo').container('students')

  const checkName = allowedKorean(name)
  const checkBirth = birthValid(birth)

  if (checkName && checkBirth) {
    const item = {
      name,
      birth,
      group,
      registrationDate,
    }
    container.items.create(item)
    context.res = {
      status: 200,
      body: item,
    }
    context.done()
  }

  context.res = {
    status: 400,
    body: 'bad parameter'
  }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  req.method === 'GET'
    ? await methodGet(context, req)
    : await methodPost(context, req)
};

export default httpTrigger;