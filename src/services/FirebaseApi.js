import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyA5T5USCalywJ4becyvsb0ONq8RLBDji2Y",
    authDomain: "todomanager-54e29.firebaseio.com",
    databaseURL: "https://todomanager-54e29.firebaseio.com",
    projectId: "todomanager-54e29",
    storageBucket: "todomanager-54e29.appsport.com",
    messagingSenderId: "719375627316"
};

export const initializeFirebaseApi = () => firebase.initializeApp(config);

export const createUserOnFirebaseAsync = async (email, password) => {
    const {user} = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

        return user;
}
export const currentFirebaseUser = () => {
    return new Promise((resolve, reject) => {
        var unsubscribe = null;
        unsubscribe = firebase
            .auth()
            .onAuthStateChanged((user) => {
                resolve(user);
            }, (error) => {
                reject(error);
            }, () => {
                unsubscribe();
            });
    });
}

export async function signInOnFirebaseAsync(email, password) {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    return user;
}

export const writeTaskOnFirebaseAsync = async (task) => {
    const user = await currentFirebaseUser();
    var tasksReference = firebase.database().ref(user.uid);
    const key = task.key ? task.key : tasksReference.child('tasks').push().key;
    return await tasksReference.child(`tasks/${key}`).update(task);
}

export const readTasksFromFirebaseAsync = async (listener) => {
    const user = await currentFirebaseUser();
    var tasksReference = firebase.database().ref(user.uid).child('tasks');
    tasksReference.on('value', (snapshot) => {
        var tasks = [];
        snapshot.forEach(function (element) {
            var task = element.val();
            task.key = element.key;
            tasks.push(task);
        });
        listener(tasks);
    });
}