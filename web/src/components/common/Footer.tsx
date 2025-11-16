import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

export default function Footer() {
  const { currentUser } = useContext(AuthContext);
  
  // Determine if user is internal staff
  const isInternalStaff = currentUser?.role.includes('Admin') || 
                          currentUser?.role.includes('Foster') || 
                          currentUser?.role.includes('Super Foster') || 
                          currentUser?.role.includes('Interviewer');

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-10 mt-16">
      <div className="container mx-auto px-4">
        {!isInternalStaff ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Organization Info */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <img 
                  src="https://lf-code-agent.coze.cn/obj/x-ai-cn/298572746754/attachment/logo_20251115040913.png" 
                  alt="Save Fur Pets" 
                  className="h-10 w-auto mr-3"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A volunteer-run animal rescue organization dedicated to finding loving homes for abandoned and stray animals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <i className="fa-brands fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <i className="fa-brands fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <i className="fa-brands fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <i className="fa-brands fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/adoptables" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Adoptables
                  </Link>
                </li>
                <li>
                  <Link to="/adopted" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ways to Help */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ways to Help</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Donate
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Become a Foster
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Volunteer
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                    Become an Interviewer
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fa-solid fa-envelope text-primary mt-1 mr-3"></i>
                  <span className="text-gray-600 dark:text-gray-300">info@savefurpets.org</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-phone text-primary mt-1 mr-3"></i>
                  <span className="text-gray-600 dark:text-gray-300">(123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-location-dot text-primary mt-1 mr-3"></i>
                  <span className="text-gray-600 dark:text-gray-300">123 Rescue Lane, Pet City, PC 12345</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4">
              <img 
                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/298572746754/attachment/logo_20251115040913.png" 
                alt="Save Fur Pets" 
                className="h-10 w-auto mr-3"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Thank you for your dedicated service to saving animals in need. Your contribution makes a real difference in their lives.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                <i className="fa-solid fa-file-lines text-xl"></i> Volunteer Manual
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                <i className="fa-solid fa-calendar-check text-xl"></i> Schedule
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                <i className="fa-solid fa-comments text-xl"></i> Team Chat
              </a>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Save Fur Pets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}