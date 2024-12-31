const NodedbJson = require('nodedb-json');
const db = new NodedbJson('db.json');
class Store {
    constructor() {
        this.db = db;
    }
    set(key, value) {
        this.db.set(key, value);
    }
    get(key) {
        return this.db.get(key);
    }
    update(key, value) {
        this.db.update(key, value);
    }
    delete(key) {
        this.db.delete(key);
    }
    push(key, value) {
        this.db.push(key, value);
    }
    find(key, predicate) {
        return this.db.find(key, predicate);
    }
    filter(key, predicate) {
        return this.db.filter(key, predicate);
    }
}
module.exports = Store;
/*
const NodedbJson = require('nodedb-json');
const db = new NodedbJson('path/to/db.json');

db.set('name', 'John Doe');
console.log(db.get('name')); // Outputs: John Doe

ES6

import NodedbJson from 'nodedb-json';
const db = new NodedbJson('path/to/db.json');

db.set('name', 'John Doe');
console.log(db.get('name')); // Outputs: John Doe

Basic Operations
Set

db.set("key", "value");

Get

const value = db.get("key");

Update

// Update an object
db.update("key", { newField: "newValue" });

// Update an array item
db.update("arrayKey", (item) => item.id === 1, { name: "Updated Name" });

Delete

// Delete a key
db.delete("key");

// Delete array items using a predicate
db.delete("arrayKey", (item) => item.id === 1);

// Batch delete array items by specified field
db.delete("arrayKey", [1, 3]); // Deletes items with id 1 and 3
db.delete("arrayKey", ["Alice", "Charlie"], "name"); // Deletes items with name 'Alice' and 'Charlie'

Push

db.push("users", { name: "Bob", age: 30 }).push("users", { name: "Charlie", age: 35 });
db.push("users", [
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 },
]);

Advanced Operations
Find

const item = db.find("arrayKey", (item) => item.id === 2);

Filter

const items = db.filter("arrayKey", (item) => item.isActive);*/