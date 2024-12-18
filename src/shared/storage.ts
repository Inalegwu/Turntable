import findPouch from "pouchdb-find";
import PouchDB from "pouchdb-node";
import relationalPouch from "relational-pouch";

PouchDB.plugin(relationalPouch).plugin(findPouch);

export const store = new PouchDB<
    Transfer & {
        app_id: string;
    }
>("app_db");
