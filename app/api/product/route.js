import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';

export async function POST(req) {
  await connectDB();

  const { title, description, price } = await req.json();

  if (!title || !description || !price) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      createdAt: new Date(),
    });
    await product.save();

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}