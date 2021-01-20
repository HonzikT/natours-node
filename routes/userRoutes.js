const express = require('express');

const {
  getAllUsers,
  currentUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.route('/').get(getAllUsers).post(currentUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
