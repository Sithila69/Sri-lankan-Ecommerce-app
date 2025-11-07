const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-light mb-6">Kadey.lk</h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Sri Lanka&apos;s premier marketplace connecting you with authentic
              local businesses and quality products.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Food & Beverages
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Clothing & Fashion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Home & Garden
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Handicrafts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6">Support</h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Seller Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Kadey.lk. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
