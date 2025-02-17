import React from 'react'
import Hero from './Hero'
import Category from './Category'
import BestSeller from './BestSeller'
import FooterSection from './FooterSection'
import Headsetpage from '@/app/(root)/pages/HeadSetPage/page'



const Home = () => {
  return (
    <div>
        <Hero/>
        <Category/>
        <BestSeller/>
        <Headsetpage/>
        <FooterSection/>
       
        </div>
  )
}

export default Home