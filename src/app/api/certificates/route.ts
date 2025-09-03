import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all certificates
export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({
      orderBy: { yearGet: "desc" },
    });
    return NextResponse.json(certs);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// CREATE new certificate
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const cert = await prisma.certificate.create({
      data: {
        publisher: data.publisher,
        yearGet: parseInt(data.yearGet), // ✅ convert ke Int
        yearEnd: parseInt(data.yearEnd), // ✅ convert ke Int
        link: data.link,
        image: data.image,
      },
    });

    return new Response(JSON.stringify(cert), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create certificate" }), { status: 500 });
  }
}
