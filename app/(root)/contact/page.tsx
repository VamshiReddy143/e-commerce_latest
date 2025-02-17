"use client";

import { MapPin, Clock, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import customer from "@/public/customer.jpg"
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Home() {

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    subject:"",
    message:""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const message = (e: React.FormEvent)=>{
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setFormData({
      name:"",
      email:"",
      subject:"",
      message:""
    })
    toast.success("message sent successfully")
  }
  return (
    <main className="min-h-screen dark:bg-black dark:text-white text-black bg-white">
      {/* Contact Section */}
      <section className=" mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4"><strong className="border-b-4 border-red-500">Connect</strong> with Our Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin felis luctus malesuada mattis, purus leo dolu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-100  dark:bg-gray-800 p-8 rounded-[30px]">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch with Us</h2>
            <form className="space-y-4 ">
              <div className="grid grid-cols-2  gap-4">
                <Input name="name" value={formData.name} onChange={handleChange} className="bg-white dark:bg-gray-800  dark:border-gray-500 p-5 rounded-xl" placeholder="Input your name" />
                <Input name="email" value={formData.email}  onChange={handleChange} className="bg-white  dark:bg-gray-800  dark:border-gray-500 p-5 rounded-xl"  placeholder="Input your email" />
              </div>
              <Input name="subject" value={formData.subject} onChange={handleChange} className="bg-white  dark:bg-gray-800  dark:border-gray-500 p-5 rounded-xl"  placeholder="Subject" />
              <Textarea name="message"  value={formData.message} onChange={handleChange}
                placeholder="Submit your message request"
                className="h-32 bg-white  dark:bg-gray-800  dark:border-gray-500 p-5 rounded-xl"
              />
              <Button onClick={message} className="bg-black text-white dark:bg-gray-500 rounded-xl p-5 dark:text-white">
                Send message
              </Button>
            </form>
          </div>

          {/* Contact Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consecteur turis ole adip iscing vipu deit elit taras felius neal saret tame tal mericoper dei materio denta low luce.
            </p>

            <div className="space-y-6 grid sm:grid-cols-2 grid-cols-1">
              <div className="flex items-center gap-4">
                <div className="bg-black p-2 rounded-lg">
                  <MapPin className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">Jl. Raya Kuta No. 121</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-black p-2 rounded-lg">
                  <Clock className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-gray-600">Daily 09 am - 05 pm</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-black p-2 rounded-lg">
                  <Phone className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Mobile</p>
                  <p className="text-gray-600">(+62)1 789 345</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-black p-2 rounded-lg">
                  <Mail className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">admin@support.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10 justify-between flex">
              <p className="font-medium mb-4">Social Media:</p>
              <div className="flex gap-4">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-black cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-600 hover:text-black cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-600 hover:text-black cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-600 hover:text-black cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" mx-auto dark:bg-black px-4 py-16 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Common Queries Answered with Additional FAQs</h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipis cingit lan vipurel elit. Ut elit taras felius luctu neal em corper mat tra pulvinar.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg">
                <AccordionTrigger className="px-4">How can I benefit from your startup?</AccordionTrigger>
                <AccordionContent className="px-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg">
                <AccordionTrigger className="px-4">How can I get in touch with customer support?</AccordionTrigger>
                <AccordionContent className="px-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sipit singin commodis ligula eget delosurul artido ensean massa cum late secis natioque senellus et magnis dis parturient montes taria.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg">
                <AccordionTrigger className="px-4">How do you ensure data security and privacy?</AccordionTrigger>
                <AccordionContent className="px-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg">
                <AccordionTrigger className="px-4">How do I get started with your offerings?</AccordionTrigger>
                <AccordionContent className="px-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Image 
              src={customer}
              alt="Customer Support"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <p className="text-gray-400 mb-4">Jl. Raya Kuta No. 121, Badung - Bali, Indonesia</p>
              <p className="text-gray-400 mb-4">(+62)-822-4545-2882</p>
              <div className="flex gap-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Team</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">UI/UX Design</a></li>
                <li><a href="#" className="hover:text-white">Mobile App Dev</a></li>
                <li><a href="#" className="hover:text-white">Web Dev</a></li>
                <li><a href="#" className="hover:text-white">Cloud Services</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Get Latest Update</h3>
              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet elit tel. Iuslral luctus nec ullamcorper mattis pulvin tel.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter Your Email" 
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Toaster/>
    </main>
  );
}