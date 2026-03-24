import { getLeadList } from "@/lib/repositories/leads";
import { getTestimonialList } from "@/lib/repositories/testimonials";
import { recentLeads, todayFollowUps, testimonialQueue } from "@/data/mock-data";

export type DashboardStat = {
  label: string;
  value: string;
  trend: string;
};

export type DashboardLead = {
  id: string;
  patientName: string;
  phone: string;
  treatmentInterest: string;
  source: string;
  status: string;
};

export type DashboardFollowUp = {
  id: string;
  patientName: string;
  time: string;
  owner: string;
  priority: string;
};

export type DashboardQueueItem = {
  id: string;
  patientName: string;
  type: string;
  doctor: string;
  status: string;
};

export async function getDashboardData() {
  const [leads, testimonials] = await Promise.all([getLeadList(), getTestimonialList()]);

  const bookedCount = leads.filter((lead) =>
    ["Consultation Booked", "Visited Hospital", "Treatment Started"].includes(lead.pipelineStage)
  ).length;
  const pendingTestimonials = testimonials.filter(
    (item) => item.consent === "Pending" || item.approval !== "Approved"
  ).length;
  const consentPendingCount = testimonials.filter((item) => item.consent === "Pending").length;

  const stats: DashboardStat[] = [
    {
      label: "Total Active Leads",
      value: String(leads.length),
      trend: `${leads.filter((lead) => lead.pipelineStage === "Inquiry").length} fresh inquiries`
    },
    {
      label: "Today Follow-ups",
      value: String(todayFollowUps.length),
      trend: `${todayFollowUps.filter((item) => item.priority === "High").length} high priority`
    },
    {
      label: "Booked Consultations",
      value: String(bookedCount),
      trend: `${Math.max(leads.length, 1) ? Math.round((bookedCount / Math.max(leads.length, 1)) * 100) : 0}% pipeline progress`
    },
    {
      label: "Pending Testimonials",
      value: String(pendingTestimonials),
      trend: `${consentPendingCount} need consent`
    }
  ];

  const freshLeads: DashboardLead[] = process.env.DATABASE_URL
    ? leads.slice(0, 3).map((lead) => ({
        id: lead.id,
        patientName: lead.patientName,
        phone: "Open lead detail",
        treatmentInterest: lead.treatmentInterest,
        source: lead.source,
        status: lead.pipelineStage
      }))
    : recentLeads;

  const queue: DashboardQueueItem[] = process.env.DATABASE_URL
    ? testimonials.slice(0, 3).map((item) => ({
        id: item.id,
        patientName: item.patientName,
        type: item.type,
        doctor: item.owner,
        status: item.consent === "Pending" ? "Consent Pending" : item.approval
      }))
    : testimonialQueue;

  const followUps: DashboardFollowUp[] = todayFollowUps;

  return {
    stats,
    freshLeads,
    followUps,
    queue
  };
}

