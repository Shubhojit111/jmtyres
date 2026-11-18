/* One-time admin bootstrap. Password reset requires ADMIN_RESET_PASSWORD=true. */
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
(async () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "J.M. Tyres Owner").trim();
  const phone = (process.env.ADMIN_PHONE || "918336819093").trim();
  if (
    !/^\S+@\S+\.\S+$/.test(email) ||
    password.length < 12 ||
    Buffer.byteLength(password, "utf8") > 72
  )
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (12–72 UTF-8 bytes) as environment variables.",
    );
  const client = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/jmtyres",
    { serverSelectionTimeoutMS: 5000 }
  );
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "jmtyres");
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    const old = await db.collection("users").findOne({ email });
    if (old) {
      if (old.role !== "admin")
        throw new Error(
          "This email belongs to a customer. Choose another admin email.",
        );
      if (process.env.ADMIN_RESET_PASSWORD !== "true") {
        console.log(`Admin ${email} already exists; no changes made.`);
        return;
      }
      const passwordHash = await bcrypt.hash(password, 12);
      await db.collection("users").updateOne(
        { _id: old._id },
        { $set: { passwordHash, updatedAt: new Date() } },
      );
      await db.collection("sessions").deleteMany({ userId: old._id });
      await db.collection("password_resets").deleteMany({ userId: old._id });
      console.log(`Updated admin ${email}; revoked existing sessions and reset links.`);
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .collection("users")
      .insertOne({
        name,
        email,
        phone,
        passwordHash,
        role: "admin",
        accountStatus: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    console.log(
      `Created admin ${email}. Password was not printed. Never use development credentials in production.`,
    );
  } finally {
    await client.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
