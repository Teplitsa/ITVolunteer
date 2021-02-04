import { MongoClient } from "mongodb";
import { ExtendedRequest } from "../server-model/server-model.typing";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import appConfig from "../app.config";

const database = async (req: ExtendedRequest, res: NextApiResponse, next) => {
  try {
    const client = new MongoClient(appConfig.MongoConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!client.isConnected()) await client.connect();

    Object.assign(req, {
      dbClient: client,
      db: client.db("itv_cache"),
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Fatal error: failed to connect to the database");
  }

  return next();
};

const middleware = nextConnect();

middleware.use(database);

export default middleware;
