# simple-twitter

A simplified mock of Twitter using Node.js for the backend and HTML/CSS/Javascript with Tailwind for the frontend. [View the app here.](https://simple-twitter-xfrk.onrender.com/)

So far, its features include the following:
* Create tweets and edit or delete them
* View and like other users' tweets - users can only like a tweet once
* Upload an avatar with Cloudinary which will be displayed beside your tweet
* User authentication and authorisation with Passport.js
  * Users have to create an account and log in to use all of the above features
  * Users can only edit/delete their own tweets
  * Users can only like other users' tweets and not their own
* Responsive design
* After logging in, the app is essentially a single-page application to improve user experience - e.g. editing a tweet or uploading an avatar brings up a pop up window to do so, instead of redirecting to another page
* Semantic HTML and aria labels for better accessibility
