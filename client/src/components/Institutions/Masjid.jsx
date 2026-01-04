const Masjid = () => {
  return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10
                        px-6 py-8 rounded-md border border-border">

          {/* Image + Title */}
          <div className="flex flex-col items-start md:hidden">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900 text-center">
                  Msjidul Isha'a
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/mas.jpg" alt="Msjidul-Isha'a"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

          {/* Text Content */}
          <div className="flex items-center">
            <span>
                <h1 className="font-semibold text-xl md:text-2xl text-gray-700 border-b">
                    A Hub of Spiritual Experience
                </h1>
                <p className="text-muted-foreground leading-relaxed pt-2">  
                    Masjidul Isha'a serves as a spiritual center for Markaz students, visitors, 
                    and the local community, providing a serene space for worship and religious 
                    observances. Spiritual gatherings, prayer assemblies, and devotional 
                    programs offer comfort and inspiration to all those who love and support the Markaz.

                    Through its continuous involvement in social welfare initiatives in Ottappalam, 
                    this Da'wah centre has grown into one of the region's prominent cultural and 
                    spiritual landmarks, contributing meaningfully to the social fabric of the locality.
                </p>
            </span>
          </div>

          {/* Image + Title */}
          <div className="flex-col items-start hidden md:flex">
                <h1 className="font-bold text-2xl md:text-3xl pb-4 text-blue-900">
                  Msjidul Isha'a
                </h1>
                <div className="w-full max-w-sm overflow-hidden rounded-md">
                    <img src="/mas.jpg" alt="Msjidul-Isha'a"
                  className="w-full object-cover transition-transform duration-300 ease-in-out
                    hover:scale-110"
                    />
                </div>        
          </div>

        </div>
      </div>
  );
};


export default Masjid;