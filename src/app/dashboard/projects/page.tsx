"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2Icon, PencilIcon, MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  tech: string[];
}

export default function CertificatesPage() {
  const [Projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: "", description: "", image: "", link: "", tech: "" });
  const [editId, setEditId] = useState<string | null>(null);

  // 1. Buat state untuk melacak visibilitas, nilai awalnya false (tersembunyi)
  const [showProjects, setShowProjects] = useState(false);

  // State untuk mengelola dropdown mana yang sedang terbuka
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (projectID: string) => {
    setOpenDropdownId(openDropdownId === projectID ? null : projectID);
  };

  // Ambil semua data
  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // Tambah atau Update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      tech: form.tech.split(",").map(t => t.trim()), // convert ke array
    };

    if (editId) {
      await fetch(`/api/projects/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({ name: "", description: "", image: "", link: "", tech: "" });
    fetchProjects();
  }

  // Delete
  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  // Edit
  function handleEdit(projects: Project) {
    setEditId(projects.id);
    setForm({
      description: projects.description,
      name: projects.name,
      image: projects.image,
      link: projects.link,
      tech: projects.tech ? projects.tech.join(", ") : "", // gabung array ke string
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
        <div className="bg-white sm:p-8 rounded-xl p-4 shadow-md mb-10">

          {/* Header untuk form */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-lime-400 p-2 rounded-lg">
              {/* Anda bisa menambahkan ikon di sini jika mau */}
              {editId ? <PencilIcon /> : <PlusIcon />}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editId ? "Update Certificate" : "Add New Project"}
            </h2>
          </div>

          {/* Form dengan layout grid yang responsif */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

            {/* Input Publisher */}
            <div className="md:col-span-2">
              <label htmlFor="publisher" className="block text-sm font-medium text-slate-700 mb-1">
                Judul
              </label>
              <input
                id="publisher"
                type="text"
                placeholder="e.g., Web Portfolio With Next.js"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-black"
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
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-black">

              </textarea>
            </div>

            {/* Tech/Stack */}
            <div className="md:col-span-2">
              <label htmlFor="tech" className="block text-sm font-medium text-slate-700 mb-1">
                Tech / Stack
              </label>
              <input
                id="tech"
                type="text"
                placeholder="e.g., Next.js, Tailwind, MongoDB"
                value={form.tech || ""}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-black"
              />
              <p className="text-xs text-slate-500 mt-1">
                Pisahkan dengan koma, contoh: <span className="italic">Next.js, Tailwind, MongoDB</span>
              </p>
            </div>


            {/* Input Link & URL Gambar */}
            <div className="md:col-span-2">
              <label htmlFor="link" className="block text-sm font-medium text-slate-700 mb-1">
                Project Link
              </label>
              <input
                id="link"
                type="text"
                placeholder="https://project-link.github/..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-black"
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
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-black"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition text-black"
              >
                {editId ? "Update Project" : "Add Project"}
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
          onClick={() => setShowProjects(!showProjects)} // Mengubah dari false -> true,
          className="mb-5"
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">My Projects</h1>
            <p className="mt-1 text-slate-500">{showProjects ? "Koleksi semua projek dan pencapaian Anda." : "Klik untuk menampilkan koleksi projek."}</p>
          </header>
        </Button>

        {/* 3. Gunakan state untuk menampilkan div secara kondisional */}
        {showProjects && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">

                {/* Gambar Kartu */}
                <div className="relative h-48 w-full">
                  <Image src={project.image} alt={project.name} layout="fill" objectFit="cover" />
                  <div className="absolute top-0 right-0 p-2">
                    <div className="relative">
                      <button onClick={() => toggleDropdown(project.id)} className="p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition text-black">
                        <MoreVerticalIcon />
                      </button>
                      {openDropdownId === project.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-10 py-1">
                          <button onClick={() => { handleEdit(project); toggleDropdown(project.id); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            <PencilIcon /> Edit
                          </button>
                          <button onClick={() => { handleDelete(project.id); toggleDropdown(project.id); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2Icon /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-5">
                  <p className="text-sm font-semibold text-indigo-600">{project.name}</p>
                  <h1 className="mt-1 text-sm text-slate-800 truncate" title={project.description}>
                    {project.description}
                  </h1>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 group-hover:underline">
                    Link Project {/* <ExternalLinkIcon /> */}
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
