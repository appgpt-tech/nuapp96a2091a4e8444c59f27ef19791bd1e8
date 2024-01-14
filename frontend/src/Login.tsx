import React from "react";
import { useEffect } from "react";
import { SignInAndUp } from "supertokens-auth-react/recipe/thirdpartypasswordless";
//import Session from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { useCheckAuth } from "ra-core";

const LoginPage = ({ theme }) => {
  const checkAuth = useCheckAuth();
  const navigate = useNavigate();
  //  let sessionContext = Session.useSessionContext();
  //  if (sessionContext.loading) {
  //    return null;
  //  }
  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate("/");
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);

  return (
    <div>
      <SignInAndUp />
    </div>
  );
};

export default LoginPage;
