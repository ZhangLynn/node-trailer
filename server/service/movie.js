const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

export const getAllMovies = async (type, year) => {
  // mongoDB默认空对象查询所有
  const query = {}

  if (type) {
    query.type = type
  }

  if (year) {
    query.year = year
  }

  return Movie.find(query)

}

// export const getAllMovies = async (query, page, size) => {
//   const movies = await Movie.find(query,'doubanId directors rate title summary poster movieTypes casts').skip((page - 1) * size).limit(size)
//
//   return movies
// }

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})

  return movie
}

export const getMovieDetailByDoubanId = async (doubanId) => {
  const movie = await Movie.findOne({doubanId})

  return movie
}

export const getRelativeMovies = async (movie) => {
  const reconstiveMovies = await Movie.find({
    // todo 以数组形式查看
    movieTypes: {
      $in: movie.movieTypes
    }
  }, 'doubanId directors rate title summary poster movieTypes casts').sort({'rate.rate': -1}).limit(5)

  return reconstiveMovies
}

export const getMovieCounts = async (query) => {
  const count = await Movie.count(query)

  return count
}

export const delMovie = async (movie) => {
  const categories = movie.category
  for (const categoryId in categories) {
    const category = await Category.findOne({_id: categoryId})
    category.movies.splice(category.movies.indexOf(movie._id), 1)
    await category.save()
  }
  await movie.remove()
}
