import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { INews } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, dbClient, query: { limit } }, res) => {
  try {
    const findOptions = { limit: Number.isNaN(Number(limit)) ? 0 : Number(limit) };
    const news: Array<INews> = await db.collection("news").find({}, findOptions).toArray();

    res.status(200);
    res.json({ news });
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
});

export default handler;
