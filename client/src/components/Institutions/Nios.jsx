const Nios = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10
                        px-6 py-8 rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start md:hidden">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
                  National Institute of Open Schooling
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/nios.jpg" alt="Nios"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Opportunities Without Limits
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    The institution functions as a recognized study and examination centre of the 
                    National Institute of Open Schooling (NIOS). Through the academic support services 
                    offered here, students are assisted in completing their Secondary (SSLC) and Higher 
                    Secondary education.

                    Hundreds of students currently pursue their studies at this Secondary and Senior 
                    Secondary learning centre, which operates under the Ministry of Human Resource 
                    Development, Government of India.
                </p>
            </span>
          </div>

          {/* Image + Title */}
          <div className="flex-col items-start hidden md:flex">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900">
                  National Institute <span className="text-sm">of Open Schooling</span> 
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/nios.jpg" alt="Nios"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

        </div>
      </div>
  );
};


export default Nios;