
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET single certificate
export async function GET(req: NextRequest, { params }: any) {
  const { id } = params;

  const cert = await prisma.certificate.findUnique({
    where: { id },
  });

  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(cert);
}

// UPDATE certificate
export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;
  try {
    const data = await req.json();
    const cert = await prisma.certificate.update({
      where: { id },
      data: {
        publisher: data.publisher,
        yearGet: parseInt(data.yearGet),
        yearEnd: parseInt(data.yearEnd),
        link: data.link,
        image: data.image,
        description: data.description,
        title: data.title,
      },
    });
    return NextResponse.json(cert);
  } catch {
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// DELETE certificate
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    await prisma.certificate.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}
