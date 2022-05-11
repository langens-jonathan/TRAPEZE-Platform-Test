import React, { useEffect} from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../app/store";
import { useAppDispatch } from '../../app/hooks';

import {
    deleteSession,
} from './authenticationSlice';

import "./Authentication.module.css";

export function Logout() {
    const { isAuthenticated, isLoading, errorMessage } = useSelector((state: RootState) => state.authentication);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let timeout : ReturnType<typeof setTimeout>;

        if(isAuthenticated) {
            dispatch(deleteSession({}));
        } else {
            timeout = setTimeout(() => {
                navigate("/");
            }, 3500);
        }
        return () => {
            clearTimeout(timeout);
        }
    }, [isAuthenticated]);

    return (
        <>
            <div className={`p-8 my-10 overflow-hidden border border-sky-500 rounded-lg shadow-md min-h-[25vh] flex flex-col items-center justify-center mx-auto ${isLoading ? "animate-pulse" : ""}`}>
                <div className="text-gray-700">
                    {isAuthenticated && (
                        <>Please wait, your session is being terminated, you will be automatically redirected to the home page afterwards.</>
                    )}

                    {!isAuthenticated && (
                        <>You have been signed off, you will be redirected in a few seconds.</>
                    )}
                </div>
            </div>


            {errorMessage && (
                <div className="p-8 my-10 overflow-hidden border border-red-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center mx-auto">
                    <span className="text-gray-700">{errorMessage}</span>
                </div>
            )}
        </>
    );
}
