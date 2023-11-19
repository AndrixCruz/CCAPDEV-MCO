import mongoose, { model } from 'mongoose';

const reviewSchema = new Schema({
    username: String,
    bio: String,
});

const Review = model('Review', reviewSchema);

export default Review;