import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Nav
  'nav.home': { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'nav.about': { en: 'About Us', hi: 'हमारे बारे में', mr: 'आमच्याबद्दल' },
  'nav.academics': { en: 'Academics', hi: 'शैक्षणिक', mr: 'शैक्षणिक' },
  'nav.admissions': { en: 'Admissions', hi: 'प्रवेश', mr: 'प्रवेश' },
  'nav.faculty': { en: 'Faculty', hi: 'शिक्षक', mr: 'शिक्षक' },
  'nav.gallery': { en: 'Gallery', hi: 'गैलरी', mr: 'गॅलरी' },
  'nav.events': { en: 'Events & News', hi: 'कार्यक्रम और समाचार', mr: 'कार्यक्रम व बातम्या' },
  'nav.students': { en: 'Student Corner', hi: 'छात्र कोना', mr: 'विद्यार्थी कोपरा' },
  'nav.parents': { en: 'Parent Portal', hi: 'अभिभावक पोर्टल', mr: 'पालक पोर्टल' },
  'nav.contact': { en: 'Contact Us', hi: 'संपर्क करें', mr: 'संपर्क' },

  // Hero
  'hero.tagline': { en: 'Nurturing Minds, Shaping Futures', hi: 'मन का पोषण, भविष्य का निर्माण', mr: 'मनाचे पोषण, भविष्याची जडणघडण' },
  'hero.subtitle': { en: 'Providing quality education with strong values since 2016. Empowering students to become leaders of tomorrow.', hi: '2016 से गुणवत्तापूर्ण शिक्षा और मजबूत मूल्यों के साथ। छात्रों को कल के नेता बनने के लिए सशक्त बनाना।', mr: '2016 पासून दर्जेदार शिक्षण आणि मजबूत मूल्यांसह. विद्यार्थ्यांना उद्याचे नेते बनण्यासाठी सक्षम करणे.' },
  'hero.apply': { en: 'Apply Now', hi: 'अभी आवेदन करें', mr: 'आत्ता अर्ज करा' },
  'hero.explore': { en: 'Explore More', hi: 'और जानें', mr: 'अधिक जाणून घ्या' },

  // Stats
  'stats.years': { en: 'Years of Excellence', hi: 'उत्कृष्टता के वर्ष', mr: 'उत्कृष्टतेची वर्षे' },
  'stats.students': { en: 'Students Enrolled', hi: 'नामांकित छात्र', mr: 'नोंदणीकृत विद्यार्थी' },
  'stats.teachers': { en: 'Expert Teachers', hi: 'विशेषज्ञ शिक्षक', mr: 'तज्ञ शिक्षक' },
  'stats.pass': { en: 'Pass Rate', hi: 'उत्तीर्ण दर', mr: 'उत्तीर्ण दर' },

  // Sections
  'highlights.admissions': { en: '🎓 Admissions Open 2025-26', hi: '🎓 प्रवेश खुले 2025-26', mr: '🎓 प्रवेश सुरू 2025-26' },
  'highlights.results': { en: '📊 Board Results: 98.5% Pass', hi: '📊 बोर्ड परिणाम: 98.5% उत्तीर्ण', mr: '📊 बोर्ड निकाल: 98.5% उत्तीर्ण' },
  'highlights.events': { en: '🏅 Annual Sports Day - March 2025', hi: '🏅 वार्षिक खेल दिवस - मार्च 2025', mr: '🏅 वार्षिक क्रीडा दिन - मार्च 2025' },

  'about.title': { en: 'About Our School', hi: 'हमारे विद्यालय के बारे में', mr: 'आमच्या शाळेबद्दल' },
  'about.desc': { en: 'Gurukul Vidyalay & Jr. College has been a beacon of education in Maharashtra for nearly four decades. Our school combines traditional Indian values with modern teaching methodologies to create well-rounded individuals ready for the challenges of the 21st century.', hi: 'गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज लगभग चार दशकों से महाराष्ट्र में शिक्षा का केंद्र रहा है। हमारा विद्यालय पारंपरिक भारतीय मूल्यों को आधुनिक शिक्षण पद्धतियों के साथ जोड़ता है।', mr: 'गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज जवळजवळ चार दशकांपासून महाराष्ट्रातील शिक्षणाचा दीपस्तंभ आहे. आमची शाळा पारंपरिक भारतीय मूल्ये आणि आधुनिक शिक्षण पद्धतींचा मेळ घालते.' },

  'testimonials.title': { en: 'What Parents & Students Say', hi: 'अभिभावक और छात्र क्या कहते हैं', mr: 'पालक आणि विद्यार्थी काय म्हणतात' },

  'cta.title': { en: 'Ready to Join Our School Family?', hi: 'हमारे स्कूल परिवार में शामिल होने के लिए तैयार?', mr: 'आमच्या शाळा कुटुंबात सामील होण्यास तयार?' },
  'cta.subtitle': { en: 'Applications for the 2025-26 academic session are now open. Give your child the gift of quality education.', hi: '2025-26 शैक्षणिक सत्र के लिए आवेदन अब खुले हैं। अपने बच्चे को गुणवत्तापूर्ण शिक्षा का उपहार दें।', mr: '2025-26 शैक्षणिक सत्रासाठी अर्ज आता सुरू आहेत. आपल्या मुलाला दर्जेदार शिक्षणाची भेट द्या.' },
  'cta.apply': { en: 'Start Application', hi: 'आवेदन शुरू करें', mr: 'अर्ज सुरू करा' },
  'cta.contact': { en: 'Contact Us', hi: 'संपर्क करें', mr: 'संपर्क करा' },

  // Footer
  'footer.desc': { en: 'Providing quality education since 2016. Affiliated to Shivaji University, Kolhapur.', hi: '2016 से गुणवत्तापूर्ण शिक्षा। शिवाजी विद्यापीठ, कोल्हापूर से संबद्ध।', mr: '2016 पासून दर्जेदार शिक्षण. शिवाजी विद्यापीठ, कोल्हापूर संलग्न.' },
  'footer.quicklinks': { en: 'Quick Links', hi: 'त्वरित लिंक', mr: 'जलद दुवे' },
  'footer.contact': { en: 'Contact Info', hi: 'संपर्क जानकारी', mr: 'संपर्क माहिती' },
  'footer.hours': { en: 'Office Hours', hi: 'कार्यालय समय', mr: 'कार्यालयीन वेळ' },
  'footer.rights': { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।', mr: 'सर्व हक्क राखीव.' },

  // About Page
  'about.page.title': { en: 'About Gurukul Vidyalay & Jr. College', hi: 'गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज के बारे में', mr: 'गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज बद्दल' },
  'about.history.title': { en: 'Our History', hi: 'हमारा इतिहास', mr: 'आमचा इतिहास' },
  'about.vision.title': { en: 'Vision & Mission', hi: 'दृष्टि और मिशन', mr: 'दृष्टी आणि ध्येय' },
  'about.principal.title': { en: "Principal's Message", hi: 'प्रधानाचार्य का संदेश', mr: 'मुख्याध्यापकांचा संदेश' },
  'about.infrastructure.title': { en: 'Our Infrastructure', hi: 'हमारा बुनियादी ढांचा', mr: 'आमची पायाभूत सुविधा' },

  // Academics
  'academics.title': { en: 'Academics', hi: 'शैक्षणिक', mr: 'शैक्षणिक' },
  'academics.curriculum': { en: 'Our Curriculum', hi: 'हमारा पाठ्यक्रम', mr: 'आमचा अभ्यासक्रम' },

  // Admissions
  'admissions.title': { en: 'Admissions 2025-26', hi: 'प्रवेश 2025-26', mr: 'प्रवेश 2025-26' },

  // Contact
  'contact.title': { en: 'Contact Us', hi: 'संपर्क करें', mr: 'संपर्क करा' },
  'contact.form.name': { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' },
  'contact.form.email': { en: 'Email Address', hi: 'ईमेल पता', mr: 'ईमेल पत्ता' },
  'contact.form.phone': { en: 'Phone Number', hi: 'फोन नंबर', mr: 'फोन नंबर' },
  'contact.form.message': { en: 'Your Message', hi: 'आपका संदेश', mr: 'तुमचा संदेश' },
  'contact.form.send': { en: 'Send Message', hi: 'संदेश भेजें', mr: 'संदेश पाठवा' },

  // Faculty
  'faculty.title': { en: 'Our Faculty', hi: 'हमारे शिक्षक', mr: 'आमचे शिक्षक' },

  // Gallery
  'gallery.title': { en: 'Photo Gallery', hi: 'फोटो गैलरी', mr: 'फोटो गॅलरी' },

  // Events
  'events.title': { en: 'Events & News', hi: 'कार्यक्रम और समाचार', mr: 'कार्यक्रम व बातम्या' },

  // Student Corner
  'students.title': { en: 'Student Corner', hi: 'छात्र कोना', mr: 'विद्यार्थी कोपरा' },

  // Parent Portal
  'parents.title': { en: 'Parent Portal', hi: 'अभिभावक पोर्टल', mr: 'पालक पोर्टल' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
