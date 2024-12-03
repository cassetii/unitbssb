import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBkv3y80j7f3YpuB8kZzh-W8wCC-acvzRM",
    authDomain: "bssb-818bd.firebaseapp.com",
    projectId: "bssb-818bd",
    storageBucket: "bssb-818bd.firebasestorage.app",
    messagingSenderId: "1082713375228",
    appId: "1:1082713375228:web:7352ca908a49a5d123f279",
    measurementId: "G-Q7KWK8QSTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const acForm = document.querySelector("#ac-form");
const acTableBody = document.querySelector("#ac-table tbody");

acForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const letak = document.querySelector("#letak").value;
    const jalan = document.querySelector("#jalan").value;
    const model = document.querySelector("#model").value;
    const kapasitas = document.querySelector("#kapasitas").value;
    const freon = document.querySelector("#freon").value;

    try {
        await addDoc(collection(db, "ac-units"), { letak, jalan, model, kapasitas, freon, logs: [] });
        alert("Data berhasil ditambahkan!");
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

const loadData = async () => {
    const querySnapshot = await getDocs(collection(db, "ac-units"));
    acTableBody.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.letak}</td>
            <td>${data.jalan}</td>
            <td>${data.model}</td>
            <td>${data.kapasitas}</td>
            <td>${data.freon}</td>
            <td>
                <button onclick="editData('${doc.id}', '${JSON.stringify(data)}')">Edit</button>
                <button onclick="deleteData('${doc.id}')">Delete</button>
            </td>
        `;
        acTableBody.appendChild(row);
    });
};

const editData = async (id, data) => {
    const parsedData = JSON.parse(data);
    const updatedLog = [...parsedData.logs, "Updated at " + new Date().toISOString()];
    try {
        await updateDoc(doc(db, "ac-units", id), { logs: updatedLog });
        alert("Data berhasil diupdate!");
        loadData();
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

const deleteData = async (id) => {
    try {
        await deleteDoc(doc(db, "ac-units", id));
        alert("Data berhasil dihapus!");
        loadData();
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

document.addEventListener("DOMContentLoaded", loadData);
