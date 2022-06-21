const mysql = require("mysql"); //recupere le package mysql
const config = require("../configs/db.config"); //recupére la config pour la connexion a la bdd

class BaseService {
  constructor() {
    this.name = this.constructor.name.replace(`Service`, ``);
    this.table = this.name.unCamelize();
  }
  //*****connexion bdd ******//
  static db;
  static connect = () => {
    if (!BaseService.db) {
      BaseService.db = mysql.createPool({
        host: config.HOST,
        port: config.PORT,
        user: config.USER,
        password: config.PASS,
        database: config.NAME,
      });
    }
    return BaseService.db;
  };
  //////////////////////////////////////////////////////////////////

  //****************execution d'une requete******//
  static executeQuery = async (sql, params) => {
    return await new Promise((resolve, reject) => {
      BaseService.connect().query(sql, params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      });
    })
      .catch(err => {
        console.error("DB Error", err);
        return err;
      });
  };
  executeQuery = async (sql, params) => {
    return await BaseService.executeQuery(sql, params)
  }
  ///////////////////////////////////////////////////////////////

  //*******le select******//
  select = async (params) => {
    let sql = `SELECT * FROM appuser where deleted = ?`;
    if (params?.where) {
      sql += ` AND (${params.where.replace('&&', 'AND').replace('||', 'OR')})`;
    }
    sql += ";"
    const rows = await BaseService.executeQuery(sql, [0]);
    return rows;
  };
  ///////////////////////////////////////////////////////////////////
  insertOneOrMany = async (params) => {
    if (Array.isArray(params)) {
      //INSERT MANY ROWS
      if (params.length === 0) return null;
      const columns = Object.keys([...params].pop()).join(',');
      let allValues = [];
      params.forEach(object => {
        let values = Object.values(object);
        values = values.map((val) => {
          return (val = "'" + val.replace(/'/g, "''") + "'");
        });
        values = values.join(",");
        allValues.push("(" + values + ")");
      })
      allValues = allValues.join(',');
      const sql = `INSERT INTO ${this.table} (${columns}) VALUES ${allValues};`;
      const result = await BaseService.executeQuery(sql);
      if (result.affectedRows === params.length) {
        return await this.selectAll({ where: `id >= ${result.insertId} && id < ${result.insertId + result.affectedRows}` });
      }
      return false;
    }
  }
    
      //INSERT ONE ROW

      insertUser = async (params) => {
        const columns = Object.keys(params).join(',');
        let values = Object.values(params);
        values = values.map(val => {
            return val = ('"' + val.replace('"','') + '"')
        });// `'${val.replace("'","\'")}'`);
        values = values.join(',')
        let sql = `INSERT INTO ${this.table} (${columns}) VALUES (${values})`;
        const result = await BaseService.executeQuery(sql);
        console.log(result);
        let row = null;
        if(result.affectedRows === 1){
            row = await this.selectUser(result.insertId);
        }
        return row;      
    }
    
    selectUser = async (params) => {
      let sql = `SELECT * FROM ${this.table} WHERE id_app_user=${params}`;
      const rows = await BaseService.executeQuery(sql, [0]);
      return rows;
     };
    //   const columns = Object.keys(params).join(",");
    //   let values = Object.values(params);
    //   values = values.map((val) => {
    //     return (val = "'" + val.replace(/'/g, "''") + "'");
    //   });
    //   values = values.join(",");
    //   let sql = `INSERT INTO ${this.table} (${columns}) VALUES (${values})`;
    //   const result = await BaseService.executeQuery(sql);
    //   if (result.affectedRows === 1) {
    //     return await this.selectOne(result.insertId);
    //   }
    //   return false;
    

  

  selectWhere = async (params) => {
    let sql = `SELECT * FROM ${this.table} WHERE Id_user=${params.where}`;
    const rows = await BaseService.executeQuery(sql, [0]);
    return rows;
  };
  // selectWhere = async (params) => {
  //   let sql = `SELECT * FROM ${this.table} WHERE Id_appuser=${params.where}`;
  //   const rows = await BaseService.executeQuery(sql, [0]);
  //   return this.ModelClass.from(rows);
  //  };

  updateUser = async (params) => {
    const where = params.where;
    let values = params.mdp;
    let passwordField = "user.mdp";
    let sql = `UPDATE ${this.table} SET ${passwordField} = '${values}' WHERE id_app_user = ${where};`;
    const result = await BaseService.executeQuery(sql);
    return result.affectedRows > 0 ? await this.selectWhere({ where }) : false;


  }
  
  delete = async (params) => {
    const where = params.where?.replaceAll('&&','AND').replaceAll('||','OR') || '0';
    let sql = `DELETE FROM ${this.table} WHERE ${where};`;
    const result = await DbService.executeQuery(sql);
    return result.AffectedRows > 0;
  }




}
module.exports = BaseService;