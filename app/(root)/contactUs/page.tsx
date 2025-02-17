"use client";

import { ShoppingBag,Facebook, Twitter} from "lucide-react";
import Image from "next/image";
import shop2 from "@/public/shop2.jpg"
import shop3 from "@/public/shop3.jpg"
import shop4 from "@/public/shop4.jpg"
import shop5 from "@/public/shop5.jpg"
import sale from "@/public/sale.jpg"

export default function Home() {
  return (
    <main className="min-h-screen dark:bg-black bg-white">
      {/* Hero Section */}
      <section className=" mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">About Us</h1>
            <p className="text-gray-600 text-lg">
              Discover a world of endless shopping possibilities with curated collections and exclusive deals.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, blanditiis eaque! Saepe inventore, nihil distinctio tempore ullam, obcaecati officia dolores, laudantium harum provident repudiandae quidem asperiores quibusdam error! Earum corrupti veritatis rem impedit porro nisi nam quaerat voluptas at ipsum. Incidunt repudiandae aperiam doloribus in reprehenderit accusantium! Id quisquam aut cum suscipit fugit? Officiis minus aperiam porro, molestiae maxime accusantium, neque quisquam maiores fugit eveniet sequi reiciendis beatae, unde sapiente placeat itaque nostrum explicabo nisi aliquam nemo quas molestias quis. Reprehenderit, numquam? Ad quos, iure maxime, perferendis totam quo mollitia quas dolore et ab aliquam dolorum esse beatae, nobis ducimus.
            </p>
          </div>
          <div>
           <Image
           src={shop2}
           alt="shop_2"
           width={700}
           height={600}
           />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
          <Image
           src={shop3}
           alt="shop_3"
           width={700}
           height={600}
           />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Discover a World of Shopping Excellence</h2>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="grid grid-cols-2 gap-4">
            <Image
           src={sale}
           alt="sale"
           width={700}
           height={600}
           />
               <Image
           src={shop4}
           alt="shop_4"
           width={700}
           height={600}
           />
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-16 grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">ACHIEVEMENTS</p>
            <h2 className="text-3xl font-bold mb-4">Smart Shopping Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
          </div>

          <div className="relative">
          <Image
           src={shop5}
           alt="shop_5"
           width={700}
           height={400}
           className="h-[400px] w-full object-cover mb-4"
           />
            
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">35k+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">625+</p>
                <p className="text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">5,678</p>
                <p className="text-gray-600">Orders Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className=" mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <ShoppingBag className="h-8 w-8 mb-4" />
              <div className="flex gap-4 mt-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">OFFICE</h3>
              <p className="text-gray-400">Shopping Plaza, Central Avenue</p>
              <p className="text-gray-400">New York, 10001</p>
              <p className="text-gray-400">California, 94043</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">MENU</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Partners</a></li>
                <li><a href="#" className="hover:text-white">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">LINKS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Powered by ShopHub</p>
              <p className="text-gray-400">www.shophub.com</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}