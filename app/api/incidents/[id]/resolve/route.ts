import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: {
    params: { id: string }
}) {
    const incidentId = Number(params.id);
    if (isNaN(incidentId)) {
        return new NextResponse("Invalid ID", { status: 400 });
    }

    try {
        const existing = await prisma.incident.findUnique({
            where: { id: incidentId },
        });

        if (!existing) {
            return new NextResponse("Incident not found", { status: 404 });
        }

        const updated = await prisma.incident.update({
            where: { id: incidentId },
            data: { resolved: !existing.resolved },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/incidents/:id/resolve error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
