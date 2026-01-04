const IcsSchool = () => {
  return ( <>
    <div className="bg-background pb-6">
      <div className="max-w-6xl mx-auto px-4 pt-10">

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10
                        px-6 py-8 glass rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
              Islamic Central School
            </h1>

            <div className="w-full max-w-sm overflow-hidden rounded-md">
                <img src="/ics2.jpg" alt="Islamic-Central-School"
              className="w-full object-cover transition-transform duration-300 ease-in-out
                hover:scale-110"
                />
            </div>
            
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Nurturing a New Generation of Excellence
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    The Islamic Central School located on the Ottappalam Markaz campus is one of 
                    the finest schools in Palakkad district. The school offers a high-quality learning 
                    environment supported by dedicated and highly competent teachers. With a strong 
                    record of academic excellence, the institution has made remarkable progress in the 
                    field of school education and has contributed numerous students who have secured top 
                    ranks in competitive examinations.

                    Affiliated with the Central Board of Secondary Education (CBSE), New Delhi, 
                    the school ensures a balanced educational approach by providing madrasa studies 
                    based on the syllabus of the Islamic Educational Board of India, alongside a strong 
                    foundation in modern academic education.
                </p>
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};


export default IcsSchool;