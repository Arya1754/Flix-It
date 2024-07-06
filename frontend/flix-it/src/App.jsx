import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import MovieList from './components/MovieList';
import Nav from './components/Nav';
import SearchBox from './components/SearchBox';
import AddFavourite from './components/AddFavourite';
import RemoveFavourites from './components/RemoveFavourites';
import CustomAlert from './components/CustomAlert';
import RecommendMovies from './components/RecommendMovies';
import { Route, Routes, useLocation } from 'react-router-dom'; 
import MovieListHeading from './components/MovieListHeading';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '', visible: false });
  const location = useLocation();

  useEffect(() => {
    const getMovieRequest = async (searchValue) => {
      const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();

        if (responseJson.Search) {
          setMovies(responseJson.Search);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(localStorage.getItem('react-movie-app-favourites'));

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const isMovieInFavourites = favourites.find((fav) => fav.imdbID === movie.imdbID);

    if (isMovieInFavourites) {
      setAlert({ message: 'This movie is already in your Watchlist!', type: 'warning', visible: true });
      return;
    }

    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => favourite.imdbID !== movie.imdbID);

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const closeAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  return (
    <div className="container-fluid movie-app">
      {alert.visible && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
      <Nav />
      {location.pathname === '/' && (
        <div className="row d-flex align-items-center mt-4 mb-4">
          <MovieListHeading heading="Discover Movies" />
          <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
      )}
      {
        location.pathname === '/watchlist' && (
          <div className="row d-flex align-items-center mt-4 mb-4">
          <MovieListHeading heading="Your WatchList" />
        </div>
        )
      }
      <Routes>
        <Route 
          path="/" 
          element={
            <MovieList 
              movies={movies} 
              handleFavouritesClick={addFavouriteMovie} 
              favouriteComponent={AddFavourite} 
            />
          } 
        />
        <Route 
          path="/watchlist" 
          element={
            <MovieList 
              movies={favourites} 
              handleFavouritesClick={removeFavouriteMovie} 
              favouriteComponent={RemoveFavourites} 
            />
          } 
        />
        <Route path="/recommendations" element={<RecommendMovies />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  );
};

export default App;
