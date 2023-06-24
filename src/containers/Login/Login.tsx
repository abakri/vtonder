import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { useMutation } from 'react-query';
import { useNavigate } from "react-router-dom";
import { Logo } from '../../components/SvgComponents/VTonderLogo';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

export const Login: React.FC<{}> = () => {
  type LoginFormType = {
    emailOrUsername: string;
    password: string;
  }

  const loginFormInitialValues: LoginFormType = {
    emailOrUsername: '',
    password: ''
  }

  const firebaseLogin = (loginData: LoginFormType): Promise<UserCredential> => {
    const { emailOrUsername, password } = loginData;
    return signInWithEmailAndPassword(auth, emailOrUsername, password);
  }

  const { mutate: login, isError, isLoading } = useMutation(firebaseLogin);

  const containerStyle = `flex flex-col w-1/4 gap-y-2 p-4 font-fredoka text-[#ff4589] rounded-md border-[3px] border-[#ff5c98]  bg-[#ffe0e8]`

  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard")
    });
  }, []);

  return (
    <>
      <Formik
        initialValues={loginFormInitialValues}
        onSubmit={({ emailOrUsername, password }) => { login({ emailOrUsername, password }) }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className="flex flex-col items-center h-screen pt-16">
            <div className="flex justify-center items-center w-[80%] sm:w-[450px] mt-8">
              <Logo />
            </div>

            <div
              className={containerStyle}
              style={{
                boxShadow: "6px 6px 0px #ff5c98"
              }}
            >
              <label htmlFor="emailOrUsername">Email or Username</label>
              <input
                className="rounded-md p-2"
                id="emailOrUsername"
                name="emailOrUsername"
                onChange={handleChange}
                value={values.emailOrUsername}
              />
              <label htmlFor="email">Password</label>
              <input
                className="rounded-md p-2"
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
              />
              {isError && <div className="text-red-500">Invalid email or password</div>}
              <button
                className="font-fredoka text-[#ff4589] w-1/2 h-[50px] self-center border-[3px] border-[#ff5c98] transition hover:bg-[#ff5c98] bg-[#ffe0e8] rounded-lg hover:text-white"
                style={{
                  boxShadow: "6px 6px 0px #ff5c98"
                }}
                type="submit"
                disabled={isLoading}
              >
                Login
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  )
}
