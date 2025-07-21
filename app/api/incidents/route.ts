import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const resolvedParam = req.nextUrl.searchParams.get("resolved");
    const resolved = resolvedParam === "true" ? true : resolvedParam === "false" ? false : undefined;

    try {
        const incidents = await prisma.incident.findMany({
            where: {
                resolved: resolved !== undefined ? { resolved } : {}
            },
            orderBy: {
                tsStart: "desc",
            },
            include: {
                camera: true,
            },
        });

        return NextResponse.json({ incidents });
    } catch (error) {
        console.error("GET /api/incidents error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
