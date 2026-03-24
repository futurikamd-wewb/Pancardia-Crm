import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const counselors = [
    {
      fullName: "Admin User",
      email: "admin@hospitalcrm.local",
      role: "ADMIN",
      passwordHash: "admin123"
    },
    {
      fullName: "Marketing Lead",
      email: "marketing@hospitalcrm.local",
      role: "MARKETING",
      passwordHash: "market123"
    },
    {
      fullName: "Lead Counselor",
      email: "counselor@hospitalcrm.local",
      role: "COUNSELOR",
      passwordHash: "counsel123"
    },
    {
      fullName: "Content Manager",
      email: "content@hospitalcrm.local",
      role: "CONTENT",
      passwordHash: "content123"
    },
    { fullName: "Pooja", email: "pooja@hospitalcrm.local", role: "COUNSELOR", passwordHash: "pooja123" },
    { fullName: "Ritu", email: "ritu@hospitalcrm.local", role: "COUNSELOR", passwordHash: "ritu123" },
    { fullName: "Vikas", email: "vikas@hospitalcrm.local", role: "COUNSELOR", passwordHash: "vikas123" }
  ];

  for (const user of counselors) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { fullName: user.fullName, role: user.role, passwordHash: user.passwordHash },
      create: user
    });
  }

  const source = await prisma.leadSource.upsert({
    where: { name: "Meta Lead Form" },
    update: { channelType: "Digital" },
    create: {
      name: "Meta Lead Form",
      channelType: "Digital"
    }
  });

  const pooja = await prisma.user.findUnique({
    where: { email: "pooja@hospitalcrm.local" }
  });

  const existingLead = await prisma.lead.findFirst({
    where: {
      phone: "+91 9876512345"
    }
  });

  if (!existingLead) {
    await prisma.lead.create({
      data: {
        patientName: "Anita Sharma",
        phone: "+91 9876512345",
        city: "Lucknow",
        treatmentInterest: "IVF Consultation",
        sourceId: source.id,
        assignedToId: pooja?.id,
        status: "Contacted",
        pipelineStage: "Consultation Booked",
        notes: {
          create: {
            noteText: "Patient interested hai, kal doctor consultation confirm karni hai.",
            callOutcome: "Interested",
            nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        },
        testimonials: {
          create: {
            requestStatus: "Requested",
            testimonialType: "Text",
            consentStatus: "Pending",
            approvalStatus: "Pending",
            publicationStatus: "Draft",
            notes: "Treatment complete hone ke baad follow-up karna hai."
          }
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
