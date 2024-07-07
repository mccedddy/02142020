import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const galleryGrid = document.getElementById("galleryGrid");
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const closeModal = document.getElementById("closeModal");
  const prevImage = document.getElementById("prevImage");
  const nextImage = document.getElementById("nextImage");

  let currentImages = [];
  let currentIndex = 0;

  // Function to display gallery items
  const displayGalleryItems = async () => {
    galleryGrid.innerHTML = ""; // Clear the grid

    const q = query(collection(db, "gallery"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      const itemDiv = document.createElement("div");
      itemDiv.classList.add(
        "p-2",
        "bg-white",
        "shadow-md",
        "rounded-md",
        "border",
        "border-gray-300",
        "relative"
      );
      itemDiv.setAttribute("data-aos", "fade-up");

      const firstImageUrl = itemData.imageUrls[0];
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("relative");

      const img = document.createElement("img");
      img.src = firstImageUrl;
      img.alt = `Image 1`;
      img.classList.add("w-full", "cursor-pointer", "object-cover");

      img.addEventListener("click", () => {
        currentImages = itemData.imageUrls;
        currentIndex = 0;
        modalImage.src = currentImages[currentIndex];
        modalCaption.textContent = itemData.caption;

        if (currentImages.length > 1) {
          prevImage.classList.remove("hidden");
          nextImage.classList.remove("hidden");
        } else {
          prevImage.classList.add("hidden");
          nextImage.classList.add("hidden");
        }

        imageModal.classList.remove("hidden");
      });

      imgContainer.appendChild(img);

      if (itemData.imageUrls.length > 1) {
        const icon = document.createElement("div");
        icon.classList.add(
          "absolute",
          "top-2",
          "right-2",
          "bg-gray-800",
          "text-white",
          "p-1",
          "rounded-full",
          "text-sm"
        );
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 20a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-1a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm-.5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1.5v1.5a.5.5 0 0 1-1 0v-2zm-.707-5.793a.5.5 0 1 1-.707-.707L7.293 9.5 4.5 6.707a.5.5 0 1 1 .707-.707L8 8.793l2.793-2.793a.5.5 0 1 1 .707.707L8.707 9.5l2.793 2.793a.5.5 0 0 1-.707.707L8 10.207l-2.793 2.793z"/>
        </svg>`;
        imgContainer.appendChild(icon);
      }

      itemDiv.appendChild(imgContainer);
      galleryGrid.appendChild(itemDiv);
    });
    AOS.refresh(); // Refresh AOS animations
  };

  // Function to upload images
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const caption = document.getElementById("caption").value;
    const images = document.getElementById("images").files;

    try {
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        const storageRef = ref(storage, `gallery/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadUrl);
      }

      await addDoc(collection(db, "gallery"), {
        caption: caption,
        imageUrls: imageUrls,
        timestamp: new Date(),
      });
      uploadForm.reset(); // Clear the form
      displayGalleryItems(); // Refresh the gallery items
    } catch (err) {
      console.error("Error uploading images: ", err);
    }
  });

  // Navigation buttons for modal
  prevImage.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      modalImage.src = currentImages[currentIndex];
    }
  });

  nextImage.addEventListener("click", () => {
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      modalImage.src = currentImages[currentIndex];
    }
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    imageModal.classList.add("hidden");
  });

  // Initial call to display gallery items
  displayGalleryItems().catch((err) =>
    console.error("Error getting gallery items: ", err)
  );
});
