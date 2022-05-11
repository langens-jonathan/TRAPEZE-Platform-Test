import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const DiplomaFactory = Factory.extend({
  title() { return faker.lorem.words(2)},
  description() { return faker.lorem.paragraphs(2)},
});

export default DiplomaFactory