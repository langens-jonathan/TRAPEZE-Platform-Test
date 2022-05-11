import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";

import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";

import {
    createSession,
} from "./authenticationSlice";

import "./Authentication.module.css";

export function Login() {
    const { isAuthenticated, isLoading, errorMessage } = useSelector((state: RootState) => state.authentication);
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let timeout : ReturnType<typeof setTimeout>;

        if(isAuthenticated) {
            timeout = setTimeout(() => {
                navigate("/");
            }, 3500);
        }
        return () => {
            clearTimeout(timeout);
        }
    });

    return (
        <>
            <form className="border border-sky-500 rounded-lg shadow-md min-h-[25vh] flex flex-col items-center justify-center p-8 mt-10 mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        autoComplete="current-username"
                        placeholder="Username"
                        disabled={isAuthenticated || isLoading}
                        className={`
                            border border-solid rounded px-4 py-1
                            shadow transition ease-in-out
                            hover:border-sky-600 focus:border-sky-700
                            focus:outline-none focus:shadow-outline
                            ${isAuthenticated || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={username}
                        onChange={(event => setUsername(event.target.value))}
                        autoFocus={true}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        disabled={isAuthenticated || isLoading}
                        className={`
                            border border-solid rounded px-4 py-1
                            shadow transition ease-in-out
                            hover:border-sky-600 focus:border-sky-700
                            focus:outline-none focus:shadow-outline
                            ${isAuthenticated || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={password}
                        onChange={(event => setPassword(event.target.value))}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={isAuthenticated || isLoading}
                        className={`
                            bg-sky-200 text-gray-500
                            font-bold py-2 px-4 rounded
                            shadow transition ease-in-out
                            hover:bg-sky-500 hover:text-white
                            focus:outline-none focus:shadow-outline
                            ${isAuthenticated || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            dispatch(createSession({username, password}))
                        }}
                    >
                        Sign in
                    </button>
                </div>
            </form>

            {isAuthenticated && !isLoading && (
                <div className="p-8 my-10 overflow-hidden border border-sky-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center mx-auto">
                    <span className="text-gray-700">You have successfully logged in. You will be redirected to the homepage in a few seconds.</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-8 my-10 overflow-hidden border border-red-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center mx-auto">
                    <span className="text-gray-700">{errorMessage}</span>
                </div>
            )}
        </>
    );
}
