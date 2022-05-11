import { Model, belongsTo } from "miragejs";

const Session = Model.extend({
    user: belongsTo()
});

export default Session;