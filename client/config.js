"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "FIREBASE_URI": "https://tidely-beta.firebaseio.com/",
  "GOOGLE_API_URI": "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAR3-1YSkP2LM-HuJshMivhOZuai9L5htM",
  "HOST": "http://localhost:9876"
})

;