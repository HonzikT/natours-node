const express = require('express');
const {
  getAllUsers,
  currentUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(currentUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
