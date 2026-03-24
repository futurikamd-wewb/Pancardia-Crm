import { testimonialBoard, testimonialDetails } from "@/data/mock-data";
import { getMockMediaAssets, getMockTestimonialOverride } from "@/lib/mock-store";

export type TestimonialListItem = {
  id: string;
  leadId: string;
  patientName: string;
  treatment: string;
  type: string;
  consent: string;
  approval: string;
  owner: string;
};

export type MediaAssetListItem = {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  department: string;
  treatmentTag: string;
  approvalStatus: string;
  consentAttached: boolean;
};

export type TestimonialDetailItem = {
  id: string;
  leadId: string;
  patientName: string;
  treatment: string;
  type: string;
  requestStatus: string;
  consent: string;
  approval: string;
  publicationStatus: string;
  owner: string;
  notes: string;
  media: MediaAssetListItem[];
};

export async function getTestimonialList(): Promise<TestimonialListItem[]> {
  if (!process.env.DATABASE_URL) {
    const items = await Promise.all(
      testimonialBoard.map(async (item) => {
        const override = await getMockTestimonialOverride(item.id);
        return {
          id: item.id,
          leadId: item.leadId,
          patientName: item.patientName,
          treatment: item.treatment,
          type: override?.type ?? item.type,
          consent: override?.consent ?? item.consent,
          approval: override?.approval ?? item.approval,
          owner: override?.owner ?? item.owner
        };
      })
    );
    return items;
  }

  const { prisma } = await import("@/lib/prisma");
  const testimonials = await prisma.testimonial.findMany({
    include: {
      lead: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return testimonials.map((item: (typeof testimonials)[number]) => ({
    id: item.id,
    leadId: item.leadId,
    patientName: item.lead.patientName,
    treatment: item.lead.treatmentInterest ?? "-",
    type: item.testimonialType ?? "Unknown",
    consent: item.consentStatus,
    approval: item.approvalStatus,
    owner: "Marketing Team"
  }));
}

export async function getTestimonialDetail(id: string): Promise<TestimonialDetailItem | null> {
  if (!process.env.DATABASE_URL) {
    const testimonial = testimonialDetails.find((item) => item.id === id);
    if (!testimonial) {
      return null;
    }

    const runtimeMedia = await getMockMediaAssets(id);
    const override = await getMockTestimonialOverride(id);

    return {
      id: testimonial.id,
      leadId: testimonial.leadId,
      patientName: testimonial.patientName,
      treatment: testimonial.treatment,
      type: override?.type ?? testimonial.type,
      requestStatus: override?.requestStatus ?? testimonial.requestStatus,
      consent: override?.consent ?? testimonial.consent,
      approval: override?.approval ?? testimonial.approval,
      publicationStatus: override?.publicationStatus ?? testimonial.publicationStatus,
      owner: override?.owner ?? testimonial.owner,
      notes: override?.notes ?? testimonial.notes,
      media: [
        ...runtimeMedia.map((asset) => ({
          id: asset.id,
          fileName: asset.fileName,
          fileType: asset.fileType,
          fileUrl: asset.fileUrl,
          department: asset.department,
          treatmentTag: asset.treatmentTag,
          approvalStatus: asset.approvalStatus,
          consentAttached: asset.consentAttached
        })),
        ...testimonial.media
      ]
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: {
      lead: true,
      mediaAssets: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!testimonial) {
    return null;
  }

  return {
    id: testimonial.id,
    leadId: testimonial.leadId,
    patientName: testimonial.lead.patientName,
    treatment: testimonial.lead.treatmentInterest ?? "-",
    type: testimonial.testimonialType ?? "Unknown",
    requestStatus: testimonial.requestStatus,
    consent: testimonial.consentStatus,
    approval: testimonial.approvalStatus,
    publicationStatus: testimonial.publicationStatus,
    owner: "Marketing Team",
    notes: testimonial.notes ?? "",
    media: testimonial.mediaAssets.map((asset) => ({
      id: asset.id,
      fileName: asset.fileName,
      fileType: asset.fileType,
      fileUrl: asset.fileUrl,
      department: asset.department ?? "-",
      treatmentTag: asset.treatmentTag ?? "-",
      approvalStatus: asset.approvalStatus,
      consentAttached: asset.consentAttached
    }))
  };
}
