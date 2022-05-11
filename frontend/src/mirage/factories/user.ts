import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const UserFactory = Factory.extend({
    name() { return `${faker.name.firstName()} ${faker.name.lastName()}`},
    username() { return faker.internet.userName(faker.name.firstName(), faker.name.lastName())},
    password() { return faker.internet.password(8)},
    email() { return faker.internet.email(faker.name.firstName(), faker.name.lastName()) }
});

export default UserFactory
