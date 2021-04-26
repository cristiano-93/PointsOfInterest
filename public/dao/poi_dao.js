class PoiDao {
    // conn is our mysql database connection
    // table is the table storing the points of interest
    constructor(conn, table) {
        this.conn = conn;
        this.table = table;
    }


    // find a Point of interest with a given ID

    findPoiById(id) {
        return new Promise((resolve, reject) => {
            this.conn.query(`SELECT * FROM ${this.table} WHERE ID=?`, [id],
                (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else if (results.length == 0) {
                        // resolve with null if no results - this is not considered an error, so we do not reject
                        resolve(null);
                    } else {
                        // To simplify code which makes use of the DAO, extract the one and only row from the array 
                        // and resolve with that.
                        resolve(results[0]);
                    }
                });
        });
    }
}