import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

function Search({ children, onSearch }) {
  const [query, setQuery] = useState("");

  const value = {
    query,
    setQuery,
    onSearch
  };

  return (
    <SearchContext.Provider value={value}>
      <div className="search-container">{children}</div>
    </SearchContext.Provider>
  );
}

// Input
Search.Input = function SearchInput(props) {
  const { query, setQuery } = useContext(SearchContext);

  return (
    <input
      type="text"
      
      value={query}
      placeholder="Search..."
      onChange={(e) => setQuery(e.target.value)}
      {...props}
    />
  );
};

// Button
Search.Button = function SearchButton({ children }) {
  const { query, onSearch } = useContext(SearchContext);

  return (
    <button onClick={() => onSearch(query)}>
      {children}
    </button>
  );
};

// Results
Search.Results = function SearchResults({ items }) {
  const { query } = useContext(SearchContext);

  const filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {filtered.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};

export default Search;
