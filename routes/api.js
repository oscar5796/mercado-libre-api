const express = require("express");
const fetch = require('node-fetch');

var app = express();

app.get("/items", async (req, res, next) => {
  const query = req.query.q;
  const limit = req.query.limit;

  if (query === undefined || query === "") {
    return res.status(400).json({
      ok: false,
      message: "Must have a query",
    });
  }

  let queryResults;

  try {
    const url = `https://api.mercadolibre.com/sites/MLA/search${query ? `?q=${query}`: ""}${limit ? `&limit=${limit}` : ""}`
    const result = await fetch(url);
    console.log('result => ', result);
    queryResults = await result.json();
  } catch (error) {
    res.status(400).json({
      error,
      message: "Something went wrong"
    })
  }

  return res.status(200).json({
    author: {
      name: "Oscar",
      lastName: "Santisteban"
    },
    categories: queryResults.results.map((result) => result.category_id),
    items: queryResults.results
  })
});

app.get("/items/:id", async(req, res, next) => {
  const id = req.params.id;
  const limit = req.query.limit;

  let item;
  let itemDescription;

  if (id === undefined || id === "") {
    return res.status(400).json({
      ok: false,
      message: "Must specify an id",
    });
  }

  try {
    const itemResponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const itemDescriptionResponse = await fetch(`https://api.mercadolibre.com/items/${id}/description`);

    item = await itemResponse.json();
    itemDescription = await itemDescriptionResponse.json();

  } catch (error) {
    res.status(400).json({
      error,
      message: "Something went wrong"
    })
  }

  return res.status(200).json({
    author: {
      name: "Oscar",
      lastname: "Santisteban"
    },
    item: {
      ...item,
      description: itemDescription
    }
  })
})

module.exports = app;