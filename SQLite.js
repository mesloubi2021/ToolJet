const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tooljet.db');

// Create a table for Items
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )`);
});

// Function to add an item to the database
function addItem(name, description) {
  db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Item added to the database');
    }
  });
}

// Function to retrieve all items from the database
function getAllItems(callback) {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      callback(rows);
    }
  });
}

// Usage
addItem('Sample Item', 'This is a test item.');
getAllItems((items) => {
  console.log('All Items:');
  items.forEach((item) => {
    console.log(`${item.id}: ${item.name} - ${item.description}`);
  });
});
