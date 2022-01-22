import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const VcodeSchema = new Schema({
    email: String,
    vcode: String,
});
const Vcode = mongoose.model('Vcode', VcodeSchema);

export default Vcode;