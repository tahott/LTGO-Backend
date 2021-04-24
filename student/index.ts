import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import {
  allowedKorean,
  birthValid,
} from './utils'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const {
    name, birth, group, registrationDate
  } = req.body

  const checkName = allowedKorean(name)
  const checkBirth = birthValid(birth)

  if (checkName && checkBirth) {
    // db insert
    context.res = {
      status: 200,
      body: {
        name,
        birth,
        group,
        registrationDate,
      }
    }
    context.done()
  }

  context.res = {
    status: 400,
    body: 'bad parameter'
  }
};

export default httpTrigger;