import React from "react";
import { CiWallet } from "react-icons/ci";
import { MdOutlineHeadsetMic, MdOutlineVerified } from "react-icons/md";
import { PiTruckFill } from "react-icons/pi";

const FooterSection = () => {
  return (
    <div className="mt-[60px] mb-10 text-black">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Shipping */}
        <div className="flex bg-gray-100 p-4 rounded-[30px] gap-4 items-center">
          <div>
            <PiTruckFill size={40} color="red" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Free Shipping</h1>
            <p className="text-sm sm:text-base">Free Shipping On All Orders</p>
          </div>
        </div>

        {/* Money Guarantee */}
        <div className="flex bg-gray-100 p-4 rounded-[30px] gap-4 items-center">
          <div>
            <MdOutlineVerified size={40} color="red" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Money Guarantee</h1>
            <p className="text-sm sm:text-base">30 Days Money Back</p>
          </div>
        </div>

        {/* Online Support 24/7 */}
        <div className="flex bg-gray-100 p-4 rounded-[30px] gap-4 items-center">
          <div>
            <MdOutlineHeadsetMic size={40} color="red" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Online Support 24/7</h1>
            <p className="text-sm sm:text-base">Technical Support 24/7</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex bg-gray-100 p-4 rounded-[30px] gap-4 items-center">
          <div>
            <CiWallet size={40} color="red" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Secure Payment</h1>
            <p className="text-sm sm:text-base">All Cards Accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;