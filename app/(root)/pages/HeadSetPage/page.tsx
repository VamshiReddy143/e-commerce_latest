import Image from 'next/image'
import React from 'react'
import headset from "@/public/headset.png"

const page = () => {
    return (
        <div className='mt-[7em]'>
            <div className='bg-red-500 flex justify-between rounded-[30px] p-[2em] pl-[5em] pr-[5em]'>
                <div>
                    <p className='text-xl font-bold'>20% off</p>
                    <h1 className='text-8xl font-extrabold'>FINF</h1>
                    <h1  className='text-8xl font-extrabold'>SMIL</h1>
                    <p className='mt-3'>Limited time offer</p>
                </div>
             

                <div className='mr-10 w-[20%] flex flex-col items-start justify-center'>
                    <p className='text-xl font-bold'>Beats Solo Air</p>
                    <h1 className='text-4xl font-extrabold mt-2 mb-2'>Summer Sale</h1>
                    <p>Company that grown from a small startup to one of the world&apos;s leading tech companies</p>
                </div>
            </div>
            <div className='absolute top-10 right-[50%]'>
                    <Image
                    src={headset}
                    alt='headset'
                    width={900}
                    height={900}
                    className='h-[300px] w-[200px] sm:h-[500px] sm:w-[400px] p-6 sm:p-9 rounded-[30px] cursor-pointer'
                    
                    />
                </div>
        </div>
    )
}

export default page