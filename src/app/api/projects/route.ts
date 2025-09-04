import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// get all certificate
export async function GET() {
    try {
        const projets = await prisma.project.findMany();
        return NextResponse.json(projets);
    } catch (error) {
        console.log(error);
        return new NextResponse("Database Error", { status: 500 });
    }
}

// create new project 
export async function POST(req: Request) {
    try {
        const data = await req.json();

        const projects = await prisma.project.create({
            data: {
                description: data.description,
                name: data.name,
                image: data.image,
                link: data.link,
            },
        });

        return new Response(JSON.stringify(projects), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create certificate" }), { status: 500 });
    }
}