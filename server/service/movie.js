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


export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})

  return movie
}

export const getMovieDetailByDoubanId = async (doubanId) => {
  const movie = await Movie.findOne({doubanId})

  return movie
}

export const getRelativeMovies = async (movie) => {
  const relativeMovies = await Movie.find({
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

export const findOneAndRemoveMovie = async (id) => {
  const movie = await Movie.findOne({_id: id})

  if (!movie) return

  const categories = movie.category

  for (let i = 0; i < categories.length; i++) {
    const categoryId = categories[i]
    const category = await Category.findOne({_id: categoryId})

    category.movies.splice(category.movies.indexOf(movie._id), 1)

    await category.save()
  }

  const result = await movie.remove()

  return true
}
