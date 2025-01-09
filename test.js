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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///BUS MANAGEMENT SYSTEM

// Backend (mkdir server.js and copy this code.........)
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bus_management'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// API to search buses
app.get('/api/buses', (req, res) => {
    const { source, destination, date } = req.query;
    if (!source || !destination || !date) {
        return res.status(400).send({ message: 'Source, destination, and date are required.' });
    }

    const query = `SELECT * FROM buses WHERE source = ? AND destination = ? AND DATE(departure_time) = ?`;
    console.log('Query:', query, 'Params:', [source, destination, date]);

    db.query(query, [source, destination, date], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});


// API to book a bus
app.post('/api/bookings', (req, res) => {
    const { bus_id, user_name, seats_booked } = req.body;

    // Check seat availability
    const checkQuery = `SELECT available_seats FROM buses WHERE id = ?`;
    db.query(checkQuery, [bus_id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results[0].available_seats < seats_booked) {
            return res.status(400).send({ message: 'Not enough seats available.' });
        }

        // Update available seats
        const updateQuery = `UPDATE buses SET available_seats = available_seats - ? WHERE id = ?`;
        db.query(updateQuery, [seats_booked, bus_id], (err) => {
            if (err) return res.status(500).send(err);

            // Add booking to bookings table
            const insertQuery = `INSERT INTO bookings (bus_id, user_name, seats_booked) VALUES (?, ?, ?)`;
            db.query(insertQuery, [bus_id, user_name, seats_booked], (err) => {
                if (err) return res.status(500).send(err);
                res.send({ message: 'Booking confirmed!', bus_id, user_name, seats_booked });
            });
        });
    });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

// SQL Queries for Database Setup and Sample Data
/*
CREATE DATABASE bus_management;

USE bus_management;

CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    seats_booked INT NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Insert sample bus data
INSERT INTO buses (source, destination, departure_time, ticket_price, available_seats) VALUES
('City A', 'City B', '2025-01-10 08:00:00', 15.50, 40),
('City A', 'City C', '2025-01-10 09:30:00', 20.00, 30),
('City B', 'City C', '2025-01-10 11:00:00', 25.00, 25),
('City C', 'City A', '2025-01-10 14:00:00', 18.75, 35);

-- Insert sample booking data
INSERT INTO bookings (bus_id, user_name, seats_booked) VALUES
(1, 'John Doe', 2),
(2, 'Jane Smith', 3),
(3, 'Alice Johnson', 1);
*/

// Frontend (React) copy to app.js file.....
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [searchParams, setSearchParams] = useState({ source: '', destination: '', date: '' });
    const [buses, setBuses] = useState([]);
    const [booking, setBooking] = useState({ bus_id: '', user_name: '', seats_booked: '' });

    const searchBuses = async () => {
        try {
            const response = await axios.get('/api/buses', { params: searchParams });
            setBuses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const bookBus = async () => {
        try {
            const response = await axios.post('/api/bookings', booking);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Bus Management System</h1>

            {/* Search Buses */}
            <div>
                <h2>Search Buses</h2>
                <input type="text" placeholder="Source" onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })} />
                <input type="text" placeholder="Destination" onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })} />
                <input
                    type="date"
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            date: e.target.value, // Ensure this matches the required format
                        })
                    }
                />

                <button onClick={searchBuses}>Search</button>
            </div>

            {/* Display Buses */}
            <div>
                <h2>Available Buses</h2>
                <ul>
                    {buses.map((bus) => (
                        <li key={bus.id}>
                            {bus.source} - {bus.destination} | Departure: {bus.departure_time} | Price: {bus.ticket_price} | Available Seats: {bus.available_seats}
                            <button onClick={() => setBooking({ ...booking, bus_id: bus.id })}>Book</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Book Bus */}
            <div>
                <h2>Book Bus</h2>
                <input type="text" placeholder="Your Name" onChange={(e) => setBooking({ ...booking, user_name: e.target.value })} />
                <input type="number" placeholder="Seats" onChange={(e) => setBooking({ ...booking, seats_booked: e.target.value })} />
                <button onClick={bookBus}>Confirm Booking</button>
            </div>
        </div>
    );
};

export default App;
