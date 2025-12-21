## Zeal Craft Innovation Developers Team
# Trimz
# Trimz-Frontend

## Trimz Website
Trimz is a barbering service booking app designed for students at the University of Ghana, Legon. This app allows students to book individual barbers for on-demand, personalized barbering services. Barbers are registered on the platform, allowing students to browse profiles and book their preferred barber based on availability.

## Features
- **Customer Registration & Login**: Students can create an account, log in, and manage their profile.
- **Barber Listing**: Registered barbers are displayed, and students can book appointments with specific barbers.
- **Appointment Scheduling**: Students can easily schedule barbering appointments.
- **Responsive Design**: The mobile-friendly app works seamlessly across different devices.
- **AND OTHERS**

## Tech Stack
This project is built using the MERN stack:

- **MongoDB**: NoSQL database for storing customer, barber, and appointment data.
- **Express.js**: Backend framework for handling API requests and routing.
- **React**: The frontend framework is used to build the customer interface.
- **Node.js**: JavaScript runtime environment for the server-side application.

## Project Structure
```bash
/frontend
    /client            # Frontend React application
    /public          # Static assets (index.html, images, etc.)
    /src             # React components and application logic
        /assets        # Images, logos, etc.        # Routes configuration for page navigation
        /components    # Header, Footer, and UI components
        /layout        # Layout components for organizing page structure
        /pages
        /routes         # Different pages (Home, Services, Contact, Login)
    /styles          # Tailwind CSS and custom styling

/Backend
    /server          # Backend Node.js application
    /models          # MongoDB models (Customer, Barber, Appointment)
    /routes          # API routes (customer, barber, appointment routes)
    /controllers     # Logic for handling requests to the routes
    /config          # Database connection and environment configuration
    /middlewares     # Middleware functions (authentication, error handling)
```
## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/)

### Backend Setup (Server)
1. Clone the repository:
    ```bash
    git clone https://github.com/dennis-000/Trimz.git
    cd Trimz/server
    ```
2. Install backend dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    Create a `.env` file in the `server/` directory and add the following:
    ```makefile
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000
    ```
4. Run the backend server:
    ```bash
    npm start
    ```
    The backend server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup (Client)
1. Navigate to the `client/` directory:
    ```bash
    cd ../client
    ```
2. Install frontend dependencies:
    ```bash
    npm install
    ```
3. Run the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend server will run on [http://localhost:3000](http://localhost:3000).

## Usage
Once both the frontend and backend are running:
- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the Trimz app.
- You can register as a customer or a barber.
- Barbers can manage their appointments, and students can book barbering services based on the barbers' availability.

## Theme (Dark Mode)

- The frontend supports **Light**, **Dark**, and **System** theme options.
- Use the theme toggle in the **Header** to cycle between: Light → Dark → System.
- The choice is saved to `localStorage` and when set to **System** the site follows the OS `prefers-color-scheme` setting and updates on change.

To test: start the frontend (`npm run dev`) and click the theme button in the top-right of the header; try changing your OS theme to see the `system` option react.

### Connecting to the Backend (Development)

- Ensure the backend server is running (default port: `5000`).
- The frontend reads `VITE_API_URL` from `.env` to determine the backend base URL. By default this repository includes `VITE_API_URL=http://localhost:5000`.
- During development the Vite dev server proxies requests starting with `/api` to the `VITE_API_URL`, so you can keep `BASE_URL` as `/api/` in code and avoid CORS issues.

Quick checklist:

1. Start the backend (in `Trimz-Backend/`):
    - Create a `.env` with `MONGO_URI` and other required env vars (see Backend README).
    - Start it with `npm run dev` (ensuring it binds to port `5000`).
2. Start the frontend (in `Trimz-Frontend/`):
    - Verify `.env` contains `VITE_API_URL=http://localhost:5000`.
    - Run `npm run dev` and open the app in the browser.

If your frontend dev server runs on a different port than `5173` (for example Vite picked `5174`), set `LOCAL_FRONTEND_URL` (or `FRONTEND_URLS`) in the backend env so the backend CORS helper allows the origin. Alternatively, rely on the Vite proxy (default) and you won't need to change backend CORS during local development.

## API Endpoints

### Customer Routes
- **POST** `/api/customers/register`: Register a new customer.
- **POST** `/api/customers/login`: Log in as a customer.

### Barber Routes
- **GET** `/api/barbers`: Retrieve a list of all registered barbers.
- **POST** `/api/barbers/register`: Register a new barber.

### Appointment Routes
- **POST** `/api/appointments`: Book an appointment with a barber.
- **GET** `/api/appointments/customer/:customerId`: Retrieve appointments for a specific customer.

## Production Build
To build the app for production:
1. In the `client/` folder, run the following to build the production version of the frontend:
    ```bash
    npm run build
    ```
    The `build/` folder will contain the production files, which you can serve from a static hosting platform or integrate with the backend.

2. Deploy the backend and configure it to serve the static frontend files and handle API requests.

## License
This project is developed and maintained by Zeal Craft Innovation, Pentecost University
