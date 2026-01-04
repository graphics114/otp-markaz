const Uthmaniyya = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10
                        px-6 py-8 rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start md:hidden">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
                  Uthmaniyya College of Excellence
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/uth.jpg" alt="Uthmaniyya-College"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    A Purposeful Mission of Preachers
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    Ottappalam Markaz stands as an excellent model of integrated 
                    religious and secular education. Its primary objective is to nurture competent 
                    preachers scholarly talents equipped to face the challenges of the modern era. 
                    The college enables students to pursue traditional Dars studies based on the 
                    syllabus of Jamia'tul Hind al-Islamiyya, alongside secular education and university 
                    degrees under one roof, while also encouraging excellence in co-curricular disciplines.

                    With a curriculum that emphasizes religious propagation, the institution focuses 
                    on developing young scholars who possess a deep understanding of contemporary secular 
                    knowledge. In addition, Uthmaniyya College advances with a comprehensive academic and 
                    training framework that includes language studies, personality development, writing skills, 
                    public speaking and preaching training, preparation for competitive examinations, computer 
                    education, and educational study tours.

                    Alongside the Usmani religious degree, the college also facilitates access to 
                    professional courses offered by various universities.
                </p>
            </span>
          </div>

          {/* Image + Title */}
          <div className="flex-col items-start hidden md:flex">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900">
                  Uthmaniyya College <span className="text-sm">of Excellence</span> 
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/uth.jpg" alt="Hifzul-Quran-College"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

        </div>
      </div>
  );
};


export default Uthmaniyya;

