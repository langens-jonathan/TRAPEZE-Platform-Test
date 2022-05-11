import React from "react";
import Moment from "moment";
import Modal from "react-modal";

import {useAppDispatch, useAppSelector, useDebouncedEffect} from "../../app/hooks"

import {getJobOffers, setFilter, setOffset, setSortOn} from './jobOffersSlice';
import {diplomaUsageRequestStatusEnum} from "../../models/User";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: "2rem",
    borderRadius: "0.5rem",
    borderColor: "rgb(14 165 233)",
    backgroundColor: "white",
  },
};

export function JobOffers() {
  const { jobOffers, errorMessage, isLoading, filter, limit, offset, hasMore, sortOn } = useAppSelector((state) => state.jobOffers);
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  useDebouncedEffect(() => {
    if(!isLoading) {
      dispatch(getJobOffers({filter, offset, limit}))
    }
  }, [filter, offset, limit], 350);

  const urlParams = new URLSearchParams({
    "request_id": "1234",
    "policy_id": "61DEEED1CE5118000A000001",
    "redirect_url": "http://localhost/frontend/consent-received"
  });

  const consentUrl = `http://localhost:8884/consents-callback?${urlParams.toString()}`;

  return (
    <>
      <Modal
        isOpen={currentUser?.diplomaUsageRequestStatus === diplomaUsageRequestStatusEnum.not_answered && sortOn === "relevance"}
        onRequestClose={() => dispatch(setSortOn("title"))}
        contentLabel="Consent request"
        style={customStyles}
      >
        <p className="my-2 justify">
          In order to use your diploma information to filter relevant job offers, we need to retrieve it from the Flemish Government.
        </p>
        <p className="my-2 justify">
          You can either accept or reject this request <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={consentUrl}
        >
          here
        </a>.
        </p>

        <p className="my-2 justify">After answering, you will be redirected here and we will be able to fetch your diploma information.</p>

      </Modal>

      <div className="flex flex-0 mt-4">
        <div className="flex flex-1 mb-3 xl:w-96">
          <input type="search"
                 className="form-control relative min-w-0 w-full px-4 py-1 mx-4 text-base
                  font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-sky-500 rounded
                  hover:border-sky-600
                  transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-sky-700 focus:outline-none
                  flex flex-1"
                 placeholder="Filter job offers based on their title."
                 aria-label="Search"
                 value={filter}
                 onChange={(event) => {dispatch(setFilter(event.target.value))}} />

          <div className="flex flex-1">
            <label className="flex flex-0 mr-5 items-center" htmlFor="sortJobOffers">Sort by: </label>
            <select
              name="sortJobOffers"
              id="sortJobOffers"
              value={sortOn}
              onChange={(event) => {
                const newSortOn =
                  "relevance" === event.target.value
                  || "title" === event.target.value
                  || "createdOn" === event.target.value
                    ? event.target.value : "title";
                dispatch(setSortOn(newSortOn))
              }}
              className={`form-select 
              appearance-none
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              mr-5
              flex
              flex-1
              focus:text-gray-700 
              focus:bg-white 
              focus:border-blue-600 
              focus:outline-none`}
            >
              <option
                value="createdOn"
              >
                Last created on
              </option>
              <option
                value="title"
              >
                Title
              </option>
              <option
                value="relevance"
                className={`${isAuthenticated || currentUser?.diplomaUsageRequestStatus === diplomaUsageRequestStatusEnum.rejected ? "opacity-50 pointer-events-none" : ""}`}
                disabled={!isAuthenticated || currentUser?.diplomaUsageRequestStatus === diplomaUsageRequestStatusEnum.rejected}
                title={`${currentUser?.diplomaUsageRequestStatus === diplomaUsageRequestStatusEnum.rejected
                  ? "Not available as you did not consent to our request to use your diploma information."
                  : `Use your diploma information to sort results based on their relevance.${!isAuthenticated
                    ? " Only available if you're logged in."
                    : ""}`}`}
              >
                Relevance
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
        { jobOffers.map((jobOffer) => {
          return (<div key={jobOffer.id} className="w-full overflow-hidden border border-sky-500 rounded-lg shadow-md hover:border-sky-600 hover:shadow-lg flex flex-col min-h-[25vh]">
            <div className="flex-grow p-6 text-justify">
              <div className="font-bold text-xl mb-2 capitalize">
                {jobOffer.title}
              </div>
              <p className="text-gray-700 text-base">
                {jobOffer.description}
              </p>
            </div>
            <div className="text-right px-6 pt-4 pb-2">
                <span
                  className="inline-block bg-sky-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {Moment(jobOffer.createdOn).fromNow()}
                </span>
            </div>
          </div>)
        }) }

        {!isLoading && hasMore && <button
            onClick={() => {dispatch(setOffset(offset + limit))}}
            className="w-full overflow-hidden border border-sky-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center hover:border-sky-600 hover:shadow-lg">
            <span className="font-semibold text-gray-700">Load more</span>
        </button> }

        {isLoading && <div
            className="w-full overflow-hidden border border-sky-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center animate-pulse"
        >
            <span className="font-semibold text-gray-700">Loading...</span>
        </div> }

        {errorMessage && <div
            className="w-full overflow-hidden border border-red-500 rounded-lg shadow-md min-h-[25vh] flex items-center justify-center">
            <span className="font-semibold text-gray-700">{errorMessage}</span>
        </div>}

      </div>
    </>
  );
}
