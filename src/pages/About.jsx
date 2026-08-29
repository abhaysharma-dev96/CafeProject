import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, Sparkles } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Clock size={24} />, value: '5', label: 'Years Running' },
    { icon: <Coffee size={24} />, value: '81k+', label: 'Cups Served' },
    { icon: <Sparkles size={24} />, value: '20', label: 'Artisanal Blends' }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The First Roast',
      desc: 'A small 1kg roaster in a garage marked the beginning of our quest for the perfect cup. Experimenting with single-origin beans sourced ethically.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKw2WsnrHk10t87Wrtl900O3zHsk19D7p7EX-6cWxDvPajf-qHHjhvXVNPQ53H0-PDHpOirCnWJWP2uj1NyG8OdTxJM_eNNFvmJ88PQND7r_FfsFx7iRiO-a1JtDgXwsrABIRjAmAfw8j_IKLk4bg_yDoieMz_IPwkgzy88vYjZGLKy9i8nsu4ZZg681KwiqIvuCA3pmdJUKX7aDT4GtmNgwCx1KiqAdR09V1X0_U8DBHL2jxD_io5',
      align: 'left'
    },
    {
      year: '2021',
      title: 'Opening the Hearth',
      desc: 'We opened our first physical space. A warm, minimalist sanctuary designed to bring people together over thoughtfully crafted pastries and exceptional coffee.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMFm31HgWMWu6Ckv2s6wZZ_WdeIRvjIEUEhjK48rASQ5F__sPyb4jphVZamnUwOtpRDUB0UT8cZxVuX2zGgoAlB4FT3lWqXebLsY1wNdE4SfihGNqSdOlvyc_dKYR7GCLr0YXGo0LMzkhY9bf-bZCNdR9f4_LExKPBVlXhC2SxKfPU27lFC7rrOGcl1UW6tqaJqQBwgVbVUePSoGG8d6gd7qnPRRIrvBr-7AuQBR-Smw3ODgil6Nip',
      align: 'right'
    },
    {
      year: '2024',
      title: 'Community & Growth',
      desc: 'Expanding our footprint while maintaining our commitment to quality. Launching our barista training program and expanding our pastry offerings.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEaK20Ow-Gy3-H4SJwy30d-fUTPGPXvtLDqvpiDDacRd_KJuTLP4hbnuAMeqO6EjIz6FDPs1XF7uaehUsdL-aW8IyfShkReNklbpOCQgOcd4KfYpiLmfwQIN5liOt3nxEW3Rl30x3Kpxtk1SL-WlacKETOtcI8OL_5RMhB_XY84_WITasuwKZOLc2D16e8RGGX6ZsxTQl7AdxAR1jcJwFqu8Y-y2PAqHlyodpr3qScSc030TO5Upap',
      align: 'left'
    }
  ];

  const team = [
    { name: 'Julian Hayes', role: 'Head Roaster', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvXj_BzfEHtju9K6A0dixWHF5u1VGj8nEOI1NUpnPakNWs-kV8MNuUu3SLNgwe07U0VHIh2POfyMZktAQ6eTKWBYwNLB344zQ-lCic3PtJW0vnj81kjVQSZf_WJ9V4U2V49AzrYEWU1mLSOd_7Mq81yXEHafZdx7jjL_Ibf_7WbqE3A14k_ZW6IGOpnh2y3-h2EzQCLMydLygce3iMUrwuuR5rrVLj237tSJiiMy8nvLvQoMsVV4C1' },
    { name: 'Elena Rostova', role: 'Master Baker', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApGl80h_Jmu-AK2nJeMAPoq3WaQFP8neWrLoQ2BcZFDSYHOdf1IYVfLcyHjY7bTpZ9WviH7gj2R-w5Ie5Q-Rhc7xhT7t7rLL8qh_O9ohqYHHMlWUo0nPHcbvv0hj9cWBwfzqc2SgrWHKfHcOkiC_CkbRvdArNv3PV1WSg6euySZjuwsplwinIGxLj3fES1nqJJJ8m-t9rUjZqDhTG5nusUI-Nw_FaApLyRXl_sRKlS1z68Mq2BwmUA' },
    { name: 'Marcus Vance', role: 'Founder', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASLSbOkZ1h0hLKBXVyBqgGYdZy-ahxoRhUL4NsS5aIMteACgTI_YIOiMxKuUl3LsqhqTyJ6F5YZts6dUbw2Myqs3CoQMi8qCnLOis3E3kjkJj-uiFCGTySXbhM6dj7AWIX3MNqIGKjxP-C7_G5v1UNYmImdxjmu4Zvdvf6l3e1vjjIjqpUR6-28r81_Z0HbW9JTQvxF1ihh02ELrdj7iCSUVuOjP-75cR_dcEjXOI02EHc53cCTYol' }
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline-lg text-6xl text-primary mb-6"
          >
            Our Story
          </motion.h1>
          <p className="text-secondary max-w-2xl mx-auto leading-relaxed">
            Crafting moments of warmth through meticulous roasting and artisanal baking. A journey from a humble spark to a community hearth.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[32px] text-center border border-primary/5 shadow-sm"
            >
              <div className="text-primary mb-6 flex justify-center">{stat.icon}</div>
              <div className="font-headline-md text-5xl text-primary mb-2">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-secondary/50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <section className="mb-32">
          <h2 className="font-headline-md text-4xl text-primary text-center mb-20">The Journey</h2>
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-primary/10 hidden md:block" />
            
            <div className="space-y-24">
              {timeline.map((item, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: item.align === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex-1"
                  >
                    <div className={`${item.align === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="bg-primary/5 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">{item.year}</span>
                      <h3 className="font-headline-md text-3xl text-primary mb-4">{item.title}</h3>
                      <p className="text-secondary/70 leading-relaxed max-w-md mx-auto md:mx-0">{item.desc}</p>
                    </div>
                  </motion.div>
                  
                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full bg-primary relative z-10 hidden md:block">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex-1"
                  >
                    <div className="rounded-[40px] overflow-hidden shadow-xl aspect-video md:aspect-[4/3]">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="font-headline-md text-4xl text-primary text-center mb-16">Meet The Craftspeople</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[32px] overflow-hidden border border-primary/5 shadow-sm"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h4 className="font-headline-md text-2xl text-primary">{member.name}</h4>
                  <p className="text-secondary/60 text-sm uppercase tracking-widest font-bold mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;