"use client";
import Link from 'next/link';
import Image from "next/image";
import Card from './ui/card';
import { useRouter } from 'next/navigation';
import SearchBar from './ui/searchbar';  // Import the SearchBar component
import ConfidenceCard from './ui/ConfidenceCard';


export default function Home() {

  return (
    <main className="flex flex-col min-h-screen  w-full p-4 ">
      <div className="contain relative flex flex-col  items-center mx-auto ">
        <p className="text-xl font-bold text-center mx-auto m-2">
        Get kids&apos; books online, delivered to your doorstep or your kids&apos; schools.
        </p>
        <p className="text-red-700 font-bold text-center mx-auto m-2">
          Order before 20th December and get up to 10% off
        </p>

        {/* Replace existing search bar with SearchBar component */}
        <SearchBar/>
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 lg:gap-6 xl:gap-8 my-3 mx-auto">
          <Card
            image="/assets/c2b1a4a7995e8cf1189e7d6fd7475315.png"
            title="Cut the line"
            description="Get all the books you need hassle-free."
          />
          <Card
            image="/assets/5595cab9936ccfe2f5eb252660d6c086.png"
            title="Cut the Luggage"
            description="Don't burden yourself with heavy books."
          />
          <Card
            image="/assets/04b598a1c4dc78fa1085bb3e68dbcdc4.png"
            title="Enjoy Convenience"
            description="Have books delivered right to your doorstep with ease."
          />
          <Card
            image="/assets/1e9a804ea2448dbdfaba2708548a4d3b.png"
            title="Enjoy Convenience"
            description="Have books delivered right to your School with ease."
          />
        </div>

        <ConfidenceCard/>

        <div className="w-full">
          <p className="text-xl font-bold text-left mx-auto m-4">
            Delivery Counties
          </p>
          <p className="text-black text-left mx-auto mb-4">
            These are the counties we deliver books to
          </p>
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 my-3 mx-auto">
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:bg-green-100 hover:shadow-lg duration-1000">
              <div className="relative w-full h-48">
                <Image
                  src="/assets/fd8bb8a51405a367eba7d78f88c25455.png"
                  alt="Nairobi and It's Environs"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-3">
                <h4 className="text-lg font-semibold mb-2">Nairobi</h4>
              </div>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:bg-green-100 hover:shadow-lg duration-1000">
              <div className="relative w-full h-48">
                <Image
                  src="/assets/eb97b969838bc3814b663e342ddd32f6.png"
                  alt="Mombasa"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold mb-2">Mombasa</h3>
              </div>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:bg-green-100 hover:shadow-lg duration-1000">
              <div className="relative w-full h-48">
                <Image
                  src="/assets/c2e0918833977d4b9e7fd356c89abe8a.png"
                  alt="Eldoret"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold mb-2">Nakuru</h3>
              </div>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:bg-green-100 hover:shadow-lg duration-1000">
              <div className="relative w-full h-48">
                <Image
                  src="/assets/f0147b4b7683342c04b80d78a25827a6.png"
                  alt="Kisumu"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold mb-2">Kisumu</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="text-xl font-bold text-left mx-auto m-4">Our Networks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 my-3 mx-auto">
          <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:bg-green-100 hover:shadow-lg text-center duration-1000 ">
          <p className="text-black font-bold p-2">Schools</p>
              <p className="font-bold text-6xl p-2">1k+</p>
              <p className="text-black p-2">Total partner Schools</p>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:bg-green-100 hover:shadow-lg text-center duration-1000 ">
            <p className="text-black font-bold p-2">Publishers</p>
              <p className="font-bold text-6xl p-2">80+</p>
              <p className="text-black p-2">Total partner Publishers</p>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:bg-green-100 hover:shadow-lg text-center duration-1000 ">
            <p className="text-black font-bold p-2">Customers</p>
              <p className="font-bold text-6xl p-2">7k+</p>
              <p className="text-black p-2">Total Customers</p>
            </div>
            <div className="max-w-smbg-white rounded-lg shadow-md overflow-hidden transition-all transform hover:scale-105 hover:bg-green-100 hover:shadow-lg text-center duration-1000 ">
            <p className="text-black font-bold p-2">BookShops</p>
              <p className="font-bold text-6xl p-2">500+</p>
              <p className="text-black p-2">Total partner bookshops</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
