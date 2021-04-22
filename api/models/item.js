const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_id: { type: String, select: false },
  name: { type: String, required: true },
  needs_stats: { type: Boolean },
  img_url: { type: String, require: true },
  ducats: { type: Number },
  trading_tax: { type: Number },
  is_urgent: { type: Boolean },
  is_watched: { type: Boolean },
  needs_stats: { type: Boolean },
  items_in_set: { type: [String] },
  relics: { type: [String] },
  mod_max_rank: { type: Number },
  avg_price: { type: Number },
  min_price: { type: Number },
  max_price: { type: Number },
  order_history: { type: [Number] }
});

module.exports = mongoose.model("Item", ItemSchema);
