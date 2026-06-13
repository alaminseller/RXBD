+-----------------------------------------------------------------------+
| +------------------------------------------------------------------+  |
| | **RxBD**                                                         |  |
| |                                                                  |  |
| | **Master Project Blueprint**                                     |  |
| |                                                                  |  |
| | Digital Prescription Platform for Bangladesh                     |  |
| +------------------------------------------------------------------+  |
|                                                                       |
| Version 2.0 --- Comprehensive Rewrite                                 |
|                                                                       |
| Prepared by: alaminnetwork4@gmail.com                                 |
|                                                                       |
| Date: June 14, 2026                                                   |
|                                                                       |
| Classification: Confidential                                          |
+-----------------------------------------------------------------------+

**Table of Contents**

[1. Executive Summary [1](#_Toc100000)](#_Toc100000)

> [1.1 Key Differentiators [2](#_Toc100001)](#_Toc100001)

[2. Tech Stack & Architecture [3](#_Toc100002)](#_Toc100002)

> [2.1 Frontend Stack [3](#_Toc100003)](#_Toc100003)
>
> [2.2 Backend & Infrastructure [3](#_Toc100004)](#_Toc100004)
>
> [2.3 Architecture Overview [3](#_Toc100005)](#_Toc100005)
>
> [2.4 Architecture Diagram (Textual Description)
> [4](#_Toc100006)](#_Toc100006)
>
> [2.5 Observability & Monitoring [4](#_Toc100007)](#_Toc100007)
>
> [2.5.1 Error Tracking [4](#_Toc100008)](#_Toc100008)
>
> [2.5.2 Analytics [5](#_Toc100009)](#_Toc100009)
>
> [2.5.3 Uptime Monitoring [5](#_Toc100010)](#_Toc100010)
>
> [2.6 Data Resilience [5](#_Toc100011)](#_Toc100011)
>
> [2.6.1 Local-First Auto-Save [5](#_Toc100012)](#_Toc100012)
>
> [2.6.2 Database Backup Strategy [6](#_Toc100013)](#_Toc100013)
>
> [2.6.3 Subscription Gating [6](#_Toc100014)](#_Toc100014)

[3. Database Schema [6](#_Toc100015)](#_Toc100015)

> [3.1 Entity Relationship Overview [6](#_Toc100016)](#_Toc100016)
>
> [3.2 Table Definitions [7](#_Toc100017)](#_Toc100017)
>
> [3.2.1 doctors [7](#_Toc100018)](#_Toc100018)
>
> [3.2.2 doctor_settings [7](#_Toc100019)](#_Toc100019)
>
> [3.2.3 patients [7](#_Toc100020)](#_Toc100020)
>
> [3.2.4 prescriptions [7](#_Toc100021)](#_Toc100021)
>
> [3.2.5 subscriptions [7](#_Toc100022)](#_Toc100022)
>
> [3.2.6 medicine_feedback [7](#_Toc100023)](#_Toc100023)
>
> [3.2.7 audit_log [8](#_Toc100024)](#_Toc100024)
>
> [3.3 Row Level Security Policies [8](#_Toc100025)](#_Toc100025)
>
> [3.4 Indexes [8](#_Toc100026)](#_Toc100026)
>
> [3.5 Database Migrations [8](#_Toc100027)](#_Toc100027)

[4. Medicine Data Strategy [9](#_Toc100028)](#_Toc100028)

> [4.1 Data Source [9](#_Toc100029)](#_Toc100029)
>
> [4.2 Static JSON Dataset Architecture [9](#_Toc100030)](#_Toc100030)
>
> [4.3 Search Behavior [9](#_Toc100031)](#_Toc100031)
>
> [4.4 Data Update Pipeline [10](#_Toc100032)](#_Toc100032)
>
> [4.5 Crowdsourced Feedback Workflow [10](#_Toc100033)](#_Toc100033)

[5. SaaS Subscription Model [10](#_Toc100034)](#_Toc100034)

> [5.1 Tier Definitions [10](#_Toc100035)](#_Toc100035)
>
> [5.2 Monthly Prescription Counter Mechanism
> [11](#_Toc100036)](#_Toc100036)
>
> [5.3 Free-to-Premium Upgrade Flow [11](#_Toc100037)](#_Toc100037)
>
> [5.4 Payment Integration via SSLCommerz
> [11](#_Toc100038)](#_Toc100038)
>
> [5.5 Downgrade and Cancellation Policy [12](#_Toc100039)](#_Toc100039)

[6. Implementation Plan [12](#_Toc100040)](#_Toc100040)

> [6.1 Phase Overview [12](#_Toc100041)](#_Toc100041)
>
> [6.2 Phase 1: Foundation & Authentication (Weeks 1-3)
> [12](#_Toc100042)](#_Toc100042)
>
> [6.3 Phase 2: Prescription Engine (Weeks 4-7)
> [13](#_Toc100043)](#_Toc100043)
>
> [6.4 Phase 3: Print & PDF Output (Weeks 8-10)
> [14](#_Toc100044)](#_Toc100044)
>
> [6.5 Phase 4: Patient Management & History (Weeks 11-12)
> [14](#_Toc100045)](#_Toc100045)
>
> [6.6 Phase 5: Polish & Deployment (Weeks 13-15)
> [15](#_Toc100046)](#_Toc100046)

[7. UX Blueprint [15](#_Toc100047)](#_Toc100047)

> [7.1 Composer Layout (Desktop) [16](#_Toc100048)](#_Toc100048)
>
> [7.2 Composer Layout (Mobile & Tablet) [16](#_Toc100049)](#_Toc100049)
>
> [7.3 Print Layout [16](#_Toc100050)](#_Toc100050)
>
> [7.4 Onboarding & Trust [16](#_Toc100051)](#_Toc100051)
>
> [7.5 Internationalization (i18n) [17](#_Toc100052)](#_Toc100052)

[8. Recommended Folder Structure [17](#_Toc100053)](#_Toc100053)

[9. Data Privacy & Compliance [17](#_Toc100054)](#_Toc100054)

> [9.1 Regulatory Compliance [17](#_Toc100055)](#_Toc100055)
>
> [9.2 Data Residency [18](#_Toc100056)](#_Toc100056)
>
> [9.3 Encryption [18](#_Toc100057)](#_Toc100057)
>
> [9.4 Data Retention & Deletion [18](#_Toc100058)](#_Toc100058)
>
> [9.5 Patient Consent Mechanism [19](#_Toc100059)](#_Toc100059)
>
> [9.6 Data Portability [19](#_Toc100060)](#_Toc100060)
>
> [9.7 Privacy Transparency [19](#_Toc100061)](#_Toc100061)

[10. Pre-Launch Checklist [19](#_Toc100062)](#_Toc100062)

> [10.1 Security [20](#_Toc100063)](#_Toc100063)
>
> [10.2 Data & UX [20](#_Toc100064)](#_Toc100064)
>
> [10.3 Deployment [20](#_Toc100065)](#_Toc100065)
>
> [10.4 Accessibility [20](#_Toc100066)](#_Toc100066)

[11. Operational Readiness [20](#_Toc100067)](#_Toc100067)

> [11.1 Support Strategy [20](#_Toc100068)](#_Toc100068)
>
> [11.2 Beta Feedback Loop [21](#_Toc100069)](#_Toc100069)
>
> [11.3 Analytics Strategy [21](#_Toc100070)](#_Toc100070)

[12. Future Roadmap (Post-Launch) [21](#_Toc100071)](#_Toc100071)

> [12.1 Tier 1: High Priority (3-6 Months)
> [22](#_Toc100072)](#_Toc100072)
>
> [12.2 Tier 2: Medium Priority (6-12 Months)
> [22](#_Toc100073)](#_Toc100073)
>
> [12.3 Tier 3: Long-Term Vision (12+ Months)
> [22](#_Toc100074)](#_Toc100074)

[13. Support FAQ [22](#_Toc100075)](#_Toc100075)

> [13.1 Getting Started [22](#_Toc100076)](#_Toc100076)
>
> [13.2 Prescriptions & Usage [23](#_Toc100077)](#_Toc100077)
>
> [13.3 Security & Privacy [24](#_Toc100078)](#_Toc100078)
>
> [13.4 Billing & Subscription [24](#_Toc100079)](#_Toc100079)

[14. Infrastructure Cost Analysis [25](#_Toc100080)](#_Toc100080)

> [14.1 Free-Tier Cost Breakdown [25](#_Toc100081)](#_Toc100081)
>
> [14.2 Scaling Cost Projections [25](#_Toc100082)](#_Toc100082)

[15. Risk Register [25](#_Toc100083)](#_Toc100083)

*Note: This Table of Contents is generated via field codes. To ensure
page number accuracy after editing, please right-click the TOC and
select \"Update Field.\"*

[]{#_Toc100000 .anchor}**1. Executive Summary**

RxBD is a comprehensive multi-tenant, SaaS-based digital prescription
platform purpose-built for private chamber doctors in Bangladesh. The
platform replaces error-prone handwritten prescriptions with a fast,
intuitive digital composer that generates professional, print-ready
prescriptions in under two minutes. By leveraging modern web
technologies and a free-tier infrastructure strategy centered on Vercel
and Supabase, RxBD achieves near-zero operational costs during its
initial growth phase while maintaining enterprise-grade security and
reliability.

The Bangladesh healthcare market presents a significant opportunity for
digital prescription tools. The country has over 75,000 registered
physicians, with a substantial proportion operating private chambers
where prescription writing constitutes the primary clinical
documentation activity. Currently, the vast majority of these
practitioners rely on handwritten prescriptions, which are prone to
illegibility, incomplete drug information, and lack of verifiable
authenticity. Existing digital solutions such as Practo and local EMR
systems are either too complex, too expensive, or poorly adapted to the
specific workflow of a Bangladeshi chamber doctor who sees 30 to 50
patients per session and needs speed above all else.

RxBD addresses this gap with a focused, opinionated product that
prioritizes speed of prescription creation, professional output quality,
and zero-friction onboarding. The platform employs a client-side
medicine search engine powered by Fuse.js over static JSON datasets,
eliminating API latency and reducing infrastructure costs. A local-first
auto-save mechanism ensures that no prescription draft is ever lost,
even during internet outages common in semi-urban and rural Bangladesh.
Every generated prescription includes a unique QR code for document
verification, building trust and combating prescription forgery.

The commercial model follows a freemium SaaS approach: the Free tier
provides core functionality with a limit of 50 prescriptions per month,
sufficient for part-time practitioners, while the Premium tier unlocks
unlimited prescriptions, custom letterhead branding, digital signature
embedding, and priority support. Payment processing is handled through
SSLCommerz, supporting local mobile financial services such as bKash,
Nagad, and Rocket, ensuring accessibility for the target demographic.

Infrastructure costs are managed through a deliberate free-tier
strategy. Vercel\'s hobby plan provides serverless hosting with 100GB
monthly bandwidth and 10-second function timeouts, while Supabase\'s
free tier offers 500MB of PostgreSQL storage, 1GB of file storage, and
50,000 monthly active users for authentication. These limits are
sufficient to support the initial user base of 500 to 1,000 doctors,
with a clear migration path to paid tiers as revenue grows. Automated,
encrypted database backups via Supabase\'s built-in Point-In-Time
Recovery and GitHub Actions provide data resilience without additional
cost.

[]{#_Toc100001 .anchor}**1.1 Key Differentiators**

-   Zero-latency medicine search via client-side Fuse.js indexing over
    8,000+ Bangladeshi pharmaceutical brands

-   Local-first draft persistence with 10-second auto-save to browser
    localStorage, ensuring zero data loss during connectivity
    disruptions

-   QR code-based prescription verification system for document
    authenticity and anti-forgery protection

-   Bilingual interface supporting both English and Bengali (Bangla),
    with automatic locale detection and manual toggle

-   Bangladesh-specific payment integration via SSLCommerz supporting
    bKash, Nagad, Rocket, and traditional card banking

-   A4 print layout conforming to the standard Bangladesh medical
    prescription format expected by patients and pharmacies

-   Free-tier infrastructure strategy enabling near-zero operational
    cost during the initial growth phase

[]{#_Toc100002 .anchor}**2. Tech Stack & Architecture**

The technology stack is selected to maximize developer productivity,
minimize infrastructure costs, and ensure a responsive, reliable user
experience. Every component is chosen with explicit justification tied
to the product requirements and the constraints of operating on
free-tier infrastructure.

[]{#_Toc100003 .anchor}**2.1 Frontend Stack**

  -----------------------------------------------------------------------------------
  **Technology**         **Version**       **Purpose**            **Justification**
  ---------------------- ----------------- ---------------------- -------------------
  Next.js                15+ (App Router)  Core framework for     App Router provides
                                           SSR, ISR, and routing  React Server
                                                                  Components for
                                                                  reduced client
                                                                  bundle size; ISR
                                                                  for medicine data
                                                                  caching; API routes
                                                                  for backend logic
                                                                  without a separate
                                                                  server

  TypeScript             5.x               Static type checking   Prevents runtime
                                                                  errors in critical
                                                                  medical data flows;
                                                                  enforces type
                                                                  safety on
                                                                  prescription JSON
                                                                  payloads and
                                                                  database models

  Tailwind CSS           4.x               Utility-first styling  Rapid UI
                                                                  development with
                                                                  consistent design
                                                                  tokens;
                                                                  tree-shaking
                                                                  eliminates unused
                                                                  CSS; responsive
                                                                  utilities for
                                                                  mobile adaptation

  shadcn/ui              Latest            Accessible component   Unstyled,
                                           library                composable
                                                                  components with
                                                                  full ARIA support;
                                                                  avoids vendor
                                                                  lock-in since code
                                                                  is owned and
                                                                  customizable

  React Hook Form        7.x               Form state management  Minimal re-renders
                                                                  for performant
                                                                  multi-field
                                                                  prescription forms;
                                                                  built-in validation
                                                                  with Zod schema
                                                                  integration

  Zod                    3.x               Schema validation      Shared validation
                                                                  schemas between
                                                                  client and server;
                                                                  runtime type safety
                                                                  for prescription
                                                                  JSON payloads

  Zustand                4.x               Client-side state      Lightweight
                                           management             alternative to
                                                                  Redux; manages
                                                                  prescription
                                                                  composer session
                                                                  state (medications
                                                                  list, patient
                                                                  context, dirty
                                                                  state)

  Fuse.js                6.x               Client-side fuzzy      Zero-latency
                                           search                 medicine search;
                                                                  fuzzy matching
                                                                  handles partial
                                                                  spelling common
                                                                  with generic drug
                                                                  names; indexes
                                                                  8,000+ brands in
                                                                  memory

  \@react-pdf/renderer   3.x               PDF generation         Client-side PDF
                                                                  creation eliminates
                                                                  server load;
                                                                  produces
                                                                  pixel-perfect
                                                                  prescription
                                                                  layouts matching
                                                                  Bangladesh medical
                                                                  format

  qrcode.react           3.x               QR code generation     Generates unique
                                                                  verification QR
                                                                  codes embedded
                                                                  directly in PDF
                                                                  output; no external
                                                                  API dependency

  next-intl              3.x               Internationalization   Bilingual support
                                                                  (English/Bengali)
                                                                  with message
                                                                  catalogs; automatic
                                                                  locale detection;
                                                                  SSR-compatible
                                                                  message loading
  -----------------------------------------------------------------------------------

[]{#_Toc100004 .anchor}**2.2 Backend & Infrastructure**

  -----------------------------------------------------------------------
  **Technology**    **Purpose**       **Free Tier       **Scaling
                                      Limits**          Strategy**
  ----------------- ----------------- ----------------- -----------------
  Next.js API       Server-side       10s function      Migrate
  Routes            business logic    timeout, 100GB    long-running
                    and database      bandwidth/month   operations to
                    interactions      (Vercel)          Supabase Edge
                                                        Functions or a
                                                        dedicated
                                                        container service

  Supabase          Primary           500MB storage,    Upgrade to
  PostgreSQL        relational        50K MAU auth, 5GB Supabase Pro
                    database with RLS bandwidth         (\$25/month) when
                    for multi-tenancy                   DB exceeds 400MB
                                                        or auth exceeds
                                                        40K MAU

  Supabase Auth     User              50K MAU, 500      Upgrade to Pro
                    authentication    email sends/day   for 100K MAU and
                    with                                custom SMTP for
                    email/password                      branded emails
                    and social OAuth                    

  Supabase Storage  Doctor asset      1GB storage, 5GB  Implement image
                    storage           bandwidth         compression and
                    (signatures,                        size limits;
                    logos, photos)                      migrate to
                                                        Cloudflare R2 for
                                                        cheaper egress

  Vercel            Deployment, CDN,  100GB bandwidth,  Upgrade to Pro
                    edge hosting,     6,000 build       (\$20/month) for
                    image             min/month         1TB bandwidth and
                    optimization                        analytics

  Vercel Image      On-the-fly        1,000             Pre-compress
  Optimization      optimization for  images/month on   uploads
                    doctor-uploaded   free tier         client-side using
                    images                              browser Canvas
                                                        API before
                                                        storage

  GitHub Actions    CI/CD pipeline    2,000             Optimize workflow
                    and scheduled     minutes/month     caching; schedule
                    backup tasks                        backups at
                                                        off-peak hours to
                                                        minimize minute
                                                        usage
  -----------------------------------------------------------------------

[]{#_Toc100005 .anchor}**2.3 Architecture Overview**

RxBD follows a flat, serverless architecture optimized for the JAMstack
paradigm. The entire application is deployed as a single Next.js project
on Vercel, with serverless API routes handling all backend logic and
Supabase providing managed database, authentication, and file storage
services. This architecture eliminates the need for container
orchestration, server provisioning, or infrastructure management,
allowing the team to focus entirely on product development.

The request flow follows a clear pattern: client requests hit Vercel\'s
edge CDN first, where static assets are served from cache. Dynamic
routes are handled by Next.js serverless functions, which authenticate
requests via Supabase Auth JWT tokens, enforce Row Level Security
through Supabase\'s PostgreSQL policies, and return data. The
prescription composer operates as a client-side application that loads
medicine data into memory once on page load, enabling instant fuzzy
search without server round-trips.

Multi-tenant data isolation is enforced at the database level through
Supabase Row Level Security (RLS). Every table includes a doctor_id
foreign key referencing the auth.users table, and RLS policies ensure
that each authenticated doctor can only access rows where the doctor_id
matches their session UID. This approach is both simpler and more secure
than application-level tenant filtering, as it prevents accidental data
leakage even if a developer introduces a bug in a query.

[]{#_Toc100006 .anchor}**2.4 Architecture Diagram (Textual
Description)**

The system architecture can be described in four layers. Layer 1
(Client) consists of the Next.js frontend application running in the
user\'s browser, including the prescription composer with Zustand state
management, Fuse.js medicine search index loaded from static JSON, and
\@react-pdf/renderer for client-side PDF generation. Layer 2 (Edge/CDN)
is Vercel\'s global edge network, serving cached static assets and
routing dynamic requests to serverless functions. Layer 3 (API)
comprises Next.js API routes running as serverless functions, handling
authentication validation, database CRUD operations, subscription
enforcement, and webhook processing for SSLCommerz payment
confirmations. Layer 4 (Data) includes Supabase PostgreSQL for
persistent data with RLS, Supabase Auth for user management, Supabase
Storage for doctor-uploaded assets, and the browser\'s localStorage for
draft auto-save persistence.

[]{#_Toc100007 .anchor}**2.5 Observability & Monitoring**

Effective monitoring is essential for a healthcare application where
data integrity and uptime directly impact patient safety. RxBD
implements a layered observability strategy using free-tier tools that
provide comprehensive coverage without operational expense.

[]{#_Toc100008 .anchor}**2.5.1 Error Tracking**

Sentry is integrated at both the frontend and API route levels. The
Sentry Next.js SDK captures unhandled exceptions, React component
errors, and API route failures with full stack traces and source maps.
The free Sentry tier provides 5,000 events per month and 1-day
retention, which is sufficient for an initial user base of up to 1,000
doctors. Error events are tagged with the doctor\'s subscription tier
and the API route involved, enabling rapid triage. Critical errors,
defined as any error in the prescription creation or PDF generation
flow, trigger immediate Slack notifications via Sentry\'s integration
webhooks.

[]{#_Toc100009 .anchor}**2.5.2 Analytics**

PostHog is chosen as the product analytics platform for its generous
free tier (1 million events per month) and self-hosting option for
future migration. Key tracking events include prescription_created,
medicine_search_used, pdf_generated, upgrade_modal_shown, and
onboarding_step_completed. These events feed into funnel analysis for
the onboarding flow and conversion tracking for the freemium-to-premium
upgrade path. PostHog\'s session replay feature provides qualitative
insight into user behavior without requiring a separate tool like
LogRocket, consolidating the observability stack.

[]{#_Toc100010 .anchor}**2.5.3 Uptime Monitoring**

UptimeRobot\'s free tier provides 50 monitors with 5-minute check
intervals. Two monitors are configured: one for the main application URL
(rxbd.com.bd) verifying HTTP 200 responses, and one for the Supabase
health endpoint. Alert channels include email and Slack integration.
This provides basic availability monitoring sufficient for the launch
phase, with migration to Vercel\'s built-in analytics and Synthetics on
the Pro plan as the platform scales.

[]{#_Toc100011 .anchor}**2.6 Data Resilience**

Data resilience in RxBD operates at three levels, ensuring that no
single point of failure can result in permanent data loss.

[]{#_Toc100012 .anchor}**2.6.1 Local-First Auto-Save**

Prescription drafts are automatically persisted to the browser\'s
localStorage every 10 seconds using a debounced Zustand middleware. The
auto-save captures the full prescription state including patient
context, medications added, clinical notes, and form dirty state. Upon
reconnection after a connectivity loss, the application detects local
drafts by comparing the localStorage timestamp against the server\'s
last-known save time and prompts the user to resume their work. This
mechanism prevents data loss even during extended internet outages,
which are common in semi-urban Bangladesh, and requires zero server
infrastructure.

[]{#_Toc100013 .anchor}**2.6.2 Database Backup Strategy**

The primary backup mechanism uses Supabase\'s built-in daily automated
backups, which are available on the Pro plan. During the free-tier
launch phase, a GitHub Actions workflow performs a daily pg_dump of the
Supabase database, encrypts the dump using AES-256 encryption with a key
stored in GitHub Secrets, and commits the encrypted backup to a private
repository. This approach provides 7-day retention without additional
cost. The encryption key is managed separately from the backup storage,
ensuring that even if the repository is compromised, the backup data
remains unreadable without the key. On migration to Supabase Pro, the
daily automated backups with 7-day Point-In-Time Recovery become the
primary mechanism, and the GitHub Actions backup is retained as a
secondary off-site copy.

[]{#_Toc100014 .anchor}**2.6.3 Subscription Gating**

Access control and tier-based feature restrictions are enforced via
Next.js Middleware, which runs on Vercel\'s edge network before any page
renders. The middleware extracts the Supabase Auth JWT from the request
cookie, decodes the user\'s plan metadata (stored as a custom claim in
the JWT), and checks the current prescription count against the plan
limit. If a Free-tier user has reached their 50-prescription monthly
limit, the middleware redirects them to an upgrade prompt page rather
than the prescription composer. Premium features such as custom
letterhead branding and digital signature upload are gated by checking
the plan claim before rendering the relevant UI components, and API
routes perform a secondary server-side plan check to prevent client-side
bypass.

[]{#_Toc100015 .anchor}**3. Database Schema**

The database is structured to support multi-tenancy where each doctor
owns their specific settings and patient records. The schema uses
Supabase PostgreSQL with Row Level Security (RLS) enforced on every
table. All tables include standard audit columns (created_at,
updated_at) and use UUID primary keys for global uniqueness and to
prevent enumeration attacks.

[]{#_Toc100016 .anchor}**3.1 Entity Relationship Overview**

The core data model revolves around the doctor entity as the tenant
root. Each doctor owns their settings, patients, and prescriptions. A
patient belongs to exactly one doctor (to maintain data isolation), and
a prescription belongs to one patient and one doctor. The subscriptions
table tracks the doctor\'s current plan and usage counters, while the
medicine_feedback table supports crowdsourced improvement of the
medicine database.

[]{#_Toc100017 .anchor}**3.2 Table Definitions**

[]{#_Toc100018 .anchor}**3.2.1 doctors**

  -----------------------------------------------------------------------
  **Column**        **Type**          **Constraints**   **Description**
  ----------------- ----------------- ----------------- -----------------
  id                UUID              PK, DEFAULT       Links to Supabase
                                      auth.uid()        Auth user;
                                                        ensures RLS
                                                        alignment

  email             TEXT              NOT NULL, UNIQUE  Doctor\'s
                                                        registered email
                                                        address

  full_name         TEXT              NOT NULL          Doctor\'s display
                                                        name (e.g., Dr.
                                                        Aminul Islam)

  degrees           TEXT\[\]          DEFAULT \'{}\'    Array of degree
                                                        strings (e.g.,
                                                        MBBS, FCPS, MD)

  specialty         TEXT              NULL              Medical specialty
                                                        (e.g.,
                                                        Cardiology,
                                                        General Practice)

  bmdc_number       TEXT              UNIQUE            Bangladesh
                                                        Medical and
                                                        Dental Council
                                                        registration
                                                        number

  phone             TEXT              NULL              Contact phone
                                                        number in +880
                                                        format

  chamber_address   TEXT              NULL              Primary chamber
                                                        address for
                                                        prescription
                                                        header

  chamber_name      TEXT              NULL              Chamber/clinic
                                                        name

  avatar_url        TEXT              NULL              Supabase Storage
                                                        URL for profile
                                                        photo

  locale            TEXT              DEFAULT \'en\'    Interface
                                                        language
                                                        preference:
                                                        \'en\' or \'bn\'

  created_at        TIMESTAMPTZ       DEFAULT now()     Account creation
                                                        timestamp

  updated_at        TIMESTAMPTZ       DEFAULT now()     Last profile
                                                        update timestamp
  -----------------------------------------------------------------------

[]{#_Toc100019 .anchor}**3.2.2 doctor_settings**

  ---------------------------------------------------------------------------
  **Column**           **Type**          **Constraints**   **Description**
  -------------------- ----------------- ----------------- ------------------
  doctor_id            UUID              PK, FK -\>        One-to-one with
                                         doctors.id ON     doctors table
                                         DELETE CASCADE    

  header_template      TEXT              DEFAULT           Prescription
                                         \'standard\'      header layout:
                                                           \'standard\',
                                                           \'compact\',
                                                           \'custom\'

  footer_text          TEXT              NULL              Custom footer text
                                                           (e.g., follow-up
                                                           instructions)

  logo_url             TEXT              NULL              Supabase Storage
                                                           URL for
                                                           chamber/practice
                                                           logo

  signature_url        TEXT              NULL              Supabase Storage
                                                           URL for digital
                                                           signature image
                                                           (Premium)

  show_qr_code         BOOLEAN           DEFAULT true      Whether to include
                                                           verification QR
                                                           code on
                                                           prescriptions

  prescription_theme   TEXT              DEFAULT           Visual theme:
                                         \'classic\'       \'classic\',
                                                           \'modern\',
                                                           \'minimal\'

  font_size            INTEGER           DEFAULT 12        Base font size for
                                                           prescription print
                                                           (10-14 pt range)

  created_at           TIMESTAMPTZ       DEFAULT now()     Settings creation
                                                           timestamp

  updated_at           TIMESTAMPTZ       DEFAULT now()     Last settings
                                                           update timestamp
  ---------------------------------------------------------------------------

[]{#_Toc100020 .anchor}**3.2.3 patients**

  ----------------------------------------------------------------------------------------
  **Column**        **Type**          **Constraints**                    **Description**
  ----------------- ----------------- ---------------------------------- -----------------
  id                UUID              PK, DEFAULT gen_random_uuid()      Unique patient
                                                                         identifier

  doctor_id         UUID              FK -\> doctors.id ON DELETE        Owning doctor for
                                      CASCADE, NOT NULL                  multi-tenant
                                                                         isolation

  name              TEXT              NOT NULL                           Patient\'s full
                                                                         name

  phone             TEXT              NULL                               Contact phone
                                                                         number

  age_years         INTEGER           NULL                               Age in years
                                                                         (alternative to
                                                                         date_of_birth for
                                                                         convenience)

  date_of_birth     DATE              NULL                               Date of birth for
                                                                         precise age
                                                                         calculation

  gender            TEXT              CHECK (gender IN                   Gender for dosage
                                      (\'male\',\'female\',\'other\'))   calculations and
                                                                         clinical context

  blood_group       TEXT              NULL                               Blood group
                                                                         (e.g., A+, O-)

  address           TEXT              NULL                               Patient address

  medical_notes     TEXT              NULL                               Persistent notes
                                                                         (allergies,
                                                                         chronic
                                                                         conditions)
                                                                         carried across
                                                                         visits

  created_at        TIMESTAMPTZ       DEFAULT now()                      First
                                                                         registration
                                                                         timestamp

  updated_at        TIMESTAMPTZ       DEFAULT now()                      Last update
                                                                         timestamp
  ----------------------------------------------------------------------------------------

[]{#_Toc100021 .anchor}**3.2.4 prescriptions**

  --------------------------------------------------------------------------
  **Column**         **Type**          **Constraints**     **Description**
  ------------------ ----------------- ------------------- -----------------
  id                 UUID              PK, DEFAULT         Unique
                                       gen_random_uuid()   prescription
                                                           identifier (used
                                                           in QR
                                                           verification URL)

  doctor_id          UUID              FK -\> doctors.id   Prescribing
                                       ON DELETE CASCADE,  doctor
                                       NOT NULL            

  patient_id         UUID              FK -\> patients.id  Patient receiving
                                       ON DELETE CASCADE,  prescription
                                       NOT NULL            

  visit_date         DATE              DEFAULT             Date of
                                       CURRENT_DATE, NOT   consultation
                                       NULL                

  chief_complaints   TEXT\[\]          DEFAULT \'{}\'      Array of chief
                                                           complaints (CC)

  vitals             JSONB             DEFAULT \'{}\'      Vital signs: {bp,
                                                           pulse, temp,
                                                           weight, spo2}

  on_examination     TEXT              NULL                Clinical
                                                           examination
                                                           findings

  investigations     TEXT\[\]          DEFAULT \'{}\'      Ordered
                                                           investigations
                                                           and lab tests

  diagnosis          TEXT\[\]          DEFAULT \'{}\'      Diagnosis entries
                                                           (ICD-10 codes
                                                           optional)

  medications        JSONB             NOT NULL, DEFAULT   Array of
                                       \'\[\]\'            medication
                                                           objects: \[{name,
                                                           generic, dosage,
                                                           frequency,
                                                           duration,
                                                           instructions}\]

  advice             TEXT              NULL                General advice
                                                           and follow-up
                                                           instructions

  follow_up_date     DATE              NULL                Next visit date

  pdf_url            TEXT              NULL                Supabase Storage
                                                           URL for saved PDF
                                                           (if stored
                                                           server-side)

  qr_verified_at     TIMESTAMPTZ       NULL                Timestamp when QR
                                                           code was last
                                                           scanned for
                                                           verification

  is_draft           BOOLEAN           DEFAULT true        Whether
                                                           prescription is
                                                           still in draft
                                                           state

  created_at         TIMESTAMPTZ       DEFAULT now()       Creation
                                                           timestamp

  updated_at         TIMESTAMPTZ       DEFAULT now()       Last modification
                                                           timestamp
  --------------------------------------------------------------------------

[]{#_Toc100022 .anchor}**3.2.5 subscriptions**

  ----------------------------------------------------------------------------------------
  **Column**                 **Type**          **Constraints**           **Description**
  -------------------------- ----------------- ------------------------- -----------------
  doctor_id                  UUID              PK, FK -\> doctors.id ON  One-to-one with
                                               DELETE CASCADE            doctors

  plan                       TEXT              NOT NULL, DEFAULT         Current
                                               \'free\', CHECK (plan IN  subscription tier
                                               (\'free\',\'premium\'))   

  prescriptions_this_month   INTEGER           DEFAULT 0                 Counter for
                                                                         monthly
                                                                         prescription
                                                                         usage on Free
                                                                         tier

  counter_reset_at           DATE              NOT NULL, DEFAULT         Date when counter
                                               CURRENT_DATE              was last reset
                                                                         (monthly)

  premium_since              TIMESTAMPTZ       NULL                      Timestamp of
                                                                         first Premium
                                                                         upgrade

  premium_expires_at         TIMESTAMPTZ       NULL                      Expiration date
                                                                         for Premium
                                                                         subscription

  sslcommerz_tran_id         TEXT              NULL                      Last SSLCommerz
                                                                         transaction ID
                                                                         for payment
                                                                         reference

  created_at                 TIMESTAMPTZ       DEFAULT now()             Subscription
                                                                         record creation

  updated_at                 TIMESTAMPTZ       DEFAULT now()             Last subscription
                                                                         change
  ----------------------------------------------------------------------------------------

[]{#_Toc100023 .anchor}**3.2.6 medicine_feedback**

  -----------------------------------------------------------------------------------------------------------------
  **Column**        **Type**          **Constraints**                                             **Description**
  ----------------- ----------------- ----------------------------------------------------------- -----------------
  id                UUID              PK, DEFAULT gen_random_uuid()                               Unique feedback
                                                                                                  entry identifier

  doctor_id         UUID              FK -\> doctors.id ON DELETE SET NULL                        Submitting doctor
                                                                                                  (nullable for
                                                                                                  anonymous)

  medicine_name     TEXT              NOT NULL                                                    Name of the
                                                                                                  medicine being
                                                                                                  reported

  feedback_type     TEXT              NOT NULL, CHECK (type IN                                    Category of
                                      (\'missing\',\'incorrect\',\'duplicate\',\'suggestion\'))   feedback

  description       TEXT              NOT NULL                                                    Detailed
                                                                                                  description of
                                                                                                  the issue or
                                                                                                  suggestion

  status            TEXT              DEFAULT \'pending\', CHECK (status IN                       Review status for
                                      (\'pending\',\'reviewed\',\'resolved\',\'rejected\'))       admin workflow

  resolved_at       TIMESTAMPTZ       NULL                                                        Timestamp when
                                                                                                  feedback was
                                                                                                  resolved

  created_at        TIMESTAMPTZ       DEFAULT now()                                               Feedback
                                                                                                  submission
                                                                                                  timestamp
  -----------------------------------------------------------------------------------------------------------------

[]{#_Toc100024 .anchor}**3.2.7 audit_log**

  -----------------------------------------------------------------------------------
  **Column**        **Type**          **Constraints**     **Description**
  ----------------- ----------------- ------------------- ---------------------------
  id                UUID              PK, DEFAULT         Unique log entry identifier
                                      gen_random_uuid()   

  doctor_id         UUID              FK -\> doctors.id   Acting doctor
                                      ON DELETE SET NULL  

  action            TEXT              NOT NULL            Action performed (e.g.,
                                                          \'prescription.created\',
                                                          \'patient.exported\')

  entity_type       TEXT              NOT NULL            Entity type (e.g.,
                                                          \'prescription\',
                                                          \'patient\',
                                                          \'subscription\')

  entity_id         UUID              NULL                ID of the affected entity

  metadata          JSONB             DEFAULT \'{}\'      Additional context (IP
                                                          address, user agent,
                                                          changed fields)

  created_at        TIMESTAMPTZ       DEFAULT now()       Action timestamp
  -----------------------------------------------------------------------------------

[]{#_Toc100025 .anchor}**3.3 Row Level Security Policies**

Every table in the database is protected by RLS policies ensuring that a
logged-in doctor can only select, insert, or update data where the
doctor_id matches their authenticated session UID. The RLS policies are
defined as follows for each table, using the auth.uid() function to
extract the current user\'s ID from the JWT token. For the doctors
table, the policy verifies that the id column matches auth.uid(). For
all other tables with a doctor_id column, the policy checks that
doctor_id equals auth.uid(). The audit_log table is write-only for
doctors (INSERT allowed, SELECT restricted to admin roles) to prevent
tampering with activity records.

Additionally, RLS policies enforce subscription limits on the
prescriptions table. An INSERT policy on prescriptions checks the
subscriptions table to verify that the doctor has not exceeded their
monthly prescription limit before allowing a new prescription to be
created. This database-level enforcement prevents bypass through API
route vulnerabilities or direct Supabase client access.

[]{#_Toc100026 .anchor}**3.4 Indexes**

The following indexes are created to optimize the most frequent query
patterns. An index on patients(doctor_id, name) supports the patient
search dropdown in the prescription composer. An index on
prescriptions(doctor_id, created_at DESC) enables efficient history
retrieval sorted by most recent visit. An index on
prescriptions(patient_id, created_at DESC) supports the patient history
view. An index on subscriptions(doctor_id) provides fast lookups for
subscription gating middleware. A GIN index on
prescriptions(medications) allows JSONB queries for analytics (e.g.,
most prescribed medications). An index on medicine_feedback(status)
supports the admin review queue for pending feedback items.

[]{#_Toc100027 .anchor}**3.5 Database Migrations**

Schema migrations are managed through Supabase\'s built-in migration
system, which tracks migration files in a supabase/migrations/ directory
within the project repository. Each migration is an up-only SQL file
with a timestamp prefix (e.g., 20260614000000_create_subscriptions.sql).
The supabase CLI is used to apply migrations to local development
instances and to push changes to the remote Supabase project. Rollback
is handled by creating a new migration that reverses the previous
change, rather than using down migrations, ensuring a consistent and
auditable migration history.

[]{#_Toc100028 .anchor}**4. Medicine Data Strategy**

RxBD employs a hybrid static-dynamic medicine data strategy that
prioritizes search speed and zero API latency while maintaining a clear
path for data updates. This approach recognizes that the Bangladesh
pharmaceutical market, while containing approximately 8,000 registered
brand-name products across 300+ generic molecules, is small enough to be
indexed entirely in client memory, yet large enough that manual curation
is impractical.

[]{#_Toc100029 .anchor}**4.1 Data Source**

The initial medicine database is sourced from the Directorate General of
Drug Administration (DGDA) of Bangladesh, which publishes a regularly
updated registry of all approved pharmaceutical products. This registry
includes brand names, generic compositions, dosage forms, strengths,
manufacturers, and retail prices. The raw DGDA data is processed through
an ETL (Extract, Transform, Load) pipeline that normalizes brand name
spellings, maps each brand to its generic molecule, and structures the
data into the JSON format required by Fuse.js. The pipeline is
version-controlled in the repository and can be re-run whenever the DGDA
publishes updated data.

[]{#_Toc100030 .anchor}**4.2 Static JSON Dataset Architecture**

Medicine data is stored as optimized static JSON files in the
/public/data/ directory. The primary file, medicines.json, contains an
array of objects, each with the following structure: { id, brand,
generic, dosageForm, strength, manufacturer, category, tags }. A
secondary file, generics.json, provides a mapping of generic molecule
names to their pharmacological categories, common side effects, and
typical dosage ranges. Both files are loaded once when the prescription
composer page mounts, and Fuse.js creates in-memory indices over the
brand, generic, and tags fields.

The estimated file size for medicines.json is approximately 2MB for
8,000 entries, which compresses to under 400KB with Vercel\'s automatic
Brotli compression. This size is well within acceptable limits for a
one-time page-load fetch and has negligible impact on the user\'s
initial bandwidth, even on slow mobile connections common in Bangladesh.

[]{#_Toc100031 .anchor}**4.3 Search Behavior**

Fuse.js is configured with a threshold of 0.3 (balancing precision and
recall), keys indexed on brand (weight 2), generic (weight 1.5), and
tags (weight 1). This configuration ensures that a partial brand name
like \'amo\' returns \'Amoxicillin\' brands as top results, while a
generic search for \'paracetamol\' returns all paracetamol-containing
brands. Results are displayed in a dropdown with the brand name
highlighted and the generic composition shown as a secondary line,
enabling doctors to quickly identify the correct medication even when
multiple brands share similar names.

[]{#_Toc100032 .anchor}**4.4 Data Update Pipeline**

Updates to the medicine database follow a two-tier strategy. Tier 1 (Hot
Updates) uses a Supabase table called medicine_hotfixes that stores
corrections and additions submitted through the crowdsourced feedback
system. When the prescription composer loads, it fetches any hotfixes
created since the last JSON deployment date and merges them into the
in-memory Fuse.js index. This ensures that critical corrections (e.g., a
dangerous dosage error) are available within minutes without requiring a
full deployment. Tier 2 (Cold Updates) involves periodic re-runs of the
DGDA ETL pipeline, regeneration of the static JSON files, and deployment
of a new version via Vercel. This happens on a monthly cadence or when
the hotfix table accumulates more than 50 entries, at which point the
hotfixes are folded into the main JSON dataset.

[]{#_Toc100033 .anchor}**4.5 Crowdsourced Feedback Workflow**

The prescription composer includes a feedback button that allows doctors
to flag incorrect or missing medicine data. When clicked, it opens a
lightweight form pre-populated with the current medicine name and a
dropdown for feedback type (missing, incorrect, duplicate, suggestion).
The submission is stored in the medicine_feedback table with a status of
\'pending\'. An admin dashboard, accessible only to the RxBD operations
team, displays pending feedback items sorted by submission date.
Reviewed items are either resolved (by creating a hotfix entry in the
medicine_hotfixes table) or rejected (with a reason recorded in the
audit_log). The submitting doctor receives a notification when their
feedback is resolved, encouraging continued participation in the
improvement process.

[]{#_Toc100034 .anchor}**5. SaaS Subscription Model**

RxBD follows a freemium SaaS model designed to maximize adoption among
Bangladeshi doctors while generating sustainable revenue from power
users. The model is intentionally simple, with only two tiers to
minimize decision friction during signup and to make the upgrade path
obvious and compelling.

[]{#_Toc100035 .anchor}**5.1 Tier Definitions**

  -----------------------------------------------------------------------
  **Feature**             **Free Tier**           **Premium Tier**
  ----------------------- ----------------------- -----------------------
  Monthly prescription    50 prescriptions/month  Unlimited prescriptions
  limit                                           

  Prescription PDF        Standard template with  Custom letterhead
  template                RxBD watermark          branding (logo, colors,
                                                  footer)

  Digital signature       Not available           Upload and embed
                                                  digital signature image

  Prescription templates  Not available           Create and use reusable
  (Macros)                                        clinical protocol
                                                  templates

  Patient history depth   Last 10 prescriptions   Full, unlimited history
                          per patient             

  Data export             CSV only                CSV and JSON formats

  Medicine database       Full access with        Full access with
                          standard search         priority hotfix
                                                  delivery

  Support channel         Community forum and     Priority WhatsApp and
                          email                   email support (24h SLA)

  QR verification         Included                Included with custom
                                                  branding on
                                                  verification page
  -----------------------------------------------------------------------

[]{#_Toc100036 .anchor}**5.2 Monthly Prescription Counter Mechanism**

The 50-prescription monthly limit for Free-tier users is enforced
through a combination of database-level and application-level checks.
The subscriptions table maintains a prescriptions_this_month counter and
a counter_reset_at date. Every time a Free-tier doctor creates a new
prescription (transitions from draft to final), the API route increments
the counter. Before allowing the creation, it checks whether the counter
has reached the 50-prescription limit. If counter_reset_at is older than
30 days, the counter is reset to 1 and the date is updated to the
current date.

A scheduled Supabase Edge Function runs daily at midnight Bangladesh
time (UTC+6) to reset all Free-tier counters where counter_reset_at is
older than 30 days. This ensures that the counter resets even if a
doctor does not visit the platform on their reset date. Additionally,
the RLS policy on the prescriptions table includes a subquery check
against the subscriptions table, providing a secondary enforcement layer
that prevents counter bypass through direct database access.

[]{#_Toc100037 .anchor}**5.3 Free-to-Premium Upgrade Flow**

When a Free-tier doctor approaches their monthly limit (at 40
prescriptions), a non-intrusive banner appears at the top of the
prescription composer reading \'You have 10 prescriptions remaining this
month. Upgrade to Premium for unlimited access.\' At 48 prescriptions,
the banner becomes more prominent with a yellow highlight. At 50
prescriptions, the composer is disabled and replaced with a full-screen
upgrade prompt that explains the Premium benefits and includes a direct
\'Upgrade Now\' button. This graduated approach provides multiple
touchpoints for conversion without alienating users with hard paywalls
at the first sign of friction.

The upgrade flow itself redirects the doctor to a Stripe Checkout-like
page powered by SSLCommerz. After successful payment, a webhook from
SSLCommerz hits the /api/webhooks/sslcommerz API route, which verifies
the payment signature using the store\'s secret key, updates the
subscriptions table to set plan=\'premium\', records the SSLCommerz
transaction ID, and sets the premium_expires_at date. The doctor\'s JWT
is refreshed on their next request to include the updated plan claim,
immediately unlocking Premium features.

[]{#_Toc100038 .anchor}**5.4 Payment Integration via SSLCommerz**

SSLCommerz is the leading payment gateway in Bangladesh, supporting all
local payment methods including bKash, Nagad, Rocket, DBBL Nexus, and
international Visa/Mastercard. Integration follows SSLCommerz\'s hosted
checkout flow: the RxBD backend generates a payment session by calling
SSLCommerz\'s /gwprocess/v4/api.php endpoint with the doctor\'s
information and payment amount, receives a redirect URL, and sends the
doctor to SSLCommerz\'s hosted payment page. After payment completion,
SSLCommerz sends an IPN (Instant Payment Notification) webhook to the
/api/webhooks/sslcommerz endpoint, which is the authoritative source of
payment confirmation. The Premium tier is priced at BDT 499 per month
(approximately USD 4.50), a price point validated through interviews
with 15 pilot doctors who indicated willingness to pay between BDT 300
and BDT 800 for premium prescription features.

[]{#_Toc100039 .anchor}**5.5 Downgrade and Cancellation Policy**

When a Premium subscription expires (premium_expires_at passes without
renewal), the system automatically reverts the doctor to the Free tier.
The prescriptions_this_month counter is initialized to the count of
prescriptions created in the current calendar month, ensuring that the
doctor does not receive a fresh 50-prescription allocation upon
downgrade. Existing Premium features (custom letterhead, digital
signature) are preserved in the doctor_settings table but are no longer
rendered in the PDF output. The doctor\'s data, including all
prescription history, remains fully accessible. A 3-day grace period
after expiration allows continued Premium access while a renewal
reminder is sent via email and in-app notification.

[]{#_Toc100040 .anchor}**6. Implementation Plan**

The implementation follows a five-phase plan with explicit timelines,
dependencies, and deliverables. Each phase produces a deployable
increment, enabling continuous feedback from beta users throughout the
development process.

[]{#_Toc100041 .anchor}**6.1 Phase Overview**

  ------------------------------------------------------------------------
  **Phase**         **Duration**      **Key             **Dependencies**
                                      Deliverables**    
  ----------------- ----------------- ----------------- ------------------
  Phase 1:          3 weeks (Weeks    Next.js project   None
  Foundation & Auth 1-3)              scaffold,         
                                      Supabase setup,   
                                      Auth flow, RLS    
                                      policies,         
                                      subscription      
                                      model             

  Phase 2:          4 weeks (Weeks    Composer form,    Phase 1
  Prescription      4-7)              Zustand state,    
  Engine                              medicine search,  
                                      auto-save,        
                                      subscription      
                                      enforcement       

  Phase 3: Print &  3 weeks (Weeks    PDF template, QR  Phase 2
  PDF Output        8-10)             code generation,  
                                      print layout,     
                                      verification page 

  Phase 4: Patient  2 weeks (Weeks    Patient CRUD,     Phase 2
  Management        11-12)            history view,     
                                      data export       
                                      (CSV/JSON)        

  Phase 5: Polish & 3 weeks (Weeks    Onboarding        Phase 3, Phase 4
  Launch            13-15)            walkthrough, i18n 
                                      (Bengali), E2E    
                                      testing, Vercel   
                                      deployment,       
                                      analytics setup   
  ------------------------------------------------------------------------

[]{#_Toc100042 .anchor}**6.2 Phase 1: Foundation & Authentication (Weeks
1-3)**

This phase establishes the technical foundation upon which all
subsequent features are built. The primary goal is to have a deployed,
authenticated application with functional multi-tenant data isolation
and a working subscription model.

-   Week 1: Initialize Next.js 15 project with TypeScript, Tailwind CSS
    4, and shadcn/ui. Configure ESLint, Prettier, and Husky pre-commit
    hooks. Set up Supabase project, create all database tables with RLS
    policies, and implement the migration system. Deploy the initial
    scaffold to Vercel with a placeholder landing page.

-   Week 2: Implement Supabase Auth with email/password signup and
    login. Build the registration flow with email verification. Create
    the doctor profile onboarding form (name, degrees, specialty,
    chamber info). Implement the /api/auth/callback route for OAuth and
    session management. Set up the Next.js Middleware for
    subscription-aware route protection.

-   Week 3: Build the subscription system. Create the subscriptions
    table triggers and the monthly counter reset Edge Function.
    Implement the Free-tier prescription counter API route. Build the
    upgrade prompt UI components. Integrate SSLCommerz sandbox
    environment for payment testing. Deploy and verify the complete
    auth + subscription flow end-to-end.

[]{#_Toc100043 .anchor}**6.3 Phase 2: Prescription Engine (Weeks 4-7)**

This phase builds the core product value: the prescription composer.
This is the most complex phase, involving a multi-section form with
real-time search, state management, and auto-save functionality.

-   Week 4: Design and implement the three-panel composer layout
    (patient sidebar, Rx pad center, search sidebar). Build the React
    Hook Form structure for the prescription form with Zod validation
    schemas. Create the Zustand store for prescription session state
    with localStorage persistence middleware.

-   Week 5: Integrate the static medicine JSON dataset and configure
    Fuse.js for client-side search. Build the medicine search dropdown
    component with brand/generic display and keyboard navigation.
    Implement the medication entry flow (add, edit, remove, reorder)
    with dosage, frequency, duration, and special instruction fields.

-   Week 6: Implement the auto-save mechanism. Build the localStorage
    draft detection and resume flow. Add the CC (Chief Complaints),
    findings, and investigation sections to the composer. Implement the
    diagnosis entry with optional ICD-10 code lookup. Build the vitals
    input panel with validation for blood pressure, pulse, temperature,
    weight, and SpO2 values.

-   Week 7: Implement the prescription finalization flow (draft to
    final). Build the API route for saving prescriptions to Supabase
    with subscription counter increment. Add the advice and follow-up
    date fields. Implement the prescription templates (Macros) feature
    for Premium users, allowing one-click loading of predefined
    medication sets. Test the complete composer workflow end-to-end.

[]{#_Toc100044 .anchor}**6.4 Phase 3: Print & PDF Output (Weeks 8-10)**

This phase transforms the digital prescription data into a professional,
print-ready document that conforms to the Bangladesh medical
prescription format.

-   Week 8: Build the \@react-pdf/renderer prescription template
    conforming to the standard A4 Bangladesh medical format. Implement
    the header section (doctor name, degrees, specialty, chamber info,
    logo). Build the left sidebar (vitals, CC, investigations) and the
    main Rx section (medications with formatting for generic names in
    bold, dosage, frequency, duration, and instructions).

-   Week 9: Implement the footer section with doctor signature area and
    QR code generation. Build the QR code embedding logic using
    qrcode.react, encoding the verification URL
    (rxbd.com.bd/verify/\[prescription_id\]). Implement PDF download and
    browser print functionality. Test print scaling across Chrome,
    Firefox, and Safari.

-   Week 10: Build the public prescription verification page at
    /verify/\[id\]. This is a server-side rendered page that fetches the
    prescription by ID from Supabase (using a service role key,
    bypassing RLS for read-only access), verifies the prescription
    exists and is not in draft state, and displays a read-only summary
    with doctor name, patient name, visit date, and a tamper-evident
    hash indicator. Implement the Premium custom letterhead feature,
    allowing doctors to upload logos and configure header/footer
    layouts. Deploy and test on mobile devices.

[]{#_Toc100045 .anchor}**6.5 Phase 4: Patient Management & History
(Weeks 11-12)**

This phase adds the patient management layer that enables longitudinal
care tracking and returning-patient workflows.

-   Week 11: Build the patient CRUD API routes with search
    functionality. Implement the patient list view with search by name
    and phone number. Build the patient creation form with validation.
    Implement the returning-patient flow in the composer: when a doctor
    selects an existing patient, their persistent medical notes
    (allergies, chronic conditions) are auto-populated, and their visit
    history is displayed in the left sidebar.

-   Week 12: Build the patient history view showing all past
    prescriptions in reverse chronological order. Implement the
    prescription detail view for historical prescriptions (read-only,
    with PDF download). Build the data export feature: CSV export for
    Free-tier doctors (patient list and prescription summary), JSON
    export for Premium doctors (full prescription payload including
    medications JSONB). Test data export with large datasets to ensure
    performance.

[]{#_Toc100046 .anchor}**6.6 Phase 5: Polish & Deployment (Weeks
13-15)**

This phase focuses on user experience refinement, internationalization,
testing, and production readiness.

-   Week 13: Implement the 3-step onboarding walkthrough (complete
    profile, upload branding, write test prescription). Build the
    Bengali (Bangla) language translation using next-intl. Create and
    review message catalogs for all UI strings. Implement locale
    detection based on browser language and manual toggle in settings.
    Test all UI states in both English and Bengali.

-   Week 14: Conduct comprehensive cross-browser testing (Chrome,
    Firefox, Safari, Edge) and mobile testing (iOS Safari, Android
    Chrome). Fix layout issues on tablet and mobile form factors.
    Implement the responsive composer layout: on screens narrower than
    1024px, the three-panel layout collapses to a tabbed interface with
    Patient, Rx Pad, and Search tabs. Optimize PDF rendering performance
    for older devices.

-   Week 15: Set up Sentry error tracking with Next.js SDK integration.
    Configure PostHog analytics with custom event tracking. Set up
    UptimeRobot monitors for the application URL and Supabase health
    endpoint. Configure the custom domain (rxbd.com.bd) with SSL
    certificate via Vercel. Deploy to Vercel production environment.
    Conduct final security review (RLS policy verification, environment
    variable audit, rate limiting). Launch beta with 3-5 pilot doctors.

[]{#_Toc100047 .anchor}**7. UX Blueprint**

The UX design prioritizes speed and clarity for a user base that is
time-pressured, varies widely in technical literacy, and operates in an
environment where internet connectivity is unreliable. Every design
decision is tested against the benchmark of enabling a doctor to
complete a prescription in under two minutes.

[]{#_Toc100048 .anchor}**7.1 Composer Layout (Desktop)**

The prescription composer uses a three-panel split-screen layout
optimized for the clinical workflow of a chamber doctor. The Left
Sidebar (25% width) displays the patient context: selected patient
demographics, persistent medical notes (allergies, chronic conditions),
and quick access to the last 5 prescriptions for returning patients. The
Center Workspace (50% width) is the Rx Pad, containing the multi-section
prescription form arranged in clinical order: Chief Complaints, Vitals,
On Examination, Investigations, Diagnosis, Medications, Advice, and
Follow-Up. Each section is collapsible to reduce visual clutter. The
Right Sidebar (25% width) provides the medicine search input at the top,
followed by a diagnosis template picker and a list of the doctor\'s
frequently prescribed medications for quick access.

[]{#_Toc100049 .anchor}**7.2 Composer Layout (Mobile & Tablet)**

On screens narrower than 1024px, the three-panel layout transforms into
a tabbed interface to preserve all functionality without horizontal
scrolling. Three tabs are displayed at the bottom of the screen: Patient
(left sidebar content), Rx Pad (center workspace), and Search (right
sidebar content). The active tab takes the full screen width. The
medication search results appear as a modal overlay from the Search tab,
allowing the doctor to select a medication and be returned to the Rx Pad
tab with the medication pre-filled. On phones narrower than 640px, the
form sections within the Rx Pad are displayed as an accordion rather
than collapsible panels, ensuring that only one section is expanded at a
time to maximize usable screen space.

[]{#_Toc100050 .anchor}**7.3 Print Layout**

The prescription print layout adheres to the standard Bangladesh medical
prescription format on A4 paper (210mm x 297mm). The header section
occupies the top 15% of the page, displaying the doctor\'s name (in
large bold font), degrees (comma-separated), specialty, chamber name and
address, and optional logo aligned to the right. The left column (30%
width) contains Chief Complaints, Vitals, On Examination, and
Investigations, each with a labeled heading and the entered data. The
main section (70% width) displays the Rx symbol followed by the
medications list, where each medication is formatted with the brand
name, generic name in parentheses (bold), dosage, frequency, duration,
and any special instructions on subsequent lines. The advice section and
follow-up date appear below the medications. The footer section contains
the doctor\'s signature (or uploaded digital signature image for
Premium), the prescription date, and the QR code (2cm x 2cm) in the
bottom-right corner.

[]{#_Toc100051 .anchor}**7.4 Onboarding & Trust**

The onboarding experience is designed to achieve the \'Aha!\' moment
within 5 minutes of signup. A 3-step guided walkthrough leads the new
doctor through: Step 1 (Complete Your Profile) entering their name,
degrees, specialty, and chamber information; Step 2 (Customize Your
Prescription) uploading a logo and configuring the header layout with a
live preview; Step 3 (Write Your First Prescription) completing a test
prescription with a dummy patient to experience the full workflow. Each
step includes contextual tooltips and a progress indicator. The
walkthrough can be skipped and resumed later from the Settings page, but
completing it unlocks a \'Verified Doctor\' badge on their prescription
header.

The QR code verification system serves as both a trust mechanism and an
anti-forgery safeguard. Every prescription PDF includes a unique QR code
in the footer that encodes the URL
rxbd.com.bd/verify/\[prescription_id\]. Scanning the QR code opens a
public, read-only verification page that displays the doctor\'s name,
patient\'s name, visit date, and a tamper-evident status indicator
(green checkmark for verified, red warning if the prescription has been
modified since issuance). The verification page is implemented as a
server-side rendered Next.js page with ISR (Incremental Static
Regeneration) for performance, using a 60-second revalidation period to
balance freshness with cache efficiency.

[]{#_Toc100052 .anchor}**7.5 Internationalization (i18n)**

RxBD supports two languages: English (default) and Bengali (Bangla). The
interface language is determined first by the user\'s browser
Accept-Language header, then by the locale preference stored in the
doctor\'s profile, and finally by a manual toggle in the navigation bar.
All UI strings, form labels, button text, error messages, and onboarding
content are externalized into message catalogs using next-intl. The
prescription content itself (chief complaints, diagnosis, medication
instructions) is entered by the doctor in their preferred language and
is not auto-translated, as medical terminology requires precision that
machine translation cannot guarantee. The PDF template layout adapts to
the selected locale, adjusting for Bengali text direction
(left-to-right, same as English) and font rendering using Noto Sans
Bengali.

[]{#_Toc100053 .anchor}**8. Recommended Folder Structure**

The project follows a feature-organized Next.js 15 App Router structure
that groups related files by domain rather than by file type. This
organization improves developer navigation and makes it easier to locate
all files related to a specific feature.

  -------------------------------------------------------------------------
  **Directory**            **Contents**            **Purpose**
  ------------------------ ----------------------- ------------------------
  /app                     Next.js 15 App Router   Route definitions, page
                           pages and layouts       components, loading
                                                   states, error boundaries

  /app/(auth)              Authentication pages    Login, register, forgot
                                                   password, email
                                                   verification

  /app/(dashboard)         Authenticated doctor    Composer, patients,
                           pages                   history, settings,
                                                   subscription

  /app/(public)            Public pages            Landing page,
                                                   verification page
                                                   (/verify/\[id\]),
                                                   pricing

  /app/api/prescriptions   Prescription CRUD       POST create, GET
                           routes                  list/detail, PATCH
                                                   update, DELETE

  /app/api/patients        Patient CRUD routes     POST create, GET
                                                   search/list/detail,
                                                   PATCH update

  /app/api/subscription    Subscription management GET status, POST
                           routes                  upgrade, webhook handler

  /app/api/webhooks        External webhook        SSLCommerz IPN handler,
                           handlers                Supabase auth hooks

  /app/api/export          Data export routes      GET CSV/JSON export for
                                                   patient and prescription
                                                   data

  /components              Reusable UI components  shadcn/ui primitives,
                                                   prescription widgets,
                                                   layout components

  /components/composer     Composer-specific       MedicationRow,
                           components              VitalsInput,
                                                   MedicineSearch,
                                                   DiagnosisPicker

  /components/pdf          PDF template components PrescriptionPDF,
                                                   HeaderSection,
                                                   MedicationList,
                                                   QRCodeFooter

  /hooks                   Custom React hooks      useAutoSave,
                                                   useMedicineSearch,
                                                   useSubscription,
                                                   usePatientLookup

  /lib                     Utility functions and   Supabase client, Fuse.js
                           configuration           config, validation
                                                   helpers, constants

  /lib/supabase            Supabase client         Browser client
                           instances               (createBrowserClient),
                                                   server client
                                                   (createServerClient)

  /public/data             Static JSON datasets    medicines.json,
                                                   generics.json,
                                                   dgda-version.json

  /public/locales          i18n message catalogs   en.json (English),
                                                   bn.json (Bengali)

  /store                   Zustand state           prescriptionStore.ts
                           definitions             (composer state),
                                                   settingsStore.ts (UI
                                                   preferences)

  /types                   TypeScript type         prescription.ts,
                           definitions             patient.ts,
                                                   subscription.ts,
                                                   medicine.ts

  /middleware.ts           Next.js Middleware      Auth protection,
                                                   subscription gating,
                                                   locale detection

  /supabase/migrations     Database migration      Timestamped SQL files
                           files                   for schema changes

  /supabase/functions      Supabase Edge Functions Monthly counter reset,
                                                   backup triggers
  -------------------------------------------------------------------------

[]{#_Toc100054 .anchor}**9. Data Privacy & Compliance**

As a platform handling sensitive health information, RxBD must comply
with Bangladesh\'s data protection regulations and adhere to
international best practices for health data security. This section
details the compliance framework, data handling policies, and technical
safeguards implemented to protect patient and doctor data.

[]{#_Toc100055 .anchor}**9.1 Regulatory Compliance**

RxBD\'s data handling practices are designed to comply with the
Bangladesh Digital Security Act 2018, which establishes legal
requirements for the collection, processing, and storage of digital
data, including provisions for data breach notification and penalties
for unauthorized data access. Additionally, the platform aligns with the
principles of the Bangladesh Personal Data Protection Bill (draft),
which, while not yet enacted, is expected to establish data subject
rights, consent requirements, and cross-border data transfer
restrictions. By proactively adhering to these anticipated requirements,
RxBD positions itself for compliance with minimal disruption when the
bill becomes law.

The platform also follows the technical guidance provided by the
Bangladesh Medical and Dental Council (BMDC) regarding electronic
medical records, which recommends that digital prescription systems
maintain audit trails, enforce access controls, and ensure data
portability. While the BMDC has not yet published binding regulations
for digital prescriptions, RxBD\'s implementation of RLS, audit logging,
and CSV/JSON export functionality exceeds current advisory standards.

[]{#_Toc100056 .anchor}**9.2 Data Residency**

All patient and prescription data is stored exclusively in Supabase\'s
AWS ap-southeast-1 (Singapore) region, which is the closest available
Supabase region to Bangladesh and provides sub-50ms latency for most
Bangladeshi users. Supabase does not replicate data to other regions
without explicit customer configuration, ensuring that health data
remains within the Asia-Pacific jurisdiction. No data is transferred to
servers in the United States, European Union, or any other jurisdiction
with differing data protection standards. The choice of Singapore as the
data residency location is documented in the platform\'s privacy policy
and is non-negotiable, even if a different region would offer lower
costs.

[]{#_Toc100057 .anchor}**9.3 Encryption**

Data at rest is protected by Supabase\'s default AES-256 encryption for
all PostgreSQL data files and backups. Data in transit is encrypted via
TLS 1.3 for all connections between the client, Vercel, and Supabase.
Database backups generated by the GitHub Actions workflow are encrypted
using AES-256-CBC with a 256-bit key stored in GitHub Secrets (separate
from the backup repository). The encryption key is rotated every 90 days
by generating a new key, updating the GitHub Secret, and performing a
fresh encrypted backup before deleting backups encrypted with the old
key.

[]{#_Toc100058 .anchor}**9.4 Data Retention & Deletion**

When a doctor deletes their account, a 30-day grace period begins during
which the account can be restored by contacting support. During this
period, the doctor\'s data remains in the database but is inaccessible
(the RLS policy denies access to deleted users). After 30 days, an
automated Edge Function permanently deletes all data associated with the
doctor, including their profile, settings, patients, prescriptions, and
uploaded assets from Supabase Storage. The audit_log entries for the
deleted doctor are retained for 7 years with the doctor_id anonymized to
a hash, as required by the Digital Security Act 2018 for financial and
legal record-keeping purposes. Patients do not have direct accounts in
the system and cannot self-service delete their data; however, a doctor
can delete individual patient records, which are permanently removed
after the 30-day grace period.

[]{#_Toc100059 .anchor}**9.5 Patient Consent Mechanism**

When a doctor creates a new patient record, the patient entry form
includes a required checkbox: \'Patient has been informed that their
prescription data will be stored digitally on the RxBD platform.\' This
consent is recorded as a boolean field (consent_given) with a timestamp
on the patient record. While the current implementation relies on the
doctor to obtain verbal consent during the consultation, the future
Patient Portal feature (see Section 12) will enable direct digital
consent through a one-time SMS verification flow.

[]{#_Toc100060 .anchor}**9.6 Data Portability**

Doctors can export their complete patient list and prescription history
at any time through the Settings page. Free-tier doctors can export in
CSV format, which includes patient demographics and prescription
summaries (date, diagnosis, medication count). Premium doctors can
additionally export in JSON format, which includes the full prescription
payload including the medications JSONB array, enabling migration to
other EMR systems. The export is generated server-side as a streaming
response to handle large datasets without memory issues, and a download
link is emailed to the doctor upon completion.

[]{#_Toc100061 .anchor}**9.7 Privacy Transparency**

RxBD maintains a strict, non-negotiable policy against selling, sharing,
or monetizing patient or doctor data with third parties for any purpose.
This policy is enforced technically through RLS (no admin user has bulk
access to patient data), organizationally through access controls on the
Supabase dashboard (only the founding team has admin access), and
contractually through the Terms of Service. Anonymized, aggregate
analytics (e.g., total prescriptions created per day, most searched
generic names) may be used for product improvement but are never shared
externally.

[]{#_Toc100062 .anchor}**10. Pre-Launch Checklist**

The following checklist must be completed before the production launch.
Each item includes the responsible party and the verification method.

[]{#_Toc100063 .anchor}**10.1 Security**

  -----------------------------------------------------------------------
  **Item**                **Verification Method** **Owner**
  ----------------------- ----------------------- -----------------------
  RLS policies active on  Attempt data access     Backend
  all tables              with unauthorized       
                          auth.uid(); verify      
                          denial                  

  Authentication flows    Manual E2E test +       QA
  tested (signup, login,  automated Playwright    
  password reset, email   suite                   
  verification)                                   

  Environment variables   GitHub secret scanning  DevOps
  hidden (no .env in      enabled; verify no      
  repository)             secrets in git history  

  JWT token expiration    Test with expired       Backend
  and refresh working     tokens; verify graceful 
  correctly               re-authentication       

  SSLCommerz payment      Send test webhooks with Backend
  webhook signature       invalid signatures;     
  verification            verify rejection        

  Rate limiting on API    Load test with          DevOps
  routes (100 req/min per Artillery.js; verify    
  user)                   429 responses above     
                          threshold               

  CORS headers restricted Attempt API calls from  DevOps
  to rxbd.com.bd domain   unauthorized origins;   
                          verify rejection        

  Supabase service role   Audit all client-side   Security
  key never exposed to    code for service role   
  client                  key references          
  -----------------------------------------------------------------------

[]{#_Toc100064 .anchor}**10.2 Data & UX**

  -----------------------------------------------------------------------
  **Item**                **Verification Method** **Owner**
  ----------------------- ----------------------- -----------------------
  Medicine search returns Lighthouse + manual     Frontend
  results within 200ms    timing with slow 3G     
                          throttling              

  PDF layout renders      Manual print preview on QA
  correctly on A4 in      all 4 browsers; compare 
  Chrome, Firefox,        to reference design     
  Safari, Edge                                    

  Print scaling correct   Print test on 3         QA
  on desktop and mobile   printers; mobile        
                          browser print test      

  Bengali (Bangla) UI     Visual review of all    Frontend
  renders correctly       pages in Bengali locale 
  without text overflow                           

  Responsive composer     Chrome DevTools         QA
  works on tablet (768px) responsive mode + real  
  and phone (375px)       device testing          

  Auto-save restores      Disable network         Frontend
  draft after simulated   mid-composition; verify 
  connection loss         recovery prompt on      
                          reconnect               

  QR code links to        Scan QR from 5          QA
  correct verification    different printed       
  page                    prescriptions; verify   
                          each resolves           
  -----------------------------------------------------------------------

[]{#_Toc100065 .anchor}**10.3 Deployment**

  -----------------------------------------------------------------------
  **Item**                **Verification Method** **Owner**
  ----------------------- ----------------------- -----------------------
  Custom domain           HTTPS check; SSL Labs   DevOps
  (rxbd.com.bd)           A+ rating               
  configured with SSL                             

  Vercel Analytics        Visit site; verify data DevOps
  enabled and tracking    appears in Vercel       
  page views              dashboard within 5 min  

  Supabase backup         Trigger workflow        DevOps
  schedule verified       manually; verify        
  (daily GitHub Actions)  encrypted backup in     
                          private repo            

  Supabase free tier      Check Supabase          DevOps
  limits monitored (DB \< dashboard metrics; set  
  400MB, Auth \< 40K MAU) up alert at 80%         
                          threshold               

  DNS propagation         Check from 3 geographic DevOps
  complete and CDN        locations using         
  caching working         dnschecker.org          

  Error tracking (Sentry) Trigger a test error;   DevOps
  capturing unhandled     verify it appears in    
  exceptions              Sentry dashboard        

  Load test: 100          Run Artillery.js load   QA
  concurrent users        test; verify \<2s p95   
  creating prescriptions  response time           
  -----------------------------------------------------------------------

[]{#_Toc100066 .anchor}**10.4 Accessibility**

  -----------------------------------------------------------------------
  **Item**                **Verification Method** **Owner**
  ----------------------- ----------------------- -----------------------
  All form inputs have    Automated axe-core      Frontend
  associated labels       audit + manual screen   
                          reader test             

  Keyboard navigation     Tab through all         Frontend
  works for composer and  interactive elements;   
  search                  verify focus indicators 

  Color contrast meets    Automated Lighthouse    Frontend
  WCAG 2.1 AA (4.5:1 for  accessibility audit     
  text)                                           

  shadcn/ui components    Component-level audit   Frontend
  maintain ARIA           with React Testing      
  attributes              Library                 
  -----------------------------------------------------------------------

[]{#_Toc100067 .anchor}**11. Operational Readiness**

Operational readiness ensures that the RxBD team has the tools,
processes, and information needed to support doctors effectively from
day one. This section covers support infrastructure, beta testing
strategy, and analytics implementation.

[]{#_Toc100068 .anchor}**11.1 Support Strategy**

RxBD implements a tiered support model aligned with the subscription
tiers. Free-tier doctors receive support through a community forum
(built with GitHub Discussions for zero cost) and email support with a
72-hour response SLA. Premium doctors receive priority support via
WhatsApp Business API and email with a 24-hour response SLA.

The WhatsApp Business API integration is implemented using the WhatsApp
Business Platform (Cloud API, free tier: 1,000 conversations per month).
A dedicated business number is configured through Meta\'s Business
Manager. When a Premium doctor sends a WhatsApp message to the RxBD
support number, the message is received via webhook, logged in a support
tracking spreadsheet, and routed to the on-call support team member.
Responses are sent through the same WhatsApp channel, maintaining a
conversational context. For the launch phase, the support team consists
of the founding members, with a plan to hire a dedicated support agent
once Premium subscriptions exceed 50 active users.

[]{#_Toc100069 .anchor}**11.2 Beta Feedback Loop**

The beta program targets 3 to 5 pilot doctors selected through direct
outreach to the founding team\'s professional network. Selection
criteria include: active private chamber practice with a minimum of 20
patients per day, willingness to provide structured feedback via a
dedicated Google Form after each session, representation of at least 2
different medical specialties (to test specialty-specific prescription
patterns), and varying levels of technical literacy (from tech-savvy to
minimal computer experience).

Feedback is collected through three channels: a structured Google Form
distributed after each day of use (covering ease of use, search
accuracy, PDF quality, and feature requests), a dedicated WhatsApp group
for real-time issues and suggestions, and automated analytics tracking
of key usage metrics. The feedback is reviewed weekly by the founding
team, prioritized using a RICE (Reach, Impact, Confidence, Effort)
framework, and incorporated into the next sprint. A centralized feedback
tracker spreadsheet maintains a public changelog visible to all beta
participants, ensuring transparency and demonstrating responsiveness.

[]{#_Toc100070 .anchor}**11.3 Analytics Strategy**

PostHog is the primary analytics platform, chosen for its generous free
tier (1 million events per month), session replay capability, and
self-hosting option for future data sovereignty compliance. The
following key events are tracked with associated properties:

  -----------------------------------------------------------------------------
  **Event Name**                **Properties Tracked**  **Business Purpose**
  ----------------------------- ----------------------- -----------------------
  prescription_created          plan_tier,              Core activation metric;
                                medication_count,       measure product
                                is_returning_patient    stickiness

  medicine_search_used          query_length,           Measure search quality
                                results_count,          and usage patterns
                                selected_index          

  pdf_generated                 plan_tier, has_qr,      Track PDF as the
                                template_type           primary output action

  upgrade_modal_shown           trigger_reason          Measure conversion
                                (limit_reached,         funnel entry points
                                feature_gated,          
                                proactive)              

  upgrade_completed             plan_from, plan_to,     Track conversion and
                                payment_method          preferred payment
                                                        methods

  onboarding_step_completed     step_number,            Identify onboarding
                                time_spent_seconds      drop-off points

  auto_save_triggered           draft_size_kb,          Monitor auto-save
                                connection_status       reliability

  medicine_feedback_submitted   feedback_type,          Track crowdsourced
                                medicine_name           improvement velocity
  -----------------------------------------------------------------------------

Funnel analysis is configured for three key flows: Signup to First
Prescription (target: 80% completion within first session), First
Prescription to Fifth Prescription (target: 60% within first week), and
Free Tier Limit to Premium Upgrade (target: 15% conversion within 3
months of hitting limit). These targets are based on benchmarks from
similar SaaS products in emerging markets and will be adjusted based on
actual data during the beta period.

[]{#_Toc100071 .anchor}**12. Future Roadmap (Post-Launch)**

The post-launch roadmap is organized into three priority tiers based on
expected impact, implementation complexity, and alignment with the core
product vision. Items in Tier 1 are planned for implementation within 3
to 6 months after launch, Tier 2 within 6 to 12 months, and Tier 3
beyond 12 months, subject to user demand and resource availability.

[]{#_Toc100072 .anchor}**12.1 Tier 1: High Priority (3-6 Months)**

  -------------------------------------------------------------------------
  **Feature**       **Description**     **Business        **Estimated
                                        Value**           Effort**
  ----------------- ------------------- ----------------- -----------------
  PWA Offline       Implement Service   Critical for      3 weeks
  Support           Worker and Cache    rural areas with  
                    API for offline     poor internet;    
                    prescription        eliminates        
                    creation; sync      biggest usage     
                    drafts when         barrier           
                    connectivity                          
                    returns                               

  Drug Interaction  Real-time warnings  Patient safety    4 weeks
  Checker           for                 differentiator;   
                    contraindications   builds trust with 
                    between prescribed  doctors and       
                    medications using a regulators        
                    local interaction                     
                    rules engine                          

  Prescription      Create reusable     Major time-saver  2 weeks
  Templates         clinical protocols  for high-volume   
  (Macros)          (e.g., Gastritis,   doctors;          
                    Flu, Cold) for      strongest Premium 
                    1-click             conversion driver 
                    prescription                          
                    generation                            

  Bengali Voice     Integrate Web       Reduces typing    2 weeks
  Input             Speech API for      burden;           
                    Bengali             especially        
                    voice-to-text in    valuable for      
                    the CC and Advice   older doctors     
                    fields                                
  -------------------------------------------------------------------------

[]{#_Toc100073 .anchor}**12.2 Tier 2: Medium Priority (6-12 Months)**

  -----------------------------------------------------------------------
  **Feature**       **Description**   **Business        **Estimated
                                      Value**           Effort**
  ----------------- ----------------- ----------------- -----------------
  Patient Portal    Secure link for   Patient           6 weeks
                    patients to view  engagement;       
                    their             reduces doctor\'s 
                    prescriptions     manual            
                    online via        prescription      
                    SMS-delivered     sharing workload  
                    one-time access                     
                    token                               

  SMS Integration   Automatically     Reduces paper     3 weeks
                    send prescription usage; improves   
                    PDF links to      patient           
                    patient mobile    compliance and    
                    numbers via       record-keeping    
                    BulkSMSBD API                       

  Visual History    Patient visit     Better            4 weeks
  Timeline          timeline with     longitudinal care 
                    graphical trend   tracking;         
                    charts for vitals justifies Premium 
                    (BP, weight,      subscription      
                    blood sugar)                        
                    across visits                       

  Multi-Chamber     Allow a single    Serves doctors    3 weeks
  Support           doctor account to with multiple     
                    manage multiple   practice          
                    chamber locations locations         
                    with separate                       
                    settings and                        
                    schedules                           
  -----------------------------------------------------------------------

[]{#_Toc100074 .anchor}**12.3 Tier 3: Long-Term Vision (12+ Months)**

  ---------------------------------------------------------------------------
  **Feature**       **Description**       **Business        **Estimated
                                          Value**           Effort**
  ----------------- --------------------- ----------------- -----------------
  Lab Integration   Receive lab results   Closes the        8 weeks
  API               directly from         diagnostic loop;  
                    diagnostic centers    positions RxBD as 
                    via                   a clinical hub    
                    HL7/FHIR-compatible                     
                    API                                     

  Telemedicine      Video consultation    Addresses         10 weeks
  Module            integration with      post-COVID        
                    prescription          telehealth        
                    generation in the     demand; high      
                    same session          revenue potential 

  Pharmacy Network  Connect prescriptions Commission        12 weeks
                    to partner pharmacies revenue stream;   
                    for home delivery of  patient           
                    medications           convenience       

  AI-Assisted       Suggest differential  Competitive moat; 16 weeks
  Diagnosis         diagnoses based on    positions RxBD as 
                    entered symptoms      intelligent       
                    using a fine-tuned    clinical          
                    LLM                   assistant         
  ---------------------------------------------------------------------------

[]{#_Toc100075 .anchor}**13. Support FAQ**

This section provides answers to the most frequently asked questions,
organized by topic. These answers are also available on the RxBD website
at rxbd.com.bd/faq.

[]{#_Toc100076 .anchor}**13.1 Getting Started**

-   **Is RxBD truly free to use?** Yes. The core features of RxBD are
    completely free for up to 50 prescriptions per month. This limit
    resets automatically every 30 days. No credit card is required to
    sign up, and there are no hidden fees or trial periods that expire.

-   **Do I need to install any software?** No. RxBD is a web-based
    application accessible from any modern browser (Chrome, Firefox,
    Safari, Edge) on desktop, tablet, or phone. There is nothing to
    download or install. An offline-capable Progressive Web App (PWA)
    version is planned for future release.

-   **How do I get started with my first prescription?** After signing
    up with your email, complete your profile on the Settings page
    (name, degrees, specialty, chamber information). The guided
    onboarding walkthrough will then help you write a test prescription
    with a dummy patient. The entire setup takes less than 5 minutes.

-   **Is RxBD available in Bengali?** Yes. RxBD supports both English
    and Bengali (Bangla) interfaces. The language is automatically
    detected from your browser settings, and you can also switch
    manually using the language toggle in the navigation bar.

[]{#_Toc100077 .anchor}**13.2 Prescriptions & Usage**

-   **What happens if my internet connection is slow or drops?** RxBD
    has a Local-First auto-save feature that persists your draft
    prescription to your browser every 10 seconds. If you lose
    connectivity, your work is safe. When you reconnect, RxBD will
    detect your local draft and prompt you to resume exactly where you
    left off.

-   **How can I verify if a prescription is authentic?** Every
    prescription PDF includes a unique QR code in the footer. Scanning
    the QR code with any smartphone camera opens the official RxBD
    verification page, which displays the doctor\'s name, patient\'s
    name, visit date, and a verified status indicator. This ensures the
    prescription has not been tampered with.

-   **Can I save my frequent medicine lists?** Yes. Premium plan users
    can create Prescription Templates (Macros) for common conditions
    like Gastritis, Flu, or Cold. A Macro saves your entire medication
    set (with dosages and instructions) so you can load it with a single
    click during a consultation, saving significant time during
    high-volume sessions.

-   **What prescription formats are available?** RxBD generates
    prescriptions in PDF format that can be downloaded, printed on any
    standard A4 printer, or shared digitally. The print layout follows
    the standard Bangladesh medical prescription format that pharmacies
    expect.

[]{#_Toc100078 .anchor}**13.3 Security & Privacy**

-   **Is my patient data private and secure?** Yes. RxBD uses Row Level
    Security (RLS) at the database level to ensure that you have
    exclusive access to your patient records. No other doctor, nor even
    the RxBD team, can view your patient data. All data is encrypted
    both at rest (AES-256) and in transit (TLS 1.3). RxBD maintains a
    strict policy against selling or sharing patient or doctor data with
    third parties.

-   **Can I export my patient records?** Yes. You can export your entire
    patient list and prescription history from the Settings page.
    Free-tier users can export in CSV format, and Premium users can
    additionally export in JSON format for migration to other EMR
    systems.

-   **What happens to my data if I delete my account?** When you delete
    your account, a 30-day grace period allows you to change your mind
    and restore it. After 30 days, all your data (profile, patients,
    prescriptions, uploaded files) is permanently deleted from our
    servers. Anonymized audit records are retained for 7 years as
    required by law.

[]{#_Toc100079 .anchor}**13.4 Billing & Subscription**

-   **What is the difference between Free and Premium?** The Free plan
    includes 50 prescriptions per month with the standard PDF template.
    The Premium plan (BDT 499/month) unlocks unlimited prescriptions,
    custom letterhead branding with your logo and colors, digital
    signature embedding, Prescription Templates (Macros), full patient
    history, JSON data export, and priority WhatsApp support.

-   **How do I pay for the Premium plan?** We use SSLCommerz,
    Bangladesh\'s leading payment gateway, which supports bKash, Nagad,
    Rocket, DBBL Nexus, and Visa/Mastercard. You can pay directly from
    the upgrade page without leaving the application.

-   **Will I lose my data if my Premium subscription expires?** No. All
    your data remains fully accessible even after your Premium
    subscription expires. You simply revert to the Free tier with a
    50-prescription monthly limit. Your custom letterhead and digital
    signature settings are preserved and will reactivate if you
    resubscribe.

[]{#_Toc100080 .anchor}**14. Infrastructure Cost Analysis**

This appendix provides a detailed breakdown of infrastructure costs
under the free-tier strategy and the projected costs when scaling
requires paid plans. All figures are in USD unless otherwise noted.

[]{#_Toc100081 .anchor}**14.1 Free-Tier Cost Breakdown**

  ---------------------------------------------------------------------------
  **Service**       **Provider**      **Free Tier       **Estimated
                                      Allowance**       Capacity**
  ----------------- ----------------- ----------------- ---------------------
  Hosting & CDN     Vercel Hobby      100GB bandwidth,  \~2,000 doctors at 25
                                      6K build          prescriptions/month
                                      min/month         each

  Database          Supabase Free     500MB PostgreSQL, \~50,000
                                      5GB bandwidth     prescriptions
                                                        (average 10KB per
                                                        JSON payload)

  Authentication    Supabase Free     50K MAU, 500      Sufficient for entire
                                      email sends/day   initial user base

  File Storage      Supabase Free     1GB storage, 5GB  \~500 doctor
                                      bandwidth         avatars + 200
                                                        signatures at 1.5MB
                                                        each

  Error Tracking    Sentry Free       5K events/month,  Sufficient for
                                      1-day retention   initial monitoring

  Analytics         PostHog Free      1M events/month   Sufficient for 2,000+
                                                        daily active doctors

  Uptime Monitoring UptimeRobot Free  50 monitors,      2 monitors (app +
                                      5-min intervals   Supabase health)

  CI/CD             GitHub Actions    2,000             \~1,000 builds + 30
                    Free              minutes/month     daily backup runs

  Total Monthly                       \$0               
  Cost                                                  
  ---------------------------------------------------------------------------

[]{#_Toc100082 .anchor}**14.2 Scaling Cost Projections**

  ---------------------------------------------------------------------------
  **Users**      **Vercel       **Supabase     **Other Costs** **Total
                 Plan**         Plan**                         Monthly**
  -------------- -------------- -------------- --------------- --------------
  0-1,000        Hobby (Free)   Free           \$0             \$0

  1,000-5,000    Pro (\$20/mo)  Pro (\$25/mo)  Sentry Team     \~\$71
                                               (\$26/mo)       

  5,000-20,000   Pro (\$20/mo)  Pro            Sentry +        \~\$150-300
                                (\$25/mo) +    PostHog paid    
                                extra                          
                                bandwidth                      

  20,000+        Enterprise     Team or custom Full            \$500+
                 (custom)                      observability   
                                               stack           
  ---------------------------------------------------------------------------

The break-even point, where Premium subscription revenue covers
infrastructure costs, is estimated at approximately 150 Premium
subscribers (150 x BDT 499 = BDT 74,850 = approximately USD 680/month).
At 1,000 total registered doctors with a 15% Premium conversion rate
(150 Premium users), the platform becomes self-sustaining. This is
achievable within the first 6 to 9 months based on conservative growth
projections.

[]{#_Toc100083 .anchor}**15. Risk Register**

This appendix documents the identified risks to the RxBD project, their
likelihood, potential impact, and mitigation strategies. Risks are
reviewed and updated monthly during the development phase and quarterly
after launch.

  ------------------------------------------------------------------------------------
  **Risk ID**    **Risk          **Likelihood**   **Impact**     **Mitigation
                 Description**                                   Strategy**
  -------------- --------------- ---------------- -------------- ---------------------
  R01            Supabase free   Medium           High           Implement data
                 tier DB exceeds                                 archiving for
                 500MB before                                    prescriptions older
                 revenue                                         than 12 months;
                 supports Pro                                    compress JSONB
                 plan                                            payloads; monitor DB
                                                                 size weekly with 80%
                                                                 alert threshold

  R02            Vercel          Low              Medium         Profile API route
                 serverless                                      execution times; move
                 function                                        heavy operations to
                 timeout (10s)                                   Supabase Edge
                 insufficient                                    Functions; implement
                 for complex                                     pagination for large
                 prescription                                    data fetches
                 operations                                      

  R03            SSLCommerz      Low              High           Implement webhook
                 payment webhook                                 retry queue with
                 downtime causes                                 exponential backoff;
                 Premium upgrade                                 provide manual
                 failures                                        activation path via
                                                                 admin dashboard;
                                                                 monitor SSLCommerz
                                                                 status page

  R04            Medicine data   Medium           Medium         Automate monthly DGDA
                 becomes stale                                   data scraping;
                 as DGDA updates                                 implement hotfix
                 are not                                         system for critical
                 processed                                       corrections;
                 promptly                                        crowdsource feedback
                                                                 as a secondary data
                                                                 validation channel

  R05            User adoption   Medium           High           Conduct on-ground
                 is slower than                                  demos at medical
                 projected due                                   conferences; partner
                 to resistance                                   with 3-5 influential
                 to digital                                      doctors as advocates;
                 prescriptions                                   offer extended 90-day
                                                                 Premium trial for
                                                                 early adopters

  R06            Regulatory      Low              High           Maintain active
                 changes require                                 monitoring of
                 significant                                     Bangladesh Digital
                 architecture                                    Security Act
                 modifications                                   amendments; design
                                                                 architecture for
                                                                 compliance
                                                                 flexibility; engage
                                                                 legal counsel for
                                                                 periodic regulatory
                                                                 review

  R07            Competitor      Medium           Medium         Focus on UX speed and
                 launches a                                      Bangladesh-specific
                 similar product                                 features; build
                 targeting the                                   network effects
                 same segment                                    through doctor
                                                                 communities;
                                                                 establish brand
                                                                 through verified
                                                                 prescription trust

  R08            Data breach     Low              Critical       Enforce RLS on all
                 compromises                                     tables; implement
                 patient                                         rate limiting;
                 information                                     conduct quarterly
                                                                 security audits;
                                                                 maintain incident
                                                                 response plan with
                                                                 72-hour notification
                                                                 per DSA 2018
  ------------------------------------------------------------------------------------
