export const dashboardStats = [
  { label: "Total Active Leads", value: "248", trend: "+18 this week" },
  { label: "Today Follow-ups", value: "37", trend: "9 high priority" },
  { label: "Booked Consultations", value: "21", trend: "64% contact rate" },
  { label: "Pending Testimonials", value: "12", trend: "4 need consent" }
];

export const recentLeads = [
  {
    id: "lead-1",
    patientName: "Anita Sharma",
    phone: "+91 98765 11111",
    treatmentInterest: "IVF Consultation",
    source: "Meta Campaign",
    status: "Contacted"
  },
  {
    id: "lead-2",
    patientName: "Rahul Verma",
    phone: "+91 98765 22222",
    treatmentInterest: "Orthopedic Surgery",
    source: "Google Search",
    status: "Appointment Booked"
  },
  {
    id: "lead-3",
    patientName: "Saira Khan",
    phone: "+91 98765 33333",
    treatmentInterest: "Skin Treatment",
    source: "Website Form",
    status: "Follow-up Due"
  }
];

export const todayFollowUps = [
  { id: "fu-1", patientName: "Nitin Jain", time: "11:30 AM", owner: "Pooja", priority: "High" },
  { id: "fu-2", patientName: "Seema Gupta", time: "01:00 PM", owner: "Rohit", priority: "Medium" },
  { id: "fu-3", patientName: "Moin Khan", time: "04:15 PM", owner: "Pooja", priority: "High" }
];

export const testimonialQueue = [
  {
    id: "tq-1",
    patientName: "Kavita Arora",
    type: "Video",
    doctor: "Dr. Mehta",
    status: "Consent Pending"
  },
  {
    id: "tq-2",
    patientName: "Arjun Singh",
    type: "Text",
    doctor: "Dr. Roy",
    status: "Under Review"
  },
  {
    id: "tq-3",
    patientName: "Neha Das",
    type: "Video",
    doctor: "Dr. Kapoor",
    status: "Approved"
  }
];

export const leadsBoard = [
  {
    id: "lb-1",
    patientName: "Aarti Yadav",
    city: "Lucknow",
    treatmentInterest: "Dental Implants",
    source: "Google Ads",
    assignedTo: "Ritu",
    pipelineStage: "Consultation Booked",
    nextFollowUp: "24 Mar, 5:00 PM"
  },
  {
    id: "lb-2",
    patientName: "Farhan Ali",
    city: "Kanpur",
    treatmentInterest: "Cardiology",
    source: "Meta Lead Form",
    assignedTo: "Vikas",
    pipelineStage: "Inquiry",
    nextFollowUp: "25 Mar, 10:30 AM"
  },
  {
    id: "lb-3",
    patientName: "Meenakshi Rao",
    city: "Delhi",
    treatmentInterest: "Maternity Care",
    source: "WhatsApp Campaign",
    assignedTo: "Pooja",
    pipelineStage: "Visited Hospital",
    nextFollowUp: "26 Mar, 12:00 PM"
  }
];

export const testimonialBoard = [
  {
    id: "tb-1",
    leadId: "lb-1",
    patientName: "Lokesh Bhat",
    treatment: "Hair Transplant",
    type: "Video",
    consent: "Pending",
    approval: "Under Review",
    owner: "Content Team"
  },
  {
    id: "tb-2",
    leadId: "lb-2",
    patientName: "Pallavi Sen",
    treatment: "IVF Journey",
    type: "Text",
    consent: "Received",
    approval: "Approved",
    owner: "Marketing Team"
  },
  {
    id: "tb-3",
    leadId: "lb-3",
    patientName: "Sameer Gupta",
    treatment: "Knee Replacement",
    type: "Image",
    consent: "Received",
    approval: "Under Review",
    owner: "Coordinator"
  }
];

