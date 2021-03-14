const express = require("express");
const fetch = require('node-fetch');


var app = express();

app.get("/items", async (req, res) => {
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
    items: queryResults.results.map(item => ({
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
        decimals: item.price % 1
      },
      sold_quatity: item.sold_quantity,
      condition: item.condition,
      picture: item.thumbnail,
      free_shipping: item.shipping.free_shipping,
      city_name: item.address.city_name
    }))
  })
});

app.get("/items/:id", async(req, res) => {
  const id = req.params.id;

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
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: item.price,
        decimals: item.price % 1
      },
      sold_quantity: item.sold_quantity,
      condition: item.condition,
      picture: item.pictures[0].url,
      free_shipping: item.shipping.free_shipping,
      city_name: item.seller_address.city.name,
      description: itemDescription,
    }
  })
})

module.exports = app;