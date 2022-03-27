const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const createIntern = new mongoose.Schema(
  {
    name: {
      type: String,
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
    mobile: {
      type: Number,
      trim: true,
      required: true,
      unique:true,
      match: [/^([+]\d{2})?\d{10}$/,"please fill a valid mobile Number"],
      minLength: 10,
      maxLength: 10
    },

    collegeId: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "college",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("intern", createIntern);
