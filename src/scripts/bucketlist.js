import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc as firestoreDoc,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const addBucketlistItemForm = document.getElementById(
    "addBucketlistItemForm"
  );
  const notDoneList = document.getElementById("notDoneList");
  const doneList = document.getElementById("doneList");

  // Function to display bucketlist items
  const displayBucketlistItems = async () => {
    notDoneList.innerHTML = ""; // Clear the list
    doneList.innerHTML = ""; // Clear the list

    const q = query(collection(db, "bucketlist"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      const itemDiv = document.createElement("div");
      itemDiv.classList.add(
        "p-4",
        "bg-white",
        "shadow-md",
        "rounded-md",
        "border",
        "border-gray-300"
      );
      itemDiv.setAttribute("data-aos", "fade-up");

      itemDiv.innerHTML = `
        <p class="text-xl font-bold">${itemData.title}</p>
        <p>${itemData.description}</p>
        <label class="inline-flex items-center mt-2">
          <input type="checkbox" ${itemData.done ? "checked" : ""} data-id="${
        doc.id
      }" class="form-checkbox h-5 w-5 text-blue-600">
          <span class="ml-2">Done</span>
        </label>
      `;

      if (itemData.done) {
        doneList.appendChild(itemDiv);
      } else {
        notDoneList.appendChild(itemDiv);
      }

      itemDiv
        .querySelector("input[type='checkbox']")
        .addEventListener("change", async (e) => {
          const itemId = e.target.getAttribute("data-id");
          const itemDoc = firestoreDoc(db, "bucketlist", itemId);
          const doneStatus = e.target.checked;
          await updateDoc(itemDoc, {
            done: doneStatus,
          });
          displayBucketlistItems(); // Refresh the list
        });
    });
    AOS.refresh(); // Refresh AOS animations
  };

  // Function to add a bucketlist item
  addBucketlistItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
      await addDoc(collection(db, "bucketlist"), {
        title: title,
        description: description,
        done: false,
        timestamp: new Date(),
      });
      addBucketlistItemForm.reset(); // Clear the form
      displayBucketlistItems(); // Refresh the bucketlist items
    } catch (err) {
      console.error("Error adding bucketlist item: ", err);
    }
  });

  // Initial call to display bucketlist items
  displayBucketlistItems().catch((err) =>
    console.error("Error getting bucketlist items: ", err)
  );
});
