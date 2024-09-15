import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { SOURCE_CODE_URL } from '@parsers-jamboree/common';
import { ABOUT_ROUTE, TEST_CASE_ROUTE } from './constants';

export const Navigation = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link to="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link to={`/${TEST_CASE_ROUTE}`} className="hover:text-gray-300 transition-colors">
            Test Case
          </Link>
        </li>
        <li>
          <Link to={`/${ABOUT_ROUTE}`} className="hover:text-gray-300 transition-colors">
            About
          </Link>
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
