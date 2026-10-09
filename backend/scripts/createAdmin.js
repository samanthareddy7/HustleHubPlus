
//   ADMIN_EMAIL=admin@hustlehub.com ADMIN_PASSWORD='Admin@12345' node scripts/createAdmin.js
require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { User } = require("../models/user");

const run = async () => {
    const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD first.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email });
    if (existing) {
        console.log("An account with that email already exists.");
    } else {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;
        const passwordHash = await bcrypt.hash(password, rounds);
        await User.create({ name: "Admin", email, passwordHash, role: "admin" });
        console.log("Admin account created.");
    }

    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err.message);
    process.exit(1);
});