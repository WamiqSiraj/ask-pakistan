
import { useMemo, useState } from "react";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  LoaderCircle,
  X,
  ShieldCheck,
  IdCard,
  Plane,
  Landmark,
  GraduationCap,
  BriefcaseBusiness,
  CarFront,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import { askGeminiAssistant } from "../services/geminiService";

// Official website directory.
// Add more verified services here as the platform grows.
const SERVICES = [
  {
    id: "cnic",
    title: "CNIC & Identity Services",
    category: "Identity",
    authority: "NADRA",
    jurisdiction: "Federal",
    description:
      "Explore identity card applications, renewals, modifications and identity-related services.",
    keywords: "cnic nicop identity id card renewal nadra pakid",
    url: "https://www.nadra.gov.pk/",
    question:
      "How can I apply for, renew, or modify my CNIC through NADRA? Explain the current official process and where to verify requirements.",
    popular: true,
  },
  {
    id: "passport",
    title: "Passport Services",
    category: "Travel",
    authority: "Directorate General of Immigration & Passports",
    jurisdiction: "Federal",
    description:
      "Find information about Pakistani passports, renewals, application procedures and official requirements.",
    keywords: "passport renewal dgip travel immigration",
    url: "https://dgip.gov.pk/",
    question:
      "How do I apply for or renew a Pakistani passport? Explain the official procedure and available application options.",
    popular: true,
  },
  {
    id: "fbr",
    title: "Tax Registration & Filing",
    category: "Tax",
    authority: "Federal Board of Revenue",
    jurisdiction: "Federal",
    description:
      "Explore income tax registration, tax returns and taxpayer information.",
    keywords: "fbr ntn filer tax iris income returns atl",
    url: "https://www.fbr.gov.pk/",
    question:
      "Explain how to register with FBR, file an income tax return and verify taxpayer status using official services.",
    popular: true,
  },
  {
    id: "hec",
    title: "Degree Attestation",
    category: "Education",
    authority: "Higher Education Commission",
    jurisdiction: "Federal",
    description:
      "Learn about university degree attestation, verification and higher education resources.",
    keywords: "hec degree attestation verification university education",
    url: "https://www.hec.gov.pk/",
    question:
      "How can I get my university degree attested by HEC in Pakistan? Explain the current application process.",
    popular: true,
  },
  {
    id: "secp",
    title: "Company Registration",
    category: "Business",
    authority: "Securities and Exchange Commission of Pakistan",
    jurisdiction: "Federal",
    description:
      "Discover official company incorporation, registration and corporate compliance resources.",
    keywords: "secp company incorporation business registration",
    url: "https://www.secp.gov.pk/",
    question:
      "How do I register a company in Pakistan through SECP? Explain the steps and official requirements.",
    popular: false,
  },
  {
    id: "license-punjab",
    title: "Driving Licence — Punjab",
    category: "Transport",
    authority: "Punjab Traffic Police",
    jurisdiction: "Punjab",
    description:
      "Find official driving licence information and procedures for Punjab.",
    keywords: "driving licence license dlims punjab learner renewal",
    url: "https://trafficpolice.punjab.gov.pk/",
    question:
      "Explain how to apply for or renew a driving licence in Punjab, Pakistan, using official sources.",
    popular: false,
  },
  {
    id: "vehicle-punjab",
    title: "Vehicle Registration — Punjab",
    category: "Transport",
    authority: "Punjab Excise & Taxation",
    jurisdiction: "Punjab",
    description:
      "Find vehicle registration, taxation and verification information for Punjab.",
    keywords: "vehicle car motorcycle mtmis punjab excise registration",
    url: "https://excise.punjab.gov.pk/",
    question:
      "How can I verify or register a vehicle in Punjab through the Excise Department?",
    popular: false,
  },
  {
    id: "vehicle-sindh",
    title: "Vehicle Registration — Sindh",
    category: "Transport",
    authority: "Sindh Excise & Taxation",
    jurisdiction: "Sindh",
    description:
      "Access official information about vehicle registration and taxation in Sindh.",
    keywords: "vehicle sindh excise car motorcycle registration",
    url: "https://excise.gos.pk/",
    question:
      "How do I verify a vehicle registration or find vehicle registration requirements in Sindh?",
    popular: false,
  },
  {
    id: "punjab-services",
    title: "Punjab Citizen Services",
    category: "Identity",
    authority: "Government of Punjab",
    jurisdiction: "Punjab",
    description:
      "Explore Punjab government citizen services and administrative resources.",
    keywords: "punjab certificate domicile birth citizen government",
    url: "https://punjab.gov.pk/",
    question:
      "Where can I find official Punjab government services for citizens, including certificates and administrative procedures?",
    popular: false,
  },
  {
    id: "sindh-services",
    title: "Sindh Government Services",
    category: "Identity",
    authority: "Government of Sindh",
    jurisdiction: "Sindh",
    description:
      "Find Sindh provincial government departments and citizen service information.",
    keywords: "sindh services domicile birth certificate citizen",
    url: "https://www.sindh.gov.pk/",
    question:
      "How do I find and access citizen services offered by the Government of Sindh?",
    popular: false,
  },
  {
    id: "kp-services",
    title: "Khyber Pakhtunkhwa Services",
    category: "Identity",
    authority: "Government of Khyber Pakhtunkhwa",
    jurisdiction: "Khyber Pakhtunkhwa",
    description:
      "Browse provincial services, departments and official citizen information.",
    keywords: "kpk kp kpt services domicile government",
    url: "https://kp.gov.pk/",
    question:
      "Where can I find official government services and certificate information in Khyber Pakhtunkhwa?",
    popular: false,
  },
];

