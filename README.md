[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/EM0JVmR-)
# Mini Project: E-commerce API

## Instructions

### Collaboration Requirements

Please don't split the code. Write every line of code together. In each group, every person should understand every line of code.

### Overview

In this project, you will be using Node, Express, MongoDB, and Mongoose to create an e-commerce backend app. This app will have 2 types of users: admins of the shop and customers.

### Working with Docker

This app is bootstrapped with Docker and Docker Compose. It containerizes the server as well as the database.

### To Start the Server

Run the command `yarn && yarn start`. This will install all the dependencies and build the Docker image.

### To Install Packages

When you run `yarn add PACKAGE`, the package will be installed in Docker as well automatically. However, if you run into issues, you need to stop the server first with `yarn stop`, then you can run `yarn build` to rebuild the Docker image and start again.

### To Prune the Containers and Data

> ⚠️ WARNING: This is a destructive command that will delete the containers and all the data inside, like database data and uploads. You can run `yarn prune` to shut down the server and delete all the volumes associated with it. This serves as a start-fresh command that will return your server environment to the original state. It will not affect your code changes, though.

## Starter Code

In this project folder, you will find:

1. Express server setup in `/index.js`
2. The database connection is set up in `db/connection.js`

Now the rest is for you to build on your own 😁

### Functional Requirements

The requirements will be split into two main sections: Admin Features and Customer Features. Ensure you write clean code, as each section builds upon the previous work.

**Attention**: All types of validation and error handling should be taken into consideration in all requests.

### Admin Features

1. **Shop Item Management:**
   - Define your `shop-item` schema with at least these fields: title, image, price, description, availableCount, genre or category.
   - Admin should be able to add new shop items.
   - Admin should be able to update the details of a shop item, such as description, price, available count, etc.
   - Admin should be able to delete one or more items from the items list.
   - Admin should be able to search for shop items based on different properties.

### Customer Features

1. **Shop Item Interaction:**

   - Customer is able to get all shop items and filter according to category and price range (e.g., items that range in price from $10 to $50).
   - Customer should be able to search for items.
   - Customer should be able to get the information of a single item.

2. **Cart Management:**

   - A customer is able to add an item to their cart by sending a request to `/cart` with the customer ID, item ID, and quantity requested. Ensure there are enough items in the inventory before adding to the cart. Adding to the cart should also decrement the quantity in the shop items inventory.
   - After adding items to their cart, customers will need to checkout and order, so create a request to the endpoint `/checkout`. Calculate the bill for all the items in the cart, create an `order` object with all order items and bill total, and return it to the customer. The cart for that customer should be empty after they order.

3. **Model Requirements:**
   - Define a new model for the `customer`.
   - Define a model for the `cart`. The `cart` can be embedded or referenced inside the `customer` model.
   - Define a new model for customer orders, called `order`. All customer orders will be stored in this model after checkout.

### Authentication and Authorization

**Admin Authentication:**

- Admin should be able to sign in using an email and a password through the `/admin/signin` endpoint.
- Admin should remain signed in and have access to the admin routes until they sign out.
- Admin should be able to sign out through the `/admin/signout` endpoint.
- Only admins must be authorized to access the admin endpoints.
- Admin functionalities:
  - Fetch all the orders information from the `/admin/orders` endpoint.
  - Fetch all the customers' information from the `/admin/customers` endpoint.
  - Only an admin can create a new admin account from the `/admin/new-admin` endpoint.

**Customer Authentication:**

- Customer should be able to sign up using an email and a password through the `/customer/signup` endpoint.
- Customer should be able to sign in using an email and a password or a social media account of your choice through the `/customer/signin` endpoint.
- Customer should remain signed in and have access to the customer routes until they sign out.
- Customer should be able to sign out through the `/customer/signout` endpoint.
- Only customers must be authorized to access the customer endpoints.
- Customer functionalities:
  - Fetch all their previous orders information from the `/customer/orders` endpoint.
  - Fetch and update their profile information through the `/customer/profile` endpoint.
  - Update their cart and perform CRUD operations on it (e.g., add items, remove items, update items by incrementing and decrementing the quantity) through the `/customer/cart` endpoint.

**NOTE:** Apply authentication checks to all previous admin and customer routes created. Remove the customer ID from the request body of previous routes, and instead identify the customer using the authentication setup.

### Optional BONUS Requirements

Excited to take your project to the next level? Why not build the frontend for your first e-commerce website using React?

- The frontend should include the main functionalities of the app for the customer, such as signup, signin, signout views, all products view, single product view, cart view, and checkout view.

- The frontend should include the main functionalities of the app for the admin, such as signin, signout views, all orders view, all customers view, add new product view, update product view, delete product view.
