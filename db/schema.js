const { gql } = require("apollo-server");

const typeDefs = gql`
  type Token {
    token: String
  }

  type Proyecto {
    nombre: String
    id: ID
    resp: String
  }

  type Tarea {
    nombre: String
    id: ID
    proyecto: String
    estado: Boolean
  }

  type Query {
    obtenerProyecto: [Proyecto]
    obtenerTarea(input: ProyectoIDInput): [Tarea]
  }

  input ProyectoIDInput {
    proyecto: String!
  }

  input UsuarioInput {
    nombre: String!
    email: String!
    password: String!
  }

  input AuthenticaUsuario {
    email: String!
    password: String!
  }

  input ProyectoInput {
    nombre: String!
  }

  input TareaInput {
    nombre: String!
    proyecto: String
  }

  type Mutation {
    # users
    crearUsuario(input: UsuarioInput): String
    authenticaUsuario(input: AuthenticaUsuario): Token

    # proyecto
    nuevoProyecto(input: ProyectoInput): Proyecto
    editarProyecto(id: ID!, input: ProyectoInput): Proyecto
    eliminarProyecto(id: ID!): String

    # tarea
    nuevaTarea(input: TareaInput): Tarea
    actulizarTarea(id: ID!, input: TareaInput, estado: Boolean): Tarea
    eliminarTarea(id: ID!): String
  }
`;

module.exports = { typeDefs };
