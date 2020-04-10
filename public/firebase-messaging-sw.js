importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCWalwPSvfi8GbdofE_whZMHLi_Fc0l7DE",
    authDomain: "symper-f0ede.firebaseapp.com",
    databaseURL: "https://symper-f0ede.firebaseio.com",
    projectId: "symper-f0ede",
    storageBucket: "symper-f0ede.appspot.com",
    messagingSenderId: "315052954103",
    appId: "1:315052954103:web:08b4ceaff3d03f0ad8def2"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
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