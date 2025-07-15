import React from 'react';
import { FaLinkedin, FaGithub, FaHeart, FaCode } from 'react-icons/fa';

const Connect = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="text-2xl" />,
      url: 'https://linkedin.com/in/manannarwal', // Replace with your LinkedIn
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-500 hover:to-blue-600'
    },
    {
      name: 'GitHub',
      icon: <FaGithub className="text-2xl" />,
      url: 'https://github.com/manannarwal', // Replace with your GitHub
      color: 'from-gray-700 to-gray-800',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700'
    }
  ];

  return (
    <div className="ml-5 mr-3 pb-3 bg-[#121212] rounded-2xl mb-3 max-md:-ml-10 min-h-screen">
      <div className="p-8 max-md:p-4">
        {/* Header Section */}
        <div className="text-center mb-12 max-md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white max-md:text-3xl">
              Let's Connect
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-md:text-base leading-relaxed max-w-2xl mx-auto">
            Thanks for using MovFlix! I'd love to connect with you and hear your feedback. 
            Feel free to reach out through any of these platforms.
          </p>
        </div>


        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-md:gap-4 max-md:mb-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-gradient-to-r ${link.color} ${link.hoverColor} p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-white/20 max-md:p-4`}
            >
              <div className="flex items-center gap-4 max-md:gap-3">
                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 max-md:text-lg">{link.name}</h3>
                </div>
                <div className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  →
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Project Info Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-10 max-md:p-6 max-md:mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaHeart className="text-red-400 text-xl max-md:text-lg" />
              <h3 className="text-2xl font-bold text-white max-md:text-xl">About MovFlix</h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-md:text-sm">
              MovFlix is a passion project built to provide a seamless entertainment experience. 
              The platform aggregates content from various sources to help you discover and enjoy 
              your favorite movies and TV shows in one place.
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 text-center max-md:p-6">
          <h3 className="text-2xl font-bold text-white mb-4 max-md:text-xl">Your Feedback Matters</h3>
          <p className="text-gray-300 mb-2 leading-relaxed max-md:text-sm max-md:mb-4">
            Found a bug? Have a feature request? Or just want to say hi? 
            I'd love to hear from you! Your input helps make MovFlix better for everyone.
            Feel free to drop me a mail at <a href="mailto:manan.iitm@gmail.com" className="text-blue-400 hover:text-blue-300 underline">narwalmanan10@gmail.com</a>.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-6 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connect;
