"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-6 px-4">
        {/* Services Section */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Services</h3>
          <ul className="text-gray-200 text-sm space-y-1">
            <li><a href="/services/school-delivery" className="hover:underline">School Delivery</a></li>
            <li><a href="/services/doorstep-delivery" className="hover:underline">Doorstep Delivery</a></li>
            <li><a href="/services/book-sourcing" className="hover:underline">Book Sourcing</a></li>
            <li>
              <Link href="/support" className="hover:underline">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-200 text-sm text-center md:text-left">
            Email:<a href="mailto:info@harmosoftbookstore.co.ke">info@harmosoftbookstore.co.ke</a><br />
            Phone:<a href="tel:+254722825304"> +254 722825304</a><br />
            Phone:<a href="tel:+254722825332"> +254 722825332</a><br />            
            Web:<a href="https://harmosoftbookstore.co.ke">  https:/harmosoftbookstore.co.ke/</a> <br />
            Watermark Business Park, Karen, Nairobi, Kenya
          </p>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-200 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.8 20h-2.99v-10h2.99v10zm-1.5-11.43c-.95 0-1.72-.78-1.72-1.74s.77-1.74 1.72-1.74 1.72.78 1.72 1.74-.77 1.74-1.72 1.74zm13.8 11.43h-2.99v-5.52c0-1.32-.03-3.01-1.83-3.01s-2.1 1.43-2.1 2.91v5.62h-2.99v-10h2.87v1.36h.04c.4-.76 1.38-1.56 2.85-1.56 3.04 0 3.6 2 3.6 4.65v5.55z"/>
              </svg>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-gray-200 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.92 10.92 0 01-3.14 1.54 4.48 4.48 0 00-7.86 3.1v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c13 8 27 0 27-16 0-.25-.01-.5-.02-.75A9.93 9.93 0 0023 3z" />
              </svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-gray-200 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.16c3.19 0 3.584.012 4.85.07 1.17.054 1.973.24 2.43.402a4.915 4.915 0 011.69 1.09c.468.468.843 1.066 1.09 1.69.162.457.348 1.26.402 2.43.058 1.266.07 1.66.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.973-.402 2.43a4.915 4.915 0 01-1.09 1.69c-.468.468-1.066.843-1.69 1.09-.457.162-1.26.348-2.43.402-1.266.058-1.66.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.973-.24-2.43-.402a4.915 4.915 0 01-1.69-1.09c-.468-.468-.843-1.066-1.09-1.69-.162-.457-.348-1.26-.402-2.43-.058-1.266-.07-1.66-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.973.402-2.43a4.915 4.915 0 011.09-1.69c.468-.468 1.066-.843 1.69-1.09.457-.162 1.26-.348 2.43-.402 1.266-.058 1.66-.07 4.85-.07zm0-2.16C8.73 0 8.332.014 7.052.072 5.773.13 4.798.314 4.023.637a6.916 6.916 0 00-2.512 1.67A6.916 6.916 0 00.64 4.82C.317 5.595.133 6.57.075 7.849.017 9.128.003 9.527.003 12c0 2.472.014 2.872.072 4.152.058 1.279.242 2.254.565 3.03a6.916 6.916 0 001.67 2.512 6.916 6.916 0 002.512 1.67c.775.323 1.75.507 3.03.565C8.332 23.986 8.73 24 12 24s3.668-.014 4.948-.072c1.279-.058 2.254-.242 3.03-.565a6.916 6.916 0 002.512-1.67 6.916 6.916 0 001.67-2.512c.323-.775.507-1.75.565-3.03.058-1.279.072-1.677.072-4.152 0-2.473-.014-2.872-.072-4.152-.058-1.279-.242-2.254-.565-3.03a6.916 6.916 0 00-1.67-2.512 6.916 6.916 0 00-2.512-1.67c-.775-.323-1.75-.507-3.03-.565C15.668.014 15.27 0 12 0zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-10.845a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <p className="text-center text-gray-200 text-sm">
          &copy; {new Date().getFullYear()} Harmosoft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
