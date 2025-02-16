import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import { ProductModel } from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findById(session.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    

  
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
 

    const totalOrders = await Order.countDocuments();
 

    
    const totalProducts = await ProductModel.countDocuments();


    const totalUsers = await User.countDocuments();
   

   
    const monthlySales = await Order.aggregate([
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } },
    ]);
    console.log("📈 Monthly Sales:", monthlySales);

    
    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    

    return NextResponse.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      monthlySales,
      bestSellers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
