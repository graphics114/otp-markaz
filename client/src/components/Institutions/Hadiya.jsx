const Hadiya = () => {
  return ( <>
    <div className="bg-background pb-6">
      <div className="max-w-6xl mx-auto px-4 pt-10">

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10
                        px-6 py-8 glass rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
              Markaz Hadiya <span className="text-xl">Women's College</span>
            </h1>

            <div className="w-full max-w-sm overflow-hidden rounded-md">
                <img src="/hadiya.jpg" alt="Markaz-Hadiya-Women's-College"
              className="w-full object-cover transition-transform duration-300 ease-in-out
                hover:scale-110"
                />
            </div>
            
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    A New Pathway to Women's Empowerment
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    This noble institution provides young women who have completed SSLC 
                    and Plus Two with in-depth religious education alongside secular studies and 
                    comprehensive skill-development training. The institution offers certifications 
                    affiliated with the University of Calicut and Karanthoor Markaz, ensuring academic 
                    credibility and recognition.

                    In addition to formal education, the institution emphasizes holistic development 
                    through programs such as pre-marital counseling, personality development, first-aid 
                    training, soft skills development, and educational study tours. It also conducts two 
                    approved courses under the recognition of Markaz AWIS, Kozhikode, catering to diverse 
                    academic and professional aspirations.

                    The courses currently offered include: <br />

                    1.Hadiya Higher Secondary with Afsal-ul-Ulama Preliminary <br />

                    2.Hadiya Higher Secondary with Plus Two Commerce <br />

                    3.Hadiya Diploma with B.A. Afsal-ul-Ulama
                </p>
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};


export default Hadiya;