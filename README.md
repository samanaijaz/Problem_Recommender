# Codeforces__Problem__Recommender
Made a webpage using Node.js, express.js, ejs, html , css, mongodb. where first user will make account with his mail id in which he will require to fill his email address , his codeforces handle and set a password , done using mongodb.

And when user login he will be recommended some problems that the user should do for practice. basically those problem are suitable for that particular user as they are extracted using users past history. then user will be shown this current rating and rankings. Also the problems that is unsolved by the user will also be shown,    and the Tags on which user should focus.

Now exploring each one by one

First is recommendation i am recommeding problems by finding the wrong submissions (using codeforces API). and in those which are most frequent tags also what is users current rating as it is known a user should do problems within +250 of his current rating. also i taken the average of the last 5 ratings as current rating   then again fetched API of problemset to access the problems and attached those filters. and got the recommended problems.

Second i am showing unsolved problems by using codeforces API. by going to users submissions http link where i am taking problems with verdict wrong answer. and then deleting the problems with accepted also. 

Third i am also showing the tags user should focus on. i am storing the wrong submissions tags in a dictionary and sorting that dictionary and taking the top 5 tags and giving it to the user.

Fourth is the basic details of the user that also i am fetching with the Codeforces API and organising in a good manner and showing him. 

Fiveth is used Mongodb where i created a login / sign up system to make my website more real and good. 

Also at the end i have used a good CSS in this web project to make it user friendly  .
