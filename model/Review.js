import mongoose, { model } from 'mongoose';

const reviewSchema = new Schema({
    username: String,
    time: Date.now(),
    restaurant: String,
    rating: number,
    comment: String,
    email: String,
});

const Review = model('Review', reviewSchema);

export default Review;