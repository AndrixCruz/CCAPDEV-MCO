import mongoose, { model } from 'mongoose';

const restaurantSchema = new Schema({
    name: String,
    location: String,
    website: String,
    bio: String,
    owner: String,
});

const Restaurant = model('Restaurant', restaurantSchema);

export default Restaurant;