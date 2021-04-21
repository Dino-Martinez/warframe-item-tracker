const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    item_id: { type: String, select: false },
    name: { type: String, required: true },
    needs_stats: { type:String },
});

module.exports = mongoose.model("Item", ItemSchema);
