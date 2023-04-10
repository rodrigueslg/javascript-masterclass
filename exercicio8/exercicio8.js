const DatabaseError = function DatabaseError(statement, message) {
  this.statement = statement;
  this.message = message;
}

const Parser = function() {
  const commands = new Map();
  commands.set("createTable", /create table ([a-z]+) \((.+)\)/);
  commands.set("insert", /insert into ([a-z]+) \((.+)\) values \((.+)\)/);
  commands.set("select", /select (.+) from ([a-z]+)(?: where (.+))?/);
  commands.set("delete", /delete from ([a-z]+)(?: where (.+))?/);

  this.parse = function(statement) {
    for (let [command, regexp] of commands) {
      const parsedStatement = statement.match(regexp);
      if (parsedStatement) {
        return {
          command,
          parsedStatement
        }
      }
    }
  }
}

const database = {
  tables: {},
  parser: new Parser(),
  delete(parsedStatement) {
    let [, tableName, whereClause] = parsedStatement;

    let rows = this.tables[tableName].data;
    if (whereClause) {
      const [whereCol, whereValue] = whereClause.split(" = ");
      rows = rows.filter((data) => {
        return data[whereCol] !== whereValue;
      });
    }
    else {
      rows = [{}];
    }

    this.tables[tableName].data = rows;
  },
  select(parsedStatement) {
    let [, fields, tableName, whereClause] = parsedStatement;
    fields = fields.split(", ");

    let rows = this.tables[tableName].data;
    if (whereClause) {
      const [whereCol, whereValue] = whereClause.split(" = ");
      rows = rows.filter((data) => {
        return data[whereCol] === whereValue;
      });
    }

    rows = rows.map((row) => {
      let selectedRow = {};
      fields.forEach(field => {
        selectedRow[field] = row[field];
      });
      return selectedRow;
    });

    return rows;
  },
  insert(parsedStatement) {
    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(", ");
    values = values.split(", ");

    let row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  } ,
  createTable(parsedStatement) {
    let [, tableName, columns] = parsedStatement;
    columns = columns.split(",");

    this.tables[tableName] = {
      columns: {},
      data: []
    }

    for (let col of columns) {
      col = col.trim().split(" ");
      const [name, type] = col;
      database.tables[tableName].columns[name] = type;
    }
  },
  execute(statement) {
    const result = this.parser.parse(statement);
    if (result) {
      return this[result.command](result.parsedStatement);
    }
    const message = `Syntax error: "${statement}"`;
    throw new DatabaseError(statement, message);
  }
};

try {
  database.execute("create table author (id number, name string, age number, city string, state string, country string)");
  database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
  database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
  database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");

  console.log(database.execute("select name, age from author"));
  console.log(database.execute("select name, age from author where id = 2"));

  database.execute("delete from author where id = 2");
  console.log(JSON.stringify(database, undefined, " "));

  database.execute("delete from author");
  console.log(JSON.stringify(database, undefined, " "));
}
catch (e) {
  console.log(e);
}
