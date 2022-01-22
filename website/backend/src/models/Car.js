import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const CarSchema = new Schema({
    username: String,
    carname: String,
    password: String,
    host: String,
    port: String,
});
const Car = mongoose.model('Car', CarSchema);

export default Car;