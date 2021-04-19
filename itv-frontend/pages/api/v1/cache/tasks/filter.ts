import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db }, res) => {
  try {
    const filterSections = await db.collection("task_list_filter").find().toArray();

    res.status(200);
    res.json({ sections: filterSections });
  } catch (error) {
    console.error(error);
  }
});

export default handler;
