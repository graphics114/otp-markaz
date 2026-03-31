import database from "../../database/db.js";

/**
 * Some deployed DBs ended up with a UNIQUE constraint/index on students.roll_number.
 * The app should allow duplicate roll numbers, so we drop any UNIQUE constraint or
 * UNIQUE index that involves (only) the `roll_number` column.
 *
 * This migration is safe to run multiple times.
 */
export async function allowDuplicateRollNumbers() {
  // Find attnum for students.roll_number
  const attRes = await database.query(
    `
    SELECT a.attnum
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'students'
      AND n.nspname = current_schema()
      AND a.attname = 'roll_number'
      AND a.attisdropped = false
      AND a.attnum > 0
    `
  );

  if (attRes.rows.length === 0) return;
  const rollAttnum = attRes.rows[0].attnum;

  // 1) Drop UNIQUE constraints that are exactly on roll_number
  const constraintsRes = await database.query(
    `
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'students'::regclass
      AND contype = 'u'
      AND conkey = ARRAY[$1::smallint]
    `,
    [rollAttnum]
  );

  for (const { conname } of constraintsRes.rows) {
    await database.query(
      `ALTER TABLE students DROP CONSTRAINT IF EXISTS "${conname}";`
    );
  }

  // 2) Drop UNIQUE indexes that are exactly on roll_number
  // (pg_index.indkey is an int2vector; we cast it to int2[] for safe comparison)
  const indexesRes = await database.query(
    `
    SELECT i.relname AS indexname
    FROM pg_index ix
    JOIN pg_class i ON i.oid = ix.indexrelid
    WHERE ix.indrelid = 'students'::regclass
      AND ix.indisunique = true
      AND ix.indnatts = 1
      AND (ix.indkey::int2[])[1] = $1::smallint
    `,
    [rollAttnum]
  );

  for (const { indexname } of indexesRes.rows) {
    await database.query(`DROP INDEX IF EXISTS "${indexname}";`);
  }
}

