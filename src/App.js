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

  changeShelf = (shelf, book) => {
    if (book.shelf !== '') {
      BooksAPI.update(book, shelf).then((res) =>
      BooksAPI.getAll().then((booksObj) => this.setState({
        books: booksObj
      }))
    )
    } else if (book.shelf === 'none') {
      console.log('add this one!')
    }
  }

  componentDidMount() {
    try {
      BooksAPI.getAll().then((booksObj) => this.setState({
        books: booksObj
      }));
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="app">
        <Routes>
          <Route exact path='/' element={<Shelves changeShelf={this.changeShelf} books={this.state.books} shelves={this.shelves} />}
          />

          <Route path='/search' element={<SearchDisplay changeShelf={this.changeShelf} shelves={this.shelves} />}
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
              <Shelf key={shelf.name} books={this.sorter(this.props.books, shelf)} changeShelf={this.props.changeShelf} shelfName={shelf.title} shelves={this.props.shelves} />
              )
            }
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    )
  }
}

class Shelf extends Component {

  render() {

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfName}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map(b =>
              <li key={b.id}>
                <Book books={b} shelves={this.props.shelves} changeShelf={this.props.changeShelf}></Book>
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
            <Book books={b} changeShelf={this.props.changeShelf} shelves={this.props.shelves} ></Book>
          </li>
        )}
      </ol>
    )
  }
}

class Book extends Component {
  render() {
    const { books } = this.props

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${books.imageLinks ? books.imageLinks.thumbnail : ''})` }}></div>
          <Mover book={books} changeShelf={this.props.changeShelf} shelves={this.props.shelves} ></Mover>
        </div>
        <div className="book-title">{books.title}</div>
        <div className="book-authors">{books.authors}</div>
      </div>
    )
  }
}

class Mover extends Component {
  render() {
    return (
      <div className="book-shelf-changer">
      <select value={this.props.book.shelf} onChange={(event) => this.props.changeShelf(event.target.value, this.props.book)}>
        <option value="move" disabled>Move to...</option>

        {this.props.shelves.map(s =>
          <option key={s.name} value={s.name} >
            {s.title}</option>
        )}

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

  search = (event) => {
    try {
      BooksAPI.search(event.target.value).then((booksObj) => {
        console.log(booksObj)
        if (booksObj === undefined || booksObj.error) {
          this.setState({
            search: []
          })
        } else {
          this.setState({
            search: booksObj
          })
        }
      })
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    return (
      <div className="search-books">
        <SearchBar onSearch={(event) => this.search(event)} />
        {this.state.search !== [] && (
          <div className="search-books-results">
            <BookGrid books={this.state.search} shelves={this.props.shelves} changeShelf={this.props.changeShelf} />
          </div>
        )}
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
          <input onChange={(event) => this.props.onSearch(event)} type="text" placeholder="Search by title or author"/>

        </div>
      </div>
    )
  }
}

export default BooksApp
