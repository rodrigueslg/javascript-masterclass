let statement = "create table author (id number, name string, age number, city string, state string, country string)";

const regexp = /create table ([a-z]+) \((.+)\)/;
const parsedStatement = statement.match(regexp);

const tableName = parsedStatement[1];
console.log(tableName);

let columns = parsedStatement[2];
columns = columns.split(", ");
console.log(columns);