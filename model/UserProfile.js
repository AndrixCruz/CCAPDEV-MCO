import mongoose, { model } from 'mongoose';

const userProfileSchema = new Schema({
    username: String,
    bio: String,
});

const UserProfile = model('UserProfile', userProfileSchema);

export default Review;