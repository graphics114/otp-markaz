const Madrasa = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10
                        px-6 py-8 rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start md:hidden">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
                  Isha'Athul Islam Madrasa
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/madrasa.jpg" alt="Isha'Athul-Islam-Madrasa"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Character Formation Through Religious Education
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    This madrasa functions with the objective of providing religious education 
                    and character development for children in Ottappalam and its surrounding areas, 
                    following the syllabus prescribed by the Sunni Education Board. In addition to textbook 
                    learning, students receive practical training and guidance in religious practices 
                    under the supervision of qualified and experienced teachers.
                </p>
            </span>
          </div>

          {/* Image + Title */}
          <div className="flex-col items-start hidden md:flex">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900">
                  Isha'Athul Islam Madrasa
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/madrasa.jpg" alt="Isha'Athul-Islam-Madrasa"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

        </div>
      </div>
  );
};


export default Madrasa;