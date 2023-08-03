import React from "react"
import {
    AiOutlineGithub,
    AiOutlineLinkedin,
  } from "react-icons/ai"

  const Footer = () => {
    return (
      <footer className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl">
        <hr className="w-full h-0.5 mx-auto mt-8 bg-neutral-200 border-0" />
        <div className="mx-auto p-4 flex flex-col items-center text-center text-neutral-900 md:flex-row md:justify-center md:items-center">
          <div className="flex flex-row items-center justify-center space-x-1 text-neutral-500 dark:text-neutral-100 mb-2 md:mb-0">
            © 2023 Made with <img className="w-6 h-6 mx-1" src="/images/heart.png" alt="Heart" /> by Brice Juhel
            <a href="/" className="hover:underline"></a>
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="https://www.linkedin.com/in/brice-juhel" rel="noreferrer" target="_blank">
              <AiOutlineLinkedin
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
                size={50}
              />
            </a>
            <a href="https://github.com/BriceJuhel" rel="noreferrer" target="_blank">
              <AiOutlineGithub
                className="hover:-translate-y-1 transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
                size={50}
              />
            </a>
          </div>
        </div>
      </footer>
    );
  };

export default Footer