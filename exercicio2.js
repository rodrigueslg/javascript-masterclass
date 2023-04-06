let statement = "create table author (id number, name string, age number, city string, state string, country string)";

const regexp = /create table ([a-z]+) \((.+)\)/;
const parsedStatement = statement.match(regexp);

const tableName = parsedStatement[1];
console.log(tableName);

let columns = parsedStatement[2];
columns = columns.split(",");
console.log(columns);

const database = {
  tables: {
    [tableName]: {
      columns: {},
      "data": []
    }
  }
};

for (let col of columns) {
  col = col.trim().split(" ");
  const name = col[0];
  const type = col[1];
  database.tables[tableName].columns[name] = type;
}
console.log(JSON.stringify(database, undefined, " "));