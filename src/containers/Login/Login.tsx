import React from 'react';
import { Formik } from 'formik';
import { useMutation } from 'react-query';
import pb from "../../lib/pocketbase"
import { Navigate } from "react-router-dom";
import { Record, RecordAuthResponse } from 'pocketbase';
import { Logo } from '../../components/SvgComponents/VTonderLogo';

export const Login: React.FC<{}> = () => {
  type LoginFormType = {
    emailOrUsername: string;
    password: string;
  }

  const loginFormInitialValues: LoginFormType = {
    emailOrUsername: '',
    password: ''
  }

  const pocketbaseLogin = (loginData: LoginFormType): Promise<RecordAuthResponse<Record>> => {
    const { emailOrUsername, password } = loginData;
    return pb.collection("users").authWithPassword(emailOrUsername, password);
  }

  const { mutate: login, isError, isLoading } = useMutation(pocketbaseLogin)

  const containerStyle = `flex flex-col w-1/4 gap-y-2 p-4 font-fredoka text-[#ff4589] rounded-md border-[3px] border-[#ff5c98]  bg-[#ffe0e8]`

  return (
    <>
      {pb.authStore.isValid && <Navigate to="/dashboard" />}
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
