import React from 'react';

const MovieList = (props) => {
  const filteredMovies = props.movies.filter(movie => movie.Type === 'movie');
  const FavouriteComponent = props.favouriteComponent;

  return (
    <div className='movie-app d-flex'>
      {filteredMovies.map((movie, index) => (
        <div key={movie.imdbID} className='image-container'>
          <img src={movie.Poster} alt='movie' className='poster' />
          <div onClick={() => props.handleFavouritesClick(movie)}
          className='overlay d-flex align-items-center justify-content-center'>
            <FavouriteComponent />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
