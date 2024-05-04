import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const Audio = mongoose.model('Audio', audioSchema);
export default Audio;
