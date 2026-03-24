# Hospital CRM Web App MVP Blueprint

## 1. Product Vision

Ye app hospital ki marketing aur patient coordination team ke liye hai. Main purpose hai:

- marketing leads ko organize karna
- lead se patient conversion track karna
- follow-ups miss hone se bachana
- successful patients se testimonial collect karna
- photos, videos, consent, aur approval records ko centralize karna

## 2. Core Users

### Admin

- team access control
- reports dekhna
- approvals dena

### Marketing Executive

- new leads manage karna
- source-wise analysis dekhna
- campaign performance track karna

### Counselor / Coordinator

- patient se baat karna
- follow-up notes add karna
- appointment aur visit status update karna

### Content / Media Team

- testimonial media upload karna
- consent verify karna
- approved media ko publish-ready banana

## 3. Main Problems To Solve

### Lead Messiness

- same patient multiple times enter hota hai
- source unclear hota hai
- ownership unclear hoti hai

### Follow-up Failure

- callbacks miss ho jate hain
- no reminder system
- notes scattered rehte hain

### Testimonial Gap

- satisfied patient identify hota hai, but request nahi jati
- consent missing hota hai
- media files WhatsApp ya personal phones me reh jati hain

### Reporting Gap

- kaunsa ad source quality leads de raha hai, clear nahi hota
- kaunsa campaign testimonial-worthy patients la raha hai, track nahi hota

## 4. MVP Modules

## Module A: Lead Management

Fields:

- lead id
- patient name
- mobile number
- city
- treatment interest
- source
- campaign name
- assigned staff
- status
- lead created date

Lead statuses:

- New
- Contacted
- Follow-up Due
- Appointment Booked
- Visited
- Admitted
- Closed Won
- Closed Lost

Features:

- lead create/edit
- duplicate detection by phone
- source tagging
- filters by source, status, assignee, date

## Module B: Follow-up CRM

Features:

- each lead ke liye notes timeline
- next follow-up date
- reminder status
- call outcome logging
- reassignment to another staff member

Call outcomes:

- No Answer
- Interested
- Not Interested
- Call Back Later
- Appointment Confirmed
- Wrong Number

## Module C: Patient Conversion Pipeline

Purpose:

- marketing lead se actual patient conversion clear karna

Stages:

- Inquiry
- Consultation Booked
- Visited Hospital
- Treatment Started
- Discharged
- Eligible for Testimonial

## Module D: Testimonial Workflow

Purpose:

- happy patients ko structured way me testimonial flow me lana

Flow:

1. patient discharge ya success milestone complete
2. staff marks patient as testimonial-eligible
3. testimonial request sent
4. consent collected
5. media uploaded
6. internal approval
7. ready for marketing use

Fields:

- testimonial type: text / video / image
- request date
- request status
- consent status
- approval status
- publication status

Statuses:

- Pending Request
- Requested
- Received
- Consent Pending
- Under Review
- Approved
- Rejected
- Published

## Module E: Media Library

Purpose:

- testimonial aur campaign media ko searchable banana

Features:

- upload photo/video/document
- tag by doctor, department, treatment, campaign
- link media with patient/testimonial
- approval label
- consent proof attachment

## 5. Dashboard Screens

### 1. Admin Dashboard

Widgets:

- total leads
- leads by source
- today follow-ups
- booked appointments
- admitted patients
- pending testimonials
- approved testimonials

### 2. Leads Page

- table view
- filter/search
- add lead
- assign staff
- quick status update

### 3. Lead Detail Page

- patient basic profile
- source details
- timeline of notes
- follow-up schedule
- conversion stage
- testimonial eligibility

### 4. Testimonials Page

- pending requests
- received testimonials
- missing consent
- ready for approval
- approved media

### 5. Media Library Page

- cards/list view
- treatment and department filters
- search by patient / tag / doctor

## 6. AI Features For Later Phase

Ye features MVP ke baad add karna better hoga:

- lead conversation summary
- smart follow-up suggestions
- Hindi/English testimonial text cleanup
- review request message generation
- low-quality or duplicate media detection

## 7. Compliance Notes

Hospital use case me ye mandatory sochna chahiye:

- testimonial bina consent use na ho
- sensitive patient data limited access me ho
- media approval audit trail ho
- who changed what, log maintain ho

## 8. MVP Priorities

### Must Have

- login
- role-based access
- lead CRUD
- follow-up reminders
- patient pipeline
- testimonial request tracking
- consent status tracking
- media upload and tagging

### Good To Have

- dashboard charts
- duplicate merge
- export CSV
- WhatsApp integration

### Later

- full marketing analytics
- AI automation
- multi-hospital support

## 9. Suggested User Flow

1. marketing se lead aaya
2. lead assign hua
3. counselor call note add karta hai
4. appointment book hota hai
5. patient visit/admit hota hai
6. treatment/discharge ke baad patient testimonial-eligible mark hota hai
7. consent collect hota hai
8. video/text testimonial upload hota hai
9. admin approve karta hai
10. marketing team use karti hai

## 10. Suggested Phase 1 Build

Week 1:

- project setup
- auth
- lead model
- leads list/detail UI

Week 2:

- follow-up notes
- reminder flow
- pipeline stage updates

Week 3:

- testimonial module
- consent tracking
- media upload integration

Week 4:

- admin dashboard
- reporting basics
- cleanup and deployment
