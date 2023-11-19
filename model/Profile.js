import mongoose, { model } from 'mongoose';

const profileSchema = new Schema({
    Name: String,
    username: String,
    email: String,
    password: String,
});

const Profile = model('Profile', profileSchema);

export default Profile;