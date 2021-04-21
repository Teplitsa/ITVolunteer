import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { IAdvantage } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db }, res) => {
  try {
    const advantages: Array<IAdvantage> = await db.collection("advantages").find().toArray();

    res.status(200);
    res.json({ advantages });
  } catch (error) {
    console.error(error);
  }
});

export default handler;
