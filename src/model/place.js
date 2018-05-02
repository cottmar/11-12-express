'use strict';

import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: () => Date(),
  },
});

export default mongoose.model('place', placeSchema);
