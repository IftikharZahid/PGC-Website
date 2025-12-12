import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

const LibraryCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Science & Technology', 'Literature & Languages', 'Social Sciences', 'Business & Commerce', 'Reference'];

  const books = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      author: "Michael T. Goodrich",
      category: "Science & Technology",
      isbn: "978-1118771334",
      available: true,
      copies: 3,
      year: 2018
    },
    {
      id: 2,
      title: "Physics: Principles with Applications",
      author: "Douglas C. Giancoli",
      category: "Science & Technology",
      isbn: "978-0321625922",
      available: true,
      copies: 5,
      year: 2020
    },
    {
      id: 3,
      title: "Organic Chemistry",
      author: "Paula Yurkanis Bruice",
      category: "Science & Technology",
      isbn: "978-0134042282",
      available: false,
      copies: 0,
      year: 2019
    },
    {
      id: 4,
      title: "English Literature: A Very Short Introduction",
      author: "Jonathan Bate",
      category: "Literature & Languages",
      isbn: "978-0199228720",
      available: true,
      copies: 4,
      year: 2017
    },
    {
      id: 5,
      title: "The Norton Anthology of English Literature",
      author: "Stephen Greenblatt",
      category: "Literature & Languages",
      isbn: "978-0393603132",
      available: true,
      copies: 6,
      year: 2021
    },
    {
      id: 6,
      title: "Classical Urdu Poetry",
      author: "Mir Taqi Mir",
      category: "Literature & Languages",
      isbn: "978-0195779943",
      available: true,
      copies: 2,
      year: 2016
    },
    {
      id: 7,
      title: "World History: Patterns of Interaction",
      author: "Roger B. Beck",
      category: "Social Sciences",
      isbn: "978-0547491127",
      available: true,
      copies: 5,
      year: 2019
    },
    {
      id: 8,
      title: "Introduction to Psychology",
      author: "James W. Kalat",
      category: "Social Sciences",
      isbn: "978-1337098175",
      available: true,
      copies: 4,
      year: 2020
    },
    {
      id: 9,
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
      category: "Social Sciences",
      isbn: "978-1305585126",
      available: false,
      copies: 0,
      year: 2018
    },
    {
      id: 10,
      title: "Financial Accounting",
      author: "Jerry J. Weygandt",
      category: "Business & Commerce",
      isbn: "978-1119491637",
      available: true,
      copies: 7,
      year: 2021
    },
    {
      id: 11,
      title: "Marketing Management",
      author: "Philip Kotler",
      category: "Business & Commerce",
      isbn: "978-0133856460",
      available: true,
      copies: 3,
      year: 2019
    },
    {
      id: 12,
      title: "Business Communication Today",
      author: "Courtland L. Bovée",
      category: "Business & Commerce",
      isbn: "978-0134742267",
      available: true,
      copies: 5,
      year: 2020
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/library" className="text-white/80 hover:text-white transition-colors flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Library
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Library Catalog</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Browse our collection of books and resources
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none text-lg"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'book' : 'books'}
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <RevealOnScroll key={book.id} animation="animate-fade-up" delay={`${index * 0.05}s`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  {/* Book Header */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full">
                        {book.category}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        book.available 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {book.available ? 'Available' : 'Borrowed'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      by {book.author}
                    </p>

                    {/* Book Details */}
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>ISBN: {book.isbn}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Published: {book.year}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Copies: {book.copies}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <button 
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        book.available
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!book.available}
                    >
                      {book.available ? 'Request Book' : 'Currently Unavailable'}
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-xl text-gray-600 dark:text-gray-400">No books found matching your search</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LibraryCatalog;
