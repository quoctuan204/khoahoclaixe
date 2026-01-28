# Backend for Khoa Hoc Lai Xe

## Setup

1. Install MongoDB: Download and install from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your credentials
5. Run: `npm run dev`

## Database

- Uses MongoDB with Mongoose
- Collections: registrations, contacts
- Data is saved before sending notifications

## API Endpoints

- POST /api/register-course: Save course registration and send notifications
- POST /api/contact-advice: Save contact advice and send notifications

## Environment Variables

- EMAIL_USER: Gmail address
- EMAIL_PASS: App password
- TWILIO_ACCOUNT_SID: Twilio SID
- TWILIO_AUTH_TOKEN: Twilio token
- TWILIO_PHONE_NUMBER: Twilio phone number
- ADMIN_EMAIL: Admin email
- ADMIN_PHONE: Admin phone
- MONGO_URI: MongoDB connection string
- PORT: Server port (default 5000)

## Environment Variables

- EMAIL_USER: Gmail address
- EMAIL_PASS: App password
- TWILIO_ACCOUNT_SID: Twilio SID
- TWILIO_AUTH_TOKEN: Twilio token
- TWILIO_PHONE_NUMBER: Twilio phone number
- ADMIN_EMAIL: Admin email
- ADMIN_PHONE: Admin phone
- PORT: Server port (default 5000)