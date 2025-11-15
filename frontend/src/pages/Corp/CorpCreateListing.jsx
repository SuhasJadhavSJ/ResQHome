// frontend/src/pages/Corp/CorpCreateListing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";

const CorpCreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    sex: "unknown",
    city: "",
    address: "",
    description: "",
  });
  const [images, setImages] = useState([]); // File objects
  const [preview, setPreview] = useState([]); // data URLs
  const [medicalHistory, setMedicalHistory] = useState([{ note: "" }]);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8); // limit 8
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageAt = (idx) => {
    setImages(img => img.filter((_, i) => i !== idx));
    setPreview(p => p.filter((_, i) => i !== idx));
  };

  const addMedicalRow = () => setMedicalHistory(prev => [...prev, { note: "" }]);
  const updateMedical = (i, val) => {
    setMedicalHistory(prev => prev.map((m, idx) => idx === i ? { note: val } : m));
  };
  const removeMedical = (i) => setMedicalHistory(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Name is required");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("type", form.type);
      fd.append("breed", form.breed);
      fd.append("age", form.age);
      fd.append("sex", form.sex);
      fd.append("city", form.city);
      fd.append("address", form.address);
      fd.append("description", form.description);
      fd.append("medicalHistory", JSON.stringify(medicalHistory.filter(m => m.note.trim())));
      images.forEach((f) => fd.append("images", f));

      const res = await fetch("http://localhost:8000/api/corp/listings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create listing");

      toast.success("Listing created");
      navigate("/corp/listings");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-6 ml-20 max-w-4xl">
      <h1 className="text-3xl font-bold text-teal-900 mb-6">List Animal for Adoption</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange} required placeholder="Name" className="border p-3 rounded" />
          <input name="type" value={form.type} onChange={onChange} placeholder="Type (Dog/Cat)" className="border p-3 rounded" />
          <input name="breed" value={form.breed} onChange={onChange} placeholder="Breed" className="border p-3 rounded" />
          <input name="age" value={form.age} onChange={onChange} placeholder="Age (e.g. 2 years)" className="border p-3 rounded" />
          <select name="sex" value={form.sex} onChange={onChange} className="border p-3 rounded">
            <option value="unknown">Sex: Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input name="city" value={form.city} onChange={onChange} placeholder="City" className="border p-3 rounded" />
        </div>

        <input name="address" value={form.address} onChange={onChange} placeholder="Address (optional)" className="border p-3 rounded w-full" />

        <textarea name="description" value={form.description} onChange={onChange} placeholder="Describe animal, temperament, special needs..." className="border p-3 rounded w-full" rows={4} />

        <div>
          <label className="block text-sm font-medium mb-2">Images (max 8)</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded">
              <FaImage /> Add Images
              <input type="file" accept="image/*" multiple onChange={onImagesChange} className="hidden" />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              {preview.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="" className="h-20 w-28 object-cover rounded" />
                  <button type="button" onClick={() => removeImageAt(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Medical History</h4>
          {medicalHistory.map((m, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input value={m.note} onChange={(e) => updateMedical(i, e.target.value)} placeholder="Note" className="flex-1 border p-2 rounded" />
              <button type="button" onClick={() => removeMedical(i)} className="bg-red-500 text-white px-3 py-1 rounded"><FaTrash/></button>
            </div>
          ))}
          <button type="button" onClick={addMedicalRow} className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded">
            <FaPlus /> Add Entry
          </button>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-teal-700 text-white px-6 py-2 rounded">
            {loading ? "Listing..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CorpCreateListing;
