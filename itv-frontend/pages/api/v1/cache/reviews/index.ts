import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { IReview } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db }, res) => {
  try {
    const reviews: Array<IReview> = await db.collection("reviews").find().toArray();

    res.status(200);
    res.json({ reviews });
  } catch (error) {
    console.error(error);
  }
});

export default handler;
