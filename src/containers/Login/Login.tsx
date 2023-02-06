import React from 'react';
import { Formik } from 'formik';
import { useMutation } from 'react-query';
import pb from "../../lib/pocketbase"
import { Navigate } from "react-router-dom";
import { Record, RecordAuthResponse } from 'pocketbase';

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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="emailOrUsername">Email or Username</label>
                            <input
                                id="emailOrUsername"
                                name="emailOrUsername"
                                onChange={handleChange}
                                value={values.emailOrUsername}
                            />
                            <label htmlFor="email">Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={values.password}
                            />
                            {isError && <div className="text-red-500">Invalid email or password</div>}
                            <button type="submit" disabled={isLoading}>
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    )
}