# Cognito Signup Page

A simple static signup page that integrates with AWS Cognito using AWS SDK v3.

## Features

- Email and password fields for user registration
- Integration with AWS Cognito for user management using AWS SDK v3
- Simple, responsive design

## Setup

1. Clone or download this repository
2. Install dependencies: `npm install`
3. Build the JavaScript bundle: `npm run build`
4. Open `index.html` in a web browser

## Development

- Run `npm run watch` to automatically rebuild when files change

## Configuration

The signup page is configured to use:
- AWS Region: `us-east-1`
- User Pool Client ID: `5jffkijsulbgi2ti8es3feb431`

## How it Works

1. The user enters their email and password
2. The form submits the data to AWS Cognito using the AWS SDK v3
3. If successful, the user will receive a verification email
4. Error messages are displayed if the signup fails

## Files

- `index.html`: The signup form
- `src/index.js`: JavaScript code for AWS Cognito integration using SDK v3
- `styles.css`: CSS styles for the page
- `dist/bundle.js`: Generated JavaScript bundle (after building)

## Notes

- This implementation uses AWS SDK v3 as requested
- No password confirmation field is included as requested
- The page only collects email and password
