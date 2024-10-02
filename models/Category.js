import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  properties: {
    type: String,
    default: '',
  },
  brand: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;