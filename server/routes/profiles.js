const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();

// POST /api/profiles
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Missing or empty name' });
    }
    if (typeof name !== 'string') {
      return res.status(422).json({ status: 'error', message: 'Invalid type' });
    }
    if (name.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'Missing or empty name' });
    }

    const result = await Profile.create(name.trim());
    if (result.exists) {
      return res.status(201).json({
        status: 'success',
        message: 'Profile already exists',
        data: result.profile
      });
    } else {
      return res.status(201).json({
        status: 'success',
        data: result.profile
      });
    }
  } catch (error) {
    console.error('Error in POST /api/profiles:', error);
    if (error.message.includes('returned an invalid response')) {
      return res.status(502).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// GET /api/profiles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }
    res.json({ status: 'success', data: profile });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// GET /api/profiles
router.get('/', async (req, res) => {
  try {
    const { gender, country_id, age_group } = req.query;
    const filters = {};
    if (gender) filters.gender = gender;
    if (country_id) filters.country_id = country_id;
    if (age_group) filters.age_group = age_group;

    const profiles = await Profile.findAll(filters);
    res.json({
      status: 'success',
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// DELETE /api/profiles/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Profile.delete(id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;