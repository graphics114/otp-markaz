import { useState, useRef } from 'react';
import { ArrowRight, CheckCircle2, BookOpen, GraduationCap, Calendar, Phone, X, User, MapPin, Layers, FileText, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { registerAdmition } from "../Store/slices/admitionSlice"

const Admission = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const { loading } = useSelector((state) => state.admition);

  const steps = [
    { id: 1, label: "Personal", icon: User },
    { id: 2, label: "Parents", icon: User }, // Using User icon again, could be Users if available
    { id: 3, label: "Address", icon: MapPin },
    { id: 4, label: "Academic", icon: BookOpen },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const [editData, setEditData] = useState({
    candidate_name: "",
    date_of_birth: "",
    phone_number: "",
    whatsapp_number: "",
    aadhar_number: "",
    blood_group: "",
    father_name: "",
    father_phone: "",
    father_occupation: "",
    mother_name: "",
    mother_phone: "",
    mother_occupation: "",
    guardian_name: "",
    guardian_phone: "",
    address_line1: "",
    address_line2: "",
    locality: "",
    country: "",
    state: "",
    district: "",
    pin_code: "",
    institution: "",
    syllabus: "",
    school_class: "",
    madrasa_class: "",
    medium: "",
    earlier: "",
    prv_institution: "",
    inst_contact: "",
    com_juz: "",
  });

  const handleAdmitionChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { district: "" }), // reset district when state changes
      ...(name === "country" && { state: "", district: "" }), // optional
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(registerAdmition(editData));
      setRegistration(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  // STATE
  const indiaStates = [
    {
      state: "Kerala",
      districts: [
        "Thiruvananthapuram",
        "Kollam",
        "Pathanamthitta",
        "Alappuzha",
        "Kottayam",
        "Idukki",
        "Ernakulam",
        "Thrissur",
        "Palakkad",
        "Malappuram",
        "Kozhikode",
        "Wayanad",
        "Kannur",
        "Kasaragod",
      ],
    },
    {
      state: "Tamil Nadu",
      districts: [
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Salem",
        "Tiruchirappalli",
      ],
    },
  ];

  const selectedStateObj = indiaStates.find(
    (s) => s.state === editData.state
  );

  const districts = selectedStateObj?.districts || [];

  return (
    <div className="min-h-screen bg-background pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header Section */}
        <div className="text-center space-y-4 animate-slide-in-top">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight">
            Admissions <span className="text-primary">Open</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Join our prestigious institutions for the academic year 2026-2027.
            Shape your future with world-class Islamic and academic education.
          </p>
        </div>

        {/* Featured Course: Hifzul Quran */}
        <div className="glass-panel p-6 md:p-12 rounded-3xl relative overflow-hidden group hover:shadow-glow transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                <Calendar className="w-4 h-4" /> Academic Year 2026-27
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-gray-700">Ottapalam Markaz</span><br />
                Hifzul Quran College</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our simplified Hifz course is designed to help students memorize the Holy Quran
                with Tajweed and proper pronunciation. We provide a spiritual environment
                that nurtures the student's connection with the Quran.
              </p>

              <ul className="space-y-3">
                {[
                  "Expert Qaris & Tutors",
                  "Individual Attention",
                  "Integrated Spiritual Studies",
                  "Quality Boarding Facilities"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p><strong>കൂടുതല്‍ വിവരങ്ങള്‍ക്ക് :</strong> <span className="text-gray-500">7994401787, 8606607260, 9809453239</span></p>
              <button onClick={() => setShowInstructions(true)}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground w-full md:w-auto justify-center px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:bg-primary/90 transition-all transform hover:-translate-y-1">
                Apply Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden shadow-2xl h-[250px] md:h-[400px] group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/Hifiz2.jpg"
                alt="Hifzul Quran Student"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-semibold text-lg">Excellence in</p>
                <p className="text-3xl font-bold">Memorization</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-foreground flex items-center gap-2 font-malayalam">
                <BookOpen className="w-5 h-5" /> നിര്‍ദ്ദേശങ്ങള്‍
              </h3>
              <button onClick={() => setShowInstructions(false)}
                className="text-primary-foreground/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-muted-foreground">
                Please read the following instructions carefully before applying:
              </p>
              <ul className="space-y-3">
                {[
                  "സ്‌കൂള്‍ 6-ാം ക്ലാസിലേക്ക് പ്രവേശനം.",
                  "സി ബി എസ് ഇ & കേരള സിലബസ് സൗകര്യം.",
                  "സികില്‍ ഡെവലപ്‌മെന്റ് പരിശീലനങ്ങള്‍.",
                  "രജിസ്‌ട്രേഷന്‍ ഓണ്‍ലൈനായി പൂര്‍ത്തിയാക്കണം.",
                  "ഫോം ഇംഗ്ലീഷില്‍ മാത്രമേ പൂരിപ്പിക്കാവൂ.",
                  "ഫോം ഫില്‍ ചെയ്ത ശേഷം ലഭിക്കുന്ന വാട്‌സ്ആപ്പ് ലിങ്ക് വഴി ഗ്രൂപ്പില്‍ നിര്‍ബന്ധമായും ജോയില്‍ ചെയ്യണം.",
                ].map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm text-foreground font-malayalam leading-relaxed">
                    <div className="min-w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-sans">
                      {index + 1}
                    </div>
                    {instruction}
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 text-sm text-muted-foreground space-y-1">
                <p><strong>Note:</strong> Admission is subject to availability of seats and performance in the interview.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-secondary/20 border-t border-border flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowInstructions(false)}
                className="px-5 py-2.5 rounded-full text-foreground hover:bg-secondary font-medium transition-colors w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={() => setRegistration(true)}
                target="_blank" rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 w-full sm:flex-1">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Registration Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Your application has been submitted successfully. We will contact you shortly.
              </p>
            </div>
            <div className="pt-2">
              <div className="p-5 bg-green-50 rounded-2xl border border-green-100 space-y-4">
                <div className="text-center">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Notice</p>
                  <p className="text-sm text-green-800 font-medium font-malayalam leading-relaxed">
                    അപ്‌ഡേറ്റുകൾക്കായി ദയവായി വാട്‌സ്ആപ്പ് ഗ്രൂപ്പിൽ ജോയിൻ ചെയ്യുക.
                  </p>
                  <p className="text-[11px] text-green-700 mt-1 opacity-80">
                    Please join our WhatsApp group for interview dates and updates.
                  </p>
                </div>

                <a href="https://chat.whatsapp.com/Dp3ZKP4Ks79JxvWllJjdgK?mode=gi_t" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95">
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Group
                </a>
              </div>
            </div>
            <button onClick={() => setShowSuccess(false)}
              className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {registration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-background w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] min-h-[500px] border border-border/50 animate-in zoom-in-95 duration-300">

            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-72 bg-secondary/30 border-r border-border p-6 flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary/50" />

              <div className="space-y-8 relative z-10">
                <div className="px-2">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    Admission
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 font-medium ml-1">Academic Year 2026-27</p>
                </div>

                <div className="relative pl-4">
                  {/* Vertical line connection */}
                  <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border -z-10 rounded-full" />

                  <div className="space-y-6">
                    {steps.map((step) => (
                      <div key={step.id} className={`flex items-center gap-4 relative group cursor-pointer`} onClick={() => step.id < currentStep ? prevStep() : null}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                          ${currentStep === step.id ? 'border-primary bg-primary text-primary-foreground shadow-md scale-125' :
                            currentStep > step.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}>
                          {currentStep > step.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <step.icon className="w-3 h-3" />}
                        </div>
                        <div className={`transition-all duration-300 ${currentStep === step.id ? 'opacity-100 translate-x-0' : 'opacity-70'}`}>
                          <span className={`text-sm font-bold block ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                          {currentStep === step.id && <span className="text-[10px] text-muted-foreground font-medium animate-in fade-in slide-in-from-left-2">In Progress</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground opacity-50 px-2">
                Markaz Admission Portal &copy; 2026
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full bg-background relative">

              {/* Mobile Header & Stepper */}
              <div className="md:hidden shrink-0 z-20 bg-background relative">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between text-card-foreground">
                  <div className="flex items-center gap-2 font-bold">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span>Admission Form</span>
                  </div>
                  <button type="button" onClick={() => setRegistration(false)} className="p-2 -mr-2 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Horizontal Stepper Mobile */}
                <div className="bg-secondary/10 px-4 py-4 border-b border-border/50">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-0.5 bg-secondary -z-10" />
                    <div className="absolute left-0 top-4 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                    {steps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground shadow-md scale-110' : 'bg-background border-border text-muted-foreground'
                          }`}>
                          {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground/60'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Close Button */}
              <button type="button" onClick={() => setRegistration(false)}
                className="hidden md:flex absolute top-4 right-4 z-50 p-2 rounded-full bg-secondary/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                <X className="w-5 h-5" />
              </button>

              {/* Main Form Area (Flex Column) */}
              <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden relative">

                {/* Scrollable Fields */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
                  <div className="max-w-3xl mx-auto space-y-8 pb-4">

                    {/* Step 1: Personal Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-foreground">Personal Details</h3>
                          <p className="text-muted-foreground text-sm">Please provide accurate personal information.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" name="candidate_name" value={editData.candidate_name} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none"
                              placeholder="e.g. Muhammed Ali" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Date of Birth <span className="text-red-500">*</span></label>
                            <input type="date" name="date_of_birth" value={editData.date_of_birth} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Blood Group</label>
                            <select name="blood_group" value={editData.blood_group} onChange={handleAdmitionChange}
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none appearance-none">
                              <option value="" disabled hidden>Select Group</option>
                              {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Phone Number <span className="text-red-500">*</span></label>
                            <input type="number" name="phone_number" value={editData.phone_number} onChange={handleAdmitionChange} required maxLength={10}
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none"
                              placeholder="Mobile" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">WhatsApp <span className="text-red-500">*</span></label>
                            <input type="number" name="whatsapp_number" value={editData.whatsapp_number} onChange={handleAdmitionChange} required maxLength={10}
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none"
                              placeholder="WhatsApp" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Aadhar Number <span className="text-red-500">*</span></label>
                            <input type="number" name="aadhar_number" value={editData.aadhar_number} onChange={handleAdmitionChange} required maxLength={12}
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none"
                              placeholder="12-digit UID" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Parent Information Section */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-foreground">Family Information</h3>
                          <p className="text-muted-foreground text-sm">Parent and Guardian contact details.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Father */}
                          <div className="space-y-4 p-5 bg-card rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                              <User className="w-4 h-4 text-primary" />
                              <h4 className="font-bold text-sm uppercase text-foreground">Father</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Father's Name <span className="text-red-500">*</span></label>
                                <input type="text" name="father_name" placeholder="Name" value={editData.father_name} onChange={handleAdmitionChange} required
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Phone Number</label>
                                <input type="tel" name="father_phone" placeholder="Phone" value={editData.father_phone} onChange={handleAdmitionChange}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Occupation</label>
                                <input type="text" name="father_occupation" placeholder="Occupation" value={editData.father_occupation} onChange={handleAdmitionChange}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                            </div>
                          </div>

                          {/* Mother */}
                          <div className="space-y-4 p-5 bg-card rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                              <User className="w-4 h-4 text-primary" />
                              <h4 className="font-bold text-sm uppercase text-foreground">Mother</h4>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Mother's Name <span className="text-red-500">*</span></label>
                                <input type="text" name="mother_name" placeholder="Name" value={editData.mother_name} onChange={handleAdmitionChange} required
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Phone Number</label>
                                <input type="tel" name="mother_phone" placeholder="Phone" value={editData.mother_phone} onChange={handleAdmitionChange}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Occupation</label>
                                <input type="text" name="mother_occupation" placeholder="Occupation" value={editData.mother_occupation} onChange={handleAdmitionChange}
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                            </div>
                          </div>

                          {/* Guardian */}
                          <div className="space-y-4 p-5 bg-card rounded-xl border border-border shadow-sm md:col-span-2">
                            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                              <User className="w-4 h-4 text-primary" />
                              <h4 className="font-bold text-sm uppercase text-foreground">Guardian</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Guardian Name <span className="text-red-500">*</span></label>
                                <input type="text" name="guardian_name" placeholder="Name" value={editData.guardian_name} onChange={handleAdmitionChange} required
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground ml-1">Guardian Phone <span className="text-red-500">*</span></label>
                                <input type="number" name="guardian_phone" placeholder="Phone" value={editData.guardian_phone} onChange={handleAdmitionChange} required
                                  className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Address Section */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-foreground">Address Details</h3>
                          <p className="text-muted-foreground text-sm">Permanent residential address.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Address Lines <span className="text-red-500">*</span></label>
                            <div className="flex flex-col gap-3">
                              <input type="text" name="address_line1" placeholder="House Name, Building, Street" value={editData.address_line1} onChange={handleAdmitionChange} required
                                className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                              <input type="text" name="address_line2" placeholder="Area, Landmark, Post Office (Optional)" value={editData.address_line2} onChange={handleAdmitionChange}
                                className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Locality <span className="text-red-500">*</span></label>
                            <input type="text" name="locality" value={editData.locality} onChange={handleAdmitionChange} required placeholder="Locality"
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Pincode <span className="text-red-500">*</span></label>
                            <input type="number" name="pin_code" placeholder="673..." value={editData.pin_code} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">State <span className="text-red-500">*</span></label>
                            <select name="state" value={editData.state} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none">
                              <option value="" disabled hidden>Select State</option>
                              {indiaStates.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">District <span className="text-red-500">*</span></label>
                            <select name="district" value={editData.district} onChange={handleAdmitionChange} disabled={!editData.state} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none disabled:opacity-50">
                              <option value="" disabled hidden>Select District</option>
                              {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Academic Section */}
                    {currentStep === 4 && (
                      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-foreground">Academic Profile</h3>
                          <p className="text-muted-foreground text-sm">Previous education and institution preferences.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Applying For <span className="text-red-500">*</span></label>
                            <select name="institution" value={editData.institution} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none">
                              <option value="" disabled hidden>Select institution</option>
                              <option value="Hifzul Quran College">Hifzul Quran College</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Current School Class <span className="text-red-500">*</span></label>
                            <input type="text" name="school_class" value={editData.school_class} onChange={handleAdmitionChange} required placeholder="School"
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">School Board <span className="text-red-500">*</span></label>
                            <select name="syllabus" value={editData.syllabus} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none">
                              <option value="" disabled hidden>Select Board</option>
                              <option value="CBSE">CBSE</option>
                              <option value="KERALA">KERALA</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Medium of Instruction <span className="text-red-500">*</span></label>
                            <select name="medium" value={editData.medium} onChange={handleAdmitionChange} required
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none">
                              <option value="" disabled hidden>Select Medium</option>
                              <option value="Malayalam">Malayalam</option>
                              <option value="English">English</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Current Madrassa Class <span className="text-red-500">*</span></label>
                            <input type="text" name="madrasa_class" value={editData.madrasa_class} onChange={handleAdmitionChange} required placeholder="Madrasa"
                              className="w-full px-4 py-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:bg-background transition-all outline-none" />
                          </div>
                        </div>

                        {/* Hifz Specific */}
                        {editData.institution === "Hifzul Quran College" && (
                          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Layers className="w-20 h-20 text-primary" />
                            </div>
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2 relative z-10">
                              <Layers className="w-5 h-5" /> Hifz History
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Have You studied earlier? <span className="text-red-500">*</span></label>
                                <select name="earlier" value={editData.earlier} onChange={handleAdmitionChange} required
                                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary transition-all outline-none">
                                  <option value="" disabled hidden>Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              {editData.earlier === "Yes" && (
                                <>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Previous Institution<span className="text-red-500">*</span></label>
                                    <input type="text" name="prv_institution" value={editData.prv_institution} onChange={handleAdmitionChange} required placeholder="Institution"
                                     className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary transition-all outline-none" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Institution Contact <span className="text-red-500">*</span></label>
                                    <input type="number" name="inst_contact" value={editData.inst_contact} onChange={handleAdmitionChange} required maxLength={10} placeholder="Contact"
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary transition-all outline-none" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-semibold tracking-wider text-muted-foreground ml-1">Juz Completed <span className="text-red-500">*</span></label>
                                    <input type="text" name="com_juz" value={editData.com_juz} onChange={handleAdmitionChange} required placeholder="Juz"
                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary transition-all outline-none" />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions (Sticky Bottom) */}
                <div className="shrink-0 p-4 border-t border-border bg-background z-20 flex justify-between gap-3">
                  <button type="button" onClick={currentStep === 1 ? () => setRegistration(false) : prevStep}
                    className="px-5 py-3 rounded-xl border border-border font-medium text-foreground w-full md:w-auto">
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  {currentStep < steps.length ? (
                    <button type="button" onClick={() => {
                      if (formRef.current?.reportValidity()) {
                        nextStep();
                      }
                    }}
                      className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold w-full md:w-auto flex justify-center items-center gap-2">
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={loading} className="px-5 py-3 rounded-xl bg-green-600 text-white font-bold w-full md:w-auto flex justify-center items-center gap-2 whitespace-nowrap">
                      {loading ? 'Processing...' : 'Submit Application'}
                      {!loading && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;