export const testimonialDetails = [
  {
    id: "tb-1",
    leadId: "lb-1",
    patientName: "Lokesh Bhat",
    treatment: "Hair Transplant",
    type: "Video",
    requestStatus: "Requested",
    consent: "Pending",
    approval: "Under Review",
    publicationStatus: "Draft",
    owner: "Content Team",
    notes: "Patient interested hai but written consent abhi pending hai.",
    media: [
      {
        id: "media-1",
        fileName: "consult-room-clip.mp4",
        fileType: "video/mp4",
        fileUrl: "/mock-storage/consult-room-clip.mp4",
        department: "Dermatology",
        treatmentTag: "Hair Transplant",
        approvalStatus: "Pending",
        consentAttached: false
      }
    ]
  },
  {
    id: "tb-2",
    leadId: "lb-2",
    patientName: "Pallavi Sen",
    treatment: "IVF Journey",
    type: "Text",
    requestStatus: "Received",
    consent: "Received",
    approval: "Approved",
    publicationStatus: "Ready",
    owner: "Marketing Team",
    notes: "Text testimonial approved. Creative card ready karni hai.",
    media: [
      {
        id: "media-2",
        fileName: "ivf-review-copy.txt",
        fileType: "text/plain",
        fileUrl: "/mock-storage/ivf-review-copy.txt",
        department: "IVF",
        treatmentTag: "IVF Journey",
        approvalStatus: "Approved",
        consentAttached: true
      }
    ]
  },
  {
    id: "tb-3",
    leadId: "lb-3",
    patientName: "Sameer Gupta",
    treatment: "Knee Replacement",
    type: "Image",
    requestStatus: "Requested",
    consent: "Received",
    approval: "Under Review",
    publicationStatus: "Draft",
    owner: "Coordinator",
    notes: "Before/after images review me hain.",
    media: [
      {
        id: "media-3",
        fileName: "knee-recovery-photo.jpg",
        fileType: "image/jpeg",
        fileUrl: "/mock-storage/knee-recovery-photo.jpg",
        department: "Orthopedics",
        treatmentTag: "Knee Replacement",
        approvalStatus: "Under Review",
        consentAttached: true
      }
    ]
  }
] as const;

export const leadDetails = [
  {
    id: "lb-1",
    patientName: "Aarti Yadav",
    phone: "+91 9876511111",
    city: "Lucknow",
    treatmentInterest: "Dental Implants",
    source: "Google Ads",
    assignedTo: "Ritu",
    status: "Appointment Booked",
    pipelineStage: "Consultation Booked",
    nextFollowUp: "24 Mar, 5:00 PM",
    notes: [
      {
        id: "lb-1-note-1",
        noteText: "Patient ne Saturday consultation confirm ki hai.",
        callOutcome: "Appointment Confirmed",
        nextFollowUp: "24 Mar, 5:00 PM",
        createdAt: "23 Mar, 11:15 AM"
      },
      {
        id: "lb-1-note-2",
        noteText: "Initial inquiry website se aayi thi, implant pricing discuss hua.",
        callOutcome: "Interested",
        nextFollowUp: "23 Mar, 6:00 PM",
        createdAt: "22 Mar, 3:40 PM"
      }
    ]
  },
  {
    id: "lb-2",
    patientName: "Farhan Ali",
    phone: "+91 9876522222",
    city: "Kanpur",
    treatmentInterest: "Cardiology",
    source: "Meta Lead Form",
    assignedTo: "Vikas",
    status: "New",
    pipelineStage: "Inquiry",
    nextFollowUp: "25 Mar, 10:30 AM",
    notes: [
      {
        id: "lb-2-note-1",
        noteText: "Callback morning me maanga hai. Reports WhatsApp par bhejne wale hain.",
        callOutcome: "Call Back Later",
        nextFollowUp: "25 Mar, 10:30 AM",
        createdAt: "24 Mar, 9:10 AM"
      }
    ]
  },
  {
    id: "lb-3",
    patientName: "Meenakshi Rao",
    phone: "+91 9876533333",
    city: "Delhi",
    treatmentInterest: "Maternity Care",
    source: "WhatsApp Campaign",
    assignedTo: "Pooja",
    status: "Contacted",
    pipelineStage: "Visited Hospital",
    nextFollowUp: "26 Mar, 12:00 PM",
    notes: [
      {
        id: "lb-3-note-1",
        noteText: "Hospital visit complete. Family ko package details mail ki gayi.",
        callOutcome: "Interested",
        nextFollowUp: "26 Mar, 12:00 PM",
        createdAt: "24 Mar, 1:45 PM"
      }
    ]
  }
] as const;
