import Image from 'next/image';
import React from 'react';
import headset from "@/public/headset.png";

const Headsetpage = () => {
    return (
        <div className='mt-[10em] hidden sm:block relative'>
            {/* Container */}
            <div className='bg-red-500 flex justify-between items-center rounded-[30px] p-[2em] pl-[5em] pr-[5em] relative'>
                
                {/* Left Content */}
                <div>
                    <p className='text-xl font-bold'>20% off</p>
                    <h1 className='text-8xl font-extrabold'>FINF</h1>
                    <h1 className='text-8xl font-extrabold'>SMIL</h1>
                    <p className='mt-3'>Limited time offer</p>
                </div>
             
                {/* Right Content (Text) */}
                <div className='w-[20%] flex flex-col items-start justify-center'>
                    <p className='text-xl font-bold'>Beats Solo Air</p>
                    <h1 className='text-4xl font-extrabold mt-2 mb-2'>Summer Sale</h1>
                    <p>Company that has grown from a small startup to one of the world&apos;s leading tech companies</p>
                </div>

                {/* Image (Now Inside the Flex Container) */}
                <div className='absolute right-[45%] bottom-[-5%] w-[400px]'>
                    <Image
                        src={headset}
                        alt='headset'
                        width={900}
                        height={900}
                        className='h-[300px] w-[200px] sm:h-[500px] sm:w-[400px] p-6 sm:p-9 rounded-[30px]'
                    />
                </div>
            </div>
        </div>
    );
}

export default Headsetpage;
