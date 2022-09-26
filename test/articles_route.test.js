"use strict";

const expect = require("chai").expect;
const request = require("supertest-as-promised");

const app = require("../app");
const agent = request.agent(app);

const db = require("../models/database");
const Article = require("../models/article");
const User = require("../models/user");

/**
 *
 * Tests Article Route
 *
 * Hace esto después de terminar los primeros test del Modelo de Article
 *
 */
describe("Articles Route:", function () {
  /**
   * Primero limpiamos la base de datos antes de comenzar
   */
  before(function () {
    return db.sync({ force: true });
  });

  /**
   * También, vaciamos las tablas luego de cada spec
   */
  afterEach(function () {
    return Promise.all([
      Article.truncate({ cascade: true }),
      User.truncate({ cascade: true }),
    ]);
  });

  describe("GET /articles", function () {
    /**
     * Problema 1
     * Haremos un request GET a /articles
     *
     * 1.  Debería retornar JSON (..usa `res.json`)
     * 2.  Porque no hay nada en la BD, debería ser un arreglo vacío
     *
     * **Credito Extra**: Considera usando app.param para automaticamente agregar el Article donde haya un param :id detectado
     */
    it("responde con un array via JSON", function () {
      return agent
        .get("/articles")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(function (res) {
          // res.body es el objeto JSON retornado
          expect(res.body).to.be.an.instanceOf(Array);
          expect(res.body).to.have.length(0);
        });
    });

    /**
     * Problema 2
     * Guarda un articulo en la base de datos usando nuestro modelo y
     * luego retornalo usando la ruta GET /articles
     *
     */
    it("retorna un articulo si hay uno en la base de datos", function () {
      var article = Article.build({
        title: "Test Article",
        content: "Test body",
      });

      return article.save().then(function () {
        return agent
          .get("/articles")
          .expect(200)
          .expect(function (res) {
            expect(res.body).to.be.an.instanceOf(Array);
            expect(res.body[0].content).to.equal("Test body");
          });
      });
    });

    /**
     * Problema 3
     * Guarda un segundo articulo en la base de datos usando nuestro
     * modelo, luego retornalo usando la ruta GET /articles
     *
     */
    it("retorna otro articulo si hay uno en la base de datos", function () {
      const article1 = Article.build({
        title: "Test Article",
        content: "Test body",
      });

      const article2 = Article.build({
        title: "Another Test Article",
        content: "Another test body",
      });

      return article1
        .save()
        .then(function () {
          return article2.save();
        })
        .then(function () {
          return agent
            .get("/articles")
            .expect(200)
            .expect(function (res) {
              expect(res.body).to.be.an.instanceOf(Array);
              expect(res.body[0].content).to.equal("Test body");
              expect(res.body[1].content).to.equal("Another test body");
            });
        });
    });
  });

  /**
   * Busca un articulo por su id
   */
  describe("GET /articles/:id", function () {
    let coolArticle;

    beforeEach(function () {
      const creatingArticles = [
        {
          title: "Boring article",
          content: "This article is boring",
        },
        {
          title: "Cool Article",
          content: "This article is cool",
        },
        {
          title: "Riveting Article",
          content: "This article is riveting",
        },
      ].map((data) => Article.create(data));

      return Promise.all(creatingArticles).then((createdArticles) => {
        coolArticle = createdArticles[1];
      });
    });

    /**
     * Este es un correcto pedido a GET /articles/:id donde buscamos
     * por el id del articulo creado arriba.
     */
    it("retorna el JSON del articulo basado en el id", function () {
      return agent
        .get("/articles/" + coolArticle.id)
        .expect(200)
        .expect(function (res) {
          if (typeof res.body === "string") {
            res.body = JSON.parse(res.body);
          }
          expect(res.body.title).to.equal("Cool Article");
        });
    });

    /**
     * Aquí pasamos un id incorrecto al URL, deberíamos tener un error 404
     */
    it("retorna un error 404 si el id no es correcto", function () {
      return agent.get("/articles/76142896").expect(404);
    });
  });

  /**
   * Series de tests para testear la creación de nuevos Articles
   * usando un POST request a /articles
   */
  describe("POST /articles", function () {
    /**
     * Testea la creación de un articulo
     * Aquí nosotros no solo conseguimos devuelta el articulo,
     * obtenemos un objeto de este tipo, el cual tu construyes:
     *  {
     *    message: 'Created successfully',
     *    article: <la instancia del articulo creado>
     *  }
     *
     */
    it("creates a new article", function () {
      return agent
        .post("/articles")
        .send({
          title: "Awesome POST-Created Article",
          content: "Can you believe I did this in a test?",
        })
        .expect(201)
        .expect(function (res) {
          expect(res.body.message).to.equal("Created successfully");
          expect(res.body.article.id).to.not.be.an("undefined");
          expect(res.body.article.title).to.equal(
            "Awesome POST-Created Article"
          );
        });
    });

    // Esta debería fallar con un 500 porque no seteamos el article.content

    it("no crea un nuevo articulo sin contenido", function () {
      return agent
        .post("/articles")
        .send({
          title: "Este articulo no debería ser permitido",
        })
        .expect(500);
    });

    // Chequeá si los articulos fueron realmente guardados a la base de datos
    it("guarda los articulos a la BD", function () {
      return agent
        .post("/articles")
        .send({
          title: "Awesome POST-Created Article",
          content: "Can you believe I did this in a test?",
        })
        .expect(201)
        .then(function () {
          return Article.findOne({
            where: { title: "Awesome POST-Created Article" },
          });
        })
        .then(function (foundArticle) {
          expect(foundArticle).to.exist; // eslint-disable-line no-unused-expressions
          expect(foundArticle.content).to.equal(
            "Can you believe I did this in a test?"
          );
        });
    });

    // No asumas que las operaciones async (como escrituras en la BD)
    // va a funcionar. Siempre chequeá
    it("Envía devuelta JSON del articulo creado, no solo la data POSTeada", function () {
      return agent
        .post("/articles")
        .send({
          title: "Coconuts",
          content: "A full-sized coconut weighs about 1.44 kg (3.2 lb).",
          extraneous:
            "Sequelize va a ignorar silenciosamente esta propiedad que no es del esquema",
        })
        .expect(201)
        .expect(function (res) {
          expect(res.body.article.extraneous).to.be.an("undefined");
          expect(res.body.article.createdAt).to.exist; // eslint-disable-line no-unused-expressions
        });
    });
  });

  /**
   * Series de specs para testear actualizar los Articles usando pedido PUT
   *  a /articles/:id
   */
  describe("PUT /articles/:id", function () {
    let article;

    beforeEach(function () {
      return Article.create({
        title: "Final Article",
        content: "You can do it!",
      }).then(function (createdArticle) {
        article = createdArticle;
      });
    });

    /**
     * Testeá la actualización de un articulo
     * Aquí no tenemos devuelta solo el artículo, sino que tenemos un objeto
     * de este tipo, que tu construyes
     *  {
     *    message: 'Updated successfully',
     *    article: <la instancia del articulo actualizado>
     *  }
     *
     **/
    it("actualiza un article", function () {
      return agent
        .put("/articles/" + article.id)
        .send({
          title: "Awesome PUT-Updated Article",
        })
        .expect(200)
        .expect(function (res) {
          expect(res.body.message).to.equal("Updated successfully");
          expect(res.body.article.id).to.not.be.an("undefined");
          expect(res.body.article.title).to.equal(
            "Awesome PUT-Updated Article"
          );
          expect(res.body.article.content).to.equal("You can do it!");
        });
    });

    it("guarda la actualización a la BD", function () {
      return agent
        .put("/articles/" + article.id)
        .send({
          title: "Awesome PUT-Updated Article",
        })
        .then(function () {
          return Article.findByPk(article.id);
        })
        .then(function (foundArticle) {
          expect(foundArticle).to.exist; // eslint-disable-line no-unused-expressions
          expect(foundArticle.title).to.equal("Awesome PUT-Updated Article");
        });
    });

    it("Obtiene un 500 por un update invalido", function () {
      return agent
        .put("/articles/" + article.id)
        .send({ title: "" })
        .expect(500);
    });
  });
});