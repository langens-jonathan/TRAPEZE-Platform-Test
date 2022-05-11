import { createServer, Model, Response } from "miragejs"

import JobOfferFactory from "./factories/job-offer";
import SessionFactory from "./factories/session";
import UserFactory from "./factories/user"

import Session from "./models/session"
import User from "./models/user"
import Diploma from "./models/diploma";
import DiplomaFactory from "./factories/diploma";

export function makeServer({ environment = "development" } = {}) {
    let server = createServer({
        environment,

        models: {
            diploma: Diploma,
            jobOffer: Model,
            session: Session,
            user: User,
        },

        factories: {
            diploma: DiplomaFactory,
            jobOffer: JobOfferFactory,
            session: SessionFactory,
            user: UserFactory,
        },

        seeds(server) {
            server.create("diploma", {
                "title": "Software developer",
                "description": "A computer programmer, sometimes called a software developer, " +
                    "a programmer or more recently a coder (especially in more informal contexts), " +
                    "is a person who creates computer software. " +
                    "The term computer programmer can refer to a specialist in one area of " +
                    "computers or to a generalist who writes computer programs"});
            server.createList("diploma", 5);
            server.create("user", {username: "bernard", password: "antoine", name: "Bernard Antoine", email: "bernard.antoine@acme.com"});
            server.create("user", {username: "roger", password: "frederick", name: "Roger Frederick", email: "roger.frederick@acme.com"});
            server.create("user", {username: "michel", password: "vaillant", name: "Michel Vaillant", email: "michel.vaillant@acme.com"});
            server.createList("job-offer",  14);
        },

        routes() {
            this.namespace = "";

            this.get("/job-offers", (schema, request) => {
                const { filter, offset, limit } = request.queryParams;

                return schema.jobOffers.where((jobOffer) => { return jobOffer.title.includes(filter); }).sort((a, b) => b.createdOn - a.createdOn).slice(offset, offset + limit);
            });

            this.passthrough();

        },
    });

    return server
}
