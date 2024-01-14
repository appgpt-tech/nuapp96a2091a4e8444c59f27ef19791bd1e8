//SUPERTOKENS
import { middleware } from "supertokens-node/framework/express";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import {
  errorHandler,
  SessionRequest,
} from "supertokens-node/framework/express";
import { Configuration } from "./Configuration";
import ThirdPartyPasswordless from "supertokens-node/recipe/thirdpartypasswordless";
const { Google, Github, Apple } = ThirdParty;

export class Supertokens {
  static connectionURI: string;
  static apiKey: string;
  //static appInfo: SupertokensAppInfo;
  static supertokens;
  static Session;
  static Initialize(configuration: Configuration, appInfo: any) {
    //NP
    supertokens.init({
      supertokens: configuration.supertokens,
      framework: "express",
      appInfo: appInfo,
      recipeList: [
        ThirdPartyPasswordless.init({
          flowType: "MAGIC_LINK",
          contactMethod: "EMAIL",
          providers: [
            // We have provided you with development keys which you can use for testing.
            // IMPORTANT: Please replace them with your own OAuth keys for production use.
            Github({
              clientId: configuration.supertokensGithubClientId,
              clientSecret: configuration.supertokensGithubClientSecret,
            }),
            // Facebook({
            //     clientSecret: "FACEBOOK_CLIENT_SECRET",
            //     clientId: "FACEBOOK_CLIENT_ID"
            // })
          ],
        }),
        Session.init(), // initializes session features
      ],
    });
    Supertokens.supertokens = supertokens;
  }
}
