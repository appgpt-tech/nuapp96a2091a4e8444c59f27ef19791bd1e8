//Static template
import { Configuration } from "./Configuration";
import { Supertokens } from "./Supertokens";
import express, {
  json,
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import { middleware } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import {
  errorHandler,
  SessionRequest,
} from "supertokens-node/framework/express";
import ThirdPartyPasswordless from "supertokens-node/recipe/thirdpartypasswordless";
import { Database } from "./Database";
import fetch from "node-fetch";
var proxy = require("express-http-proxy");
const cors = require("cors");
export const app = express();
let configuration: Configuration;

export async function initialize() {
  try {
    console.log("App backend v 0.1");
    console.log("Initializing...");
    configuration = getConfig();
    console.log("  Dumping configuration:", configuration, "\n\n");
    console.log("  Initializing Database...");
    await Database.Initialize(configuration.dbConfiguration);
    console.log("  Initializing Supertokens...");
    await initializeSupertokens();
    console.log("  Entering configuration stage...");
    console.log("    CORS...");
    await configureCors();
    console.log("    App...");
    await configureApp();
    console.log("    Proxy...");
    await configureProxy();
    console.log("    Custom routes...");
    await configureSupertokensCustomRoutes();
    console.log("    Error handlers...");
    await configureErrorHandlers();
    console.log("  Verifying supertokens is up...");
    await checkSupertokensReadiness();
    console.log("  Verifying postgrest is up...");
    await checkPostgrestReadiness();
    console.log("Initialization completed.");
  } catch (e: any) {
    console.error("An error occurred during initialization: ", e);
    process.exit();
  }
}
function getConfig(): Configuration {
  try {
    return new Configuration();
  } catch (e: any) {
    console.log("There are problems with your configuration file. Exiting.");
    console.error(e);
    process.exit();
    throw e;
  }
}
function initializeSupertokens() {
  let appInfo = {
    ...configuration.supertokensAppInfo,
    apiBasePath: configuration.apiBasePath + "/auth",
  };
  Supertokens.Initialize(configuration, appInfo);
}
function configureCors() {
  const corsOptions = {
    origin: configuration.corsAllowedOrigins,
    exposedHeaders: ["Content-Range", "Range"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "content-type",
      "content-range",
      "range",
      "prefer",
      ...Supertokens.supertokens.getAllCORSHeaders(),
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}
function configureApp() {
  // IMPORTANT: CORS should be before the below line.
  app.use(middleware());
  // Use body parser to read sent json payloads
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(json({ limit: "1mb" }));
}
function configureProxy() {
  if (!configuration.supertokensDisable) {
    //Enable authentication on Postgrest
    console.log("      Enabling POSTGREST authentication...");
    app.use(
      configuration.apiBasePath + "/proxy",
      verifySession(),
      (req: SessionRequest, res, next) => {
        console.log("Proxying path: ", req.path);
        //console.log("proxy", req.session); //!.getUserId());
        next();
      },
      proxy(configuration.postgrestUri),
      (req, res, next) => {
        console.log("proxy res", res);
        next();
      }
    );
  } else {
    console.log("      Disabling POSTGREST authentication...");
    app.use(
      //Disable authentication on postgrest
      configuration.apiBasePath + "/proxy",
      (req: SessionRequest, res, next) => {
        /*
        console.debug("Proxying path: ", req.path);
        console.debug("         method: ", req.method);
        console.debug("         params: ", req.params);
        console.debug("         body: ", req.body);
        console.debug("         headers: ", req.headers);
        */
        next();
      },
      proxy(configuration.postgrestUri, {
        userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
          return proxyResData.toString(); // it should return string
        },
      }),
      (req, res, next) => {
        console.log("proxy res", res);
        next();
      }
    );
  }
}
function configureSupertokensCustomRoutes() {
  //supertokens
  app.post(
    configuration.apiBasePath + "/getuser",
    verifySession(),
    async (req: SessionRequest, res) => {
      try {
        let userId = req.session!.getUserId();
        //console.log("/getuser: userId", userId);
        let userInfo = await ThirdPartyPasswordless.getUserById(userId);
        return res.send({ userId: userId, userInfo: userInfo });
      } catch (e) {
        return res.send("error");
      }
    }
  );
  app.post(
    configuration.apiBasePath + "/logoutuser",
    verifySession(),
    async (req: SessionRequest, res) => {
      try {
        let userId = req.session!.getUserId();
        console.log("/logoutuser: userId", userId);
        if (userId) {
          await req.session!.revokeSession();
          return res.send({ status: "OK" });
        } else {
          return res.send({ status: "NOT_LOGGED_IN" });
        }
      } catch (e) {
        return res.send("error");
      }
    }
  );
}
function configureErrorHandlers() {
  app.use(errorHandler());
  app.use(function notFoundHandler(_req, res: ExResponse) {
    res.status(404).send({
      message: "Not Found yo",
    });
  });
  app.use(function customErrorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error my ass",
        details: err?.stack,
      });
    }
    next();
  });
}
async function checkSupertokensReadiness() {
  try {
    let obj: any = await fetch(
      configuration.supertokens.connectionURI + "/hello"
    );
  } catch (e: any) {
    throw e;
  }
}
async function checkPostgrestReadiness() {
  try {
    let res: any = await fetch(configuration.postgrestUri + "/applications");
    let json: any = await res.json();
  } catch (e: any) {
    throw e;
  }
}
