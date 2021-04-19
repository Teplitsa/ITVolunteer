import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ITaskState } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, query: { limit } }, res) => {
  try {
    const tasks: Array<ITaskState> = await db.collection("tasks")
      .find()
      .limit(Number.isNaN(Number(limit)) ? 0 : Number(limit))
      .toArray();

    // console.log("tasks:", tasks);

    res.status(200);
    res.json({ tasks });
  } catch (error) {
    console.error(error);
  }
});

export default handler;
