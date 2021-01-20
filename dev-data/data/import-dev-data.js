const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succesful')); // eslint-disable-line no-console

// Read JSON file
const tours = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded successfully!'); // eslint-disable-line no-console
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
  process.exit();
};

// Delete all data from DB collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!'); // eslint-disable-line no-console
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
  process.exit();
};

// Specify action in argv
if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
