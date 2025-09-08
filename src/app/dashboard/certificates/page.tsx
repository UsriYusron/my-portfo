"use client";
import { useEffect, useState } from "react";

import { Trash2Icon, PencilIcon, MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [form, setForm] = useState({ publisher: "", yearGet: "", yearEnd: "", link: "", image: "", description: "", title: "" });
  const [editId, setEditId] = useState<string | null>(null);

  // 1. Buat state untuk melacak visibilitas, nilai awalnya false (tersembunyi)
  const [showCerts, setShowCerts] = useState(false);

  // State untuk mengelola dropdown mana yang sedang terbuka
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (certId: any) => {
    setOpenDropdownId(openDropdownId === certId ? null : certId);
  };

  // Ambil semua data
  async function fetchCerts() {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    setCerts(data);
  }

  useEffect(() => {
    fetchCerts();
  }, []);

  // Tambah atau Update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/certificates/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ publisher: "", yearGet: "", yearEnd: "", link: "", image: "", description: "", title: "" });
    fetchCerts();
  }

  // Delete
  async function handleDelete(id: string) {
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    fetchCerts();
  }

  // Edit
  function handleEdit(cert: any) {
    setEditId(cert.id);
    setForm({
      publisher: cert.publisher,
      yearGet: cert.yearGet,
      yearEnd: cert.yearEnd,
      link: cert.link,
      image: cert.image,
      description: cert.description,
      title: cert.title,
    });
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">

        {/* =================================
      BAGIAN FORM
      =================================
      Form dibungkus dalam 'card' putih dengan shadow untuk memisahkannya 
      secara visual dari daftar di bawah.
    */}
        <div className="bg-white sm:p-8 rounded-xl shadow-md mb-10 p-4 text-black">

          {/* Header untuk form */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-lime-400 p-2 rounded-lg">
              {/* Anda bisa menambahkan ikon di sini jika mau */}
              {editId ? <PencilIcon /> : <PlusIcon />}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editId ? "Update Certificate" : "Add New Certificate"}
            </h2>
          </div>

          {/* Form dengan layout grid yang responsif */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">


            {/* title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Judul
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Belajar Dasar Pemrograman Web"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Input Publisher */}
            <div className="md:col-span-2">
              <label htmlFor="publisher" className="block text-sm font-medium text-slate-700 mb-1">
                Publisher
              </label>
              <input
                id="publisher"
                type="text"
                placeholder="e.g., Google, Dicoding"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Input Tahun Mulai */}
            <div>
              <label htmlFor="yearGet" className="block text-sm font-medium text-slate-700 mb-1">
                Start Year
              </label>
              <input
                id="yearGet"
                type="number"
                placeholder="2023"
                value={form.yearGet}
                onChange={(e) => setForm({ ...form, yearGet: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Input Tahun Selesai */}
            <div>
              <label htmlFor="yearEnd" className="block text-sm font-medium text-slate-700 mb-1">
                End Year (Optional)
              </label>
              <input
                id="yearEnd"
                type="number"
                placeholder="2025"
                value={form.yearEnd || ''}
                onChange={(e) => setForm({ ...form, yearEnd: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* deskripsi */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="" id=""
                cols={30} rows={5}
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition">

              </textarea>
            </div>

            {/* Input Link & URL Gambar */}
            <div className="md:col-span-2">
              <label htmlFor="link" className="block text-sm font-medium text-slate-700 mb-1">
                Credential Link
              </label>
              <input
                id="link"
                type="text"
                placeholder="https://credential.link/..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                id="image"
                type="text"
                placeholder="https://image.url/..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                {editId ? "Update Certificate" : "Add Certificate"}
              </button>

              {/* Tombol Batal hanya muncul saat mode edit */}
              {editId && (
                <button
                  type="button"
                  // onClick={handleCancelEdit} // Asumsi Anda punya fungsi ini
                  className="text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <Button
          variant="link"
          onClick={() => setShowCerts(!showCerts)} // Mengubah dari false -> true,
          className="mb-5"
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">My Certificates</h1>
            <p className="mt-1 text-slate-500">{showCerts ? "Koleksi semua sertifikasi dan pencapaian Anda." : "Klik untuk menampilkan koleksi sertifikasi."}</p>
          </header>
        </Button>

        {/* 3. Gunakan state untuk menampilkan div secara kondisional */}
        {showCerts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">

                {/* Gambar Kartu */}
                <div className="relative">
                  <img src={cert.image} alt={cert.publisher} className="w-full h-48 object-cover" />
                  <div className="absolute top-0 right-0 p-2">
                    <div className="relative">
                      <button onClick={() => toggleDropdown(cert.id)} className="p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition">
                        <MoreVerticalIcon />
                      </button>
                      {openDropdownId === cert.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-10 py-1">
                          <button onClick={() => { handleEdit(cert); toggleDropdown(cert.id); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <PencilIcon /> Edit
                          </button>
                          <button onClick={() => { handleDelete(cert.id); toggleDropdown(cert.id); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2Icon /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-5">
                  <p className="text-sm font-semibold text-indigo-600">{cert.publisher}</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-800 truncate" title={cert.title}>
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    {/* <CalendarIcon /> */}
                    <span>{cert.yearGet} - {cert.yearEnd || 'Present'}</span>
                  </div>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 group-hover:underline">
                    Lihat Kredensial {/* <ExternalLinkIcon /> */}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
