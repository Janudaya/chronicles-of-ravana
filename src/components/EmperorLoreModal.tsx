'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  BookOpen,
  Sparkles,
  Plane,
  HeartPulse,
  Compass,
  ArrowRight,
  Shield,
  Sun,
  Flame,
  Feather,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface EmperorLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreSigiriya: () => void;
  onExploreVimanaNetwork?: () => void;
}

export const EmperorLoreModal: React.FC<EmperorLoreModalProps> = ({
  isOpen,
  onClose,
  onExploreSigiriya,
  onExploreVimanaNetwork,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lineage' | 'vidyas' | 'ayurveda' | 'aeronautics'>('lineage');

  // Listen to Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Royal Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-slate-900 via-obsidian to-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Glowing Header Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 shadow-gold-glow" />

        {/* Header Bar */}
        <div className="relative px-6 py-5 border-b border-amber-500/20 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-gold-glow">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  {language === 'si' ? 'රාජකීය ලේඛනාගාරය' : language === 'hi' ? 'शाही अभिलेखागार' : 'Royal Imperial Archives'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">• Pulasti Dynasty</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide">
                {language === 'si'
                  ? 'මහා රාවණාධිරාජයාගේ ඓතිහාසික චරිතාපදානය'
                  : language === 'hi'
                  ? 'महाराज लंकापति रावण की अमर गाथा'
                  : 'Emperor Ravana: The Sovereign of the Solar Dynasty'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual Card Inside Modal */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex-shrink-0">
          <img
            src="/images/ravana/emperor-ravana-solar-king.jpg"
            alt="Emperor Ravana on Golden Throne"
            className="w-full h-full object-cover object-top filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-amber-300 font-semibold tracking-wider">
                HELA EMPIRE • CIRCA 5000 BCE
              </span>
              <p className="text-sm font-serif text-slate-200 drop-shadow-md">
                {language === 'si'
                  ? 'දස මහා විද්‍යාවන් ප්‍රගුණ කළ, ආකාශ යානා තාක්ෂණයේ සහ ආයුර්වේදයේ පුරෝගාමී අසහාය නායකයා'
                  : language === 'hi'
                  ? 'दश महाविद्याओं के ज्ञाता, प्राचीन वैमानिकी एवं आयुर्वेद के अमर प्रणेता'
                  : 'Master of Ten Sciences, Pioneer of Ancient Aeronautics, Medicine & Statecraft'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 overflow-x-auto scrollbar-none gap-2 py-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('lineage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-serif transition-all whitespace-nowrap ${
              activeTab === 'lineage'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{language === 'si' ? 'සූර්ය වංශය සහ රාජ්‍යත්වය' : language === 'hi' ? 'सूर्य वंश एवं संप्रभुता' : 'Solar Lineage & Empire'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vidyas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-serif transition-all whitespace-nowrap ${
              activeTab === 'vidyas'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'si' ? 'දස මහා විද්‍යාවන්' : language === 'hi' ? 'दश महाविद्याएं' : '10 Cosmic Sciences'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ayurveda')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-serif transition-all whitespace-nowrap ${
              activeTab === 'ayurveda'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>{language === 'si' ? 'ආයුර්වේද ග්‍රන්ථ හා වෛද්‍යවේදය' : language === 'hi' ? 'आयुर्वेद एवं चिकित्सा शास्त्र' : 'Ayurveda & Treatises'}</span>
          </button>

          <button
            onClick={() => setActiveTab('aeronautics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-serif transition-all whitespace-nowrap ${
              activeTab === 'aeronautics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Plane className="w-4 h-4 text-sky-400" />
            <span>{language === 'si' ? 'දඬුමොනර සහ ගුවන් ජාලය' : language === 'hi' ? 'दण्डुमोनरा एवं वैमानिकी' : 'Aeronautics & Vimanas'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-200 scrollbar-thin">
          {/* TAB 1: LINEAGE & SOVEREIGNTY */}
          {activeTab === 'lineage' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start">
                <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-amber-300 text-base sm:text-lg">
                    {language === 'si'
                      ? 'හෙළ අධිරාජ්‍යයේ ස්වර්ණමය යුගය'
                      : language === 'hi'
                      ? 'हेला साम्राज्य का स्वर्णिम युग'
                      : 'The Golden Age of the Hela Civilization'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {language === 'si'
                      ? 'ඓතිහාසික හෙළ වංශකතාවලට සහ පුරාවිද්‍යා මූලාශ්‍රයන්ට අනුව, මහා රාවණ යනු පුලස්ති ඍෂිවරයාගේ පෙළපතින් පැවත ආ සූර්ය වංශික හෙළ නායකයෙකි. ඔහු යක්ෂ, නාග, දේව සහ ගාන්ධර්ව යන චතුර්විධ හෙළ ගෝත්‍ර ඒකාබද්ධ කර සමෘද්ධිමත් සහ විද්‍යාත්මකව දියුණු අධිරාජ්‍යයක් ලංකාද්වීපය කේන්ද්‍ර කරගනිමින් ගොඩනැගුවේය.'
                      : language === 'hi'
                      ? 'प्राचीन हेला इतिहास और वैदिक संदर्भों के अनुसार, महाराज रावण महर्षि पुलस्त्य के कुल से उत्पन्न सूर्यवंशी सम्राट थे। उन्होंने यक्ष, नाग, देव और गंधर्व जनजातियों को एकीकृत कर लंका को अद्वितीय समृद्ध एवं वैज्ञानिक साम्राज्य का रूप दिया।'
                      : 'According to prehistoric Hela chronicles and oral folklore, Emperor Ravana belonged to the illustrious Pulasti sage lineage. He unified the four primordial indigenous tribes of Lanka—Yaksha, Naga, Deva, and Gandharva—into a technologically sophisticated and prosperous maritime civilization centered on Sri Lanka.'}
                  </p>
                </div>
              </div>

              {/* Pillars of Sovereignty Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif font-semibold text-amber-200 text-sm">
                    {language === 'si' ? 'සූර්ය වන්දනාව' : language === 'hi' ? 'सूर्य उपासना' : 'Solar Allegiance'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'si'
                      ? 'සූර්ය ශක්තිය තාක්ෂණයට හා ආධ්‍යාත්මයට යොදාගත් සූර්ය වංශික පාලනය.'
                      : language === 'hi'
                      ? 'सौर ऊर्जा और ब्रह्मांडीय शक्ति का वैज्ञानिक व आध्यात्मिक उपयोग।'
                      : 'Harnessing solar resonance for advanced energy, propulsion, and cosmic consciousness.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif font-semibold text-emerald-200 text-sm">
                    {language === 'si' ? 'අලකමන්දාව බලකොටුව' : language === 'hi' ? 'अलकामंदा राजधानी' : 'Alakamanda Citadel'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'si'
                      ? 'වර්තමාන සීගිරිය හෙවත් අලකමන්දා ආකාශ මාලිගය ඔහුගේ ප්‍රධාන පරිපාලන කේන්ද්‍රය විය.'
                      : language === 'hi'
                      ? 'वर्तमान सिगिरिया, जिसे प्राचीन काल में अलकामंदा आकाश प्रासाद कहा जाता था।'
                      : 'Sigiriya, anciently known as Alakamanda, stood as the paramount administrative sky fortress.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif font-semibold text-sky-200 text-sm">
                    {language === 'si' ? 'සාගරික බලය' : language === 'hi' ? 'सामुद्रिक प्रभुत्व' : 'Maritime Network'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'si'
                      ? 'ත්‍රිකුණාමලය (කෝණේෂ්වරම්) හරහා සමස්ත ඉන්දියන් සාගරය පුරා විහිදුනු වෙළඳ නාවික බලය.'
                      : language === 'hi'
                      ? 'त्रिकोणामलाई (गोकर्ण) बंदरगाह से पूरे हिंद महासागर में विस्तृत व्यापार।'
                      : 'Extensive trans-oceanic naval routes and coastal fortresses safeguarding trade across the Indian Ocean.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 10 SCIENCES (DASA MAHA VIDYAS) */}
          {activeTab === 'vidyas' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 font-serif leading-relaxed">
                {language === 'si'
                  ? '💡 "දස හිස" (දශමුඛ) යනු භෞතික හිස් දහයක් නොව, ක්ෂේත්‍ර 10ක් පුරා විහිදුනු අසමසම ප්‍රඥාව සහ විශ්ව විද්‍යාවන් 10ක නිපුණතාවයයි:'
                  : language === 'hi'
                  ? '💡 "दशानन" का वास्तविक अर्थ दस सिर नहीं, बल्कि ज्ञान की 10 विधाओं में अद्वितीय महारत और सर्वांगीण प्रज्ञा है:'
                  : '💡 "Dasa Mukha" (Ten-Headed) symbolizes mastery over 10 distinct cosmic domains of science, engineering, and philosophy:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {[
                  {
                    num: '01',
                    title: language === 'si' ? 'ආයුර්වේදය සහ රස ශාස්ත්‍රය' : language === 'hi' ? 'आयुर्वेद एवं रस शास्त्र' : 'Ayurveda & Alchemy',
                    desc: language === 'si' ? 'ඖෂධ පැළෑටි හා රසදිය ආශ්‍රිත ධාතු විද්‍යාව සහ සුවපත් කිරීම.' : language === 'hi' ? 'औषधीय विज्ञान, रस रसायन और कायाकल्प।' : 'Herbal alchemy, biological rejuvenation, and mercury metallurgy.',
                  },
                  {
                    num: '02',
                    title: language === 'si' ? 'ජ්‍යෝතිෂය සහ ඛගෝල විද්‍යාව' : language === 'hi' ? 'ज्योतिष एवं खगोल विज्ञान' : 'Astronomy & Astrophysics',
                    desc: language === 'si' ? 'ග්‍රහ චලිතය, කාල ගණනය සහ සූර්ය චක්‍ර පිළිබඳ ගැඹුරු ගණිතමය දැනුම.' : language === 'hi' ? 'ग्रहीय गति, काल गणना और सौर चक्रों का गणितीय ज्ञान।' : 'Celestial mechanics, solar cycles, and planetary geodesy.',
                  },
                  {
                    num: '03',
                    title: language === 'si' ? 'ව්‍යෝම විද්‍යාව (ගුවන් තාක්ෂණය)' : language === 'hi' ? 'व्योम विद्या (विमान शास्त्र)' : 'Aeronautics & Vimana Propulsion',
                    desc: language === 'si' ? 'දඬුමොනර ආකාශ යානය සහ සුළං කපොලු ඔස්සේ පියාසැරි සැලසුම් කිරීම.' : language === 'hi' ? 'दण्डुमोनरा और वायु धाराओं पर आधारित प्राचीन उड्डयन तकनीक।' : 'Aerodynamic vimana design and atmospheric vortex navigation.',
                  },
                  {
                    num: '04',
                    title: language === 'si' ? 'සංගීතය සහ නාද තරංග ශාස්ත්‍රය' : language === 'hi' ? 'संगीत एवं नाद विज्ञान' : 'Music & Acoustic Harmonics',
                    desc: language === 'si' ? 'රාවණහත්ත සංගීත භාණ්ඩය සහ ශිව තාණ්ඩව ස්තෝත්‍රය නිර්මාණය.' : language === 'hi' ? 'रावणहत्था वाद्ययंत्र और शिव तांडव स्तोत्र की रचना।' : 'Inventor of the Ravana Hatha bowed violin and composer of Shiva Tandava Stotram.',
                  },
                  {
                    num: '05',
                    title: language === 'si' ? 'ධනුර්වේදය සහ යුද තාක්ෂණය' : language === 'hi' ? 'धनुर्वेद एवं युद्धाभ्यास' : 'Martial Arts & Ballistics',
                    desc: language === 'si' ? 'අංගම්පොර සටන් කලාව සහ ශක්ති අවි (අස්ත්‍ර) පරිහරණය.' : language === 'hi' ? 'अंगम्पोरा युद्ध कला और दिव्य अस्त्रों का संचालन।' : 'Indigenous Angampora hand-to-hand combat and concentrated energy weaponry.',
                  },
                  {
                    num: '06',
                    title: language === 'si' ? 'රාජ්‍ය නීතිය සහ දේශපාලන දර්ශනය' : language === 'hi' ? 'राज नीति एवं न्याय शास्त्र' : 'Statecraft & Sovereignty',
                    desc: language === 'si' ? 'සමෘද්ධිමත් ජාතියක් ගොඩනැගීමට අදාළ යුක්තිගරුක පාලන ව්‍යුහය.' : language === 'hi' ? 'प्रजा-हितकारी शासन और अंतरराष्ट्रीय कूटनीति।' : 'Constitutional jurisprudence, tribal federation, and international governance.',
                  },
                  {
                    num: '07',
                    title: language === 'si' ? 'වාස්තු සහ ජල ඉංජිනේරු විද්‍යාව' : language === 'hi' ? 'वास्तु एवं जल अभियांत्रिकी' : 'Hydraulic Architecture',
                    desc: language === 'si' ? 'සීගිරිය සහ නිල් දිය පොකුණ ඇතුළු භූගත උමං හා ජල පීඩන තාක්ෂණය.' : language === 'hi' ? 'सिगिरिया और भूमिगत जल संरचनाओं का निर्माण।' : 'Gravity hydraulics, underground aqueducts, and acoustic chamber engineering.',
                  },
                  {
                    num: '08',
                    title: language === 'si' ? 'මනෝ විද්‍යාව සහ සිත දමනය' : language === 'hi' ? 'मनोविज्ञान एवं सम्मोहन' : 'Psychology & Neuro-Mechanics',
                    desc: language === 'si' ? 'සිතේ ශක්තිය, භාවනාව සහ විඥාන තරංග පාලනය.' : language === 'hi' ? 'मन की एकाग्रता, ध्यान और चेतना का नियंत्रण।' : 'Telepathic resonance, sensory focus, and psychosomatic mastery.',
                  },
                  {
                    num: '09',
                    title: language === 'si' ? 'භාෂා සහ ශිලා ලිපි විද්‍යාව' : language === 'hi' ? 'भाषा एवं लिपि विज्ञान' : 'Linguistics & Epigraphy',
                    desc: language === 'si' ? 'හෙළ බස සහ පුරාණ කේත ලිපි ක්‍රම පිළිබඳ පරිපූර්ණ ප්‍රවීණතාවය.' : language === 'hi' ? 'प्राचीन लिपियों और बहुभाषी संचार का ज्ञान।' : 'Proto-Sinhala scripts, acoustic phonetics, and cryptic inscriptions.',
                  },
                  {
                    num: '10',
                    title: language === 'si' ? 'විශ්ව දර්ශනය සහ ආධ්‍යාත්මය' : language === 'hi' ? 'ब्रह्म विद्या एवं दर्शन' : 'Cosmic Metaphysics',
                    desc: language === 'si' ? 'විශ්වයේ පැවැත්ම, හේතුඵල න්‍යාය සහ ගැඹුරු දාර්ශනික පරිණතභාවය.' : language === 'hi' ? 'ब्रह्मांडीय सत्य, ध्यान और गूढ़ आध्यात्मिक साधना।' : 'Universal ontology, energy reciprocity, and deep spiritual introspection.',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-amber-400 font-bold text-xs">{item.num}.</span>
                      <h5 className="font-serif font-bold text-white text-xs sm:text-sm">{item.title}</h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AYURVEDA TREATISES */}
          {activeTab === 'ayurveda' && (
            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {language === 'si'
                  ? 'මහා රාවණ රජු අතිවිශිෂ්ට ආයුර්වේද වෛද්‍යවරයෙකු වූ අතර ඔහු විසින් රචිත ග්‍රන්ථ හතරක් ඉන්දියානු සහ හෙළ ආයුර්වේද වෛද්‍ය ඉතිහාසයේ අදටත් මූලික ලේඛන ලෙස සැලකේ:'
                  : language === 'hi'
                  ? 'महाराज रावण आयुर्वेद के महान ज्ञाता थे। उनके द्वारा रचित चार ऐतिहासिक ग्रंथ आज भी भारतीय और श्रीलंकाई चिकित्सा पद्धतियों में प्रमाणिक माने जाते हैं:'
                  : 'Emperor Ravana was a master Ayurvedic physician credited with composing four foundational classical treatises still revered in traditional medicine:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>අර්ක ප්‍රකාශය (Arka Prakasha)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'si'
                      ? 'ඖෂධ පැළෑටි ස්වේදනය කිරීමෙන් (Distillation) සාරය ලබාගැනීමේ විද්‍යාව විස්තර කරන ලොව පැරණිතම ඖෂධ සංස්කරණ ග්‍රන්ථය.'
                      : language === 'hi'
                      ? 'औषधीय अर्क (Distillation) निकालने की प्राचीनतम वैज्ञानिक विधि का ग्रंथ।'
                      : 'The earliest known systematic treatise on herbal distillation, extracting essential medicinal oils and volatile botanical tinctures.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>කුමාර තන්ත්‍රය (Kumara Tantra)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'si'
                      ? 'ළමා රෝග, ගර්භණී සමයේ මාතෘ රැකවරණය සහ ළමා මනෝවිද්‍යාව පිළිබඳ සම්ප්‍රදායික වෛද්‍ය පද්ධතිය.'
                      : language === 'hi'
                      ? 'बाल चिकित्सा, प्रसूति और शिशुओं के रोगों के उपचार का विशिष्ट शास्त्र।'
                      : 'Comprehensive pediatric treatise detailing child healthcare, prenatal nourishment, and the treatment of childhood ailments.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>නාඩි පරීක්ෂාව (Nadi Pariksha)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'si'
                      ? 'මැණික් කටුවෙහි නාඩි ස්පන්දනයෙන් වාත, පිත්ත, කඵ ත්‍රිදෝෂ අසමතුලිතතා නිවැරදිව හඳුනාගැනීමේ ශිල්පය.'
                      : language === 'hi'
                      ? 'नाड़ी स्पंदन द्वारा वात, पित्त, कफ के असंतुलन की सटीक पहचान का विज्ञान।'
                      : 'The exquisite science of radial pulse diagnosis, decoding bio-energetic frequencies and tri-dosha imbalances without invasive tools.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>උඩ්ඩීස තන්ත්‍රය (Uddisa Tantra)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'si'
                      ? 'මනෝකායික රෝග සුවපත් කිරීම, ශක්ති ක්ෂේත්‍ර නියාමනය සහ චිකිත්සක මන්ත්‍ර විද්‍යාව පිළිබඳ ග්‍රන්ථය.'
                      : language === 'hi'
                      ? 'मानसिक रोगों, ऊर्जा केंद्रों और तांत्रिक चिकित्सा का गहन ग्रंथ।'
                      : 'Psychosomatic healing, metaphysical bio-field restoration, and harmonic vibrational therapeutics.'}
                  </p>
                </div>
              </div>

              {/* Sanctuaries Connection */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>🌿 ඖෂධ උයන: රිටිගල සහ රූමස්සල සංරක්ෂිත වනාන්තර</span>
                <span className="text-amber-400 font-mono">Ritigala & Rumassala</span>
              </div>
            </div>
          )}

          {/* TAB 4: AERONAUTICS & VIMANAS */}
          {activeTab === 'aeronautics' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-sky-500/30 h-44 sm:h-56">
                <img
                  src="/images/ravana/dandu-monara-vimana.jpg"
                  alt="Dandu Monara Vimana in flight"
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-sky-300 drop-shadow">
                    {language === 'si' ? 'දඬුමොනර ආකාශ යානය' : language === 'hi' ? 'दण्डुमोनरा पुष्पक विमान' : 'Dandu Monara: The Peacock Vimana'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-sky-500/40">
                    Solar Mercury Propulsion
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                <p>
                  {language === 'si'
                    ? 'දඬුමොනර යනු මොනරෙකුගේ හැඩය සහ පිහාටු ව්‍යුහය ආශ්‍රිත වායුගතික (Aerodynamic) මූලධර්ම මත නිර්මාණය වූ පූර්ව ඓතිහාසික ගුවන් යානයකි. මෙය රසදිය සුළි (Mercury Vortex) සහ සූර්ය ශක්තිය ප්‍රයෝජනයට ගනිමින් ශ්‍රී ලංකාවේ ප්‍රධාන ගුවන් තොටුපළවල් හතරක් හරහා ගමන් ගත්තේය.'
                    : language === 'hi'
                    ? 'दण्डुमोनरा मयूर के आकार की वायुगतिकीय संरचना पर आधारित प्राचीन विमान था। इसमें पारा भंवर (Mercury Vortex) और सौर ऊर्जा का उपयोग होता था और लंका के 4 प्रमुख विमान पत्तनों से संचालित होता था।'
                    : 'The Dandu Monara was an aerodynamic ancient aircraft modeled upon the anatomical wing mechanics of the peacock. Propelled by mercury vortex engines and resonance solar collectors, it utilized a network of four primary mountaintop aerodromes across Sri Lanka.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {[
                    { name: 'Wariyapola', label: 'වාරියපොළ', sub: 'North-Western Port' },
                    { name: 'Gurulupotha', label: 'ගුරුළුපොත', sub: 'Knuckles Hangar' },
                    { name: 'Thotupola Kanda', label: 'තොටුපළ කන්ද', sub: 'Horton Plains Strip' },
                    { name: 'Weragantota', label: 'වේරගන්තොට', sub: 'Mahaweli River Port' },
                  ].map((port, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                      <div className="text-[10px] font-mono text-sky-400 font-bold">PORT 0{idx + 1}</div>
                      <div className="font-serif font-bold text-white text-xs">{port.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{port.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-400 font-serif flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'si'
                ? 'සීගිරිය ආකාශ බලකොටුව සහ ගුවන් පථ සිතියමෙන් ගවේෂණය කරන්න'
                : language === 'hi'
                ? 'सिगिरिया आकाश दुर्ग और वैमानिकी मार्गों का अन्वेषण करें'
                : 'Explore the Sky Citadel and Vimana airfields on the map'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onExploreSigiriya();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold text-xs sm:text-sm shadow-gold-glow transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'si' ? 'සීගිරිය සිතියමෙන් බලන්න' : language === 'hi' ? 'सिगिरिया मानचित्र देखें' : 'Fly to Sigiriya on Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-serif transition-colors"
            >
              {language === 'si' ? 'වසන්න' : language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
