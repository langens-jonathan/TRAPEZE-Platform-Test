import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Modal from 'react-modal';

import { RootState } from "./app/store";
import './App.css';

import { Login } from "./features/authentication/Login"
import { Logout } from "./features/authentication/Logout"
import { JobOffers } from "./features/job-offers/JobOffers"

import React from "react";
import {useAppDispatch} from "./app/hooks";
import {restoreSession} from "./features/authentication/authenticationSlice";

const ROUTE_HOME = "/";
const ROUTE_CONSENT_RECEIVED = "/consent-received";
const ROUTE_LOGIN = "/login";
const ROUTE_LOGOUT = "/logout";

Modal.setAppElement("#root");

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Content/>
    </Router>
  );
}

function Content() {
  const { isAuthenticated } = useSelector((state: RootState) => state.authentication);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!isAuthenticated) {
      dispatch(restoreSession({}))
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="flex flex-col">
        <nav className="flex items-center justify-between flex-wrap bg-sky-900 p-6 mb-4">
          <div className="flex items-center flex-no-shrink text-white mr-6">
            <span className="font-semibold text-3xl tracking-tight">Unemployment Office</span>
          </div>

          <div className="block mt-2 lg:mt-0 lg:hidden">
            <button
              className="flex items-center px-3 py-2 border rounded text-sky-200 border-sky-400 hover:text-white hover:border-white"
              onClick={() => setIsMenuVisible(!isMenuVisible)}>
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
              </svg>
            </button>
          </div>

          <div className={`${isMenuVisible ? "block" : "hidden"} w-full flex-grow lg:flex lg:items-center lg:w-auto`}>
            <div className="flex flex-col text-right lg:text-left lg:flex-row lg:flex-grow justify-end">
              <a className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4 active" href="/">Citizens</a>
              <a className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" href="/">Employers</a>
              <a className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" href="/">Partners</a>

              <a className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" href="/">Our locations</a>
              <a className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" href="/">Contact us</a>
              {isAuthenticated
                ? <NavLink className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" to={ROUTE_LOGOUT}>Logout</NavLink>
                : <NavLink className="block mt-1 lg:inline-block lg:mt-0 text-sky-200 hover:text-white mr-4" to={ROUTE_LOGIN}>Login</NavLink>
              }
            </div>
          </div>
        </nav>

        <nav id="tabs" className="mx-4">
          <ul className="flex border-b text-center">
            <li className="mr-1">
              <NavLink className="bg-white inline-block py-2 px-4 text-sky-500 hover:text-sky-800 font-semibold" to="/second">
                Home
              </NavLink>
            </li>
            <li className="mr-1">
              <NavLink className="bg-white inline-block py-2 px-4 text-sky-500 hover:text-sky-800 font-semibold" to={ROUTE_HOME}>
                Job offers
              </NavLink>
            </li>
            <li className="mr-1 pointer-events-none">
              <NavLink className="bg-white inline-block py-2 px-4 text-gray-300 no-underline font-semibold" to="/inactive">
                Your candidatures
              </NavLink>
            </li>
            <li className="mr-1">
              <NavLink className="bg-white inline-block py-2 px-4 text-sky-500 hover:text-sky-800 font-semibold" to="/second">
                Information
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-col flex-1">
        <Routes>
          <Route path={ROUTE_HOME} element={<JobOffers/>}/>
          <Route path={ROUTE_CONSENT_RECEIVED} element={<div className={"justify-center text-center"}>Your consent has been received.</div>}/>
          <Route path={ROUTE_LOGIN} element={<Login/>}/>
          <Route path={ROUTE_LOGOUT} element={<Logout/>}/>
        </Routes>
      </main>

      <footer className="flex p-8 sm:px-1/20">

      </footer>
    </div>
  );
}

export default App;
