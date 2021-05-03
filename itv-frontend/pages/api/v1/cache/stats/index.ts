import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { IStats } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, dbClient }, res) => {
  try {
    const stats: IStats = await db.collection("stats").findOne({});

    res.status(200);
    res.json({ stats });
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
});

export default handler;
