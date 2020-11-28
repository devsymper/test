importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBW8O6OeIUpaNbEYwyihGF7QsuVrwtOM4w",
    authDomain: "symper-54ee6.firebaseapp.com",
    databaseURL: "https://symper-54ee6.firebaseio.com",
    projectId: "symper-54ee6",
    storageBucket: "symper-54ee6.appspot.com",
    messagingSenderId: "801948571579",
    appId: "1:801948571579:web:d01c00ea89bb60df08d69e",
    measurementId: "G-7WZC29YT0G"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});