import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:123456@localhost:5432/newposts",
});

export { pool };
