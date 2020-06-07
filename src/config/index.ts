import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  port: number;
  intranetBaseURL: string;
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  port: +(process.env.SERVER_PORT ?? 3000),
  intranetBaseURL: process.env.INTRANET_SERVER_URL ?? "",
};
export { config };
