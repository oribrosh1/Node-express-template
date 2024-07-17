# BOA Home Task - Ori Brosh

This repository contains the implementation for the BOA Ideas home assignment. The project involves developing a feature for Shopify that allows customers to save their cart during checkout and retrieve it later.

## Getting Started

Follow these instructions to set up your development environment and start working on the project.

### Prerequisites

- Node.js installed on your machine.
- Access to a Shopify development store.
- A local MySQL database setup.


### Assignment Requirements

Save the state of the cart for logged-in customers via the Shopify checkout UI extension.
Retrieve the saved cart state through a Shopify App Proxy call to your backend.
Implement the frontend section with dynamic text content, background color, and text color.

### Code Architecture

#### Cart Session Model Changes:
The cart session model has been updated to better suit the project's requirements. These changes support a more efficient handling of cart data.

#### Clean Architecture Implementation:
The backend is structured following a clean architecture approach, consisting of routes, controllers, and repositories. This structure ensures that interactions with the cart session via API requests are handled cleanly and efficiently.

### Notes:
- This updated README includes detailed information about the structural changes you made to the cart session model and the introduction of clean architecture in your project.
- Make sure that the specifics regarding the database model changes and the roles of the different architectural components (routes, controllers, repositories) are clearly documented elsewhere in your project, such as in code comments or a separate documentation file. This will help reviewers understand the changes and the rationale behind your architectural decisions.