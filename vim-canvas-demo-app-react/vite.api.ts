import { ViteDevServer, Connect } from 'vite';
import { ServerResponse } from 'http';
import { parse } from 'url';
import dotenv from 'dotenv';
import { parseJwt } from "@cfworker/jwt";
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

export const apiPlugin = () => ({
  name: 'vim-auth-api',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(bodyParser.json());
    server.middlewares.use("/api/launch", async (req: Connect.IncomingMessage, res: ServerResponse, _: Connect.NextFunction) => {
        console.log("Got a request for launch");
        const redirectUri = `http://localhost:${server.config.server.port}`;
        const launchId = parse(req.url || '', true).query["launch_id"];
        const authorizationUrl = new URL('https://connect.getvim.com/os-api/v1/oauth/authorize');
        authorizationUrl.searchParams.set('launch_id', launchId?.toString() || '');
        authorizationUrl.searchParams.set('client_id', process.env.CLIENT_ID || '');
        authorizationUrl.searchParams.set('redirect_uri', redirectUri);
        res.statusCode = 302;
        res.setHeader("Location", authorizationUrl.toString());
        res.end();
    });
    server.middlewares.use("/api/token", async (req: Connect.IncomingMessage, res: ServerResponse, _: Connect.NextFunction) => {
        console.log('Got token body', req.body);
        const { code } = req.body;

        const vimResponse = await fetch(
          "https://connect.getvim.com/os-api/v1/oauth/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: process.env.CLIENT_ID,
              code,
              secret: process.env.CLIENT_SECRET,
            }),
          }
        );
        const tokenData = await vimResponse.json();
        if (!(await isAuthorized(tokenData, process.env.CLIENT_ID))) {
            res.end(JSON.stringify({
                status: 403,
                statusText: "Forbidden: You do not have access to this resource.",
            }));
        } else {
            res.end(JSON.stringify(tokenData));
        }
    });
  },
});


async function isAuthorized(
    vimTokenData,
    clientId: string,
    vimIssuer = "https://auth.getvim.com/"
  ) {
    try {
      const decodedIdToken = await parseJwt({
        jwt: vimTokenData.idToken,
        issuer: vimIssuer,
        audience: clientId,
      });
      console.log("decoded vim token", decodedIdToken);
      if (decodedIdToken.valid) {
        // If identification data on token is not sufficient userinfo endpoint can be used...
        return await isUserEligibleToMyApp({
          email: decodedIdToken.payload["email"],
          vimUserId: decodedIdToken.payload["nickname"],
        });
      } else if (decodedIdToken.valid === false) {
        console.error(
          `Failed to parse jwt ${decodedIdToken.reason} [${decodedIdToken.reasonCode}]`,
          {
            vimTokenData,
            vimIssuer,
            clientId,
          }
        );
        return false;
      }
    } catch (error) {
      console.error("Error verifying token", error);
      return false;
    }
  }

  async function isUserEligibleToMyApp({ email, vimUserId }) {
    console.info(`User ${email}, ${vimUserId} is eligible to my app.`);
    return true;
  }
