import Image from "next/image";
import { Trash2Icon, PencilIcon, MoreVerticalIcon } from 'lucide-react';

interface Certificate {
  id: string;
  publisher: string;
  yearGet: string;
  yearEnd: string;
  link: string;
  image: string;
  description: string;
  title: string;
}

interface CertificateListProps {
  certs: Certificate[];
  handleEdit: (cert: Certificate) => void;
  handleDelete: (id: string) => void;
  toggleDropdown: (certId: string) => void;
  openDropdownId: string | null;
}

export default function CertificateList({ certs, handleEdit, handleDelete, toggleDropdown, openDropdownId }: CertificateListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {certs.map((cert) => (
        <div key={cert.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">

          {/* Gambar Kartu */}
          <div className="relative h-48 w-full">
            <Image src={cert.image} alt={cert.publisher} fill className="object-cover" />
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
  );
}
