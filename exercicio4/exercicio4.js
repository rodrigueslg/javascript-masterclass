const DatabaseError = function DatabaseError(statement, message) {
  this.statement = statement;
  this.message = message;
}

const database = {
  tables: {},
  createTable(statement) {
    const regexp = /create table ([a-z]+) \((.+)\)/;
    const parsedStatement = statement.match(regexp);

    const tableName = parsedStatement[1];
    console.log(tableName);
    this.tables[tableName] = {
      columns: {},
      data: []
    }

    let columns = parsedStatement[2];
    columns = columns.split(",");
    console.log(columns);

    for (let col of columns) {
      col = col.trim().split(" ");
      const name = col[0];
      const type = col[1];
      database.tables[tableName].columns[name] = type;
    }
  },
  execute(statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    }
    const message = `Syntax error: "${statement}"`;
    throw new DatabaseError(statement, message);
  }
};

try {
  database.execute("create table author (id number, name string, age number, city string, state string, country string)");
  console.log(JSON.stringify(database, undefined, " "));

  database.execute("select * from author");
}
catch (e) {
  console.log(e);
}
