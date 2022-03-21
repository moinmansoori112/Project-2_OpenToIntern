const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss","Mast"],
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9a-zA-Z]).{8,}$/,"Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
