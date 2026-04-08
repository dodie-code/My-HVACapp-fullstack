const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type: String,
  }, 
  password: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: [ 'client', 'technician', 'administrator' ],
    default: 'client',
  },
}, 
{timestamps: true });

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 15);
});

module.exports = mongoose.model('User', UserSchema);
