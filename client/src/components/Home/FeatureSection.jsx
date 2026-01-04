import { Trophy, Building2, Users, User2, GraduationCap } from 'lucide-react';
import { FaAward, FaUsers } from "react-icons/fa6";
import { useEffect, useRef, useState } from 'react';

const FeatureSection = () => {

  const Features = [
    { id: 1, icon: FaAward, num: 30, descri: "Years of Excellence" },
    { id: 2, icon: Building2, num: 13, descri: "Educational Institutes" },
    { id: 3, icon: FaUsers, num: 2000, descri: "Active Students" },
    { id: 4, icon: Users, num: 10000, descri: "Happy Families" },
    { id: 5, icon: User2, num: 500, descri: "Dedicated Staff" },
    { id: 6, icon: GraduationCap, num: 5000, descri: "Successful Alumni" },
  ];

  const [counts, setCounts] = useState({});
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          Features.forEach(item => {
            startCount(item.id, item.num);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const startCount = (id, end) => {
    let start = 0;
    const duration = 2000;
    const stepTime = 30;
    const step = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCounts(prev => ({ ...prev, [id]: end }));
        clearInterval(timer);
      } else {
        setCounts(prev => ({ ...prev, [id]: start }));
      }
    }, stepTime);
  };

  return (
    <section ref={sectionRef} className="py-12 bg-secondary/5 relative">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground">
            Celebrating over three decades of educational brilliance and community service.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center relative z-10">
          {Features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="group p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">
                  {counts[item.id] || 0}+
                </h3>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  {item.descri}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;