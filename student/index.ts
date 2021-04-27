import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({ endpoint: process.env["DbEndPoint"], key: process.env["DbKey"] });

const methodGet = async function (context: Context, req: HttpRequest) {
  const { id } = req.params;
  const container = await client.database('ltgo').container('students');
  const { resources } = await container.items.query(`
    select
      c["name"],
      c["birth"],
      c["group"]
    from c
    where c["id"] = "${id}"
  `).fetchAll()

  context.res = {
    status: 200,
    body: resources
  }
}

const methodPatch = async function (context: Context, req: HttpRequest) {

}

const methodDelete = async function (context: Context, req: HttpRequest) {
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  req.method === 'GET'
    ? await methodGet(context, req)
    : req.method === 'PATCH'
      ? await methodPatch(context, req)
      : await methodDelete(context, req)
};

export default httpTrigger;