const express = require("express");
const articles = express.Router();

const Article = require("../models/article");

articles.get("/", async (req, res) => {
    const articles = await Article.findAll();
    res.status(200).json(articles);
});

articles.get("/:id", async (req, res) => {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    article ?
        res.status(200).json(article)
        :
        res.sendStatus(404);
});

articles.post("/", async (req, res) => {
    const { title, content } = req.body;

    try {
        const newArticle = await Article.create({ title, content })
        res.status(201).json({
            message: 'Created successfully',
            article: newArticle
        });
    }
    catch (error) {
        res.sendStatus(500);
    };
});

articles.put("/:id", async (req, res) => {
    const { id } = req.params;
    const title = req.body;

    try {
        const article = await Article.update(title, {
            where: { id },
            returning: true,
            plain: true
        });

        res.status(200).json({
            message: 'Updated successfully',
            article: article[1]
        });
    }
    catch (error) {
        res.sendStatus(500);
    };
});

module.exports = articles;