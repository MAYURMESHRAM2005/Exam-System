/**
 * ============================================================================
 * MIGRATION: backfill startAtUTC / endAtUTC on existing Exam documents
 * ============================================================================
 *
 * Why this is needed:
 * Exams created before this fix only have `date` (a Date) and `time`
 * (a "HH:MM" string). The new canonical fields `startAtUTC` / `endAtUTC`
 * are populated automatically by the Exam model's pre-save hook — but only
 * on *save*. Existing rows in MongoDB were never saved through that hook,
 * so they need one explicit backfill pass.
 *
 * This is safe to run multiple times (idempotent: skips exams that already
 * have startAtUTC unless --force is passed) and safe to run while the app
 * is live — it only ever recomputes startAtUTC/endAtUTC, never touches
 * `date`/`time`/`duration`, and every write is a single-document update.
 *
 * Note: getExamWindow() in utils/dateTime.js already falls back to deriving
 * the window from date+time on the fly for any document missing
 * startAtUTC, so *running this migration is not required for correctness* —
 * it's purely a performance/consistency optimization (lets startAtUTC be
 * indexed and queried directly, e.g. by the notification scheduler, instead
 * of recomputing on every read). Run it whenever convenient after deploying.
 *
 * Usage:
 *   node backend/scripts/migrateExamStartAtUTC.js
 *   node backend/scripts/migrateExamStartAtUTC.js --force   # recompute all
 * ============================================================================
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Exam = require("../models/Exam");
const { parseExamTime } = require("../utils/dateTime");

const FORCE = process.argv.includes("--force");

async function run() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGO_URI (or MONGODB_URI) is not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  const filter = FORCE ? {} : { $or: [{ startAtUTC: null }, { startAtUTC: { $exists: false } }] };
  const exams = await Exam.find(filter).select("_id date time duration");

  console.log(`Found ${exams.length} exam(s) to migrate.`);

  let migrated = 0;
  let skipped = 0;

  for (const exam of exams) {
    const start = parseExamTime(exam.date, exam.time);
    if (!start) {
      console.warn(`  ⚠ Skipping ${exam._id}: unparseable date/time (${exam.date} / ${exam.time})`);
      skipped += 1;
      continue;
    }
    const end = new Date(start.getTime() + exam.duration * 60000);

    await Exam.updateOne(
      { _id: exam._id },
      { $set: { startAtUTC: start, endAtUTC: end } }
    );
    migrated += 1;
  }

  console.log(`Done. Migrated: ${migrated}. Skipped (unparseable): ${skipped}.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
