import { leadDetails, leadsBoard } from "@/data/mock-data";
import { getMockLeadOverride } from "@/lib/mock-store";

export type LeadListItem = {
  id: string;
  patientName: string;
  city: string;
  treatmentInterest: string;
  source: string;
  assignedTo: string;
  pipelineStage: string;
  nextFollowUp: string;
};

export type LeadNoteItem = {
  id: string;
  noteText: string;
  callOutcome: string;
  nextFollowUp: string;
  createdAt: string;
};

export type LeadMediaItem = {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  category: "image" | "video" | "document" | "consent";
  department: string;
  treatmentTag: string;
  approvalStatus: string;
  consentAttached: boolean;
};

export type LeadDetailItem = {
  id: string;
  patientName: string;
  phone: string;
  city: string;
  treatmentInterest: string;
  source: string;
  assignedTo: string;
  status: string;
  pipelineStage: string;
  nextFollowUp: string;
  notes: LeadNoteItem[];
  media: LeadMediaItem[];
};

function getMediaCategory(fileType: string, consentAttached: boolean): LeadMediaItem["category"] {
  if (consentAttached) {
    return "consent";
  }

  if (fileType.startsWith("image/")) {
    return "image";
  }

  if (fileType.startsWith("video/")) {
    return "video";
  }

  return "document";
}

export async function getLeadList(): Promise<LeadListItem[]> {
  if (!process.env.DATABASE_URL) {
    const items = await Promise.all(
      leadsBoard.map(async (lead) => {
        const override = await getMockLeadOverride(lead.id);
        return {
          id: lead.id,
          patientName: override?.patientName ?? lead.patientName,
          city: override?.city ?? lead.city,
          treatmentInterest: override?.treatmentInterest ?? lead.treatmentInterest,
          source: override?.source ?? lead.source,
          assignedTo: override?.assignedTo ?? lead.assignedTo,
          pipelineStage: override?.pipelineStage ?? lead.pipelineStage,
          nextFollowUp: override?.nextFollowUp ?? lead.nextFollowUp
        };
      })
    );

    return items;
  }

  const { prisma } = await import("@/lib/prisma");
  const leads = await prisma.lead.findMany({
    include: {
      source: true,
      assignedTo: true,
      notes: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return leads.map((lead: (typeof leads)[number]) => ({
    id: lead.id,
    patientName: lead.patientName,
    city: lead.city ?? "-",
    treatmentInterest: lead.treatmentInterest ?? "-",
    source: lead.source?.name ?? "Unknown",
    assignedTo: lead.assignedTo?.fullName ?? "Unassigned",
    pipelineStage: lead.pipelineStage,
    nextFollowUp: lead.notes[0]?.nextFollowUpAt
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(lead.notes[0].nextFollowUpAt)
      : "Not set"
  }));
}

export async function getLeadDetail(id: string): Promise<LeadDetailItem | null> {
  if (!process.env.DATABASE_URL) {
    const lead = leadDetails.find((item) => item.id === id);
    if (!lead) {
      return null;
    }

    const override = await getMockLeadOverride(id);

    return {
      id: lead.id,
      patientName: override?.patientName ?? lead.patientName,
      phone: override?.phone ?? lead.phone,
      city: override?.city ?? lead.city,
      treatmentInterest: override?.treatmentInterest ?? lead.treatmentInterest,
      source: override?.source ?? lead.source,
      assignedTo: override?.assignedTo ?? lead.assignedTo,
      status: override?.status ?? lead.status,
      pipelineStage: override?.pipelineStage ?? lead.pipelineStage,
      nextFollowUp: override?.nextFollowUp ?? lead.nextFollowUp,
      notes: [...lead.notes],
      media: []
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      source: true,
      assignedTo: true,
      notes: {
        orderBy: {
          createdAt: "desc"
        }
      },
      mediaAssets: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!lead) {
    return null;
  }

  return {
    id: lead.id,
    patientName: lead.patientName,
    phone: lead.phone,
    city: lead.city ?? "-",
    treatmentInterest: lead.treatmentInterest ?? "-",
    source: lead.source?.name ?? "Unknown",
    assignedTo: lead.assignedTo?.fullName ?? "Unassigned",
    status: lead.status,
    pipelineStage: lead.pipelineStage,
    nextFollowUp: lead.notes[0]?.nextFollowUpAt
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(lead.notes[0].nextFollowUpAt)
      : "Not set",
    notes: lead.notes.map((note) => ({
      id: note.id,
      noteText: note.noteText,
      callOutcome: note.callOutcome ?? "Not logged",
      nextFollowUp: note.nextFollowUpAt
        ? new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          }).format(note.nextFollowUpAt)
        : "Not set",
      createdAt: new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(note.createdAt)
    })),
    media: lead.mediaAssets.map((asset) => ({
      id: asset.id,
      fileName: asset.fileName,
      fileType: asset.fileType,
      fileUrl: asset.fileUrl,
      category: getMediaCategory(asset.fileType, asset.consentAttached),
      department: asset.department ?? "-",
      treatmentTag: asset.treatmentTag ?? "-",
      approvalStatus: asset.approvalStatus,
      consentAttached: asset.consentAttached
    }))
  };
}
