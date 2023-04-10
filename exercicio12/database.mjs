import DatabaseError from './database-error.mjs'
import Parser from './parser.mjs'

export default class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

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
  }

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
  }

  insert(parsedStatement) {
    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(", ");
    values = values.split(", ");

    let row = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  }

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
      this.tables[tableName].columns[name] = type;
    }
  }

  execute(statement) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.parser.parse(statement);
        if (result) {
          resolve(this[result.command](result.parsedStatement));
        }
        const message = `Syntax error: "${statement}"`;
        reject(new DatabaseError(statement, message));
      }, 1000);
    });
  }
}
