# book-record-management

This is a book record management API Backend for the management of records and books

# API Documentation link

https://documenter.getpostman.com/view/12012748/VUr1JDGU

# Routes and Endpoints

## /users

POST: Create a new user
GET: get all list of users ✅

## /users/{id}

GET: get a user by id ✅
PUT: update a user by id
DELETE: delete a user by id (check if he/she still has an issued book) (is there any fine to be paid)

## users/subscription-details/{id}

GET: get user subscription details

1. Date of subscription
2. Valid till
3. Fine if any

## /books

GET: Get all books
POST: Create/add a new book

## /books/{id}

GET: Get a book by id
PUT: update a book by id

## /books/issued

GET: Get all issued books

## /books/issued/withFine

GET: Get all issued books with fine.

# Subscription Types

Basic (3 months)
Standard (6 months)
Premium (12 months)

If the subscription date is 01/08/22
and Subscription type is Standard
the valid till date will be 01/02/23

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, then he gets a fine of Rs. 100./

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, and his subscription also expires, then he will get a
fine of Rs. 200./
