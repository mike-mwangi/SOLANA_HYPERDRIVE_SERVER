import mongoose from 'mongoose';

const passwordHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  passwords: {
    type: [String],
    default: []
  }
});

const PasswordHistory = mongoose.model('PasswordHistory', passwordHistorySchema);
export default PasswordHistory;