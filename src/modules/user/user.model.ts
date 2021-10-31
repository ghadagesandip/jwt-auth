import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    first_name: {
        type:String,
        required:true
    },
    last_name: String,

},{
    timestamps: true
});



export default mongoose.model('User', userSchema);