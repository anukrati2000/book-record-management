const express = require('express');
// JSON data import 
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */
router.get('/', (req, res) => {
    res.status(200).json({ success: true, data: books });

});


/**
 * Route: /books
 * Method: GET
 * Description: Get a book by id
 * Access: Public
 * Parameters: id
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "book not found",
        })
    };

    return res.status(200).json({
        success: true,
        data: book,
    });

});


/**
 * Route: /books/issued
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: none
 */
router.get('/issued/by-user', (req, res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.id;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0)
        return res.status(404).json({
            success: false,
            message: "No book issued yet"
        });

    return res.status(200).json({
        success: true,
        data: issuedBooks
    });

});


/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 * Data: author, name, genre, price, publisher, id
 */
router.post('/', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(404).json({
            success: false,
            message: "No data provided"
        });
    }

    const book = books.find((each) => each.id === data.id);

    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exist with this id, please use a unique id",
        });
    }

    let allBooks = [];
    allBooks = [...books, data];
    return res.status(200).json({
        success: true,
        data: allBooks
    });

});


/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book
 * Access: Public
 * Parameters: id
 * Data: author, name, genre, price, publisher, id
 */
router.put('/:id', (req, res) => {
    const { id } = req.params;

    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found with this particular id",
        });
    }

    const updatedBooks = books.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data,
            }
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updatedBooks
    });

});


/**
 * Route: /books/issued/withFine
 * Method: GET
 * Description: Get all issued books that have a fine
 * Access: Public
 * Parameters: none
 */
router.get('/issued/withFine', (req, res) => {
    const usersIssuedBook = users.filter((each) => each.issuedBook);

    let usersWithFine = [];

    //Subscription expiration calculation
    // January 1, 1970, UTC. Milliseconds
    usersIssuedBook.forEach((user) => {
        const getDateInDays = (date = "") => {
            if (date === '') {
                //current date
                date = new Date();
            }
            else {
                // get date on basis of data variable
                date = new Date(date);
            }
            let days = Math.floor(date / (1000 * 60 * 60 * 24));
            return days;
        }

        const subscriptionType = (date) => {

            if (user.subscriptionType === 'Basic') {
                date = date + 90;
            }
            else if (user.subscriptionType === 'Standard') {
                date = date + 180;
            }
            else if (user.subscriptionType === 'Premium') {
                date = date + 365;
            }

            return date;

        }
        let returnDate = getDateInDays(user.returnDate);
        let currentDate = getDateInDays();
        let subscriptionDate = getDateInDays(user.subscriptionDate);
        let subscriptionExpiration = subscriptionType(subscriptionDate);

        /*console.log("Return ", returnDate);
        console.log("Current ", currentDate);
        console.log("sub date", subscriptionDate);
        console.log("sub exp ", subscriptionExpiration);
        */


        const fine = returnDate < currentDate ?
            (subscriptionExpiration <= currentDate ? 200 : 100)
            : 0;

        if (fine > 0) {
            usersWithFine.push({
                ...user,
                fine
            });
        }

    });

    if (usersWithFine.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No user have a fine to pay'
        });
    }

    return res.status(200).json({
        success: true,
        data: usersWithFine
    });


});


module.exports = router;