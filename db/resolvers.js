const Usuario = require("../models/UsuarioModel");
const Proyecto = require("../models/ProyectoModel");
const Tarea = require("../models/TareaModel");
const bcryptjs = require("bcryptjs");
require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");

const crearToken = (usuario, secreta, expiresIn) => {
  const { id, email, nombre } = usuario;
  return jwt.sign({ id, email, nombre }, secreta, { expiresIn });
};

const resolvers = {
  Query: {
    obtenerProyecto: async (_, {}, { usuario }) => {
      console.log(usuario);
      const { id } = usuario;
      const proyectos = await Proyecto.find({ creador: id });
      return proyectos;
    },
    obtenerTarea: async (_, { input }, { usuario }) => {
      const tareas = await Tarea.find({ creador: usuario.id })
        .where("proyecto")
        .equals(input.proyecto);
      return tareas;
    },
  },
  Mutation: {
    crearUsuario: async (_, { input }) => {
      const { password, email } = input;
      const existing = await Usuario.findOne({ email });
      if (existing) {
        throw new Error("El usuario ya existe");
      }

      try {
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        const newUser = new Usuario(input);
        newUser.save();
        return "El usuario se creo exitosamente";
      } catch (error) {
        console.error(error);
      }
    },
    authenticaUsuario: async (_, { input }) => {
      const { password, email } = input;
      const existing = await Usuario.findOne({ email });
      if (!existing) {
        throw new Error("Credenciales incorrectas");
      }

      const passwordCorrecto = await bcryptjs.compare(
        password,
        existing.password
      );

      if (!passwordCorrecto) {
        throw new Error("Credenciales incorrectas");
      }
      return { token: crearToken(existing, process.env.SECRET, "2hr") };
    },
    nuevoProyecto: async (_, { input }, { usuario }) => {
      const { nombre } = input;

      const existing = await Proyecto.findOne({ nombre });
      if (existing) {
        throw new Error("El proyecto ya existe");
      }

      try {
        const proyecto = new Proyecto(input);
        const { id } = usuario;
        proyecto.creador = id;
        proyecto.resp = "proyecto creado exitosamente";
        const resultado = await proyecto.save();
        return resultado;
      } catch (error) {
        console.error(error);
      }
    },
    editarProyecto: async (_, { id, input }, { usuario }) => {
      let proyecto = await Proyecto.findById(id);

      const { id: idUsuario } = usuario;

      if (!proyecto) {
        throw new Error("El proyecto no existe");
      }
      const { creador } = proyecto;

      if (creador.toString() !== idUsuario) {
        throw new Error("No tienes credenciales para editar el proyecto");
      }

      proyecto = await Proyecto.findByIdAndUpdate({ _id: id }, input, {
        new: true,
      });
      return proyecto;
    },
    eliminarProyecto: async (_, { id }, { usuario }) => {
      let proyecto = await Proyecto.findById(id);

      const { id: idUsuario } = usuario;

      if (!proyecto) {
        throw new Error("El proyecto no existe");
      }
      const { creador } = proyecto;

      if (creador.toString() !== idUsuario) {
        throw new Error("No tienes credenciales para eliminar el proyecto");
      }

      await Proyecto.findByIdAndDelete({ _id: id });
      return "El proyecto fue eliminado correctamente";
    },
    nuevaTarea: async (_, { input }, { usuario }) => {
      try {
        const tarea = new Tarea(input);
        tarea.creador = usuario.id;
        const resultado = await tarea.save();
        return resultado;
      } catch (error) {
        console.error(error);
      }
    },
    actulizarTarea: async (_, { id, input, estado }, { usuario }) => {
      let tarea = await Tarea.findById(id);
      if (!tarea) {
        throw new Error("Tarea no encontrada");
      }
      if (tarea.creador.toString() !== usuario.id) {
        throw new Error("No tienes credenciales para editar la tarea");
      }
      input.estado = estado;

      tarea = await Tarea.findByIdAndUpdate({ _id: id }, input, { new: true });
      return tarea;
    },
    eliminarTarea: async (_, { id }, { usuario }) => {
      let proyecto = await Tarea.findById(id);

      const { id: idUsuario } = usuario;

      if (!proyecto) {
        throw new Error("La tarea no existe");
      }
      const { creador } = proyecto;

      if (creador.toString() !== idUsuario) {
        throw new Error("No tienes credenciales para eliminar la tarea");
      }

      await Tarea.findByIdAndDelete({ _id: id });
      return "La tarea fue eliminado correctamente";
    },
  },
};

module.exports = { resolvers };
