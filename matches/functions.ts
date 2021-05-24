import { Container } from "@azure/cosmos";
import * as dayjs from 'dayjs';

import { isMatchFinished, makeMatchDate } from './utils';

export const post = async (body, container: Container) => {
  const date = makeMatchDate(body.match.interval)
  body.id = `${body.match.interval}-${body.match.title}-${date}`;
  body.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
  body.isFinished = isMatchFinished(body.results);

  container.items.create(body);

  return {
    message: `"${body.match.title}" match was created`,
    id: body.id,
    finished: body.isFinished,
  }
}

export const patch = async (body, container: Container) => {
  if (!body.id) {
    throw 'ID value is required';
  }

  body.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
  body.isFinished = isMatchFinished(body.results);

  container.items.upsert(body);

  return {
    message: `"${body.match.title}" match was created`,
    id: body.id,
    finished: body.isFinished,
  }
}