"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
}

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);

    const selectedProducts = products.filter(({ title }) =>
      title.toLowerCase().includes(value.toLowerCase())
    );

    setShowResults(true);
    setMatchedProducts(selectedProducts);
  };

  const selectProduct = (product: Product) => {
    setInputValue(product.title);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          placeholder="Search for products..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
        />
        {showResults && inputValue && (
          <div className="absolute z-10 mt-2 py-2 w-full max-h-64 bg-white overflow-y-scroll border border-gray-300 rounded-md shadow-lg">
            {matchedProducts.length === 0 ? (
              <p className="px-4 py-2 text-gray-500">No products found.</p>
            ) : (
              <ul>
                {matchedProducts.map((product) => (
                  <li
                    key={product.id}
                    className="cursor-pointer hover:bg-blue-100 px-4 py-2 flex items-center"
                    onClick={() => selectProduct(product)}
                  >
                    <Image
                      src={product.image}
                      width={50}
                      height={50}
                      alt={product.title}
                      className="w-8 h-8 mr-2"
                    />
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
