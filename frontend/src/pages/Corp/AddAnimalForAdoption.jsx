import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaImage, FaTrash, FaVideo } from "react-icons/fa";

const AddAnimalForAdoption = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rescuedId = urlParams.get("rescuedId");

  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    age: "",
    weight: "",
    color: "",
    city: "",
    address: "",
    description: "",
  });

  const [images, setImages] = useState([]); // both prefilled + new
  const [medicalImages, setMedicalImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [imagePreview, setImagePreview] = useState([]);
  const [medicalImagePreview, setMedicalImagePreview] = useState([]);

  const [medicalHistory, setMedicalHistory] = useState([""]);

  // Fetch rescued details to auto-fill
  useEffect(() => {
    if (!rescuedId) return;

    const fetchRescued = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/corp/rescued/${rescuedId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        if (data.success) {
          const d = data.data;

          setForm((prev) => ({
            ...prev,
            name: d.name || "",
            type: d.type || "",
            city: d.city || "",
            description: d.description || "",
            address: d.city || "",
          }));

          if (d.imageUrl) {
            setImages([d.imageUrl]);
            setImagePreview([d.imageUrl]);
          }

          if (d.meta?.medicalHistory?.length) {
            setMedicalHistory(d.meta.medicalHistory.map((e) => e.note));
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRescued();
  }, [rescuedId]);

  // Image handlers
  const handleAnimalImages = (e) => {
    const newFiles = [...e.target.files];
    const updated = [...images, ...newFiles];
    setImages(updated);

    const updatedPreview = updated.map((item) =>
      typeof item === "string" ? item : URL.createObjectURL(item)
    );
    setImagePreview(updatedPreview);
  };

  const removeAnimalImage = (i) => {
    const updated = images.filter((_, idx) => idx !== i);
    setImages(updated);

    setImagePreview(updated.map((item) =>
      typeof item === "string" ? item : URL.createObjectURL(item)
    ));
  };

  const handleMedicalImages = (e) => {
    const newFiles = [...e.target.files];
    const updated = [...medicalImages, ...newFiles];
    setMedicalImages(updated);

    setMedicalImagePreview(updated.map((item) => URL.createObjectURL(item)));
  };

  const removeMedicalImage = (i) => {
    const updated = medicalImages.filter((_, idx) => idx !== i);
    setMedicalImages(updated);
    setMedicalImagePreview(updated.map((item) => URL.createObjectURL(item)));
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    const token = localStorage.getItem("token");

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // Attach medical history
    medicalHistory.forEach((note) => fd.append("medicalHistory", note));

    // Only append files (not URLs)
    images.forEach((item) => {
      if (typeof item !== "string") fd.append("images", item);
      else fd.append("existingImages", item); // send URL for backend reference
    });

    medicalImages.forEach((img) => fd.append("medicalImages", img));
    if (video) fd.append("video", video);

    try {
      const res = await fetch("http://localhost:8000/api/corp/adoption/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const out = await res.json();
      if (out.success) {
        toast.success("Animal successfully listed!");
        window.location.replace("/corp/adoptions");
      } else toast.error(out.message);
    } catch (err) {
      toast.error("Internal error");
    }
  };

  return (
    <section className="ml-[90px] bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 border">
        <h1 className="text-3xl font-bold text-center text-teal-900 mb-8">
          Create Adoption Listing 🐾
        </h1>

        <form onSubmit={submitForm} className="space-y-6">

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "type", "breed", "gender", "age", "weight", "color", "city", "address"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                placeholder={field.toUpperCase()}
                className="p-3 border rounded-lg"
              />
            ))}
          </div>

          {/* Description */}
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe animal behavior / condition..."
            className="border p-3 rounded-lg w-full"
          />

          {/* Medical Notes */}
          <div>
            <h3 className="font-bold text-teal-800 mb-2">Medical Notes</h3>
            {medicalHistory.map((note, idx) => (
              <input
                key={idx}
                value={note}
                onChange={(e) => {
                  let arr = [...medicalHistory];
                  arr[idx] = e.target.value;
                  setMedicalHistory(arr);
                }}
                className="border p-3 rounded-lg w-full mb-2"
              />
            ))}
          </div>

          {/* Images */}
          <div>
            <h3 className="font-bold text-teal-800 mb-2">Images</h3>
            <input type="file" multiple onChange={handleAnimalImages} />

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {imagePreview.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="rounded-lg h-24 object-cover w-full" />
                    <button
                      type="button"
                      onClick={() => removeAnimalImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs px-2"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Images */}
          <div>
            <h3 className="font-bold text-teal-800 mb-2">Medical Images</h3>
            <input type="file" multiple onChange={handleMedicalImages} />

            {medicalImagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {medicalImagePreview.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="rounded-lg h-24 object-cover w-full" />
                    <button
                      type="button"
                      onClick={() => removeMedicalImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs px-2"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div>
            <h3 className="font-bold text-teal-800 mb-2">Video (Optional)</h3>
            <input type="file" accept="video/*" onChange={handleVideo} />

            {video && (
              <video src={URL.createObjectURL(video)} className="w-full h-40 mt-2" controls />
            )}
          </div>

          <button className="w-full bg-teal-600 text-white p-3 rounded-lg font-semibold text-lg">
            Submit Listing
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAnimalForAdoption;
