import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  city: { type: String, required: true },
  attractions: [{ name: String, price_range: String }],
  city_image: String,
  how_to_reach: String,
  nearest_station: String,
  nearest_airport: String,
});

export default mongoose.model('Trip', tripSchema);