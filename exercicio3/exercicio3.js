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
  }
};

database.execute("create table author (id number, name string, age number, city string, state string, country string)");
console.log(JSON.stringify(database, undefined, " "));