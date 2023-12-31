const { Pool } = require('pg');
const pool = new Pool({
  user: 'neehabaral',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`
      SELECT * FROM users
      WHERE email = $1;
      `, [email])
    .then((res) => res.rows.length === 0 ? null : res.rows[0])
    .catch((err) => console.error(err.message));
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`
      SELECT * FROM users
      WHERE id = $1;
      `, [id])
    .then((res) => res.rows.length === 0 ? null : res.rows[0])
    .catch((err) => console.error(err.message));
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [user.name, user.email, user.password])
    .then((res) => res.rows[0])
    .catch((err) => console.log(err.message));
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
      SELECT reservations.*, properties.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
      `, [guest_id, limit])
    .then((res) => res.rows)
    .catch((err) => console.log(err.message));
};


/// Properties

/**
 * Get properties from search.
 * options = an object containing query filters
*/
const getAllProperties = function(options, limit) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

  // WHERE - filter by city, owner_id & min/max price
  const whereConditions = options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night;
  if (whereConditions) {
    queryString += `WHERE `;
  }
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} AND `;
  }
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length} AND `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `cost_per_night >= $${queryParams.length} AND `;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `cost_per_night <= $${queryParams.length} AND `;
  }
  // remove 'AND ' from end of WHERE clause
  if (whereConditions) {
    queryString = queryString.replace(/AND\s*$/, '');
  }
  
  // GROUP BY
  queryString += `
    GROUP BY properties.id
    `;

  // HAVING - filter by minimum rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
      HAVING avg(property_reviews.rating) >= $${queryParams.length}
      `;
  }
  // ORDER BY & LIMIT
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  // Handle promise
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.log(err.message));
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return pool
    .query(`
      INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
      `, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.log(err.message));
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
