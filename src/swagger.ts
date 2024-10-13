import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import type express from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    description: "A-center API with autogenerated swagger doc",
    version: "1.0.0",
    title: "A-center",
  },
  tags: [
    {
      name: "Create user",
      description: "Creación de nuevos usuarios",
    },
  ],
  paths: {
    "/user/create": {
      post: {
        summary: "Crea el usuario que recibe en el body de la request",
        tags: ["Create user"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string" },
                  loggedUsername: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Devuelve el username creado",
          },
          "400": {
            description: "Bad request",
          },
          "401": {
            description: "Unauthorized",
          },
          "409": {
            description: "Conflict",
          },
        },
      },
    },
  },
};

export const initSwagger = (app: express.Express): express.Express => {
  const options = {
    swaggerDefinition,
    apis: ["../src/server/controllers/user/createUserController.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/swagger", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  return app;
};
