import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single certificate
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cert = await prisma.certificate.findUnique({
    where: { id: params.id },
  });
  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cert);
}

// UPDATE certificate
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const cert = await prisma.certificate.update({
      where: { id: params.id },
      data: {
        publisher: data.publisher,
        yearGet: parseInt(data.yearGet),
        yearEnd: parseInt(data.yearEnd),
        link: data.link,
        image: data.image,
      },
    });
    return NextResponse.json(cert);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// DELETE certificate
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.certificate.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}
