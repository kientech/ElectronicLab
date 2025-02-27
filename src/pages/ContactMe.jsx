import React from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";

function ContactMe() {
  return (
    <div className="p-4 rounded-lg bg-white min-h-screen">
      <div className=" rounded-lg ">
        <div className="w-full mb-4">
          <h1 className="font-bold text-3xl text-gray-700 mb-4">
            Contact With Me
          </h1>
          <p className="text-sm text-gray-600 w-[500px] leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
            reiciendis quibusdam rerum recusandae doloribus a facilis ea,...
          </p>
        </div>

        <div className="flex mt-16 gap-20">
          <form className="w-2/4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="category" className="block text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                  placeholder="Category"
                />
              </div>
              <div>
                <label htmlFor="technology" className="block text-gray-700">
                  Technology
                </label>
                <input
                  type="text"
                  id="technology"
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                  placeholder="Technology"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="block text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-indigo-500"
                placeholder="Write your message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
            >
              Send Message
            </button>
          </form>
          <div className="w-2/4 -mt-4">
            <div>
              <div>
                <h1 className="font-semibold text-xl my-2">Chat With Me</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit....
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-x-2 mb-4">
                  <IoChatbubblesOutline size={30} />
                  <span className="font-base text-md">Start a live chat</span>
                </div>
                <div className="flex items-center gap-x-2 mb-4">
                  <MdOutlineAlternateEmail size={30} />
                  <span className="font-base text-md">Short me an email</span>
                </div>
                <div className="flex items-center gap-x-2 mb-4">
                  <FaInstagram size={30} />
                  <span className="font-base text-md">
                    Message me on Instagram
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div>
                <h1 className="font-semibold text-xl my-2">Call me</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit....
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-x-2 mb-4">
                  <IoCallOutline size={30} />
                  <span className="font-base text-md">0968 384 643</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div>
                <h1 className="font-semibold text-xl my-2">Visit me</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit....
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-x-2 mb-4">
                  <CiLocationOn size={30} />
                  <span className="font-base text-md">
                    Ho Chi Minh City, Vietnam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-10 justify-center mt-8">
          {[1, 2, 3, 4].map((item) => (
            <Link to={"/"} className="p-4 bg-blue-100 inline-block rounded-xl">
              <FaFacebookF />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactMe;
