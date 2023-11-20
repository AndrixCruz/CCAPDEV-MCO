const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const userProfileSchema = new Schema({
    username: String,
    bio: String,
});

const UserProfile = model('UserProfile', userProfileSchema);

export default UserProfile;