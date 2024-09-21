import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(req) {
  await connectDB();

  const { title, description, price, mediaUrl } = await req.json();

  if (!title || !description || !price || !mediaUrl) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      mediaUrl,
      createdAt: new Date(),
    });
    await product.save();

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();

  const { productId, title, description, price, mediaUrl } = await req.json();

  if (!productId || !title || !description || !price || !mediaUrl) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { title, description, price, mediaUrl },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Product updated successfully', product: updatedProduct }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
export async function GET(req) {
  await connectDB();

  try {
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();

  const { productId } = await req.json();

  if (!productId) {
    return new Response(JSON.stringify({ message: 'Product ID is required' }), { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Product deleted successfully', product: deletedProduct }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
