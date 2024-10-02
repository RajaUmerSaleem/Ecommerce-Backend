import connectDB from '@/lib/mongoose';
import Category from '@/models/Category';


export async function POST(req) {
  await connectDB();

  try {
    const { name, parent, properties, brand, color } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ message: 'Name is required' }), { status: 400 });
    }

    const newCategory = new Category({ name, parent, properties, brand, color });
    await newCategory.save();
    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();

  try {
    const { categoryId, name, parent, properties, brand, color } = await req.json();

    if (!categoryId || !name) {
      return new Response(JSON.stringify({ message: 'Category ID and name are required' }), { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, parent: parent || null, properties, brand, color },
      { new: true }
    );

    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedCategory), { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    const { categoryId } = await req.json();

    if (!categoryId) {
      return new Response(JSON.stringify({ message: 'Category ID is required' }), { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
export async function GET(req) {
  await connectDB();

  try {
    const categories = await Category.find().populate('parent');
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
