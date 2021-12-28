import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom';

class BooksApp extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      books: [],
    };
  }

  shelves = [
    {title: 'Currently Reading', name: 'currentlyReading'}, 
    {title: 'Want To Read', name: 'wantToRead'}, 
    {title: "Read", name: 'read'}
  ]

  componentDidMount() {
    BooksAPI.getAll().then((booksObj) => this.setState({
      books: booksObj
    }));
  }

  render() {
    return (
      <div className="app">
        <Routes>
          <Route exact path='/' element={<Shelves books={this.state.books} shelves={this.shelves} />}
          />

          <Route path='/search' element={<SearchDisplay/>}
          />
        </Routes>
      </div>
    )
  }
}

class Shelves extends Component {

  sorter = (bookList, shelf) => {
    const list = bookList.filter(b => (
      b.shelf === shelf.name
  ))
    return list;
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            {this.props.shelves.map(shelf => 
              <Shelf key={shelf.name} books={this.sorter(this.props.books, shelf)} shelf={shelf} />
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

class Shelf extends Component {



  render() {

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelf.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map(b =>
              <li key={b.id}>
                <Book books={b}></Book>
              </li>)}
          </ol>
        </div>
      </div>
    )
  }
}

class BookGrid extends Component {
  render() {
    return (
      <ol className="books-grid">
        {this.props.books.map(b =>
          <li key={b.id}>
            <Book books={b}></Book>
          </li>
        )}
      </ol>
    )
  }
}

class Book extends Component {
  render() {
    const {books} = this.props

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${books.imageLinks.thumbnail})` }}></div>
          <Mover></Mover>
        </div>
        <div className="book-title">{books.title}</div>
        <div className="book-authors">{books.authors.toString()}</div>
      </div>
    )
  }
}

class Mover extends Component {
  render() {
    return (
      <div className="book-shelf-changer">
      <select>
        <option value="move" disabled>Move to...</option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    </div>
    )
  }
}

class SearchDisplay extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      search: [],
    };
  }

  onSearch = (event) => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    return (
      <div className="search-books">
        <SearchBar onSearch={this.onSearch} />
        <div className="search-books-results">
          <BookGrid books={this.state.search} />
        </div>
      </div>
    )
  }
}

class SearchBar extends Component {

  render() {
    return (
      <div className="search-books-bar">
        <Link to="/" className="close-search">Close</Link>
        <div className="search-books-input-wrapper">
          {/*
            NOTES: The search from BooksAPI is limited to a particular set of search terms.
            You can find these search terms here:
            https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

            However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
            you don't find a specific author or title. Every search is limited by search terms.
          */}
          <input type="text" placeholder="Search by title or author"/>

        </div>
      </div>
    )
  }
}

// class Name extends Component {
//   render() {
//     return (
//       <div></div>
//     )
//   }
// }

export default BooksApp
