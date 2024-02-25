//setting up express server
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('./models/book');
const router = express.Router();

//connecting to MongoDB
const dbURI = 'mongodb+srv://shubhiagarwal:qkQPodJ5WG8R4Zvm@bookscluster.ylxufc2.mongodb.net/?retryWrites=true&w=majority&appName=bookscluster'

mongoose.connect(dbURI)
    .then((result)=>{
        app.listen(3000);
    })
    .catch((err)=>console.log('Error'))

    // checking if connected with MongoDB or not
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

const app = express();
app.set('view engine','ejs'); 
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


//home page
app.get('/', (req, res)=>{
    res.render('index',{title:'Home'});  
});


//Retrieve a list of all books.
app.get('/books',(req,res)=>{    
    Book.find().sort({title: 1})
        .then((result)=>{
            res.render('book_list',{title:'Books', error:'', items:result});
        })
        .catch((err)=>{
            console.log(err);
        });
    
});


//retrieves list of books by searching id (partial search also ) search on isbn
app.post('/search_book_by_id', (req, res) => {
    const partialISBN = req.body.isearch;

    Book.find({ isbn: { $regex: new RegExp(partialISBN, 'i') } })  // Case-insensitive partial search
        .then((results) => {
            if (results.length > 0) {
                console.log('Books found by partial ISBN:', results);
                res.render('part_books', { title: 'Book Details', books: results });
            } else {
                console.log('No books found by partial ISBN:', partialISBN);
                res.render('part_books', { title: 'Books Not Found', books: [] });
            }
        })
        .catch((err) => {
            console.error('Error searching books by partial ISBN:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        });
});



//Retrieve a specific book by its ID.
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    Book.findOne({ isbn })
        .then((result) => {
            if (result) {
                console.log('Book found by ISBN:', result);
                res.render('part_books', { title: 'Book Details', books: result });
            } else {
                console.log('Book not found by ISBN:', isbn);
                res.render('part_books', { title: 'Book Not Found', books: [] });
            }
        })
        .catch((err) => {
            console.error('Error retrieving book by ISBN:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        });
});


app.get('/create_book', (req, res)=>{
    res.render('create_book',{title:'Add_Book'});  
});



app.get('/add_book', (req, res)=>{
    res.redirect('books');  
});


//Create a new book.
app.post('/add_book', async (req, res) => {
    const { title, author, isbn, price } = req.body;

    try {
        // Check if a book with the given ISBN already exists
        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            console.log('Book already exists with ISBN:', isbn);
            res.send(`
                <script>
                    alert("Another book already exists with the same ISBN. Please enter a different ISBN.");
                    window.location.href = '/create_book';
                </script>
            `);
        } else {
            // If no existing book with the given ISBN, add the new book
            const newBook = new Book({
                title,
                author,
                isbn,
                price,
            });

            await newBook.save();
            console.log('New book added:', newBook);
            res.send(`
                <script>
                    alert("Book added successfully.");
                    window.location.href = '/add_book';
                </script>
            `);
        }
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});



//update book

app.get('/update_book', (req, res)=>{
    res.render('update_book',{title:'Update_Book'});  
});



app.post('/update_book_by_id', (req, res) => {

    const bookId = req.params.id;
    const updatedBookData = req.body;
    Book.findByIdAndUpdate(bookId, updatedBookData, { new: true })
        .then((updatedBook) => {
            if (updatedBook) {
                console.log('Book updated successfully:', newBook);
                res.send(`
                    <script>
                        alert("Book updated successfully.");
                        window.location.href = '/add_book';
                    </script>
                `);
            } else {
                console.log('Book not found by ID:', bookId);
                res.status(404).json({ error: 'Book not found', message: `No book found with ID: ${bookId}` });
            }
        })
        .catch((err) => {
            console.error('Error updating book by ID:', err);
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
        });
});



app.put('/books/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Find the book by ISBN to get its ObjectID
        const book = await Book.findOne({ isbn });

        if (book) {
            // Update the book details based on user input
            const updatedBook = await Book.findOneAndUpdate(
                { _id: book._id },
                {
                    title: req.body.title || book.title,
                    author: req.body.author || book.author,
                    price: req.body.price || book.price,
                },
                { new: true }
            );

            console.log('Book updated:', updatedBook);
            res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
        } else {
            res.status(404).json({ error: 'Book not found', message: 'Book with the given ISBN not found.' });
        }
    } catch (err) {
        console.error('Error updating book by ISBN:', err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});



app.get('/delete_book', (req, res)=>{
    res.render('delete_book',{title:'Delete_Book'});  
});



app.delete('/books/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Find the book by ISBN to get its ObjectID
        const book = await Book.findOne({ isbn });

        if (book) {
            // Delete the book by its ObjectID
            const deletedBook = await Book.findByIdAndDelete(book._id);
            
            console.log('Book deleted:', deletedBook);
            res.header('Content-Type', 'text/html');
            res.send(`
                <script>
                    alert("Deleted the book.");
                    window.location.href = '/books';
                </script>
            `);
        } else {
            res.header('Content-Type', 'text/html');
            res.send(`
                <script>
                    alert("Did not find the book.");
                    window.location.href = '/delete_book';
                </script>
            `);
        }
    } catch (err) {
        console.error('Error deleting book by ISBN:', err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});



//404 Error
app.use((req,res)=>{
    res.status(404).render('404'); 
});   