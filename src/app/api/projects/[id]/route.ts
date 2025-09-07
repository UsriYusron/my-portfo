import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// get single project
export async function GET(req: NextRequest, { params }: any) {
    const { id } = params;

    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(project);
}

// Definisikan tipe untuk context di sini
type RouteContext = {
    params: {
        id: any; // Gunakan 'string' daripada 'any' untuk type safety
    };
};

// UPDATE project
export async function PUT(req: NextRequest, context: RouteContext) {
    const { id } = context.params;

    try {
        const data = await req.json();
        const projects = await prisma.project.update({
            where: { id },
            data: {
                description: data.description,
                name: data.name,
                image: data.image,
                link: data.link,
                tech: data.tech,
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error("UPDATE_ERROR:", error); // Tambahkan log untuk debugging
        return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
    }
}

// DELETE project
export async function DELETE(req: NextRequest, context: RouteContext) {
    const { id } = context.params;

    try {
        await prisma.project.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
    }
}