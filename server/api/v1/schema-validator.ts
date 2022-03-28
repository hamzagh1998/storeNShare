const registerSchema = {
  type: "object",
  properties: {
    username: {type: "string"},
    email: {type: "string"},
    password: {type: "string"},
    avatar: {type: "string"}
  },
  required: ["username", "email", "password"],
  additionalProperties: false
};

const loginSchema = {
  type: "object",
  properties: {
    usernameOrEmail: {type: "string"},
    password: {type: "string"}
  },
  required: ["usernameOrEmail", "password"],
  additionalProperties: false
};

export { registerSchema, loginSchema };