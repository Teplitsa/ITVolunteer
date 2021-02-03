import { Db, MongoClient } from "mongodb";

export interface ExtendedRequest {
  dbClient: MongoClient;
  db: Db;
  query: {
    limit?: number;
  }
}
