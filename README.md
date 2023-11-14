# Practice Recommendation Web App

This web application, built using Node.js, Express.js, EJS, HTML, CSS, and MongoDB, provides a personalized practice experience for Codeforces users. Here's a breakdown of its features:

## Account Creation and Login

- Users can create an account using their email address, Codeforces handle, and password. MongoDB is employed to store user information securely.

## User Dashboard

Upon logging in, users are presented with a personalized dashboard that includes:

### 1. Problem Recommendations

- The system recommends problems based on the user's past history. It analyzes wrong submissions using the Codeforces API, considering the most frequent tags and the user's current rating. The recommendation system ensures that problems are within a suitable difficulty range.

### 2. Unsolved Problems

- The application retrieves unsolved problems by querying the user's submissions via the Codeforces API. Problems with a "wrong answer" verdict are included, excluding those with an "accepted" status.

### 3. Focus Tags

- The system identifies tags that the user should focus on by storing tags from wrong submissions. The top 5 tags are extracted, providing insights into areas that need improvement.

### 4. User Details

- Basic details about the user, fetched from the Codeforces API, are organized and displayed. This includes the user's current rating, rankings, and other relevant information.

### 5. MongoDB Integration

- MongoDB is utilized to create a secure login/signup system, enhancing the authenticity of the website.

## Stylish User Interface

- The web project features an aesthetically pleasing and user-friendly interface, with CSS applied to enhance the overall user experience.
