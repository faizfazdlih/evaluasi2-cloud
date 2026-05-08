require('dotenv').config();
const pool = require('./src/config/database');

(async () => {
  const [rows] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'applications' ORDER BY ORDINAL_POSITION",
    [process.env.DB_NAME]
  );
  console.log(rows.map((r) => r.COLUMN_NAME).join(','));
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
