const Thibyan = () => {
  return ( <>
    <div className="bg-background pb-6">
      <div className="max-w-6xl mx-auto px-4 pt-10">

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10
                        px-6 py-8 glass rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
              Thibyan Pre School
            </h1>

            <div className="w-full max-w-sm overflow-hidden rounded-md">
                <img src="/thibyan.jpg" alt="Thibyan-Pre-School"
              className="w-full object-cover transition-transform duration-300 ease-in-out
                hover:scale-110"
                />
            </div>
            
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    Let Children Learn
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2"> 
                    This institution is specially designed for young children, offering engaging 
                    and age-appropriate learning experiences for children from the age of three. The 
                    preschool provides Qur'anic education in a scientific and child-friendly manner, 
                    while also nurturing character formation and a disciplined lifestyle from an early age.

                    With specially trained teachers and modern classroom facilities, the preschool 
                    curriculum focuses on holistic development. Under the guidance of accomplished 
                    scholars, children receive instruction in Tajweed, Qur'an memorization, language 
                    training, and various skill-building activities. The programme follows a curriculum 
                    approved by the Islamic Educational Board of India, adding further distinction and 
                    credibility to the initiative.
                </p>
            </span>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};


export default Thibyan;