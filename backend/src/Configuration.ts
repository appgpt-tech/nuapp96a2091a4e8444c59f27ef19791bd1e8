import { isConstructorDeclaration } from "typescript";

const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
export class Configuration {
  public nodeEnv: string;
  public port: string;
  public supertokens: Supertokens;
  public supertokensAppInfo: SupertokensAppInfo;
  public supertokensDisable: boolean;
  public supertokensGithubClientId: string;
  public supertokensGithubClientSecret: string;
  public corsAllowedOrigins: string;
  public postgrestUri: string;
  public dbConfiguration: DBConfiguration;
  public apiBasePath: string;
  constructor() {
    this.nodeEnv = process.env.NODE_ENV || "";
    this.port = process.env.PORT || "3000";
    this.supertokens = new Supertokens();
    this.supertokensAppInfo = new SupertokensAppInfo();
    this.supertokensGithubClientId =
      process.env.SUPERTOKENS_GITHUB_CLIENTID || "";
    this.supertokensGithubClientSecret =
      process.env.SUPERTOKENS_GITHUB_CLIENTSECRET || "";
    this.supertokensDisable = process.env.SUPERTOKENS_DISABLE === "true";
    this.dbConfiguration = new DBConfiguration();
    this.corsAllowedOrigins = process.env.CORS_ALLOWEDORIGINS || "";
    this.postgrestUri = process.env.POSTGREST_URL || "";
    this.apiBasePath = process.env.APIBASEPATH || "";
  }
}

export class DBConfiguration {
  public type: string;
  public host: string;
  public port: string;
  public username: string;
  public password: string;
  public database: string;
  public entities: string[];
  public logging: boolean;
  public synchronize: boolean;
  constructor() {
    let dbConfiguration: any = JSON.parse(
      process.env.POSTGRESQL_CONFIGURATION || ""
    );
    this.type = dbConfiguration.type;
    this.host = dbConfiguration.host;
    this.port = dbConfiguration.port;
    this.username = dbConfiguration.username;
    this.password = dbConfiguration.password;
    this.database = dbConfiguration.database;
    this.entities = dbConfiguration.entitiesArray;
    this.logging = dbConfiguration.logging;
    this.synchronize = dbConfiguration.synchronize;
  }
}
class SupertokensAppInfo {
  public appName: string;
  public apiDomain: string;
  public websiteDomain: string;
  public apiBasePath: string;
  public websiteBasePath: string;
  constructor() {
    this.appName = process.env.SUPERTOKENS_APPINFO_APPNAME || "";
    this.apiDomain = process.env.SUPERTOKENS_APPINFO_APIDOMAIN || "";
    this.websiteDomain = process.env.SUPERTOKENS_APPINFO_WEBSITEDOMAIN || "";
    this.apiBasePath = process.env.SUPERTOKENS_APPINFO_APIBASEPATH || "";
    this.websiteBasePath =
      process.env.SUPERTOKENS_APPINFO_WEBSITEBASEPATH || "";
  }
}

class Supertokens {
  public connectionURI: string;
  public apiKey: string;
  constructor() {
    this.connectionURI = process.env.SUPERTOKENS_CONNECTION_URI || "";
    this.apiKey = process.env.SUPERTOKENS_APIKEY || "";
  }
}
