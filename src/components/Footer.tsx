import React from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white py-6">
      <div className="container mx-auto px-4 text-center">
        {/* Контактная информация */}
        <p className="mb-4">Свяжитесь с нами: <a href="mailto:example@email.com" className="text-blue-400 hover:underline">example@email.com</a></p>

        {/* Социальные сети */}
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaGithub size={24} />
          </a>
          <a href="https://twitter.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
