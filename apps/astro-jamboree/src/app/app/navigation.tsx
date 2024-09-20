import React from 'react';
import { Github } from 'lucide-react';
import { SOURCE_CODE_URL } from '@parsers-jamboree/common';
import { ABOUT_ROUTE, TEST_CASE_ROUTE } from './constants';

export const Navigation = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <ul className="flex justify-center space-x-6">
        <li>
          <a href="/" className="hover:text-gray-300 transition-colors">
            Home
          </a>
        </li>
        <li>
          <a href={`/${TEST_CASE_ROUTE}`} className="hover:text-gray-300 transition-colors">
            Test Case
          </a>
        </li>
        <li>
          <a href={`/${ABOUT_ROUTE}`} className="hover:text-gray-300 transition-colors">
            About
          </a>
        </li>
        <li>
          <a
            href={SOURCE_CODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            <Github className="inline-block mr-1" size={18}/>
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
};
