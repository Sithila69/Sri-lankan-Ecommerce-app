const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              LankaMarket
            </h3>
            <p className="text-gray-600 text-sm">
              Supporting Sri Lankan small businesses by connecting them with
              customers across the island.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Food & Beverages
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Clothing & Textiles
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Handicrafts
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Seller Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Connect
            </h4>
            <p className="text-sm text-gray-600">
              <a
                href="mailto:support@lankamarket.lk"
                className="hover:text-blue-600"
              >
                support@lankamarket.lk
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2025 LankaMarket. Supporting Sri Lankan small businesses.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
