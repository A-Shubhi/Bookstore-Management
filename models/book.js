// models/Book.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{
        type: String,
        required :true
    },

    author:{
        type: String,
    },

    isbn:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    }

}, {timestamps: true});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;