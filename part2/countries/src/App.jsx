import { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCountry, setShowCountry] = useState({});

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  // do not render anything until countries data is fetched
  if (countries.length === 0) {
    return <p>Loading countries...</p>;
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleShowCountry = () => {
    if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />;
    } else if (filteredCountries.length <= 10) {
      return filteredCountries.map((country) => {
        return (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button
              onClick={() =>
                setShowCountry({
                  ...showCountry,
                  [country.name.common]: !showCountry[country.name.common],
                })
              }
            >
              {showCountry[country.name.common] ? "hide" : "show"}
            </button>
            {showCountry[country.name.common] && <Country country={country} />}
          </div>
        );
      });
    } else {
      return <p>Too many matches, specify another filter</p>;
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div>
        <p>
          find countries{" "}
          <input value={searchQuery} onChange={handleSearchChange} />
        </p>
        <div>{handleShowCountry()}</div>
      </div>
    </>
  );
}

export default App;
