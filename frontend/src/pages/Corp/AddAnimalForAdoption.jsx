import React, { useState } from "react";
import { toast } from "react-toastify";

const AddAnimalForAdoption = () => {
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

  // Files
  const [images, setImages] = useState([]);
  const [medicalImages, setMedicalImages] = useState([]);
  const [video, setVideo] = useState(null);

  // Previews
  const [imagePreview, setImagePreview] = useState([]);
  const [medicalImagePreview, setMedicalImagePreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState("");

  // Medical notes
  const [medicalHistory, setMedicalHistory] = useState([""]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add a new medical history note
  const addMedicalField = () =>
    setMedicalHistory([...medicalHistory, ""]);

  const updateMedicalField = (idx, val) => {
    const arr = [...medicalHistory];
    arr[idx] = val;
    setMedicalHistory(arr);
  };

  // ANIMAL IMAGES
  const handleAnimalImages = (e) => {
    const newFiles = [...e.target.files];
    const updatedFiles = [...images, ...newFiles];

    setImages(updatedFiles);
    setImagePreview(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeAnimalImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);

    setImages(newImages);
    setImagePreview(newImages.map((f) => URL.createObjectURL(f)));
  };

  // MEDICAL IMAGES
  const handleMedicalImages = (e) => {
    const newFiles = [...e.target.files];
    const updatedFiles = [...medicalImages, ...newFiles];

    setMedicalImages(updatedFiles);
    setMedicalImagePreview(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeMedicalImage = (index) => {
    const newImages = [...medicalImages];
    newImages.splice(index, 1);

    setMedicalImages(newImages);
    setMedicalImagePreview(newImages.map((f) => URL.createObjectURL(f)));
  };

  // VIDEO
  const handleVideo = (e) => {
    const file = e.target.files[0];
    setVideo(file);

    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview("");
  };

  // SUBMIT FORM
  const submitForm = async (e) => {
    e.preventDefault();

    if (medicalHistory.some((n) => n.trim() === "")) {
      toast.error("Fill all medical notes!");
      return;
    }

    const token = localStorage.getItem("token");
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    medicalHistory.forEach((note) => fd.append("medicalHistory", note));

    images.forEach((img) => fd.append("images", img));
    medicalImages.forEach((img) => fd.append("medicalImages", img));

    if (video) fd.append("video", video);

    try {
      const res = await fetch(
        "http://localhost:8000/api/corp/adoption/create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const out = await res.json();

      if (out.success) {
        toast.success("Listing Created!");
        window.location.reload();
      } else {
        toast.error(out.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="pt-20 ml-24 px-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-teal-900 mb-6">
        Add Animal for Adoption 🐾
      </h1>

      <form
        onSubmit={submitForm}
        className="bg-white shadow-xl rounded-xl p-6 space-y-6 border"
      >
        {/* Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "name",
            "type",
            "breed",
            "gender",
            "age",
            "weight",
            "color",
            "city",
            "address",
          ].map((f) => (
            <input
              key={f}
              name={f}
              value={form[f]}
              onChange={change}
              placeholder={f.toUpperCase()}
              required={["name", "type", "city", "address"].includes(f)}
              className="border p-3 rounded-lg"
            />
          ))}
        </div>

        {/* Description */}
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={change}
          placeholder="Description"
          className="border p-3 rounded-lg w-full"
        />

        {/* Medical Notes */}
        <div>
          <h3 className="font-semibold text-teal-700">Medical History</h3>
          {medicalHistory.map((note, idx) => (
            <input
              key={idx}
              value={note}
              onChange={(e) => updateMedicalField(idx, e.target.value)}
              placeholder={`Medical Note ${idx + 1}`}
              className="border w-full p-3 rounded-lg mt-2"
            />
          ))}

          <button
            type="button"
            onClick={addMedicalField}
            className="mt-2 bg-amber-500 text-white px-4 py-2 rounded"
          >
            + Add More
          </button>
        </div>

        {/* ANIMAL IMAGES */}
        <div>
          <h3 className="text-lg font-semibold text-teal-700">Animal Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAnimalImages}
            className="border p-3 w-full rounded-lg"
          />

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagePreview.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    className="h-28 w-full rounded object-cover shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeAnimalImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MEDICAL IMAGES */}
        <div>
          <h3 className="text-lg font-semibold text-teal-700">
            Medical Images (Optional)
          </h3>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleMedicalImages}
            className="border p-3 w-full rounded-lg"
          />

          {medicalImagePreview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {medicalImagePreview.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    className="h-28 w-full rounded object-cover shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedicalImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VIDEO */}
        <div>
          <h3 className="text-lg font-semibold text-teal-700">
            Video (Optional)
          </h3>

          <input
            type="file"
            accept="video/*"
            onChange={handleVideo}
            className="border p-3 rounded-lg w-full"
          />

          {videoPreview && (
            <div className="relative mt-3">
              <video
                controls
                src={videoPreview}
                className="w-full h-64 rounded shadow"
              ></video>
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default AddAnimalForAdoption;
