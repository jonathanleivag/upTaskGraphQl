const mongoose = require("mongoose");

const TareaSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    lowercase: true

  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  proyecto: {
    type: mongoose.Types.ObjectId,
    ref: "Proyecto",
  },
  estado: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Tarea", TareaSchema);
