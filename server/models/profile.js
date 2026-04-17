const axios = require('axios');
const { v7: uuidv7 } = require('uuid');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  gender_probability: { type: Number, required: true },
  sample_size: { type: Number, required: true },
  age: { type: Number, required: true },
  age_group: { type: String, required: true },
  country_id: { type: String, required: true },
  country_probability: { type: Number, required: true },
  created_at: { type: String, required: true }
});

const ProfileModel = mongoose.model('Profile', profileSchema);

class Profile {
  static async create(name) {
    // Check if profile already exists
    const existing = await this.findByName(name);
    if (existing) {
      return { exists: true, profile: existing };
    }

    // Call external APIs
    console.log('Calling APIs for', name);
    const [genderizeRes, agifyRes, nationalizeRes] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${name}`, { timeout: 5000 }),
      axios.get(`https://api.agify.io?name=${name}`, { timeout: 5000 }),
      axios.get(`https://api.nationalize.io?name=${name}`, { timeout: 5000 })
    ]);
    console.log('APIs called successfully');

    const genderize = genderizeRes.data;
    const agify = agifyRes.data;
    const nationalize = nationalizeRes.data;

    // Validate responses
    if (!genderize.gender || genderize.count === 0) {
      throw new Error('Genderize returned an invalid response');
    }
    if (agify.age === null) {
      throw new Error('Agify returned an invalid response');
    }
    if (!nationalize.country || nationalize.country.length === 0) {
      throw new Error('Nationalize returned an invalid response');
    }

    // Process data
    const age = agify.age;
    let ageGroup;
    if (age <= 12) ageGroup = 'child';
    else if (age <= 19) ageGroup = 'teenager';
    else if (age <= 59) ageGroup = 'adult';
    else ageGroup = 'senior';

    const topCountry = nationalize.country.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

    const profileData = {
      id: uuidv7(),
      name,
      gender: genderize.gender,
      gender_probability: genderize.probability,
      sample_size: genderize.count,
      age,
      age_group: ageGroup,
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date().toISOString()
    };

    // Save to DB
    const profile = new ProfileModel(profileData);
    await profile.save();

    return { exists: false, profile: profileData };
  }

  static async findById(id) {
    return await ProfileModel.findOne({ id });
  }

  static async findByName(name) {
    return await ProfileModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  static async findAll(filters = {}) {
    const query = {};
    if (filters.gender) query.gender = new RegExp(`^${filters.gender}$`, 'i');
    if (filters.country_id) query.country_id = new RegExp(`^${filters.country_id}$`, 'i');
    if (filters.age_group) query.age_group = new RegExp(`^${filters.age_group}$`, 'i');

    return await ProfileModel.find(query).select('id name gender age age_group country_id');
  }

  static async delete(id) {
    const result = await ProfileModel.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

module.exports = Profile;