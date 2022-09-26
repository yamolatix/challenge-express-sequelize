"use strict";

const Promise = require("bluebird");
const expect = require("chai").expect;
const Article = require("../models/article");
const User = require("../models/user");
const db = require("../models/database");

/**
 *
 * Comenzá Aca!
 *
 * Estos tests describen el modelo que vas a escribir en models/article.js
 *
 */

describe("El modelo `Article`", function () {
  /**
   * Primero limpiamos la base de datos y recreamos las tablas antes de empezar
   */
  before(function (done) {
    db.sync({ force: true }).then(() => done());
  });

  /**
   * Luego, creamos una instancia de article (sin guardar!) antes de cada spec
   */
  const fullText =
    "The South African cliff swallow (Petrochelidon spilodera), also known as the South African swallow, is a species of bird in the Hirundinidae family.";

  let article;
  beforeEach(function () {
    article = Article.build({
      title: "Migratory Birds",
      content: fullText,
    });
  });

  /**
   * Ademas, vaciamos las tablas luego de cada spec
   */
  afterEach(function (done) {
    Promise.all([
      Article.truncate({ cascade: true }),
      User.truncate({ cascade: true }),
    ]).then(() => done());
  });

  describe("definción de atributos", function () {
    /**
     * Tu modelo debería tener dos campos (ambos requeridos): `title` y `content`.
     *
     * http://docs.sequelizejs.com/manual/tutorial/models-definition.html
     */
    xit("incluye los campos `title` y `content`", function () {
      return article.save().then(function (savedArticle) {
        expect(savedArticle.title).to.equal("Migratory Birds");
        expect(savedArticle.content).to.equal(fullText);
      });
    });

    xit("requiere `content`", function () {
      article.content = null;

      return article.validate().then(
        function () {
          throw new Error("la validación debe fallar cuando content es null");
        },
        function (result) {
          expect(result).to.be.an.instanceOf(Error);
        }
      );
    });

    xit("requiere `title` (en una forma más estricta que para `content)", function () {
      article.title = "";

      return article.validate().then(
        function () {
          throw new Error("La validación debe fallar cuando title esta vacío");
        },
        function (result) {
          expect(result).to.be.an.instanceOf(Error);
          expect(result.message).to.contain("Validation error");
        }
      );
    });

    xit("puede manejar `content` extenso", function () {
      const articleContent =
        "WALL-E (stylized with an interpunct as WALL·E) is a 2008 American computer-animated science-fiction comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. Directed by Andrew Stanton, the story follows a robot named WALL-E, who is designed to clean up an abandoned, waste-covered Earth far in the future. He falls in love with another robot named EVE, who also has a programmed task, and follows her into outer space on an adventure that changes the destiny of both his kind and humanity. Both robots exhibit an appearance of free will and emotions similar to humans, which develop further as the film progresses.";

      return Article.create({
        title: "WALL-E",
        content: articleContent,
      }).then(function (result) {
        expect(result).to.be.an("object");
        expect(result.title).to.equal("WALL-E");
        expect(result.content).to.equal(articleContent);
      });
    });
  });

  /**
   * NOTA ESPECIAL: para este punto, haz definido suficiente del modelo
   * artículo para continuar con tus Routes tests. El resto de estos specs,
   * aunque necesarios para pasar completamente los tests de Model, no son
   * necesarios para los tests de Routes. Manten en mente que los tests de
   * Routes dependen de un modelo que Funciona, así que si rompes el modelo
   * Article en tu código, las Routes también van a fallar. Hace commits!
   */

  describe("definición de opciones", function () {
    describe("`snippet` campo virtual", function () {
      /**
       * Configurá un campo virtual (Fijate en los getter methods de
       * sequelize) llamado `snippet` que devuelva los primeros 23
       * characteres del contentido continuado por un "...".
       *
       * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#defining-as-part-of-the-model-options
       */
      xit('Evalua a los primeros 23 caracteres del `content` anexado con "..."', function () {
        expect(article.snippet).to.equal("The South African cliff...");

        article.content =
          "At length did cross an Albatross / Thorough the fog it came";
        expect(article.snippet).to.equal("At length did cross an ...");

        article.content =
          "The Albatross fell off, and sank / Like lead into the sea";
        expect(article.snippet).to.equal("The Albatross fell off,...");
      });

      // Esto es principalmente para evitar un caso limite visto durante `Model.update`
      xit("retorna un empty string para contenido faltante", function () {
        article.content = undefined;

        expect(article.snippet).to.equal("");
      });
    });

    describe("metodo de instancia: `truncate`", function () {
      /**
       * Configurá un metodo de instancia (Fijate los instanceMethods de
       * sequelize) llamado `truncate` que va a acortar (cambiar!) el
       * `content` de una instancia a un length que te pasen como parametro.
       * Este metodo no guarda en la base de datos, solo modifica el objeto
       * de Sequelize para que el usuario pueda elegir si y cuando lo quiere
       * guardar.
       *
       * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
       */
      xit("trunca el `content`", function () {
        expect(article.content).to.equal(fullText);

        article.truncate(12);
        expect(article.content).to.equal("The South Af");
      });

      xit("acepta cualquier length", function () {
        expect(article.content).to.equal(fullText);

        const randLength = Math.ceil(Math.random() * 20);
        article.truncate(randLength);
        expect(article.content).to.have.length(randLength);
      });

      xit("No guarda la instancia una vez truncada", function () {
        expect(article.content).to.equal(fullText);

        article.truncate(7);
        expect(article.content).to.have.length(7);

        Article.findAll().then(function (articles) {
          expect(articles).to.have.length(0);
        });
      });
    });

    describe("Metodo de Clase: `findByTitle`", function () {
      /**
       * Seteá un metodo de clase llamado findByTitle que nos va a servir
       * para encontar *un solo* documento por su titulo.
       *
       * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#expansion-of-models
       */

      beforeEach(function () {
        const otherArticles = [1, 2, 3].map(function (num) {
          return Article.create({
            title: "Article Number " + num,
            content: "etc.",
          });
        });
        const articles = otherArticles.concat(article.save());
        return Promise.all(articles);
      });

      xit("Encuentra un artículo especifico por su `title`", function () {
        return Article.findByTitle("Migratory Birds").then(function (
          foundArticle
        ) {
          expect(foundArticle).not.to.be.an.instanceOf(Array);
          expect(foundArticle.content).to.equal(fullText);
        });
      });
    });
  });

  describe("asociaciones", function () {
    /**
     * Agregá una relación `belongsTo` entre articulos y users, pero
     * asegurate que el usuario tiene el alias de 'author' para cada
     * articulo.
     *
     * http://docs.sequelizejs.com/manual/tutorial/associations.html#belongsto
     */

    xit("pertenece a un user, que es guardado como el `author` del articulo", function () {
      const creatingUser = User.create({ name: "Alatar the Blue" });
      const creatingArticle = Article.create({
        title: "Blue Wizards",
        content:
          "They are two of the five Wizards (or Istari) sent by the Valar to Middle-earth to aid in the struggle against Sauron.",
      });

      return Promise.all([creatingUser, creatingArticle])
        .spread(function (createdUser, createdArticle) {
          // este metodo `setAuthor` existe automaticamente si seteas la asociación correctamente
          return createdArticle.setAuthor(createdUser);
        })
        .then(function () {
          return Article.findOne({
            where: { title: "Blue Wizards" },
            include: { model: User, as: "author" },
          });
        })
        .then(function (foundArticle) {
          expect(foundArticle.author).to.exist; // eslint-disable-line no-unused-expressions
          expect(foundArticle.author.name).to.equal("Alatar the Blue");
        });
    });
  });

  /**
   * Tu modelo deberia tener un campo llamado `version`,
   * el cual incrementa por 1 cada ves que guardas
   *
   * http://docs.sequelizejs.com/manual/tutorial/hooks.html
   */

  describe("campo `version`", function () {
    beforeEach(function () {
      return Article.create({
        title: "Biological Immortality",
        content:
          "Biological immortality refers to a stable or decreasing rate of mortality from senescence, thus decoupling it from chronological age.",
      });
    });

    xit("es originalmente 0, incluso si no esta explicitamente seteado", function () {
      return Article.findOne({
        where: { title: "Biological Immortality" },
      }).then(function (foundArticle) {
        expect(foundArticle.version).to.equal(0);
      });
    });

    xit("incrementa por 1 cada vez que el articulo se actualiza", function () {
      return Article.findOne({ where: { title: "Biological Immortality" } })
        .then(function (foundArticle) {
          expect(foundArticle.version).to.equal(0);
          return foundArticle.update({
            content: "Biological immortality is a lie!",
          });
        })
        .then(function (updatedArticle) {
          expect(updatedArticle.version).to.equal(1);
          return updatedArticle.update({
            content: "Have you seen the 19th century painting of Keanu Reeves?",
          });
        })
        .then(function (updatedArticle) {
          expect(updatedArticle.version).to.equal(2);

          // "recarga" el articulo de la base de datos solo para asegurarse
          // que los cambios a la versión son guardados apropiadamente!
          return updatedArticle.reload();
        })
        .then(function (reloadedArticle) {
          expect(reloadedArticle.version).to.equal(2);
        });
    });
  });

  describe("extra credito campo `tags`", function () {
    /** EXTRA CREDITO
     * Tu modelo Article debería tener un campo tag que es
     * un arreglo, pero cuando lo accedemos, deberíamos tener
     * un string: los stags unidos por una coma y espacio
     *
     * Mira a getters y setters:
     * http://docs.sequelizejs.com/manual/tutorial/models-definition.html#getters-setters
     *
     * Para activar este spec, cambia `xit` a `it`
     */
    xit("es un getter customizado", function () {
      // tags deberían tener un `defaultValue` que es un arreglo vacío.
      // console.dir(Article);
      expect(Article.tableAttributes.tags.defaultValue).to.deep.equal([]);

      // funcionalidad principal de tags
      return Article.create({
        title: "Taggy",
        content: "So Taggy",
        tags: ["tag1", "tag2", "tag3"],
      }).then(function (createdArticle) {
        expect(createdArticle.tags).to.equal("tag1, tag2, tag3");
      });
    });
  });
});
