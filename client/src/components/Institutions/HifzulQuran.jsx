const HifzulQuran = () => {
  return ( <>
    <div className="bg-background pb-6">
      <div className="max-w-6xl mx-auto px-4 pt-10">

        <div className="bg-secondary py-3 mb-8">
          <h1 className="text-2xl font-serif text-center">
            Institutions
          </h1>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10
                        px-6 py-8 glass rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
              Hifzul Qur'an College
            </h1>

            <div className="w-full max-w-sm overflow-hidden rounded-md">
                <img src="/Hifiz.jpg" alt="Hifzul-Quran-College"
              className="w-full object-cover transition-transform duration-300 ease-in-out
                hover:scale-110"
                />
            </div>
            
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    With the Sanctity of the Sacred Verses
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                        Ottappalam Markaz’s first major initiative began with this noble endeavor. 
                        The institution was established in the esteemed presence of renowned scholars 
                        such as Kaipamangalam Abdul Kareem Haji, Kundoor Abdul Khadir Musliyar, and Mathur 
                        Noor Muhammad Usthad. Since its inception, the institution has been progressing 
                        steadily by nurturing skilled Hafiz who have memorized the Holy Qur’an and excel 
                        in its recitation.

                        The presence of well-trained teachers and excellent facilities for Qur’anic studies 
                        distinguishes this institution from others. Combining traditional Hifz education and 
                        training with the support of modern technologies forms its core strength. Students 
                        from various districts across Kerala pursue their studies here.

                        To date, more than 300 students have successfully completed the memorization of 
                        the Holy Qur’an and graduated as qualified Hafiz.
                </p>
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};


export default HifzulQuran;