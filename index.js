const express = require('express');
const { resolve } = require('path');
const app = express();
const port = 3010;
const sqlite3 = require("sqlite3") ; 
const {open} = require("sqlite") ; 
app.use(express.static('static'));
let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();




//Exercise 1: Get All Restaurants
async function getAllRestaurants() {
  const query = "SELECT * FROM restaurants";
  const response = await db.all(query);
  return { restaurants: response };
}

app.get("/restaurants", async (req, res) => {
  try {
    const results = await getAllRestaurants();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 2: Get Restaurant by ID
async function getRestaurantById(id) {
  const query = "SELECT * FROM restaurants WHERE id = ?";
  const response = await db.get(query, [id]);
  return { restaurant: response };
}

app.get("/restaurants/details/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await getRestaurantById(id);

    if (!result.restaurant) {
      return res.status(404).json({ message: `Restaurant with ID ${id} not found` });
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine
async function getRestaurantsByCuisine(cuisine) {
  const query = "SELECT * FROM restaurants WHERE cuisine = ?";
  const response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  const cuisine = req.params.cuisine;

  try {
    const results = await getRestaurantsByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: `No restaurants found for cuisine: ${cuisine}` });
    }

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 4: Get Restaurants by Filter

async function getFilteredRestaurants(filters) {
  const { isVeg, hasOutdoorSeating, isLuxury } = filters;
  const query = `
    SELECT * FROM restaurants 
    WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?`;
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get("/restaurants/filter", async (req, res) => {
  const filters = req.query;

  try {
    const results = await getFilteredRestaurants(filters);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: `No restaurants found with the given filters` });
    }

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating

async function getRestaurantsSortedByRating() {
  const query = "SELECT * FROM restaurants ORDER BY rating DESC";
  const response = await db.all(query);
  return { restaurants: response };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    const results = await getRestaurantsSortedByRating();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 6: Get All Dishes
async function getAllDishes() {
  const query = "SELECT * FROM dishes";
  const response = await db.all(query);
  return { dishes: response };
}

app.get("/dishes", async (req, res) => {
  try {
    const results = await getAllDishes();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 7: Get Dish by ID

async function getDishById(id) {
  const query = "SELECT * FROM dishes WHERE id = ?";
  const response = await db.get(query, [id]);
  return { dish: response };
}

app.get("/dishes/details/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await getDishById(id);

    if (!result.dish) {
      return res.status(404).json({ message: `Dish with ID ${id} not found` });
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 8: Get Dishes by Filter

async function getFilteredDishes(isVeg) {
  const query = "SELECT * FROM dishes WHERE isVeg = ?";
  const response = await db.all(query, [isVeg]);
  return { dishes: response };
}


app.get("/dishes/filter", async (req, res) => {
  const { isVeg } = req.query;

  try {
    const results = await getFilteredDishes(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: `No dishes found with the given filter` });
    }

    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Exercise 9: Get Dishes Sorted by Price

async function getDishesSortedByPrice() {
  const query = "SELECT * FROM dishes ORDER BY price ASC";
  const response = await db.all(query);
  return { dishes: response };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    const results = await getDishesSortedByPrice();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