const CATEGORIES = [
  { name: "Identity", icon: IdCard, subtitle: "CNIC & documents" },
  { name: "Travel", icon: Plane, subtitle: "Passports & travel" },
  { name: "Tax", icon: Landmark, subtitle: "FBR & filing" },
  { name: "Education", icon: GraduationCap, subtitle: "Degrees & HEC" },
  { name: "Business", icon: BriefcaseBusiness, subtitle: "Companies & SECP" },
  { name: "Transport", icon: CarFront, subtitle: "Licences & vehicles" },
];

const ICONS = {
  Identity: IdCard,
  Travel: Plane,
  Tax: Landmark,
  Education: GraduationCap,
  Business: BriefcaseBusiness,
  Transport: CarFront,
};

const LOCATIONS = [
  "All regions",
  "Federal",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
];

const POPULAR_SEARCHES = [
  "Renew CNIC",
  "Passport",
  "Tax filing",
  "Degree attestation",
];

function ServiceCard({ service, onSelect, onAsk }) {
  const Icon = ICONS[service.category] || FileText;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#E4E8E1] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#B1C7B8] hover:shadow-lg">
      <div className="mb-5 flex items-start justify-between">
        <div className="rounded-xl bg-[#EAF2EB] p-3 text-[#20583F]">
          <Icon size={24} strokeWidth={1.7} />
        </div>

        {service.popular && (
          <span className="rounded-full bg-[#F3F1E8] px-3 py-1 text-[11px] font-semibold text-[#746A42]">
            Popular
          </span>
        )}
      </div>

      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64806D]">
        {service.category} · {service.jurisdiction}
      </div>

      <h3 className="mb-3 text-xl font-semibold tracking-tight text-[#15271F]">
        {service.title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-6 text-[#65746B]">
        {service.description}
      </p>

      <p className="mb-5 flex items-center gap-2 text-xs text-[#53675A]">
        <Landmark size={14} />
        {service.authority}
      </p>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#EDF0EA] pt-4">
        <button
          type="button"
          onClick={() => onSelect(service)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#184B36] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#103B29]"
        >
          View service
          <ArrowRight size={15} />
        </button>

        <button
          type="button"
          onClick={() => onAsk(service)}
          title={`Ask AI about ${service.title}`}
          aria-label={`Ask AI about ${service.title}`}
          className="rounded-xl border border-[#DDE6DC] p-3 text-[#215D40] transition hover:bg-[#EAF2EB]"
        >
          <Sparkles size={17} />
        </button>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All regions");
  const [selectedService, setSelectedService] = useState(null);

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();

    return SERVICES.filter((service) => {
      const matchCategory =
        category === "All" || service.category === category;

      const matchLocation =
        location === "All regions" ||
        service.jurisdiction === "Federal" ||
        service.jurisdiction === location;

      const searchable = [
        service.title,
        service.description,
        service.authority,
        service.category,
        service.keywords,
        service.jurisdiction,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchCategory &&
        matchLocation &&
        (!term || searchable.includes(term))
      );
    });
  }, [search, category, location]);

  const popular = SERVICES.filter((service) => service.popular);

  async function askAboutService(service) {
    setSelectedService(service);
    setAiQuestion(service.question);
    setAiAnswer("");
    setAiError("");
    setAiLoading(true);

    try {
      const answer = await askGeminiAssistant(service.question);
      setAiAnswer(answer);
    } catch (error) {
      setAiError(
        error.message ||
          "AI assistance is unavailable right now. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  }

  function closeDetails() {
    if (aiLoading) return;

    setSelectedService(null);
    setAiQuestion("");
    setAiAnswer("");
    setAiError("");
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setLocation("All regions");
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#172B20]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#123B2A] px-5 py-16 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-12 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-[#CDE5D3]">
            <ShieldCheck size={15} />
            ASK PAKISTAN / SERVICES HUB
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            What do you need
            <br />
            <span className="font-serif italic text-[#B8D6B8]">
              to get done?
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#D0E1D5] sm:text-lg">
            One place to discover Pakistani public services.
            Find the right department, explore official resources
            and get AI-powered guidance.
          </p>

          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-xl sm:px-5">
            <Search size={22} className="shrink-0 text-[#668171]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search CNIC, passport, tax, education..."
              aria-label="Search government services"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#15291D] outline-none placeholder:text-[#87958B] sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-[#6D8073]"
              >
                <X size={18} />
              </button>
            )}

            <a
              href="#service-directory"
              aria-label="Browse matching services"
              className="rounded-xl bg-[#20583F] p-3 text-white transition hover:bg-[#143E2C]"
            >
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs text-[#B9D3C1]">
              Popular searches:
            </span>

            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearch(term);
                  setCategory("All");
                }}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/20"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3F7352]">
            Find your way
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Explore by category
          </h2>
          <p className="mt-2 text-sm text-[#68766C]">
            Choose a category to discover relevant government services.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ name, icon: Icon, subtitle }) => {
            const active = category === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(active ? "All" : name)}
                aria-pressed={active}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  active
                    ? "border-[#20583F] bg-[#E7F0E8] shadow-sm"
                    : "border-[#E3E8E1] bg-white hover:border-[#AFC5B3]"
                }`}
              >
                <div className="mb-6 inline-flex rounded-xl bg-[#EEF3ED] p-3 text-[#20583F]">
                  <Icon size={24} strokeWidth={1.7} />
                </div>
                <h3 className="text-sm font-semibold">{name}</h3>
                <p className="mt-1 text-xs text-[#78867B]">{subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* DIRECTORY */}
      <section
        id="service-directory"
        className="mx-auto max-w-6xl scroll-mt-8 px-5 pb-20"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3F7352]">
              Government directory
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Discover services
            </h2>
            <p className="mt-2 text-sm text-[#68766C]">
              Browse curated official government resources.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#617466]">
            <CheckCircle2 size={17} className="text-[#276344]" />
            {filteredServices.length} matching services
          </div>
        </div>

        <div className="mb-7 flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-[#DEE5DC] bg-white px-4 py-3 text-sm text-[#20352A] outline-none focus:border-[#29724B]"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by region"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-xl border border-[#DEE5DC] bg-white px-4 py-3 text-sm text-[#20352A] outline-none focus:border-[#29724B]"
          >
            {LOCATIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {(search || category !== "All" || location !== "All regions") && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[#246044] hover:underline"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          )}
        </div>

        {filteredServices.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={setSelectedService}
                onAsk={askAboutService}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E2E7E0] bg-white px-6 py-16 text-center">
            <Search size={35} className="mx-auto text-[#829487]" />
            <h3 className="mt-4 text-xl font-semibold">
              No matching services
            </h3>
            <p className="mt-2 text-sm text-[#6D7D71]">
              Try a different search term, category or region.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-[#20583F] px-5 py-3 text-sm font-semibold text-white"
            >
              Show all services
            </button>
          </div>
        )}

        {/* AI PROMOTION */}
        <div className="mt-14 flex flex-col gap-7 rounded-3xl bg-[#E9EFE6] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex rounded-xl bg-white p-3 text-[#20583F]">
              <Sparkles size={23} />
            </div>

            <h2 className="text-2xl font-semibold sm:text-3xl">
              Not sure where to start?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#5F7063]">
              Ask Pakistan can help explain government services,
              identify responsible departments and guide you
              toward official information.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-3 self-start rounded-xl bg-[#20583F] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#143E2C]"
          >
            Ask Pakistan AI
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E3E7DC] bg-white p-4 text-xs leading-6 text-[#647366]">
          <ShieldCheck size={19} className="shrink-0 text-[#2D6948]" />
          Ask Pakistan is an independent information platform,
          not an official government portal. Always verify fees,
          eligibility, requirements and procedures with the
          responsible government authority.
        </div>
      </section>

      {/* SERVICE DETAILS MODAL */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#091C13]/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-dialog-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#37754E]">
                  {selectedService.category} / {selectedService.jurisdiction}
                </span>

                <h2
                  id="service-dialog-title"
                  className="mt-2 text-2xl font-semibold"
                >
                  {selectedService.title}
                </h2>

                <p className="mt-2 text-sm text-[#6A7A6C]">
                  {selectedService.authority}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                disabled={aiLoading}
                className="rounded-xl bg-[#F0F3EF] p-2 text-[#37513D] disabled:opacity-50"
                aria-label="Close service details"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 leading-7 text-[#5B6D5F]">
              {selectedService.description}
            </p>

            <div className="rounded-xl border border-[#DDE7DC] bg-[#F5F8F4] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Landmark size={19} className="text-[#246044]" />
                <h3 className="font-semibold">
                  Official government resource
                </h3>
              </div>

              <p className="mb-4 text-sm text-[#657668]">
                Visit the responsible authority to verify
                the latest information and access official services.
              </p>

              <a
                href={selectedService.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 break-all text-sm font-semibold text-[#20583F] hover:underline"
              >
                {selectedService.url}
                <ExternalLink size={15} className="shrink-0" />
              </a>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-[#2E734F]" />
                <h3 className="text-lg font-semibold">AI service guide</h3>
              </div>

              <p className="mb-4 text-sm text-[#69786B]">
                Get an explanation of the process, possible
                requirements and steps to verify with the authority.
              </p>

              {!aiAnswer && !aiLoading && !aiError && (
                <button
                  type="button"
                  onClick={() => askAboutService(selectedService)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#20583F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#143E2C]"
                >
                  <Sparkles size={17} />
                  Generate AI guidance
                </button>
              )}

              {aiLoading && (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-xl bg-[#F1F5EF] p-5 text-sm text-[#46634D]"
                >
                  <LoaderCircle size={20} className="animate-spin" />
                  Preparing your service guide...
                </div>
              )}

              {aiError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={17} />
                    {aiError}
                  </div>
                  <button
                    type="button"
                    onClick={() => askAboutService(selectedService)}
                    className="mt-3 font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {aiAnswer && (
                <div className="rounded-xl border border-[#DDE7DC] bg-[#F7F9F5] p-5">
                  <p className="mb-3 text-xs font-semibold text-[#477453]">
                    QUESTION: {aiQuestion}
                  </p>

                  <div className="whitespace-pre-wrap text-sm leading-7 text-[#334B39]">
                    {aiAnswer}
                  </div>

                  <div className="mt-5 border-t border-[#DDE7DC] pt-4 text-xs leading-6 text-[#69796D]">
                    AI-generated information may be incomplete or
                    outdated. Verify the instructions against
                    the official government website above.
                  </div>

                  <button
                    type="button"
                    onClick={() => askAboutService(selectedService)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#246044]"
                  >
                    <RotateCcw size={15} />
                    Regenerate guidance
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={closeDetails}
              disabled={aiLoading}
              className="mt-7 w-full rounded-xl border border-[#DDE5DC] px-4 py-3 text-sm font-semibold text-[#3F5B46] disabled:opacity-50"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
