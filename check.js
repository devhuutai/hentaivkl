const db = require("./utils/database");

async function checkDuplicate() {
  try {
    const connection = await db.getConnection();
    const [select] = await connection.query(`SELECT np.id as idProducts, np.name, np.slug
FROM noah_products np
LEFT JOIN noah_chapters nc ON np.id = nc.idProducts
WHERE nc.idProducts IS NULL;`);
    for (let i = 0; i < select?.length; i++) {
      const [update] = await connection.query(`UPDATE noah_products SET isDeleted = ? `, [JSON.stringify({ id: 1, time: Date.now() })]);
      console.log(`id : ${select[i].id} - slug : ${select[i].name}`);
    }
    console.log(select);
  } catch (err) {
    console.log(err);
  }
}
checkDuplicate();
