//supertokens integration
import Session from "supertokens-auth-react/recipe/session";

// Attempts to use Session from supertokens
let mySession: any;
export function apInitialize(session) {
  mySession = session;
}
async function getJWT() {
  //mySession.init();
  if (await mySession.doesSessionExist()) {
    let userId = await mySession.getUserId();
    let jwt = (await mySession.getAccessTokenPayloadSecurely()).jwt;
    let userId2 = await Session.getUserId();
    let jwt2 = (await Session.getAccessTokenPayloadSecurely()).jwt;
    console.log("jwt", jwt, jwt2);
    return jwt;
  } else {
    console.log("getJWT: session does not exist");
  }
}
// End supertokens

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// Fetch user from our backend, making use of the fact that supertoken
// automatically adds the token on the headers when using fetch
async function getUserFromApi(): any {
  await getJWT();
  let url =
    import.meta.env.VITE_BACKEND_DOMAIN +
    import.meta.env.VITE_BACKEND_APIPATH +
    "/getuser";
  let response = await fetch(url, {
    method: "POST",
  });
  let data = await response.json();
  console.log("getUserFromApi", data);
  return data;
}
async function logoutUserFromApi(): any {
  let url =
    import.meta.env.VITE_BACKEND_DOMAIN +
    import.meta.env.VITE_BACKEND_APIPATH +
    "/logoutuser";
  let response = await fetch(url, {
    method: "POST",
  });
  let data = await response.json();
  return data;
}
// Develop our custom authProvider
export const authProvider = {
  // called when the user navigates to a new location, to check for authentication
  checkAuth2: () => {
    return Promise.reject();
  },
  checkAuth: async (params) => {
    if (window.location.toString().includes("/auth/")) {
      console.log("Skipping auth check");
      return Promise.resolve();
    }
    let user: any = await getUserFromApi();
    if (user && user.userId) {
      //User logged in
      console.log("checkAuth: logged in first time");
      return Promise.resolve();
    } else {
      //try twice to see if this is a timing issue
      await sleep(500);
      user = await getUserFromApi();
      if (user && user.userId) {
        //User logged in
        console.log("checkAuth: logged in 2nd time");
        return Promise.resolve();
      } else {
        console.log("checkAuth: logged out after 2nd attempt");
        console.log("checkAuth: rejecting promise with redirect and message");
        return Promise.reject();
      }
    }
  },
  // called when the user clicks on the logout button
  logout: async () => {
    let data = await logoutUserFromApi();
    if (data && data.status == "OK") {
      return Promise.resolve();
    } else {
      console.log("logout: already logged out");
      return Promise.resolve();
    }
  },
  // called when the API returns an error
  checkError: async ({ status }) => {
    return Promise.resolve();
    if (status === 401 || status === 403) {
      let user: any = await getUserFromApi();
      if (user && user.userId) {
        await logoutUserFromApi();
        return Promise.resolve();
      } else {
        console.log("checkError: rejecting promise");
        return Promise.reject({ redirectTo: "/login" });
      }
    }
    return Promise.resolve();
  },

  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => {
    //todo
    return Promise.resolve();
  },
  getIdentity: async () => {
    let user: any = await getUserFromApi();
    if (user && user.userId) {
      return Promise.resolve({ id: user.userId, fullName: user.email });
    } else {
      console.log("getIdentity: rejecting promise");
      return Promise.reject();
    }
  },
  // called when the user attempts to log in
  // via user/password, i.e. never in our current implementation
  login: async (params) => {
    //return Promise.resolve();
    let user: any = await getUserFromApi();
    if (user && user.userId) {
      //User logged in
      console.log("login: logged in");
      return Promise.resolve();
    } else {
      console.log("login: logged out");
      return Promise.reject();
    }
  },
};
