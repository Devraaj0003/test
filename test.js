// cd backend
// npm init -y
// npm i express mysql2 body-parser cors
// touch server.js 

// npx create-react-app frontend
// cd frontend
// npm axios react-router-dom bootstrap


//server-code
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my_db'
});

db.connect((err) => {
    if (err) {
        console.error('Failed', err)
    }
    else {
        console.log('Connected');
    }
});

// API Route to Add Book
app.post('/addbook', (req, res) => {
    const { title, author } = req.body;
    let stat = "Avl";
    const sql = `INSERT INTO books (title, author,status) VALUES (?, ?, ? )`;
    db.query(sql, [title, author, stat], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding book');
        } else {
            res.status(200).send('Book added successfully');
        }
    });
});

app.post('/booknow', (req, res) => {
    const { bookId } = req.body;

    // Example logic to insert booking into a `bookings` table
    const sql = 'INSERT INTO bookings (book_id, booking_date) VALUES (?, NOW())';
    db.query(sql, [bookId], (err, result) => {
        if (err) {
            console.error('Error booking book:', err);
            res.status(500).send('Error booking book');
        } else {
            res.status(200).send('Book booked successfully');
        }
    });
});

app.get('/getbooks', (req, res) => {
    const sql = `SELECT * FROM books`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding book');
        } else {
            res.status(200).json(result);
        }
    })
})

const port = 3001; // Change 6000 to 5000
app.listen(port, () => console.log(`Server listening on port ${port}`));



///////////////////////////////////////////////////////////////////////////
//fronted



//app
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import AddBook from './routes/AdminPage';
import ViewBooks from './components/ViewBooking';


function App() {
    return (

        <Router>
            <Routes>
                <Route path="/admin" element={<AddBook />} />
                <Route path="/" element={<ViewBooks />} />
            </Routes>
        </Router>
    );
}

export default App;


//table viewing
//components/
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const ViewBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBook = async (e) => {
            try {
                const response = await axios.get('http://localhost:3001/getbooks');
                setBooks(response.data);
            } catch (err) {
                console.error('error', err);
            }
        }
        fetchBook();
    }, []);

    const handleBook = async (bookId) => {
        try {
            const response = await axios.post('http://localhost:3001/booknow', { bookId });
            alert(response.data);
        } catch (error) {
            console.error('Error booking book:', error);
            alert('Failed to book the book');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Books</h2>
            <table className="table tabel-striped">
                <thead>
                    <tr>
                        <th>*</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={book.id}>
                            <td>{index + 1}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                <button className="btn btn-success" onClick={() => handleBook(book.id)} >Book Now</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ViewBooks

//main inputboxes
//routes/


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/addbook', { title, author });
            alert(response.data);
            setTitle('');
            setAuthor('');
        } catch (error) {
            console.error('Error adding book:', error.response || error.message);
            alert('Failed to add book');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Book Title</label>
                    <input
                        className="form-control"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Author Name</label>
                    <input
                        className="form-control"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddBook;
