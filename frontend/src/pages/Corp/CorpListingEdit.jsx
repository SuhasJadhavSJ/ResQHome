import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaImage, FaTrash, FaArrowLeft } from "react-icons/fa";

const CorpListingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreview, setNewPreview] = useState([]);

  const [loading, setLoading] = useState(true);

  // fetch existing data
  const loadAnimal = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const { images, medicalHistory, medicalImages, video, ...rest } = data.data;
        setForm(rest);
        setExistingImages(images || []);
      } else {
        toast.error("Cannot load data");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimal();
  }, []);

  // text change handler
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // handle new image upload
  const handleNewImages = (e) => {
    const files = [...e.target.files];
    setNewImages((prev) => [...prev, ...files]);
    setNewPreview((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  // remove existing image
  const removeExistingImage = (idx) => {
    const updated = existingImages.filter((_, index) => index !== idx);
    setExistingImages(updated);
  };

  // remove newly added images
  const removeNewImage = (idx) => {
    const updatedFiles = newImages.filter((_, index) => index !== idx);
    const updatedPreview = newPreview.filter((_, index) => index !== idx);
    setNewImages(updatedFiles);
    setNewPreview(updatedPreview);
  };

  // submit changes
  const handleSave = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    const token = localStorage.getItem("token");

    Object.entries(form).forEach(([key, value]) => fd.append(key, value));

    // keep existing images inside update
    existingImages.forEach((img) => fd.append("images", img));

    // append newly added images
    newImages.forEach((file) => fd.append("images", file));

    try {
      const res = await fetch(
        `http://localhost:8000/api/corp/adoption/${id}/edit`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Updated successfully!");
        navigate(`/corp/adoption/${id}`);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) return <p className="pt-24 text-center text-gray-600">Loading...</p>;

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 py-8 px-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-5 hover:text-black"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl mx-auto border border-gray-200">
        <h1 className="text-3xl font-bold text-teal-900 mb-8 tracking-wide">
          Edit Listing
        </h1>

        <form onSubmit={handleSave} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name","type","breed","gender","age","weight","color","city","address"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.toUpperCase()}
                required={["name","type","city","address"].includes(field)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            ))}
          </div>

          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500"
          />

          {/* Existing Images */}
          <div>
            <h2 className="font-bold text-lg text-teal-800 mb-2">Existing Images</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {existingImages.length > 0 ? existingImages.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} className="h-28 w-full rounded object-cover shadow" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full text-xs hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))
              : <p className="text-gray-500">No images available</p>}
            </div>
          </div>

          {/* Upload New Images */}
          <div>
            <h2 className="font-bold text-lg text-teal-800 mb-2">Upload New Images (optional)</h2>

            <label className="flex flex-col items-center justify-center border-dashed border-2 border-gray-400 rounded-lg p-6 cursor-pointer hover:border-teal-600">
              <FaImage className="text-2xl mb-2 text-gray-600" />
              <span>Click to Upload Images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleNewImages} />
            </label>

            {newPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {newPreview.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} className="h-28 w-full rounded object-cover shadow" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full text-xs hidden group-hover:block"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-semibold rounded-lg shadow">
            Save Changes
          </button>

        </form>
      </div>
    </section>
  );
};

export default CorpListingEdit;
