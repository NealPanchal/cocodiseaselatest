// Frontend disease knowledge base.
// Keyed by model class name (English) -> language code -> structured advisory text.
// If a language entry is missing, UI falls back to English.

export const DISEASE_INFO = {
  Healthy_Leaves: {
    en: {
      label: 'Healthy Leaves',
      status: 'Healthy',
      symptoms: ['No disease detected.'],
      cause: ['No visible disease symptoms in the image.'],
      remedy: ['No treatment required. Maintain regular care and monitoring.'],
      prevention: [
        'Maintain balanced nutrition and irrigation.',
        'Continue routine field scouting for early pest/disease signs.'
      ],
      fertilizers: [
        'Apply NPK 14:14:14 @ 1.5 kg per palm twice a year (June-July and November-December).',
        'Supplement with organic manure (FYM/compost) @ 25-50 kg per palm annually.',
        'Micronutrient spray: Mix Borax (0.2%), Zinc sulfate (0.5%), Magnesium sulfate (1%) - spray every 3-4 months.',
        'For coastal areas, consider salt-tolerant varieties and additional potassium (25-50% more).'
      ]
    },
    hi: {
      label: 'स्वस्थ पत्तियाँ',
      status: 'स्वस्थ',
      symptoms: ['कोई रोग नहीं पाया गया।'],
      cause: ['तस्वीर में रोग के स्पष्ट लक्षण नहीं दिखे।'],
      remedy: ['किसी उपचार की आवश्यकता नहीं। नियमित देखभाल और निगरानी रखें।'],
      prevention: ['संतुलित पोषण और सिंचाई बनाए रखें।', 'नियमित निरीक्षण जारी रखें।'],
      fertilizers: [
        'NPK 14:14:14 @ 1.5 किग्रा प्रति पेड़ वर्ष में दो बार (जून-जुलाई और नवंबर-दिसंबर) लगाएं।',
        'गोबर की खाद/कम्पोस्ट @ 25-50 किग्रा प्रति पेड़ सालाना मिलाएं।',
        'सूक्ष्म पोषक स्प्रे: बोरेक्स (0.2%), जिंक सल्फेट (0.5%), मैग्नीशियम सल्फेट (1%) मिश्रण - हर 3-4 महीने स्प्रे करें।',
        'तटीय क्षेत्रों के लिए अतिरिक्त पोटैशियम (25-50% अधिक) दें।'
      ]
    },
    mr: {
      label: 'निरोगी पाने',
      status: 'निरोगी',
      symptoms: ['रोग आढळला नाही.'],
      cause: ['प्रतिमेत रोगाची स्पष्ट लक्षणे दिसत नाहीत.'],
      remedy: ['उपचार आवश्यक नाही. नियमित देखभाल व निरीक्षण ठेवा.'],
      prevention: ['संतुलित पोषण व सिंचन ठेवा.', 'नियमित निरीक्षण करा.']
    },
    kn: {
      label: 'ಆರೋಗ್ಯಕರ ಎಲೆಗಳು',
      status: 'ಆರೋಗ್ಯಕರ',
      symptoms: ['ರೋಗ ಕಂಡುಬಂದಿಲ್ಲ.'],
      cause: ['ಚಿತ್ರದಲ್ಲಿ ರೋಗ ಲಕ್ಷಣಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲ.'],
      remedy: ['ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿಲ್ಲ. ನಿಯಮಿತ ಆರೈಕೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.'],
      prevention: ['ಸಮತೋಲ ಪೋಷಣೆ ಮತ್ತು ನೀರಾವರಿ.', 'ನಿಯಮಿತ ತೋಟ ಪರಿಶೀಲನೆ.']
    },
    te: {
      label: 'ఆరోగ్యమైన ఆకులు',
      status: 'ఆరోగ్యకరం',
      symptoms: ['వ్యాధి కనిపించలేదు.'],
      cause: ['చిత్రంలో వ్యాధి లక్షణాలు స్పష్టంగా లేవు.'],
      remedy: ['చికిత్స అవసరం లేదు. సాధారణ సంరక్షణ కొనసాగించండి.'],
      prevention: ['సమతుల్య పోషణ మరియు నీటిపారుదల.', 'నియమిత పరిశీలన.']
    },
    ml: {
      label: 'ആരോഗ്യകരമായ ഇലകൾ',
      status: 'ആരോഗ്യം',
      symptoms: ['രോഗം കണ്ടെത്തിയില്ല.'],
      cause: ['ചിത്രത്തിൽ രോഗ ലക്ഷണങ്ങൾ വ്യക്തമായി കാണുന്നില്ല.'],
      remedy: ['ചികിത്സ ആവശ്യമില്ല. സ്ഥിരമായ പരിചരണം തുടരുക.'],
      prevention: ['സമതുലിത വളവും ജലസേചനവും.', 'നിയമിത നിരീക്ഷണം.']
    },
    bn: {
      label: 'সুস্থ পাতা',
      status: 'সুস্থ',
      symptoms: ['কোনো রোগ শনাক্ত হয়নি।'],
      cause: ['ছবিতে রোগের স্পষ্ট লক্ষণ নেই।'],
      remedy: ['চিকিৎসা প্রয়োজন নেই। নিয়মিত পরিচর্যা বজায় রাখুন।'],
      prevention: ['সুষম সার ও সেচ বজায় রাখুন।', 'নিয়মিত পর্যবেক্ষণ করুন।']
    },
    gu: {
      label: 'સ્વસ્થ પાંદડા',
      status: 'સ્વસ્થ',
      symptoms: ['કોઈ રોગ મળી આવ્યો નથી.'],
      cause: ['છબીમાં રોગના સ્પષ્ટ લક્ષણો નથી.'],
      remedy: ['ઉપચાર જરૂરી નથી. નિયમિત સંભાળ રાખો.'],
      prevention: ['સંતુલિત ખાતર અને સિંચાઈ.', 'નિયમિત નિરીક્ષણ.']
    },
    pa: {
      label: 'ਸਿਹਤਮੰਦ ਪੱਤੇ',
      status: 'ਸਿਹਤਮੰਦ',
      symptoms: ['ਕੋਈ ਰੋਗ ਨਹੀਂ ਮਿਲਿਆ।'],
      cause: ['ਤਸਵੀਰ ਵਿੱਚ ਰੋਗ ਦੇ ਸਪੱਸ਼ਟ ਲੱਛਣ ਨਹੀਂ ਹਨ।'],
      remedy: ['ਇਲਾਜ ਦੀ ਲੋੜ ਨਹੀਂ। ਨਿਯਮਿਤ ਦੇਖਭਾਲ ਜਾਰੀ ਰੱਖੋ।'],
      prevention: ['ਸੰਤੁਲਿਤ ਖਾਦ ਅਤੇ ਸਿੰਚਾਈ।', 'ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ।']
    },
    or: {
      label: 'ସ୍ୱସ୍ଥ ପତ୍ର',
      status: 'ସ୍ୱସ୍ଥ',
      symptoms: ['କୌଣସି ରୋଗ ମିଳିଲା ନାହିଁ।'],
      cause: ['ଛବିରେ ରୋଗର ସ୍ପଷ୍ଟ ଲକ୍ଷଣ ନାହିଁ।'],
      remedy: ['ଚିକିତ୍ସା ଆବଶ୍ୟକ ନୁହେଁ। ନିୟମିତ ଯତ୍ନ ରଖନ୍ତୁ।'],
      prevention: ['ସମତୁଳିତ ସାର ଏବଂ ସିଞ୍ଚନ।', 'ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ।']
    },
    ur: {
      label: 'صحت مند پتے',
      status: 'صحت مند',
      symptoms: ['کوئی بیماری ظاہر نہیں ہوئی۔'],
      cause: ['تصویر میں بیماری کی واضح علامات نہیں ہیں۔'],
      remedy: ['علاج کی ضرورت نہیں۔ معمول کی دیکھ بھال جاری رکھیں۔'],
      prevention: ['متوازن کھاد اور آبپاشی۔', 'باقاعدہ نگرانی۔']
    }
  },

  Caterpillars: {
    en: {
      label: 'Caterpillars',
      status: 'Diseased',
      symptoms: [
        'Irregular holes or chewed edges on leaflets.',
        'Skeletonization (leaf tissue eaten leaving veins).',
        'Presence of larvae, frass (droppings), or webbing.'
      ],
      cause: ['Caterpillar infestation feeding on leaf tissue.'],
      remedy: [
        'Remove visible larvae for small infestations.',
        'Encourage biological control (natural predators).',
        'If severe, follow local agriculture guidelines for approved control measures.'
      ],
      prevention: [
        'Regular monitoring, especially on new leaves.',
        'Avoid excessive nitrogen.',
        'Maintain field sanitation.'
      ],
      fertilizers: [
        'Use Bacillus thuringiensis (Bt) spray @ 1-2 g/liter water, apply every 7-10 days until infestation clears.',
        'Apply Neem oil solution @ 3-5 ml/liter water as organic pest control and foliar spray.',
        'Reduce nitrogen fertilizer temporarily; use balanced NPK 10:10:20 instead of high-N formulas.',
        'Support plant recovery with potassium-rich fertilizer (Muriate of Potash @ 0.5 kg/palm) after pest control.'
      ]
    },
    hi: {
      label: 'इल्ली / सूंडी',
      status: 'प्रभावित',
      symptoms: ['पत्तियों में अनियमित छेद या कटी किनारियाँ।', 'नसें बचकर ऊतक खा जाना।', 'इल्ली/मल/जाला दिखना।'],
      cause: ['इल्ली द्वारा पत्ती के ऊतक को खाना।'],
      remedy: ['कम संक्रमण में इल्ली हटाएँ।', 'प्राकृतिक शत्रुओं को बढ़ावा दें।', 'अधिक संक्रमण में स्थानीय कृषि सलाह अनुसार नियंत्रण करें।'],
      prevention: ['नियमित निगरानी करें।', 'अधिक नाइट्रोजन से बचें।', 'खेत की सफाई रखें।'],
      fertilizers: [
        'Bacillus thuringiensis (Bt) स्प्रे @ 1-2 ग्राम/लीटर पानी, संक्रमण खत्म होने तक हर 7-10 दिन लगाएं।',
        'नीम तेल घोल @ 3-5 मिली/लीटर पानी कीट नियंत्रण और पत्ते स्प्रे के लिए।',
        'नाइट्रोजन खाद अस्थायी रूप से कम करें; NPK 10:10:20 का उपयोग करें।',
        'कीट नियंत्रण के बाद पोटैशियम युक्त खाद (म्यूरेट ऑफ पोटाश @ 0.5 किग्रा/पेड़) दें।'
      ]
    },
    mr: {
      label: 'अळ्या',
      status: 'प्रभावित',
      symptoms: ['पानांवर छिद्रे/कापलेले कडे.', 'पानाचा भाग खाल्लेला दिसणे.', 'अळी/मल/जाळे दिसणे.'],
      cause: ['अळींचा प्रादुर्भाव व पानाचे ऊतक खाणे.'],
      remedy: ['दिसणाऱ्या अळ्या काढून नष्ट करा.', 'नैसर्गिक शत्रूंना प्रोत्साहन द्या.', 'तीव्र असल्यास स्थानिक कृषी मार्गदर्शनानुसार उपाय करा.'],
      prevention: ['नियमित पाहणी.', 'अतिरिक्त नायट्रोजन टाळा.', 'शेत स्वच्छता ठेवा.']
    },
    kn: {
      label: 'ಇಲಿ/ಕೀಟ (Caterpillars)',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳಲ್ಲಿ ಅಸಮಾನ ರಂಧ್ರಗಳು/ಕಡಿ.', 'ಎಲುಬಿನಂತೆ ನರಗಳು ಮಾತ್ರ ಉಳಿಯುವುದು.', 'ಲಾರ್ವಾ/ಮಲ/ಜಾಲ ಕಾಣುವುದು.'],
      cause: ['ಇಲಿಗಳು ಎಲೆ ткissue ತಿನ್ನುವುದು.'],
      remedy: ['ಕಡಿಮೆ ಹಂತದಲ್ಲಿ ಕೈಯಿಂದ ತೆಗೆದುಹಾಕಿ.', 'ಜೈವ ನಿಯಂತ್ರಣಕ್ಕೆ ಉತ್ತೇಜನ.', 'ತೀವ್ರವಾಗಿದ್ದರೆ ಸ್ಥಳೀಯ ಮಾರ್ಗಸೂಚಿಯಂತೆ ಕ್ರಮ.'],
      prevention: ['ನಿಯಮಿತ ಪರಿಶೀಲನೆ.', 'ಅತಿಯಾದ ನೈಟ್ರೋಜನ್ ಬೇಡ.', 'ತೋಟ ಸುವ್ಯವಸ್ಥೆ.']
    },
    te: {
      label: 'పురుగులు (Caterpillars)',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులపై రంధ్రాలు/కొరికిన అంచులు.', 'నరాలు మాత్రమే మిగలడం.', 'లార్వా/మలం/జాలాలు కనిపించడం.'],
      cause: ['పురుగులు ఆకు కణజాలాన్ని తినడం.'],
      remedy: ['తక్కువ దశలో చేతితో తొలగించండి.', 'జీవ నియంత్రణకు ప్రోత్సహించండి.', 'తీవ్రంగా ఉంటే స్థానిక సిఫార్సులు అనుసరించండి.'],
      prevention: ['నియమిత పరిశీలన.', 'అధిక నైట్రజన్ నివారించండి.', 'తోట శుభ్రత.']
    },
    ml: {
      label: 'ഇലപ്പുഴു',
      status: 'ബാധിതം',
      symptoms: ['ഇലയിൽ അക്രമമായ തുളകൾ/കടിച്ച അറ്റങ്ങൾ.', 'നരമ്പുകൾ മാത്രം ശേഷിക്കൽ.', 'പുഴു/മലം/വലകൾ കാണുക.'],
      cause: ['ഇലപ്പുഴു ഇലത്തിസ്സു തിന്നുക.'],
      remedy: ['ചെറു ബാധയിൽ കൈകൊണ്ട് നീക്കുക.', 'ജൈവ നിയന്ത്രണം പ്രോത്സാഹിപ്പിക്കുക.', 'കഠിനമായാൽ പ്രാദേശിക മാർഗനിർദ്ദേശം അനുസരിക്കുക.'],
      prevention: ['നിയമിത നിരീക്ഷണം.', 'അധിക നൈട്രജൻ ഒഴിവാക്കുക.', 'തോട്ട ശുചിത്വം.']
    },
    bn: {
      label: 'শুঁয়োপোকা',
      status: 'আক্রান্ত',
      symptoms: ['পাতায় অনিয়মিত ছিদ্র/কাটা কিনারা.', 'শিরা ছাড়া টিস্যু খেয়ে ফেলা.', 'লার্ভা/মল/জাল দেখা।'],
      cause: ['শুঁয়োপোকা পাতার টিস্যু খায়।'],
      remedy: ['কম হলে হাতে সরান।', 'জৈব নিয়ন্ত্রণ উৎসাহিত করুন।', 'বেশি হলে স্থানীয় নির্দেশিকা অনুসরণ করুন।'],
      prevention: ['নিয়মিত পর্যবেক্ষণ।', 'অতিরিক্ত নাইট্রোজেন এড়ান।', 'ক্ষেত পরিষ্কার রাখুন।']
    },
    gu: {
      label: 'ઇયળ (Caterpillars)',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડામાં છિદ્ર/કટાયેલા કિનારા.', 'નસો જ બાકી રહેવી.', 'ઇયળ/મલ/જાળ દેખાવું.'],
      cause: ['ઇયળ દ્વારા પાનનું તંતુ ખાવું.'],
      remedy: ['ઓછા પ્રકોપે હાથથી દૂર કરો.', 'જૈવિક નિયંત્રણ પ્રોત્સાહિત કરો.', 'વધારે હોય તો સ્થાનિક માર્ગદર્શન અનુસાર પગલાં લો.'],
      prevention: ['નિયમિત નિરીક્ષણ.', 'અતિ નાઈટ્રોજન ટાળો.', 'ખેતર સ્વચ્છતા.']
    },
    pa: {
      label: 'ਸੂੰਡੀ (Caterpillars)',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤਿਆਂ ਵਿੱਚ ਛੇਦ/ਕੱਟੇ ਕਿਨਾਰੇ.', 'ਨਸਾਂ ਤੋਂ ਇਲਾਵਾ ਟਿਸ਼ੂ ਖਾ ਲੈਣਾ.', 'ਲਾਰਵਾ/ਮਲ/ਜਾਲ.'],
      cause: ['ਸੂੰਡੀ ਪੱਤੇ ਦਾ ਟਿਸ਼ੂ ਖਾਂਦੀ ਹੈ।'],
      remedy: ['ਘੱਟ ਹੋਵੇ ਤਾਂ ਹੱਥ ਨਾਲ ਹਟਾਓ।', 'ਜੈਵਿਕ ਨਿਯੰਤਰਣ ਨੂੰ ਪ੍ਰੋਤਸਾਹਿਤ ਕਰੋ।', 'ਵੱਧ ਹੋਵੇ ਤਾਂ ਸਥਾਨਕ ਸਲਾਹ ਅਨੁਸਾਰ ਕਰੋ।'],
      prevention: ['ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ.', 'ਅਧਿਕ ਨਾਈਟ੍ਰੋਜਨ ਤੋਂ ਬਚੋ.', 'ਸਫਾਈ.']
    },
    or: {
      label: 'ଇଲି/ଶୁଣ୍ଡି',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ରରେ ଅସମ ଛିଦ୍ର.', 'ନସ ଛାଡ଼ି ଅଂଶ ଖାଇଦେବା.', 'ଲାର୍ଭା/ମଲ/ଜାଲ.'],
      cause: ['ଇଲି ଦ୍ୱାରା ପତ୍ର ତନ୍ତୁ ଖାଇବା.'],
      remedy: ['କମ୍ ଥିଲେ ହାତେ ହଟାନ୍ତୁ.', 'ଜୈବିକ ନିୟନ୍ତ୍ରଣ ପ୍ରୋତ୍ସାହନ.', 'ବେଶି ହେଲେ ସ୍ଥାନୀୟ ପରାମର୍ଶ ଅନୁସରଣ.'],
      prevention: ['ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ.', 'ଅତି ନାଇଟ୍ରୋଜେନ ଟାଳନ୍ତୁ.', 'ସଫାସୁଥା.']
    },
    ur: {
      label: 'سنڈیاں',
      status: 'متاثرہ',
      symptoms: ['پتے میں سوراخ/کٹے کنارے۔', 'ٹشو کھا کر رگیں باقی رہنا۔', 'لاروا/فضلہ/جالا۔'],
      cause: ['سنڈیاں پتے کا ٹشو کھاتی ہیں۔'],
      remedy: ['کم حملہ ہو تو ہاتھ سے ہٹائیں۔', 'حیاتیاتی کنٹرول کی حوصلہ افزائی کریں۔', 'زیادہ ہو تو مقامی رہنمائی کے مطابق کریں۔'],
      prevention: ['باقاعدہ نگرانی۔', 'زیادہ نائٹروجن سے پرہیز۔', 'کھیت کی صفائی۔']
    }
  },

  CCI_Leaflets: {
    en: {
      label: 'CCI Leaflets',
      status: 'Diseased',
      symptoms: [
        'Patchy discoloration on leaflets.',
        'Mild spots or uneven chlorosis.',
        'Localized damage that may not uniformly spread.'
      ],
      cause: [
        'Leaflet stress/injury category in the dataset; can be linked to nutrient stress, environmental stress, or early-stage infection.'
      ],
      remedy: [
        'Improve field nutrition (balanced NPK; consider micronutrients based on soil test).',
        'Remove heavily damaged leaflets if needed.',
        'If symptoms increase, consult local agricultural experts for targeted guidance.'
      ],
      prevention: [
        'Maintain consistent irrigation and avoid drought stress.',
        'Periodic soil/leaf nutrient analysis.',
        'Avoid mechanical damage during farm operations.'
      ],
      fertilizers: [
        'Apply Magnesium sulfate (Epsom salt) @ 200-300 g per palm as soil application or foliar spray (2%).',
        'Borax @ 50-100 g per palm mixed with sand for even soil distribution (apply once a year).',
        'Zinc sulfate @ 0.5% foliar spray (400-500 g in 100 liters water for 100 palms).',
        'Balanced NPK 15:15:15 @ 1.5 kg per palm to correct overall nutrient balance.',
        'Organic option: Apply neem cake @ 5 kg per palm to improve soil health and micronutrient availability.'
      ]
    },
    hi: {
      label: 'CCI पत्तियाँ',
      status: 'प्रभावित',
      symptoms: ['धब्बेदार रंग-परिवर्तन।', 'हल्के धब्बे/असमान पीलापन।', 'क्षति स्थानीय हो सकती है।'],
      cause: ['यह श्रेणी अक्सर तनाव/पोषक असंतुलन/शुरुआती संक्रमण से जुड़ी होती है।'],
      remedy: ['संतुलित पोषण दें।', 'बहुत क्षतिग्रस्त भाग हटाएँ।', 'लक्षण बढ़ें तो विशेषज्ञ से सलाह लें।'],
      prevention: ['सिंचाई नियमित रखें।', 'मिट्टी/पत्ती परीक्षण करें।', 'यांत्रिक चोट से बचें।'],
      fertilizers: [
        'मैग्नीशियम सल्फेट @ 200-300 ग्राम प्रति पेड़ मिट्टी में या 2% पत्ते स्प्रे।',
        'बोरेक्स @ 50-100 ग्राम प्रति पेड़ रेत के साथ मिलाकर (साल में एक बार)।',
        'जिंक सल्फेट @ 0.5% पत्ते स्प्रे (100 पेड़ों के लिए 100 लीटर पानी में 400-500 ग्राम)।',
        'संतुलित NPK 15:15:15 @ 1.5 किग्रा प्रति पेड़।',
        'नीम की खली @ 5 किग्रा प्रति पेड़ मिट्टी की सेहत सुधारने के लिए।'
      ]
    },
    mr: {
      label: 'CCI पान',
      status: 'प्रभावित',
      symptoms: ['ठिपके/डाग दिसणे.', 'हलका डाग किंवा असमान पिवळेपणा.', 'स्थानिक नुकसान.'],
      cause: ['पोषक/पर्यावरणीय ताण किंवा सुरुवातीचा संसर्ग असू शकतो.'],
      remedy: ['संतुलित खत द्या.', 'जास्त खराब पाने काढा.', 'लक्षणे वाढल्यास तज्ज्ञांचा सल्ला घ्या.'],
      prevention: ['नियमित सिंचन.', 'माती/पान चाचणी.', 'यांत्रिक इजा टाळा.']
    },
    kn: {
      label: 'CCI ಎಲೆಗಳು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಚುಕ್ಕೆ ಚುಕ್ಕೆ ಬಣ್ಣ ಬದಲಾವಣೆ.', 'ಸ್ವಲ್ಪ ಕಲೆ/ಅಸಮಾನ ಹಳದಿಮು.', 'ಸ್ಥಳೀಯ ಹಾನಿ.'],
      cause: ['ಪೋಷಕ/ಪರಿಸರ ಒತ್ತಡ ಅಥವಾ ಪ್ರಾರಂಭಿಕ ಸೋಂಕು ಸಾಧ್ಯ.'],
      remedy: ['ಸಮತೋಲ ಗೊಬ್ಬರ.', 'ಹೆಚ್ಚಾಗಿ ಹಾನಿಯಾದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.', 'ಹೆಚ್ಚಾದರೆ ತಜ್ಞರ ಸಲಹೆ.'],
      prevention: ['ನಿಯಮಿತ ನೀರಾವರಿ.', 'ಮಣ್ಣು/ಎಲೆ ಪೋಷಕ ಪರೀಕ್ಷೆ.', 'ಯಾಂತ್ರಿಕ ಹಾನಿ ತಪ್ಪಿಸಿ.']
    },
    te: {
      label: 'CCI ఆకులు',
      status: 'ప్రభావితం',
      symptoms: ['చెల్లాచెదురు రంగు మార్పు.', 'తేలికపాటి మచ్చలు/అసమాన పసుపు.', 'స్థానిక నష్టం.'],
      cause: ['పోషక/పర్యావరణ ఒత్తిడి లేదా ప్రారంభ సంక్రమణ కావచ్చు.'],
      remedy: ['సమతుల్య ఎరువు.', 'తీవ్రంగా దెబ్బతిన్న భాగాలు తొలగించండి.', 'పెరిగితే నిపుణుల సలహా.'],
      prevention: ['నియమిత నీటిపారుదల.', 'మట్టి/ఆకు పరీక్షలు.', 'యాంత్రిక నష్టం నివారించండి.']
    },
    ml: {
      label: 'CCI ഇലകൾ',
      status: 'ബാധിതം',
      symptoms: ['പാച്ചി നിറമാറ്റം.', 'ലഘു പാടുകൾ/അസമമായ മഞ്ഞപ്പ്.', 'പ്രാദേശിക നാശം.'],
      cause: ['പോഷക/പരിസ്ഥിതി സമ്മർദ്ദം അല്ലെങ്കിൽ ആരംഭ ബാധ സാധ്യത.'],
      remedy: ['സമതുലിത വളം.', 'കൂടുതൽ കേടായ ഭാഗങ്ങൾ നീക്കുക.', 'കൂടിയാൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['സ്ഥിരമായ ജലസേചനം.', 'മണ്ണ്/ഇല പോഷക പരിശോധന.', 'യാന്ത്രിക ക്ഷതി ഒഴിവാക്കുക.']
    },
    bn: {
      label: 'CCI পাতা',
      status: 'আক্রান্ত',
      symptoms: ['ছোপ ছোপ রঙ পরিবর্তন।', 'হালকা দাগ/অসম ম্লানতা।', 'স্থানীয় ক্ষতি।'],
      cause: ['পুষ্টি/পরিবেশগত চাপ বা প্রাথমিক সংক্রমণ হতে পারে।'],
      remedy: ['সুষম সার দিন।', 'খুব ক্ষতিগ্রস্ত অংশ সরান।', 'বাড়লে বিশেষজ্ঞের পরামর্শ নিন।'],
      prevention: ['নিয়মিত সেচ।', 'মাটি/পাতা পরীক্ষা।', 'যান্ত্রিক ক্ষতি এড়ান।']
    },
    gu: {
      label: 'CCI પાંદડા',
      status: 'અસરગ્રસ્ત',
      symptoms: ['છિટછાટ રંગ બદલાવ.', 'હલકા ડાઘ/અસમાન પીળાશ.', 'સ્થાનિક નુકસાન.'],
      cause: ['પોષક/પર્યાવરણ તાણ અથવા શરૂઆતનો ચેપ હોઈ શકે.'],
      remedy: ['સંતુલિત ખાતર આપો.', 'ઘણું નુકસાન થયેલ ભાગ દૂર કરો.', 'વધે તો નિષ્ણાત સલાહ લો.'],
      prevention: ['નિયમિત સિંચાઈ.', 'માટી/પાન પરીક્ષણ.', 'યાંત્રિક નુકસાન ટાળો.']
    },
    pa: {
      label: 'CCI ਪੱਤੇ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਛਿੱਟੇ ਰੰਗ ਬਦਲਾਅ।', 'ਹਲਕੇ ਦਾਗ/ਅਸਮਾਨ ਪੀਲਾਪਣ।', 'ਸਥਾਨਕ ਨੁਕਸਾਨ।'],
      cause: ['ਪੋਸ਼ਕ/ਵਾਤਾਵਰਣੀ ਤਣਾਅ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਸੰਕਰਮਣ।'],
      remedy: ['ਸੰਤੁਲਿਤ ਖਾਦ ਦਿਓ।', 'ਜ਼ਿਆਦਾ ਖਰਾਬ ਹਿੱਸਾ ਹਟਾਓ।', 'ਵਧੇ ਤਾਂ ਮਾਹਿਰ ਦੀ ਸਲਾਹ।'],
      prevention: ['ਨਿਯਮਿਤ ਸਿੰਚਾਈ।', 'ਮਿੱਟੀ/ਪੱਤਾ ਟੈਸਟ।', 'ਯਾਂਤ੍ਰਿਕ ਨੁਕਸਾਨ ਤੋਂ ਬਚੋ।']
    },
    or: {
      label: 'CCI ପତ୍ର',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ଛିଟିଛିଟି ରଙ୍ଗ ପରିବର୍ତ୍ତନ।', 'ହାଲୁକା ଦାଗ/ଅସମ ହଳଦିଆ।', 'ସ୍ଥାନୀୟ କ୍ଷତି।'],
      cause: ['ପୋଷକ/ପରିବେଶ ଚାପ କିମ୍ବା ଆରମ୍ଭିକ ସଂକ୍ରମଣ।'],
      remedy: ['ସମତୁଳିତ ସାର ଦିଅନ୍ତୁ।', 'ଅଧିକ କ୍ଷତି ଅଂଶ ହଟାନ୍ତୁ।', 'ବଢିଲେ ତଜ୍ଞ ସହ ପରାମର୍ଶ।'],
      prevention: ['ନିୟମିତ ସିଞ୍ଚନ।', 'ମାଟି/ପତ୍ର ପରୀକ୍ଷା।', 'ଯାନ୍ତ୍ରିକ କ୍ଷତି ଟାଳନ୍ତୁ।']
    },
    ur: {
      label: 'CCI پتے',
      status: 'متاثرہ',
      symptoms: ['دھبے دار رنگت۔', 'ہلکے دھبے/غیر ہموار پیلاہٹ۔', 'مقامی نقصان۔'],
      cause: ['غذائی/ماحولیاتی دباؤ یا ابتدائی انفیکشن ممکن۔'],
      remedy: ['متوازن کھاد دیں۔', 'زیادہ متاثرہ حصہ ہٹائیں۔', 'بڑھے تو ماہر سے مشورہ کریں۔'],
      prevention: ['باقاعدہ آبپاشی۔', 'مٹی/پتے کی جانچ۔', 'میکینیکل نقصان سے بچیں۔']
    }
  },

  WCLWD_DryingofLeaflets: {
    en: {
      label: 'WCLWD: Drying of Leaflets',
      status: 'Diseased',
      symptoms: ['Leaflet tips/edges dry out and turn brown.', 'Brittle texture and progressive drying.'],
      cause: ['Drying symptom consistent with WCLWD category; may worsen with drought/salt stress.'],
      remedy: ['Improve irrigation scheduling.', 'Maintain sanitation; remove severely dried fronds.', 'Follow local guidance for WCLWD management if widespread.'],
      prevention: ['Mulching to conserve moisture.', 'Avoid saline irrigation water; ensure good drainage.', 'Act early on initial symptoms.'],
      fertilizers: [
        'Sulphate of Potash (SOP) @ 1.5-2 kg per palm (preferred over MOP in saline conditions).',
        'Apply NPK 8:8:16 @ 2 kg per palm with double potassium ratio for drought tolerance.',
        'Gypsum @ 500 g per palm if soil salinity is an issue (helps leach excess salts).',
        'Foliar spray of potassium nitrate @ 1% (10 g/liter) for quick recovery.',
        'Organic mulch (coconut husk, straw) @ 50-75 kg around the palm basin to reduce evaporation.'
      ]
    },
    hi: {
      label: 'WCLWD: पत्तियों का सूखना',
      status: 'रोग प्रभावित',
      symptoms: ['किनारे/सिरे भूरे होकर सूखना।', 'भंगुर बनावट और धीरे-धीरे सूखना।'],
      cause: ['WCLWD श्रेणी के अनुरूप सूखना; सूखा/लवणता से बढ़ सकता है।'],
      remedy: ['सिंचाई सुधारें।', 'बहुत सूखी पत्तियाँ हटाएँ।', 'यदि बढ़े तो स्थानीय विशेषज्ञ से सलाह लें।'],
      prevention: ['मल्चिंग करें।', 'खारे पानी से बचें और निकास अच्छा रखें।', 'शुरुआती लक्षणों पर जल्दी कार्रवाई करें।'],
      fertilizers: [
        'सल्फेट ऑफ पोटाश (SOP) @ 1.5-2 किग्रा प्रति पेड़ (नमकीन मिट्टी में MOP से बेहतर)।',
        'NPK 8:8:16 @ 2 किग्रा प्रति पेड़ दोगुनी पोटैशियम के साथ।',
        'जिप्सम @ 500 ग्राम प्रति पेड़ यदि नमक तनाव हो।',
        'पोटैशियम नाइट्रेट @ 1% स्प्रे (10 ग्राम/लीटर) जल्दी रिकवरी के लिए।',
        'जैविक मल्च (नारियल भूसी, पुआल) @ 50-75 किग्रा।'
      ]
    },
    mr: {
      label: 'WCLWD: पान सुकणे',
      status: 'प्रभावित',
      symptoms: ['कडा/तपकिरी सुकलेले टोक/कडे.', 'हळूहळू सुकणे.'],
      cause: ['WCLWD प्रकारातील सुकणे; दुष्काळ/खारटपणा वाढवू शकतो.'],
      remedy: ['सिंचन वेळापत्रक सुधारा.', 'अतिसुकलेली पाने काढा.', 'वाढल्यास स्थानिक तज्ज्ञ सल्ला.'],
      prevention: ['मल्चिंग.', 'खारट पाणी टाळा; निचरा चांगला ठेवा.', 'लवकर उपाय करा.']
    },
    kn: {
      label: 'WCLWD: ಎಲೆ ಒಣಗುವುದು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಅಂಚು/ತುದಿಗಳು ಒಣಗಿ ಕಂದು ಆಗುವುದು.', 'ಕಠಿಣ/ಭಂಗುರ texture.'],
      cause: ['WCLWD ವರ್ಗದ ಒಣಗುವಿಕೆ; ಬರ/ಉಪ್ಪು ಒತ್ತಡದಿಂದ ಹೆಚ್ಚಾಗಬಹುದು.'],
      remedy: ['ನೀರಾವರಿ ಸರಿಪಡಿಸಿ.', 'ಬಹಳ ಒಣಗಿದ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.', 'ವಿಸ್ತೃತವಾಗಿದ್ದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಮಲ್ಚಿಂಗ್.', 'ಉಪ್ಪು ನೀರು ತಪ್ಪಿಸಿ; ಡ್ರೈನೇಜ್ ಉತ್ತಮ.', 'ಆರಂಭಿಕ ಲಕ್ಷಣದಲ್ಲೇ ಕ್ರಮ.']
    },
    te: {
      label: 'WCLWD: ఆకులు ఎండిపోవడం',
      status: 'ప్రభావితం',
      symptoms: ['అంచులు/చివరలు ఎండిపోయి గోధుమ రంగు.', 'క్రమంగా ఎండిపోవడం.'],
      cause: ['WCLWD తరహా ఎండుదల; కరువు/ఉప్పుతనం పెంచవచ్చు.'],
      remedy: ['నీటిపారుదల మెరుగుపరచండి.', 'చాలా ఎండిన ఆకులు తొలగించండి.', 'విస్తరిస్తే నిపుణుల సలహా.'],
      prevention: ['మల్చింగ్.', 'ఉప్పు నీరు నివారించండి; మంచి డ్రైనేజ్.', 'ప్రారంభంలోనే చర్య.']
    },
    ml: {
      label: 'WCLWD: ഇലത്തണ്ട് ഉണക്കൽ',
      status: 'ബാധിതം',
      symptoms: ['അറ്റങ്ങൾ/തുമ്പുകൾ ഉണങ്ങി തവിട്ട് നിറമാകുക.', 'ക്രമാതീതമായ ഉണക്കൽ.'],
      cause: ['WCLWD വിഭാഗത്തിലെ ഉണക്കൽ; വരൾച്ച/ഉപ്പുസമ്മർദ്ദം വർദ്ധിപ്പിക്കാം.'],
      remedy: ['ജലസേചനം മെച്ചപ്പെടുത്തുക.', 'വളരെ ഉണങ്ങിയ ഇലകൾ നീക്കുക.', 'വ്യാപകമെങ്കിൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['മൾച്ചിങ്.', 'ഉപ്പുജലം ഒഴിവാക്കുക; നല്ല ഡ്രൈനേജ്.', 'ആദ്യ ലക്ഷണത്തിൽ തന്നെ നടപടി.']
    },
    bn: {
      label: 'WCLWD: পাতার শুকিয়ে যাওয়া',
      status: 'আক্রান্ত',
      symptoms: ['পাতার কিনারা/ডগা শুকিয়ে বাদামি হওয়া।', 'ধীরে ধীরে শুকানো।'],
      cause: ['WCLWD ধরণের শুকানো; খরা/লবণাক্ততা বাড়াতে পারে।'],
      remedy: ['সেচ ব্যবস্থাপনা উন্নত করুন।', 'অতিরিক্ত শুকনো পাতা সরান।', 'বেশি হলে বিশেষজ্ঞের পরামর্শ।'],
      prevention: ['মালচিং।', 'লবণাক্ত জল এড়ান; ভালো নিকাশ।', 'শুরুতে ব্যবস্থা নিন।']
    },
    gu: {
      label: 'WCLWD: પાંદડાં સૂકાવું',
      status: 'અસરગ્રસ્ત',
      symptoms: ['કિનારા/ટિપ સૂકાઈને ભૂરો.', 'ધીમે ધીમે સૂકાવું.'],
      cause: ['WCLWD પ્રકારનું સૂકાવું; દુષ્કાળ/ખારાશ વધારી શકે.'],
      remedy: ['સિંચાઈ સુધારો.', 'ઘણાં સૂકા પાંદડા દૂર કરો.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['મલ્ચિંગ.', 'ખારું પાણી ટાળો; સારો ડ્રેનેજ.', 'શરૂઆતમાં જ પગલાં.']
    },
    pa: {
      label: 'WCLWD: ਪੱਤਿਆਂ ਦਾ ਸੁੱਕਣਾ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਕਿਨਾਰੇ/ਸਿਰੇ ਸੁੱਕ ਕੇ ਭੂਰੇ ਹੋ ਜਾਣਾ।', 'ਹੌਲੀ-ਹੌਲੀ ਸੁੱਕਣਾ।'],
      cause: ['WCLWD ਕਿਸਮ ਦਾ ਸੁੱਕਣਾ; ਸੁੱਕਾ/ਖਾਰਾਪਣ ਵਧਾ ਸਕਦਾ ਹੈ।'],
      remedy: ['ਸਿੰਚਾਈ ਸੁਧਾਰੋ।', 'ਬਹੁਤ ਸੁੱਕੇ ਪੱਤੇ ਹਟਾਓ।', 'ਵੱਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ।'],
      prevention: ['ਮਲਚਿੰਗ।', 'ਖਾਰਾ ਪਾਣੀ ਨਾ ਵਰਤੋ; ਡਰੇਨੇਜ ਚੰਗਾ।', 'ਸ਼ੁਰੂ ਵਿੱਚ ਹੀ ਕਾਰਵਾਈ।']
    },
    or: {
      label: 'WCLWD: ପତ୍ର ଶୁଖିବା',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['କିନାରା/ଟିପ୍ ଶୁଖି କଳା/ଭୁରା ହେବା।', 'ଧୀରେ ଧୀରେ ଶୁଖିବା।'],
      cause: ['WCLWD ପ୍ରକାର ଶୁଖିବା; ଖରା/ଲବଣତା ବଢ଼ାଇପାରେ।'],
      remedy: ['ସିଞ୍ଚନ ସୁଧାରନ୍ତୁ।', 'ଅଧିକ ଶୁଖା ପତ୍ର ହଟାନ୍ତୁ।', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ।'],
      prevention: ['ମଲ୍ଚିଂ।', 'ଖାରା ପାଣି ଟାଳନ୍ତୁ; ଡ୍ରେନେଜ୍ ଭଲ।', 'ଆରମ୍ଭରେ କାର୍ଯ୍ୟ।']
    },
    ur: {
      label: 'WCLWD: پتوں کا سوکھنا',
      status: 'متاثرہ',
      symptoms: ['کنارے/سِرے خشک ہو کر بھورے۔', 'آہستہ آہستہ سوکھنا۔'],
      cause: ['WCLWD جیسی خشکی؛ خشک سالی/نمکیات بڑھا سکتے ہیں۔'],
      remedy: ['آبپاشی بہتر کریں۔', 'زیادہ خشک پتے ہٹائیں۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['ملچنگ۔', 'نمکی پانی سے پرہیز؛ نکاسی اچھی رکھیں۔', 'شروع میں ہی اقدام۔']
    }
  },

  WCLWD_Flaccidity: {
    en: {
      label: 'WCLWD: Flaccidity',
      status: 'Diseased',
      symptoms: ['Leaflets appear limp/drooping and lose firmness.'],
      cause: ['Flaccidity symptom consistent with WCLWD category; often linked to water stress or physiological disruption.'],
      remedy: ['Ensure adequate irrigation and correct root-zone issues.', 'Provide balanced nutrition.', 'Consult experts if symptoms persist or spread.'],
      prevention: ['Maintain stable soil moisture and mulching.', 'Avoid root damage.', 'Regular scouting.'],
      fertilizers: [
        'Potassium-rich fertilizer: Muriate of Potash (MOP) @ 1-1.5 kg per palm to improve water regulation.',
        'Apply NPK 10:10:25 @ 2 kg per palm emphasizing potassium (K) for turgor maintenance.',
        'Calcium nitrate @ 200-300 g per palm to strengthen cell walls and improve water uptake.',
        'Root drench with seaweed extract or humic acid @ 50-100 ml per palm to stimulate root recovery.',
        'Adequate mulching with coconut husk/coir pith to conserve soil moisture.'
      ]
    },
    hi: {
      label: 'WCLWD: ढीलापन',
      status: 'रोग प्रभावित',
      symptoms: ['पत्तियाँ ढीली/लटकती हुई दिखती हैं।'],
      cause: ['WCLWD श्रेणी के अनुरूप ढीलापन; जल तनाव/शारीरिक बाधा से जुड़ा हो सकता है।'],
      remedy: ['पर्याप्त सिंचाई करें।', 'संतुलित पोषण दें।', 'लक्षण बने रहें तो विशेषज्ञ से सलाह लें।'],
      prevention: ['मिट्टी की नमी स्थिर रखें।', 'जड़ों को नुकसान से बचाएँ।', 'नियमित निरीक्षण करें।'],
      fertilizers: [
        'म्यूरेट ऑफ पोटाश (MOP) @ 1-1.5 किग्रा प्रति पेड़ जल नियंत्रण के लिए।',
        'NPK 10:10:25 @ 2 किग्रा प्रति पेड़ पोटैशियम पर जोर।',
        'कैल्शियम नाइट्रेट @ 200-300 ग्राम प्रति पेड़।',
        'समुद्री शैवाल/ह्यूमिक अम्ल @ 50-100 ml प्रति पेड़ जड़ ड्रेंच।',
        'नारियल की भूसी से मल्चिंग।'
      ]
    },
    mr: {
      label: 'WCLWD: शिथिलता',
      status: 'प्रभावित',
      symptoms: ['पाने ढिली/लटकलेली दिसतात.'],
      cause: ['पाण्याचा ताण किंवा शारीरिक अडथळा.'],
      remedy: ['पुरेसे सिंचन करा.', 'संतुलित पोषण द्या.', 'पसरल्यास तज्ज्ञ सल्ला.'],
      prevention: ['मातीतील ओलावा स्थिर ठेवा.', 'मुळांना इजा टाळा.', 'नियमित पाहणी.']
    },
    kn: {
      label: 'WCLWD: ತೂಗುವುದು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳು ತೂಗುತ್ತವೆ/ದೃಢತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.'],
      cause: ['ನೀರಿನ ಒತ್ತಡ ಅಥವಾ ದೈಹಿಕ ಸಮಸ್ಯೆ.'],
      remedy: ['ಪರ್ಯಾಯ ನೀರಾವರಿ.', 'ಸಮತೋಲ ಪೋಷಣೆ.', 'ಮುಂದುವರಿದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಮಣ್ಣಿನ ತೇವತೆ ಸ್ಥಿರ.', 'ಬೆರುಗಳಿಗೆ ಹಾನಿ ತಪ್ಪಿಸಿ.', 'ನಿಯಮಿತ ಪರಿಶೀಲನೆ.']
    },
    te: {
      label: 'WCLWD: సడలింపు',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులు సడలిపోయి వాలిపోతాయి.'],
      cause: ['నీటి ఒత్తిడి లేదా శారీరక సమస్య.'],
      remedy: ['సరైన నీటిపారుదల.', 'సమతుల్య పోషణ.', 'తదుపరి కోసం నిపుణుల సలహా.'],
      prevention: ['మట్టి తేమ స్థిరంగా.', 'వేర్లకు నష్టం నివారించండి.', 'నియమిత పరిశీలన.']
    },
    ml: {
      label: 'WCLWD: തളർച്ച',
      status: 'ബാധിതം',
      symptoms: ['ഇലകൾ തളർന്ന് തൂങ്ങുന്നു.'],
      cause: ['ജലസമ്മർദ്ദം അല്ലെങ്കിൽ ശാരീരിക പ്രശ്നം.'],
      remedy: ['മതി ജലസേചനം.', 'സമതുലിത പോഷണം.', 'തുടർന്നാൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['മണ്ണിലെ ഈർപ്പം സ്ഥിരം.', 'വേരുകൾക്ക് ക്ഷതി ഒഴിവാക്കുക.', 'നിയമിത നിരീക്ഷണം.']
    },
    bn: {
      label: 'WCLWD: ঢিলে ভাব',
      status: 'আক্রান্ত',
      symptoms: ['পাতা ঢিলে/ঝুলে পড়ে।'],
      cause: ['জল চাপ বা শারীরবৃত্তীয় সমস্যা।'],
      remedy: ['পর্যাপ্ত সেচ।', 'সুষম পুষ্টি।', 'বাড়লে বিশেষজ্ঞ পরামর্শ।'],
      prevention: ['মাটির আর্দ্রতা স্থির রাখুন।', 'শিকড় ক্ষতি এড়ান।', 'নিয়মিত পর্যবেক্ষণ।']
    },
    gu: {
      label: 'WCLWD: ઢીલાશ',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડા ઢીલા/લટકતા દેખાય.'],
      cause: ['પાણીનો તાણ અથવા શારીરિક સમસ્યા.'],
      remedy: ['પૂરતી સિંચાઈ.', 'સંતુલિત પોષણ.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['માટી ભેજ સ્થિર.', 'મૂળને નુકસાન ટાળો.', 'નિયમિત નિરીક્ષણ.']
    },
    pa: {
      label: 'WCLWD: ਢੀਲਾਪਣ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤੇ ਢੀਲੇ/ਝੁੱਕੇ ਹੋ ਜਾਂਦੇ ਹਨ।'],
      cause: ['ਪਾਣੀ ਦਾ ਤਣਾਅ ਜਾਂ ਸਰੀਰਕ ਸਮੱਸਿਆ।'],
      remedy: ['ਪੂਰੀ ਸਿੰਚਾਈ.', 'ਸੰਤੁਲਿਤ ਪੋਸ਼ਣ.', 'ਵੱਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ.'],
      prevention: ['ਮਿੱਟੀ ਦੀ ਨਮੀ ਸਥਿਰ.', 'ਜੜਾਂ ਨੂੰ ਨੁਕਸਾਨ ਨਾ ਹੋਵੇ.', 'ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ.']
    },
    or: {
      label: 'WCLWD: ଢିଲାପଣ',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ର ଢିଲା/ଲଟକିବା.'],
      cause: ['ଜଳ ଚାପ କିମ୍ବା ଶାରୀରିକ ସମସ୍ୟା.'],
      remedy: ['ପର୍ଯ୍ୟାପ୍ତ ସିଞ୍ଚନ.', 'ସମତୁଳିତ ପୋଷଣ.', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ.'],
      prevention: ['ମାଟି ଆର୍ଦ୍ରତା ସ୍ଥିର.', 'ମୂଳ କ୍ଷତି ଟାଳନ୍ତୁ.', 'ନିୟମିତ ପର୍ଯ୍ୟବେକ୍ଷଣ.']
    },
    ur: {
      label: 'WCLWD: ڈھیلا پن',
      status: 'متاثرہ',
      symptoms: ['پتے ڈھیلے/لٹکے ہوئے۔'],
      cause: ['پانی کا دباؤ یا جسمانی مسئلہ۔'],
      remedy: ['مناسب آبپاشی۔', 'متوازن غذائیت۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['مٹی کی نمی مستحکم۔', 'جڑوں کو نقصان سے بچائیں۔', 'باقاعدہ نگرانی۔']
    }
  },

  WCLWD_Yellowing: {
    en: {
      label: 'WCLWD: Yellowing',
      status: 'Diseased',
      symptoms: ['Yellowing (chlorosis) of leaflets.', 'Reduced vigor and pale appearance.'],
      cause: ['Yellowing symptom consistent with WCLWD category; may be related to nutrient imbalance or root stress.'],
      remedy: ['Check irrigation and drainage.', 'Follow recommended fertilizer schedule; include micronutrients if needed.', 'Seek expert diagnosis if progressive.'],
      prevention: ['Maintain balanced fertilization and organic matter.', 'Avoid prolonged flooding or drought.', 'Early identification and removal of severely affected fronds.'],
      fertilizers: [
        'Iron sulfate (Ferrous sulfate) @ 50-100 g per palm as soil application to correct chlorosis.',
        'Chelated iron spray @ 0.5% concentration as foliar application for quick greening effect.',
        'Apply NPK 12:12:17 @ 2 kg per palm with emphasis on potassium for stress tolerance.',
        'Magnesium sulfate @ 250 g per palm if Mg deficiency suspected (common in sandy soils).',
        'Organic compost @ 30-40 kg per palm to improve soil structure and nutrient retention.'
      ]
    },
    hi: {
      label: 'WCLWD: पीलापन',
      status: 'रोग प्रभावित',
      symptoms: ['पत्तियों का पीला पड़ना।', 'विकास कम और रंग फीका।'],
      cause: ['WCLWD श्रेणी के अनुरूप पीलापन; पोषक असंतुलन/जड़ तनाव से जुड़ा हो सकता है।'],
      remedy: ['सिंचाई/निकास जाँचें।', 'खाद कार्यक्रम अपनाएँ।', 'यदि बढ़े तो विशेषज्ञ से सलाह लें।'],
      prevention: ['संतुलित पोषण रखें।', 'जलभराव/सूखे से बचें।', 'बहुत प्रभावित पत्तियाँ हटाएँ।'],
      fertilizers: [
        'आयरन सल्फेट @ 50-100 ग्राम प्रति पेड़ पीलापन ठीक करने के लिए।',
        'चेलेटेड आयरन स्प्रे @ 0.5% पत्ते पर छिड़काव जल्दी हरियाली के लिए।',
        'NPK 12:12:17 @ 2 किग्रा प्रति पेड़ पोटैशियम जोर के साथ।',
        'मैग्नीशियम सल्फेट @ 250 ग्राम प्रति पेड़ यदि Mg की कमी हो।',
        'जैविक खाद @ 30-40 किग्रा प्रति पेड़।'
      ]
    },
    mr: {
      label: 'WCLWD: पिवळेपणा',
      status: 'प्रभावित',
      symptoms: ['पाने पिवळी पडणे.', 'वाढ कमी/फिकट दिसणे.'],
      cause: ['पोषक असंतुलन किंवा मुळांवरील ताण.'],
      remedy: ['सिंचन/निचरा तपासा.', 'खत कार्यक्रम पाळा.', 'वाढल्यास तज्ज्ञ सल्ला.'],
      prevention: ['संतुलित खत.', 'जलभराव/दुष्काळ टाळा.', 'जास्त प्रभावित पाने काढा.']
    },
    kn: {
      label: 'WCLWD: ಹಳದಿಮು',
      status: 'ಪೀಡಿತ',
      symptoms: ['ಎಲೆಗಳು ಹಳದಿ ಆಗುವುದು.', 'ವೃದ್ಧಿ ಕಡಿಮೆಯಾಗುವುದು.'],
      cause: ['ಪೋಷಕ ಅಸಮತೋಲನ ಅಥವಾ ಬೇರು ಒತ್ತಡ.'],
      remedy: ['ನೀರಾವರಿ/ಡ್ರೈನೇಜ್ ಪರಿಶೀಲನೆ.', 'ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ.', 'ಮುಂದುವರಿದರೆ ತಜ್ಞ ಸಲಹೆ.'],
      prevention: ['ಸಮತೋಲ ಪೋಷಣೆ.', 'ಜಲಾವೃತ/ಬರ ತಪ್ಪಿಸಿ.', 'ತೀವ್ರ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.']
    },
    te: {
      label: 'WCLWD: పసుపు',
      status: 'ప్రభావితం',
      symptoms: ['ఆకులు పసుపు కావడం.', 'వృద్ధి తగ్గడం.'],
      cause: ['పోషక అసమతుల్యత లేదా వేర్ల ఒత్తిడి.'],
      remedy: ['నీరు/డ్రైనేజ్ తనిఖీ.', 'ఎరువు షెడ్యూల్ అనుసరించండి.', 'పెరిగితే నిపుణుల సలహా.'],
      prevention: ['సమతుల్య ఎరువు.', 'నీటి నిల్వ/కరువు నివారించండి.', 'తీవ్ర ఆకులు తొలగించండి.']
    },
    ml: {
      label: 'WCLWD: മഞ്ഞമാറ്റം',
      status: 'ബാധിതം',
      symptoms: ['ഇലകൾ മഞ്ഞയാകുക.', 'വളർച്ച കുറയുക.'],
      cause: ['പോഷക അസന്തുലനം അല്ലെങ്കിൽ വേര്സമ്മർദ്ദം.'],
      remedy: ['ജലസേചനം/ഡ്രൈനേജ് പരിശോധിക്കുക.', 'വള ഷെഡ്യൂൾ പിന്തുടരുക.', 'വ്യാപകമെങ്കിൽ വിദഗ്ധ ഉപദേശം.'],
      prevention: ['സമതുലിത വളം.', 'ജലക്കെട്ട്/വരൾച്ച ഒഴിവാക്കുക.', 'കൂടുതൽ ബാധിച്ച ഇലകൾ നീക്കുക.']
    },
    bn: {
      label: 'WCLWD: হলদে হওয়া',
      status: 'আক্রান্ত',
      symptoms: ['পাতা হলদে হওয়া।', 'বৃদ্ধি কমে যাওয়া।'],
      cause: ['পুষ্টি ভারসাম্যহীনতা বা শিকড় চাপ।'],
      remedy: ['সেচ/নিকাশ পরীক্ষা।', 'সার সূচি অনুসরণ।', 'বাড়লে বিশেষজ্ঞ পরামর্শ।'],
      prevention: ['সুষম সার।', 'দীর্ঘ জলাবদ্ধতা/খরা এড়ান।', 'খুব আক্রান্ত পাতা সরান।']
    },
    gu: {
      label: 'WCLWD: પીળાશ',
      status: 'અસરગ્રસ્ત',
      symptoms: ['પાંદડા પીળા થવા.', 'વૃદ્ધિ ઘટે.'],
      cause: ['પોષક અસંતુલન અથવા મૂળ તાણ.'],
      remedy: ['સિંચાઈ/ડ્રેનેજ ચકાસો.', 'ખાતર કાર્યક્રમ અનુસરો.', 'વધે તો નિષ્ણાત સલાહ.'],
      prevention: ['સંતુલિત ખાતર.', 'જળભરાવ/દુષ્કાળ ટાળો.', 'ઘણું અસરગ્રસ્ત પાંદડા દૂર કરો.']
    },
    pa: {
      label: 'WCLWD: ਪੀਲਾਪਣ',
      status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਪੱਤੇ ਪੀਲੇ ਹੋਣਾ।', 'ਵਾਧਾ ਘਟਣਾ।'],
      cause: ['ਪੋਸ਼ਕ ਅਸਮਤੁਲਨ ਜਾਂ ਜੜਾਂ ਦਾ ਤਣਾਅ।'],
      remedy: ['ਸਿੰਚਾਈ/ਡਰੇਨੇਜ ਚੈੱਕ ਕਰੋ।', 'ਖਾਦ ਸ਼ਡਿਊਲ ਫਾਲੋ ਕਰੋ।', 'ਵਧੇ ਤਾਂ ਮਾਹਿਰ ਸਲਾਹ।'],
      prevention: ['ਸੰਤੁਲਿਤ ਖਾਦ।', 'ਜਲਭਰਾਵ/ਸੁੱਕਾ ਤੋਂ ਬਚੋ।', 'ਜਿਆਦਾ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਹਟਾਓ।']
    },
    or: {
      label: 'WCLWD: ହଳଦିଆ',
      status: 'ପ୍ରଭାବିତ',
      symptoms: ['ପତ୍ର ହଳଦିଆ ହେବା।', 'ବୃଦ୍ଧି କମିବା।'],
      cause: ['ପୋଷକ ଅସମତୁଳନ କିମ୍ବା ମୂଳ ଚାପ।'],
      remedy: ['ସିଞ୍ଚନ/ଡ୍ରେନେଜ୍ ଯାଞ୍ଚ।', 'ସାର କାର୍ଯ୍ୟକ୍ରମ ଅନୁସରଣ।', 'ବଢିଲେ ତଜ୍ଞ ସଲାହ।'],
      prevention: ['ସମତୁଳିତ ସାର।', 'ଜଳାବଦ୍ଧତା/ଖରା ଟାଳନ୍ତୁ।', 'ଅଧିକ ପ୍ରଭାବିତ ପତ୍ର ହଟାନ୍ତୁ।']
    },
    ur: {
      label: 'WCLWD: پیلاہٹ',
      status: 'متاثرہ',
      symptoms: ['پتے پیلے ہونا۔', 'کمزور بڑھوتری۔'],
      cause: ['غذائی عدم توازن یا جڑوں کا دباؤ۔'],
      remedy: ['آبپاشی/نکاسی چیک کریں۔', 'کھاد کا شیڈول اپنائیں۔', 'بڑھے تو ماہر سے مشورہ۔'],
      prevention: ['متوازن کھاد۔', 'لمبی پانی بھراؤ/خشکی سے بچیں۔', 'زیادہ متاثرہ پتے ہٹائیں۔']
    }
  },

  'Bud Root Dropping': {
    en: {
      label: 'Bud Root Dropping', status: 'Diseased',
      symptoms: ['Premature dropping of immature nuts.', 'Darkening and rotting of root system near bud.', 'Yellowing of lower fronds.'],
      cause: ['Caused by Phytophthora palmivora fungus.', 'Excess moisture and poor drainage favor spread.'],
      remedy: ['Remove and destroy affected palms.', 'Apply Metalaxyl-based fungicide as soil drench.', 'Improve drainage.'],
      prevention: ['Ensure proper drainage.', 'Avoid root injuries.', 'Apply Bordeaux mixture (1%) during monsoon.'],
      fertilizers: ['NPK 12:12:17 @ 2 kg/palm.', 'Neem cake @ 5 kg/palm.', 'Trichoderma compost @ 10-15 kg/palm.']
    },
    hi: {
      label: 'कली जड़ गिरना', status: 'रोग प्रभावित',
      symptoms: ['अपरिपक्व फलों का गिरना।', 'कली के पास जड़ सड़न।', 'निचली पत्तियों का पीलापन।'],
      cause: ['Phytophthora palmivora कवक।', 'अधिक नमी और खराब निकास।'],
      remedy: ['प्रभावित पेड़ हटाकर नष्ट करें।', 'मेटालैक्सिल कवकनाशी मिट्टी में डालें।', 'निकास सुधारें।'],
      prevention: ['उचित निकास रखें।', 'जड़ों को चोट से बचाएँ।', 'मॉनसून में बोर्डो मिश्रण (1%)।'],
      fertilizers: ['NPK 12:12:17 @ 2 किग्रा/पेड़।', 'नीम खली @ 5 किग्रा/पेड़।', 'ट्राइकोडर्मा खाद @ 10-15 किग्रा/पेड़।']
    },
    mr: {
      label: 'कळी मूळ गळणे', status: 'प्रभावित',
      symptoms: ['अपरिपक्व फळे गळणे।', 'कळीजवळ मूळ सडणे।', 'खालच्या पानांचा पिवळेपणा।'],
      cause: ['Phytophthora palmivora बुरशी।', 'अधिक ओलावा व खराब निचरा।'],
      remedy: ['प्रभावित झाडे काढून नष्ट करा।', 'मेटालैक्सिल माती ड्रेंच।', 'निचरा सुधारा।'],
      prevention: ['योग्य निचरा।', 'मुळांना इजा टाळा।', 'पावसाळ्यात बोर्डो मिश्रण (1%)।'],
      fertilizers: ['NPK 12:12:17 @ 2 किग्रा/झाड।', 'निंब पेंड @ 5 किग्रा/झाड।']
    },
    kn: {
      label: 'ಮೊಗ್ಗು ಬೇರು ಉದುರುವಿಕೆ', status: 'ಪೀಡಿತ',
      symptoms: ['ಅಪಕ್ವ ಫಲಗಳ ಉದುರುವಿಕೆ.', 'ಮೊಗ್ಗಿನ ಬಳಿ ಬೇರು ಕೊಳೆತ.', 'ಕೆಳಗಿನ ಎಲೆಗಳ ಹಳದಿ.'],
      cause: ['Phytophthora palmivora ಶಿಲೀಂಧ್ರ.', 'ಅತಿ ತೇವ ಮತ್ತು ಕೆಟ್ಟ ಡ್ರೈನೇಜ್.'],
      remedy: ['ಪೀಡಿತ ಮರಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ.', 'ಮೆಟಾಲಾಕ್ಸಿಲ್ ಮಣ್ಣು ಡ್ರೆಂಚ್.', 'ಡ್ರೈನೇಜ್ ಸುಧಾರಿಸಿ.'],
      prevention: ['ಸೂಕ್ತ ಡ್ರೈನೇಜ್.', 'ಬೇರು ಹಾನಿ ತಪ್ಪಿಸಿ.', 'ಮಳೆಗಾಲದಲ್ಲಿ ಬೋರ್ಡೋ ಮಿಶ್ರಣ.'],
      fertilizers: ['NPK 12:12:17 @ 2 ಕೆಜಿ/ಮರ.', 'ಬೇವಿನ ಹಿಂಡಿ @ 5 ಕೆಜಿ/ಮರ.']
    },
    te: {
      label: 'మొగ్గ వేరు రాలడం', status: 'ప్రభావితం',
      symptoms: ['అపరిపక్వ కాయలు రాలడం.', 'మొగ్గ దగ్గర వేరు కుళ్ళు.', 'క్రింది ఆకులు పసుపు.'],
      cause: ['Phytophthora palmivora ఫంగస్.', 'అధిక తేమ, తక్కువ డ్రైనేజ్.'],
      remedy: ['ప్రభావిత చెట్లు తొలగించండి.', 'మెటలాక్సిల్ మట్టి డ్రెంచ్.', 'డ్రైనేజ్ మెరుగుపరచండి.'],
      prevention: ['సరైన డ్రైనేజ్.', 'వేర్ల గాయాలు నివారించండి.', 'వర్షాకాలంలో బోర్డో మిశ్రమం.'],
      fertilizers: ['NPK 12:12:17 @ 2 కేజీ/చెట్టు.', 'వేప చెక్క @ 5 కేజీ/చెట్టు.']
    },
    ml: {
      label: 'മൊട്ട് വേര് പൊഴിയൽ', status: 'ബാധിതം',
      symptoms: ['അപക്വ കായ്കൾ പൊഴിയൽ.', 'മൊട്ടിനടുത്ത് വേര് ചീയൽ.', 'താഴത്തെ ഇലകൾ മഞ്ഞ.'],
      cause: ['Phytophthora palmivora ഫംഗസ്.', 'അധിക ഈർപ്പം, മോശം ഡ്രൈനേജ്.'],
      remedy: ['ബാധിത മരങ്ങൾ നീക്കി നശിപ്പിക്കുക.', 'മെറ്റലാക്സിൽ മണ്ണ് ഡ്രെഞ്ച്.', 'ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക.'],
      prevention: ['ശരിയായ ഡ്രൈനേജ്.', 'വേരുകൾക്ക് ക്ഷതം ഒഴിവാക്കുക.', 'മഴക്കാലത്ത് ബോർഡോ മിശ്രിതം.'],
      fertilizers: ['NPK 12:12:17 @ 2 കിഗ്രാ/മരം.', 'വേപ്പിൻ പിണ്ണാക്ക് @ 5 കിഗ്രാ/മരം.']
    },
    bn: {
      label: 'কুঁড়ি মূল ঝরা', status: 'আক্রান্ত',
      symptoms: ['অপরিপক্ব ফল ঝরা।', 'কুঁড়ির কাছে শিকড় পচন।', 'নিচের পাতা হলদে।'],
      cause: ['Phytophthora palmivora ছত্রাক।', 'অতিরিক্ত আর্দ্রতা ও খারাপ নিকাশ।'],
      remedy: ['আক্রান্ত গাছ সরিয়ে ধ্বংস করুন।', 'মেটালাক্সিল মাটি ড্রেঞ্চ।', 'নিকাশ উন্নত করুন।'],
      prevention: ['সঠিক নিকাশ।', 'শিকড়ে আঘাত এড়ান।', 'বর্ষায় বোর্দো মিশ্রণ।'],
      fertilizers: ['NPK 12:12:17 @ 2 কেজি/গাছ।', 'নিম খৈল @ 5 কেজি/গাছ।']
    },
    gu: {
      label: 'કળી મૂળ ખરવું', status: 'અસરગ્રસ્ત',
      symptoms: ['અપરિપક્વ ફળ ખરવા.', 'કળી પાસે મૂળ સડવું.', 'નીચેના પાંદડા પીળા.'],
      cause: ['Phytophthora palmivora ફૂગ.', 'વધુ ભેજ અને ખરાબ ડ્રેનેજ.'],
      remedy: ['અસરગ્રસ્ત વૃક્ષ દૂર કરો.', 'મેટાલેક્સિલ માટી ડ્રેન્ચ.', 'ડ્રેનેજ સુધારો.'],
      prevention: ['યોગ્ય ડ્રેનેજ.', 'મૂળને ઈજા ટાળો.', 'ચોમાસામાં બોર્ડો મિશ્રણ.'],
      fertilizers: ['NPK 12:12:17 @ 2 કિગ્રા/વૃક્ષ.', 'લીમડા ખોળ @ 5 કિગ્રા/વૃક્ષ.']
    },
    pa: {
      label: 'ਕਲੀ ਜੜ੍ਹ ਡਿੱਗਣਾ', status: 'ਪ੍ਰਭਾਵਿਤ',
      symptoms: ['ਕੱਚੇ ਫਲ ਡਿੱਗਣਾ।', 'ਕਲੀ ਕੋਲ ਜੜ੍ਹ ਸੜਨ।', 'ਹੇਠਲੇ ਪੱਤੇ ਪੀਲੇ।'],
      cause: ['Phytophthora palmivora ਫੰਗਸ।', 'ਜ਼ਿਆਦਾ ਨਮੀ ਅਤੇ ਮਾੜਾ ਡਰੇਨੇਜ।'],
      remedy: ['ਪ੍ਰਭਾਵਿਤ ਦਰੱਖ਼ਤ ਹਟਾਓ।', 'ਮੈਟਾਲੈਕਸਿਲ ਮਿੱਟੀ ਡਰੈਂਚ।', 'ਡਰੇਨੇਜ ਸੁਧਾਰੋ।'],
      prevention: ['ਸਹੀ ਡਰੇਨੇਜ।', 'ਜੜ੍ਹਾਂ ਨੂੰ ਸੱਟ ਤੋਂ ਬਚਾਓ।', 'ਮੌਨਸੂਨ ਵਿੱਚ ਬੋਰਡੋ ਮਿਸ਼ਰਣ।'],
      fertilizers: ['NPK 12:12:17 @ 2 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।', 'ਨਿੰਮ ਖਲ @ 5 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।']
    },
    ur: {
      label: 'کلی جڑ گرنا', status: 'متاثرہ',
      symptoms: ['نادان پھل گرنا۔', 'کلی کے قریب جڑ سڑنا۔', 'نچلے پتے پیلے۔'],
      cause: ['Phytophthora palmivora فنگس۔', 'زیادہ نمی اور خراب نکاسی۔'],
      remedy: ['متاثرہ درخت ہٹائیں۔', 'میٹالیکسل مٹی ڈرینچ۔', 'نکاسی بہتر کریں۔'],
      prevention: ['مناسب نکاسی۔', 'جڑوں کو چوٹ سے بچائیں۔', 'مانسون میں بورڈو مرکب۔'],
      fertilizers: ['NPK 12:12:17 @ 2 کلوگرام/درخت۔', 'نیم کھلی @ 5 کلوگرام/درخت۔']
    }
  },

  'Bud Rot': {
    en: {
      label: 'Bud Rot', status: 'Diseased',
      symptoms: ['Spindle leaf yellowing and wilting.', 'Rotting with foul smell in crown region.', 'Palm death if untreated.'],
      cause: ['Phytophthora palmivora attacking the growing bud.', 'Heavy rainfall and high humidity.'],
      remedy: ['Remove rotten tissue and clean crown.', 'Apply Bordeaux paste (10%).', 'Pour Metalaxyl-Mancozeb (0.1%) into crown.'],
      prevention: ['Good air circulation via proper spacing.', 'Crown inspection during rainy season.', 'Prophylactic Bordeaux mixture before monsoon.'],
      fertilizers: ['MOP @ 1.5 kg/palm.', 'NPK 14:14:14 @ 2 kg/palm.', 'Neem cake @ 5 kg/palm.']
    },
    hi: { label: 'कली सड़न', status: 'रोग प्रभावित', symptoms: ['सबसे नई पत्ती का पीला और मुरझाना।', 'कली क्षेत्र में सड़न और दुर्गंध।', 'अनुपचारित रहने पर मृत्यु।'], cause: ['Phytophthora palmivora कवक।', 'भारी बारिश और उच्च आर्द्रता।'], remedy: ['सड़ा ऊतक हटाएँ।', 'बोर्डो पेस्ट (10%) लगाएँ।', 'मेटालैक्सिल-मैन्कोज़ेब (0.1%) कली में डालें।'], prevention: ['उचित दूरी से हवा संचार।', 'बारिश में कली का निरीक्षण।', 'मॉनसून से पहले बोर्डो मिश्रण।'], fertilizers: ['MOP @ 1.5 किग्रा/पेड़।', 'NPK 14:14:14 @ 2 किग्रा/पेड़।', 'नीम खली @ 5 किग्रा/पेड़।'] },
    mr: { label: 'कळी कुज', status: 'प्रभावित', symptoms: ['नवीन पानाचा पिवळेपणा/मुरझणे.', 'कळीत सडणे व दुर्गंध.', 'उपचार न केल्यास मृत्यू.'], cause: ['Phytophthora palmivora बुरशी.', 'जोरदार पाऊस व उच्च आर्द्रता.'], remedy: ['कुजलेला भाग काढा.', 'बोर्डो पेस्ट (10%) लावा.', 'मेटालैक्सिल-मँकोझेब (0.1%) कळीत ओता.'], prevention: ['योग्य अंतर ठेवा.', 'पावसात कळी तपासा.', 'पावसाळ्यापूर्वी बोर्डो मिश्रण.'], fertilizers: ['MOP @ 1.5 किग्रा/झाड.', 'NPK 14:14:14 @ 2 किग्रा/झाड.'] },
    kn: { label: 'ಮೊಗ್ಗು ಕೊಳೆ', status: 'ಪೀಡಿತ', symptoms: ['ಹೊಸ ಎಲೆ ಹಳದಿ/ಒಣಗುವಿಕೆ.', 'ಕಿರೀಟ ಪ್ರದೇಶದಲ್ಲಿ ಕೊಳೆತ ಮತ್ತು ದುರ್ಗಂಧ.', 'ಚಿಕಿತ್ಸೆ ಇಲ್ಲದಿದ್ದರೆ ಮರ ಸಾಯಬಹುದು.'], cause: ['Phytophthora palmivora ಶಿಲೀಂಧ್ರ.', 'ಭಾರೀ ಮಳೆ ಮತ್ತು ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ.'], remedy: ['ಕೊಳೆತ ಭಾಗ ತೆಗೆಯಿರಿ.', 'ಬೋರ್ಡೋ ಪೇಸ್ಟ್ (10%).', 'ಮೆಟಾಲಾಕ್ಸಿಲ್-ಮ್ಯಾಂಕೋಜೆಬ್ ಕಿರೀಟಕ್ಕೆ.'], prevention: ['ಸೂಕ್ತ ಅಂತರ.', 'ಮಳೆಗಾಲದಲ್ಲಿ ಕಿರೀಟ ಪರಿಶೀಲನೆ.', 'ಮಳೆಗಾಲ ಮೊದಲು ಬೋರ್ಡೋ.'], fertilizers: ['MOP @ 1.5 ಕೆಜಿ/ಮರ.', 'NPK 14:14:14 @ 2 ಕೆಜಿ/ಮರ.'] },
    te: { label: 'మొగ్గ కుళ్ళు', status: 'ప్రభావితం', symptoms: ['కొత్త ఆకు పసుపు/వాడిపోవడం.', 'కిరీట ప్రాంతంలో కుళ్ళు, దుర్వాసన.', 'చికిత్స లేకపోతే చెట్టు మరణం.'], cause: ['Phytophthora palmivora ఫంగస్.', 'భారీ వర్షం, అధిక ఆర్ద్రత.'], remedy: ['కుళ్ళిన భాగం తొలగించండి.', 'బోర్డో పేస్ట్ (10%).', 'మెటలాక్సిల్-మాంకోజెబ్ కిరీటంలో పోయండి.'], prevention: ['సరైన అంతరం.', 'వర్షాకాలంలో కిరీట పరిశీలన.', 'వర్షాకాలం ముందు బోర్డో.'], fertilizers: ['MOP @ 1.5 కేజీ/చెట్టు.', 'NPK 14:14:14 @ 2 కేజీ/చెట్టు.'] },
    ml: { label: 'മൊട്ട് ചീയൽ', status: 'ബാധിതം', symptoms: ['പുതിയ ഇല മഞ്ഞ/വാടൽ.', 'കിരീട ഭാഗത്ത് ചീയലും ദുർഗന്ധവും.', 'ചികിത്സയില്ലെങ്കിൽ മരണം.'], cause: ['Phytophthora palmivora ഫംഗസ്.', 'കനത്ത മഴ, ഉയർന്ന ആർദ്രത.'], remedy: ['ചീഞ്ഞ ഭാഗം നീക്കുക.', 'ബോർഡോ പേസ്റ്റ് (10%).', 'മെറ്റലാക്സിൽ-മാൻകോസെബ് കിരീടത്തിൽ.'], prevention: ['ശരിയായ അകലം.', 'മഴക്കാലത്ത് കിരീട പരിശോധന.', 'മഴക്കാല മുൻ ബോർഡോ.'], fertilizers: ['MOP @ 1.5 കിഗ്രാ/മരം.', 'NPK 14:14:14 @ 2 കിഗ്രാ/മരം.'] },
    bn: { label: 'কুঁড়ি পচা', status: 'আক্রান্ত', symptoms: ['নতুন পাতা হলদে/নুয়ে পড়া।', 'মুকুট এলাকায় পচন ও দুর্গন্ধ।', 'চিকিৎসা না হলে মৃত্যু।'], cause: ['Phytophthora palmivora ছত্রাক।', 'ভারী বৃষ্টি ও উচ্চ আর্দ্রতা।'], remedy: ['পচা অংশ সরান।', 'বোর্দো পেস্ট (10%)।', 'মেটালাক্সিল-ম্যানকোজেব মুকুটে ঢালুন।'], prevention: ['সঠিক দূরত্ব।', 'বর্ষায় মুকুট পরীক্ষা।', 'বর্ষার আগে বোর্দো।'], fertilizers: ['MOP @ 1.5 কেজি/গাছ।', 'NPK 14:14:14 @ 2 কেজি/গাছ।'] },
    gu: { label: 'કળી સડો', status: 'અસરગ્રસ્ત', symptoms: ['નવું પાંદડું પીળું/સુકાવું.', 'તાજ વિસ્તારમાં સડો અને દુર્ગંધ.', 'સારવાર ન થાય તો મૃત્યુ.'], cause: ['Phytophthora palmivora ફૂગ.', 'ભારે વરસાદ અને ઊંચી ભેજ.'], remedy: ['સડેલો ભાગ દૂર કરો.', 'બોર્ડો પેસ્ટ (10%).', 'મેટાલેક્સિલ-મેન્કોઝેબ તાજમાં.'], prevention: ['યોગ્ય અંતર.', 'વરસાદમાં તાજ તપાસ.', 'ચોમાસા પહેલાં બોર્ડો.'], fertilizers: ['MOP @ 1.5 કિગ્રા/વૃક્ષ.', 'NPK 14:14:14 @ 2 કિગ્રા/વૃક્ષ.'] },
    pa: { label: 'ਕਲੀ ਸੜਨ', status: 'ਪ੍ਰਭਾਵਿਤ', symptoms: ['ਨਵਾਂ ਪੱਤਾ ਪੀਲਾ/ਮੁਰਝਾਉਣਾ।', 'ਤਾਜ ਖੇਤਰ ਵਿੱਚ ਸੜਨ ਅਤੇ ਬਦਬੂ।', 'ਇਲਾਜ ਨਾ ਹੋਵੇ ਤਾਂ ਮੌਤ।'], cause: ['Phytophthora palmivora ਫੰਗਸ।', 'ਭਾਰੀ ਬਾਰਿਸ਼ ਅਤੇ ਜ਼ਿਆਦਾ ਨਮੀ।'], remedy: ['ਸੜਿਆ ਹਿੱਸਾ ਹਟਾਓ।', 'ਬੋਰਡੋ ਪੇਸਟ (10%)।', 'ਮੈਟਾਲੈਕਸਿਲ-ਮੈਂਕੋਜ਼ੈਬ ਤਾਜ ਵਿੱਚ।'], prevention: ['ਸਹੀ ਦੂਰੀ।', 'ਬਰਸਾਤ ਵਿੱਚ ਤਾਜ ਜਾਂਚ।', 'ਮੌਨਸੂਨ ਤੋਂ ਪਹਿਲਾਂ ਬੋਰਡੋ।'], fertilizers: ['MOP @ 1.5 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।', 'NPK 14:14:14 @ 2 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।'] },
    ur: { label: 'کلی سڑن', status: 'متاثرہ', symptoms: ['نئے پتے پیلے/مرجھانا۔', 'تاج میں سڑن اور بدبو۔', 'علاج نہ ہو تو موت۔'], cause: ['Phytophthora palmivora فنگس۔', 'بھاری بارش اور زیادہ نمی۔'], remedy: ['سڑا حصہ ہٹائیں۔', 'بورڈو پیسٹ (10%)۔', 'میٹالیکسل-مینکوزیب تاج میں ڈالیں۔'], prevention: ['مناسب فاصلہ۔', 'بارش میں تاج کا معائنہ۔', 'مانسون سے پہلے بورڈو۔'], fertilizers: ['MOP @ 1.5 کلوگرام/درخت۔', 'NPK 14:14:14 @ 2 کلوگرام/درخت۔'] }
  },

  'Gray Leaf Spot': {
    en: {
      label: 'Gray Leaf Spot', status: 'Diseased',
      symptoms: ['Small gray-brown spots on leaflets.', 'Darker border with gray center.', 'Premature leaf drying in severe cases.'],
      cause: ['Caused by Pestalotiopsis palmarum.', 'High humidity and poor nutrition favor it.'],
      remedy: ['Remove and burn infected leaves.', 'Spray Mancozeb (0.25%) or Carbendazim (0.1%).', 'Improve air circulation.'],
      prevention: ['Adequate spacing.', 'Avoid overhead irrigation.', 'Balanced nutrition.'],
      fertilizers: ['NPK 15:15:15 @ 2 kg/palm.', 'Potassium sulfate @ 500 g/palm.', 'Neem oil spray @ 3 ml/liter.']
    },
    hi: { label: 'ग्रे लीफ स्पॉट', status: 'रोग प्रभावित', symptoms: ['पत्तियों पर छोटे भूरे-ग्रे धब्बे।', 'गहरे किनारे, ग्रे केंद्र।', 'गंभीर मामलों में पत्ती सूखना।'], cause: ['Pestalotiopsis palmarum कवक।', 'उच्च आर्द्रता और खराब पोषण।'], remedy: ['संक्रमित पत्तियाँ जलाएँ।', 'मैन्कोज़ेब (0.25%) या कार्बेन्डाज़िम (0.1%) छिड़काव।', 'हवा संचार सुधारें।'], prevention: ['उचित दूरी।', 'ऊपरी सिंचाई से बचें।', 'संतुलित पोषण।'], fertilizers: ['NPK 15:15:15 @ 2 किग्रा/पेड़।', 'पोटैशियम सल्फेट @ 500 ग्राम/पेड़।'] },
    mr: { label: 'ग्रे लीफ स्पॉट', status: 'प्रभावित', symptoms: ['पानांवर लहान राखाडी-तपकिरी डाग.', 'गडद किनार, राखाडी मध्य.', 'गंभीर स्थितीत पान सुकणे.'], cause: ['Pestalotiopsis palmarum बुरशी.', 'उच्च आर्द्रता व खराब पोषण.'], remedy: ['बाधित पाने काढून जाळा.', 'मँकोझेब (0.25%) किंवा कार्बेन्डॅझिम (0.1%).', 'हवा खेळती ठेवा.'], prevention: ['योग्य अंतर.', 'वरून सिंचन टाळा.', 'संतुलित पोषण.'], fertilizers: ['NPK 15:15:15 @ 2 किग्रा/झाड.', 'पोटॅशिअम सल्फेट @ 500 ग्रा/झाड.'] },
    kn: { label: 'ಬೂದಿ ಎಲೆ ಚುಕ್ಕೆ', status: 'ಪೀಡಿತ', symptoms: ['ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ ಬೂದು-ಕಂದು ಚುಕ್ಕೆಗಳು.', 'ಗಾಢ ಅಂಚು, ಬೂದು ಮಧ್ಯ.', 'ತೀವ್ರವಾಗಿ ಎಲೆ ಒಣಗುವಿಕೆ.'], cause: ['Pestalotiopsis palmarum ಶಿಲೀಂಧ್ರ.'], remedy: ['ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ಸುಡಿ.', 'ಮ್ಯಾಂಕೋಜೆಬ್ (0.25%) ಸಿಂಪಡಿಸಿ.'], prevention: ['ಸೂಕ್ತ ಅಂತರ.', 'ಸಮತೋಲ ಪೋಷಣೆ.'], fertilizers: ['NPK 15:15:15 @ 2 ಕೆಜಿ/ಮರ.'] },
    te: { label: 'బూడిద ఆకు మచ్చ', status: 'ప్రభావితం', symptoms: ['ఆకులపై చిన్న బూడిద-గోధుమ మచ్చలు.', 'ముదురు అంచు, బూడిద మధ్యభాగం.', 'తీవ్రంలో ఆకు ఎండిపోవడం.'], cause: ['Pestalotiopsis palmarum ఫంగస్.'], remedy: ['సంక్రమిత ఆకులు కాల్చండి.', 'మాంకోజెబ్ (0.25%) స్ప్రే.'], prevention: ['సరైన అంతరం.', 'సమతుల్య పోషణ.'], fertilizers: ['NPK 15:15:15 @ 2 కేజీ/చెట్టు.'] },
    ml: { label: 'ചാര ഇല പുള്ളി', status: 'ബാധിതം', symptoms: ['ഇലയിൽ ചെറിയ ചാര-തവിട്ട് പുള്ളികൾ.', 'ഇരുണ്ട അരികും ചാര മധ്യഭാഗവും.', 'കഠിനമായാൽ ഇല ഉണക്കൽ.'], cause: ['Pestalotiopsis palmarum ഫംഗസ്.'], remedy: ['ബാധിത ഇലകൾ കത്തിക്കുക.', 'മാൻകോസെബ് (0.25%) തളിക്കുക.'], prevention: ['ശരിയായ അകലം.', 'സമതുലിത പോഷണം.'], fertilizers: ['NPK 15:15:15 @ 2 കിഗ്രാ/മരം.'] },
    bn: { label: 'ধূসর পাতার দাগ', status: 'আক্রান্ত', symptoms: ['পাতায় ছোট ধূসর-বাদামী দাগ।', 'গাঢ় কিনারা, ধূসর কেন্দ্র।', 'গুরুতর ক্ষেত্রে পাতা শুকানো।'], cause: ['Pestalotiopsis palmarum ছত্রাক।'], remedy: ['আক্রান্ত পাতা পুড়িয়ে ফেলুন।', 'ম্যানকোজেব (0.25%) স্প্রে।'], prevention: ['সঠিক দূরত্ব।', 'সুষম পুষ্টি।'], fertilizers: ['NPK 15:15:15 @ 2 কেজি/গাছ।'] },
    gu: { label: 'ગ્રે લીફ સ્પોટ', status: 'અસરગ્રસ્ત', symptoms: ['પાંદડા પર નાના ભૂખરા-ભૂરા ડાઘ.', 'ઘાટો કિનારો, ભૂખરું કેન્દ્ર.', 'ગંભીર કેસમાં પાંદડું સૂકાવું.'], cause: ['Pestalotiopsis palmarum ફૂગ.'], remedy: ['અસરગ્રસ્ત પાંદડા બાળો.', 'મેન્કોઝેબ (0.25%) છંટકાવ.'], prevention: ['યોગ્ય અંતર.', 'સંતુલિત પોષણ.'], fertilizers: ['NPK 15:15:15 @ 2 કિગ્રા/વૃક્ષ.'] },
    pa: { label: 'ਸਲੇਟੀ ਪੱਤਾ ਧੱਬਾ', status: 'ਪ੍ਰਭਾਵਿਤ', symptoms: ['ਪੱਤਿਆਂ ਤੇ ਛੋਟੇ ਸਲੇਟੀ-ਭੂਰੇ ਧੱਬੇ।', 'ਗਹਿਰਾ ਕਿਨਾਰਾ, ਸਲੇਟੀ ਕੇਂਦਰ।', 'ਗੰਭੀਰ ਵਿੱਚ ਪੱਤਾ ਸੁੱਕਣਾ।'], cause: ['Pestalotiopsis palmarum ਫੰਗਸ।'], remedy: ['ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਸਾੜੋ।', 'ਮੈਂਕੋਜ਼ੈਬ (0.25%) ਛਿੜਕਾਅ।'], prevention: ['ਸਹੀ ਦੂਰੀ।', 'ਸੰਤੁਲਿਤ ਪੋਸ਼ਣ।'], fertilizers: ['NPK 15:15:15 @ 2 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।'] },
    ur: { label: 'سلیٹی پتے کا دھبا', status: 'متاثرہ', symptoms: ['پتوں پر چھوٹے بھورے-سلیٹی دھبے۔', 'گہرا کنارا، سلیٹی مرکز۔', 'شدید صورت میں پتا سوکھنا۔'], cause: ['Pestalotiopsis palmarum فنگس۔'], remedy: ['متاثرہ پتے جلائیں۔', 'مینکوزیب (0.25%) اسپرے۔'], prevention: ['مناسب فاصلہ۔', 'متوازن غذائیت۔'], fertilizers: ['NPK 15:15:15 @ 2 کلوگرام/درخت۔'] }
  },

  'Leaf Rot': {
    en: {
      label: 'Leaf Rot', status: 'Diseased',
      symptoms: ['Brown lesions on leaflets from tips.', 'Rotting and disintegration of tissue.', 'Entire fronds brown and hanging in severe cases.'],
      cause: ['Fungal complex including Colletotrichum.', 'Mite damage provides entry for fungi.'],
      remedy: ['Remove affected fronds.', 'Spray Hexaconazole (0.05%) or Mancozeb (0.25%).', 'Control mites first if present.'],
      prevention: ['Control eriophyid mites promptly.', 'Good field sanitation.', 'Balanced nutrition.'],
      fertilizers: ['NPK 12:12:17 @ 2 kg/palm.', 'Magnesium sulfate @ 300 g/palm.', 'Borax @ 100 g/palm.']
    },
    hi: { label: 'पत्ती सड़न', status: 'रोग प्रभावित', symptoms: ['सिरों से भूरे घाव।', 'ऊतक सड़कर टूटना।', 'गंभीर में पूरी पत्ती भूरी।'], cause: ['Colletotrichum सहित कवक समूह।', 'माइट क्षति से कवक प्रवेश।'], remedy: ['प्रभावित पत्तियाँ हटाएँ।', 'हेक्साकोनाज़ोल (0.05%) या मैन्कोज़ेब (0.25%)।', 'पहले माइट नियंत्रण।'], prevention: ['माइट को तुरंत नियंत्रित करें।', 'सफाई रखें।', 'संतुलित पोषण।'], fertilizers: ['NPK 12:12:17 @ 2 किग्रा/पेड़।', 'मैग्नीशियम सल्फेट @ 300 ग्राम/पेड़।'] },
    mr: { label: 'पान कुज', status: 'प्रभावित', symptoms: ['टोकांपासून तपकिरी व्रण.', 'ऊतक सडणे/तुटणे.', 'गंभीर स्थितीत संपूर्ण पान तपकिरी.'], cause: ['Colletotrichum सह बुरशी गट.', 'माइट नुकसानातून बुरशी प्रवेश.'], remedy: ['बाधित पाने काढा.', 'हेक्साकोनॅझोल (0.05%) किंवा मँकोझेब (0.25%).', 'आधी माइट नियंत्रण.'], prevention: ['माइट तात्काळ नियंत्रण.', 'शेत स्वच्छता.', 'संतुलित पोषण.'], fertilizers: ['NPK 12:12:17 @ 2 किग्रा/झाड.'] },
    kn: { label: 'ಎಲೆ ಕೊಳೆ', status: 'ಪೀಡಿತ', symptoms: ['ತುದಿಯಿಂದ ಕಂದು ಗಾಯ.', 'ಕೊಳೆತ ಮತ್ತು ತುಂಡಾಗುವಿಕೆ.', 'ತೀವ್ರವಾಗಿ ಇಡೀ ಎಲೆ ಕಂದು.'], cause: ['Colletotrichum ಶಿಲೀಂಧ್ರ.', 'ಉಣ್ಣೆ ಹುಳ ಹಾನಿ.'], remedy: ['ಪೀಡಿತ ಎಲೆ ತೆಗೆಯಿರಿ.', 'ಹೆಕ್ಸಾಕೊನಜೋಲ್ (0.05%) ಅಥವಾ ಮ್ಯಾಂಕೋಜೆಬ್.'], prevention: ['ಉಣ್ಣೆ ಹುಳ ನಿಯಂತ್ರಣ.', 'ಶುಚಿತ್ವ.'], fertilizers: ['NPK 12:12:17 @ 2 ಕೆಜಿ/ಮರ.'] },
    te: { label: 'ఆకు కుళ్ళు', status: 'ప్రభావితం', symptoms: ['చివరల నుండి గోధుమ గాయాలు.', 'కణజాలం కుళ్ళి విడిపోవడం.', 'తీవ్రంలో మొత్తం ఆకు గోధుమ.'], cause: ['Colletotrichum ఫంగస్ సముదాయం.', 'పురుగు నష్టం ద్వారా ఫంగస్ ప్రవేశం.'], remedy: ['ప్రభావిత ఆకులు తొలగించండి.', 'హెక్సాకొనజోల్ (0.05%) స్ప్రే.'], prevention: ['పురుగులను వెంటనే నియంత్రించండి.', 'పొలం శుభ్రత.'], fertilizers: ['NPK 12:12:17 @ 2 కేజీ/చెట్టు.'] },
    ml: { label: 'ഇല ചീയൽ', status: 'ബാധിതം', symptoms: ['അഗ്രത്തിൽ നിന്ന് തവിട്ട് വ്രണം.', 'കലകൾ ചീഞ്ഞ് വേർപെടൽ.', 'കഠിനമായാൽ മുഴുവൻ ഇല തവിട്ട്.'], cause: ['Colletotrichum ഫംഗസ് സംഘം.', 'ചാഴി കേട് വഴി ഫംഗസ് പ്രവേശനം.'], remedy: ['ബാധിത ഇലകൾ നീക്കുക.', 'ഹെക്സാകോണസോൾ (0.05%) തളിക്കുക.'], prevention: ['ചാഴികളെ ഉടൻ നിയന്ത്രിക്കുക.', 'ശുചിത്വം.'], fertilizers: ['NPK 12:12:17 @ 2 കിഗ്രാ/മരം.'] },
    bn: { label: 'পাতা পচা', status: 'আক্রান্ত', symptoms: ['ডগা থেকে বাদামী ক্ষত।', 'কলা পচে ভেঙে যাওয়া।', 'গুরুতর ক্ষেত্রে পুরো পাতা বাদামী।'], cause: ['Colletotrichum ছত্রাক।', 'মাকড় ক্ষতি দিয়ে ছত্রাক প্রবেশ।'], remedy: ['আক্রান্ত পাতা সরান।', 'হেক্সাকোনাজোল (0.05%) স্প্রে।'], prevention: ['মাকড় দ্রুত নিয়ন্ত্রণ।', 'পরিষ্কার-পরিচ্ছন্নতা।'], fertilizers: ['NPK 12:12:17 @ 2 কেজি/গাছ।'] },
    gu: { label: 'પાંદડા સડો', status: 'અસરગ્રસ્ત', symptoms: ['છેડેથી ભૂરા ઘા.', 'તંતુ સડીને તૂટવું.', 'ગંભીર કેસમાં આખું પાંદડું ભૂરું.'], cause: ['Colletotrichum ફૂગ.', 'જીવાત નુકસાન દ્વારા ફૂગ પ્રવેશ.'], remedy: ['અસરગ્રસ્ત પાંદડા દૂર કરો.', 'હેક્સાકોનાઝોલ (0.05%) છંટકાવ.'], prevention: ['જીવાત તાત્કાલિક નિયંત્રણ.', 'સ્વચ્છતા.'], fertilizers: ['NPK 12:12:17 @ 2 કિગ્રા/વૃક્ષ.'] },
    pa: { label: 'ਪੱਤਾ ਸੜਨ', status: 'ਪ੍ਰਭਾਵਿਤ', symptoms: ['ਸਿਰਿਆਂ ਤੋਂ ਭੂਰੇ ਜ਼ਖ਼ਮ।', 'ਟਿਸ਼ੂ ਸੜ ਕੇ ਟੁੱਟਣਾ।', 'ਗੰਭੀਰ ਵਿੱਚ ਪੂਰਾ ਪੱਤਾ ਭੂਰਾ।'], cause: ['Colletotrichum ਫੰਗਸ।', 'ਕੀੜਾ ਨੁਕਸਾਨ ਤੋਂ ਫੰਗਸ ਦਾਖ਼ਲ।'], remedy: ['ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਹਟਾਓ।', 'ਹੈਕਸਾਕੋਨਾਜ਼ੋਲ (0.05%) ਛਿੜਕਾਅ।'], prevention: ['ਕੀੜੇ ਤੁਰੰਤ ਕਾਬੂ।', 'ਸਫ਼ਾਈ।'], fertilizers: ['NPK 12:12:17 @ 2 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।'] },
    ur: { label: 'پتا سڑنا', status: 'متاثرہ', symptoms: ['سروں سے بھورے زخم۔', 'ٹشو سڑ کر ٹوٹنا۔', 'شدید صورت میں پورا پتا بھورا۔'], cause: ['Colletotrichum فنگس۔', 'کیڑے کے نقصان سے فنگس داخل۔'], remedy: ['متاثرہ پتے ہٹائیں۔', 'ہیکساکونازول (0.05%) اسپرے۔'], prevention: ['کیڑے فوری کنٹرول۔', 'صفائی۔'], fertilizers: ['NPK 12:12:17 @ 2 کلوگرام/درخت۔'] }
  },

  'Stem Bleeding': {
    en: {
      label: 'Stem Bleeding', status: 'Diseased',
      symptoms: ['Dark brown-black exudation on stem.', 'Longitudinal cracks oozing reddish-brown fluid.', 'Reduced yield and gradual decline.'],
      cause: ['Caused by Thielaviopsis paradoxa fungus.', 'Entry through wounds on the stem.'],
      remedy: ['Chisel out affected tissue to healthy wood.', 'Apply coal tar or Bordeaux paste (10%).', 'Root feed with Tridemorph (5ml/100ml water).'],
      prevention: ['Avoid stem injuries during harvesting.', 'Apply Bordeaux paste on wounds immediately.', 'Good drainage around palm base.'],
      fertilizers: ['NPK 14:14:14 @ 2 kg/palm.', 'MOP @ 1.5 kg/palm.', 'Neem cake @ 5 kg/palm.']
    },
    hi: { label: 'तना रक्तस्राव', status: 'रोग प्रभावित', symptoms: ['तने पर गहरे भूरे-काले रिसाव।', 'दरारों से लाल-भूरा द्रव।', 'उपज कम।'], cause: ['Thielaviopsis paradoxa कवक।', 'तने पर घाव से प्रवेश।'], remedy: ['प्रभावित ऊतक छीलें।', 'गर्म कोलतार या बोर्डो पेस्ट (10%)।', 'ट्राइडेमॉर्फ जड़ ड्रेंच।'], prevention: ['तने पर चोट से बचें।', 'घाव पर बोर्डो पेस्ट।', 'अच्छी निकास।'], fertilizers: ['NPK 14:14:14 @ 2 किग्रा/पेड़।', 'MOP @ 1.5 किग्रा/पेड़।', 'नीम खली @ 5 किग्रा/पेड़।'] },
    mr: { label: 'खोड रक्तस्राव', status: 'प्रभावित', symptoms: ['खोडावर गडद तपकिरी-काळा स्राव.', 'उभ्या भेगांतून लालसर द्रव.', 'उत्पन्न कमी.'], cause: ['Thielaviopsis paradoxa बुरशी.', 'खोडावरील जखमांतून प्रवेश.'], remedy: ['बाधित भाग खरवडून काढा.', 'कोळसा डांबर किंवा बोर्डो पेस्ट (10%).'], prevention: ['खोडाला इजा टाळा.', 'जखमेवर बोर्डो पेस्ट.', 'निचरा चांगला.'], fertilizers: ['NPK 14:14:14 @ 2 किग्रा/झाड.', 'MOP @ 1.5 किग्रा/झाड.'] },
    kn: { label: 'ಕಾಂಡ ರಕ್ತಸ್ರಾವ', status: 'ಪೀಡಿತ', symptoms: ['ಕಾಂಡದ ಮೇಲೆ ಕಂದು-ಕಪ್ಪು ಸ್ರಾವ.', 'ಬಿರುಕುಗಳಿಂದ ಕೆಂಪು-ಕಂದು ದ್ರವ.', 'ಇಳುವರಿ ಕಡಿಮೆ.'], cause: ['Thielaviopsis paradoxa ಶಿಲೀಂಧ್ರ.', 'ಗಾಯಗಳ ಮೂಲಕ ಪ್ರವೇಶ.'], remedy: ['ಪೀಡಿತ ಭಾಗ ಕೆರೆದು ತೆಗೆಯಿರಿ.', 'ಕಲ್ಲಿದ್ದಲು ಟಾರ್ ಅಥವಾ ಬೋರ್ಡೋ ಪೇಸ್ಟ್.'], prevention: ['ಕಾಂಡಕ್ಕೆ ಗಾಯ ತಪ್ಪಿಸಿ.', 'ಗಾಯಕ್ಕೆ ಬೋರ್ಡೋ.', 'ಉತ್ತಮ ಡ್ರೈನೇಜ್.'], fertilizers: ['NPK 14:14:14 @ 2 ಕೆಜಿ/ಮರ.', 'MOP @ 1.5 ಕೆಜಿ/ಮರ.'] },
    te: { label: 'కాండం రక్తస్రావం', status: 'ప్రభావితం', symptoms: ['కాండంపై ముదురు గోధుమ-నలుపు స్రావం.', 'పగుళ్లలో ఎర్ర-గోధుమ ద్రవం.', 'దిగుబడి తగ్గడం.'], cause: ['Thielaviopsis paradoxa ఫంగస్.', 'గాయాల ద్వారా ప్రవేశం.'], remedy: ['ప్రభావిత భాగం చెక్కండి.', 'బొగ్గు తారు లేదా బోర్డో పేస్ట్.'], prevention: ['కాండానికి గాయాలు నివారించండి.', 'గాయంపై బోర్డో.', 'మంచి డ్రైనేజ్.'], fertilizers: ['NPK 14:14:14 @ 2 కేజీ/చెట్టు.', 'MOP @ 1.5 కేజీ/చెట్టు.'] },
    ml: { label: 'തണ്ട് രക്തസ്രാവം', status: 'ബാധിതം', symptoms: ['തണ്ടിൽ ഇരുണ്ട തവിട്ട്-കറുപ്പ് സ്രവം.', 'വിള്ളലുകളിൽ ചുവന്ന-തവിട്ട് ദ്രവം.', 'വിളവ് കുറയൽ.'], cause: ['Thielaviopsis paradoxa ഫംഗസ്.', 'മുറിവിലൂടെ പ്രവേശനം.'], remedy: ['ബാധിത ഭാഗം ചെത്തി നീക്കുക.', 'കൽക്കരി ടാർ അല്ലെങ്കിൽ ബോർഡോ പേസ്റ്റ്.'], prevention: ['തണ്ടിന് ക്ഷതം ഒഴിവാക്കുക.', 'മുറിവിൽ ബോർഡോ.', 'നല്ല ഡ്രൈനേജ്.'], fertilizers: ['NPK 14:14:14 @ 2 കിഗ്രാ/മരം.', 'MOP @ 1.5 കിഗ്രാ/മരം.'] },
    bn: { label: 'কাণ্ড রক্তক্ষরণ', status: 'আক্রান্ত', symptoms: ['কাণ্ডে গাঢ় বাদামী-কালো নিঃসরণ।', 'ফাটল থেকে লালচে-বাদামী তরল।', 'ফলন কমা।'], cause: ['Thielaviopsis paradoxa ছত্রাক।', 'ক্ষত দিয়ে প্রবেশ।'], remedy: ['আক্রান্ত অংশ ছেনি দিয়ে তুলুন।', 'কয়লা আলকাতরা বা বোর্দো পেস্ট।'], prevention: ['কাণ্ডে আঘাত এড়ান।', 'ক্ষতে বোর্দো পেস্ট।', 'ভালো নিকাশ।'], fertilizers: ['NPK 14:14:14 @ 2 কেজি/গাছ।', 'MOP @ 1.5 কেজি/গাছ।'] },
    gu: { label: 'થડ રક્તસ્ત્રાવ', status: 'અસરગ્રસ્ત', symptoms: ['થડ પર ઘાટા ભૂરા-કાળા સ્ત્રાવ.', 'તિરાડોમાંથી લાલ-ભૂરું પ્રવાહી.', 'ઉપજ ઘટે.'], cause: ['Thielaviopsis paradoxa ફૂગ.', 'ઘા દ્વારા પ્રવેશ.'], remedy: ['અસરગ્રસ્ત ભાગ છોલો.', 'કોલ ટાર અથવા બોર્ડો પેસ્ટ.'], prevention: ['થડને ઈજા ટાળો.', 'ઘા પર બોર્ડો.', 'સારો ડ્રેનેજ.'], fertilizers: ['NPK 14:14:14 @ 2 કિગ્રા/વૃક્ષ.', 'MOP @ 1.5 કિગ્રા/વૃક્ષ.'] },
    pa: { label: 'ਤਣਾ ਖ਼ੂਨ ਵਹਿਣਾ', status: 'ਪ੍ਰਭਾਵਿਤ', symptoms: ['ਤਣੇ ਤੇ ਗੂੜ੍ਹੇ ਭੂਰੇ-ਕਾਲੇ ਰਿਸਾਅ।', 'ਦਰਾਰਾਂ ਤੋਂ ਲਾਲ-ਭੂਰਾ ਤਰਲ।', 'ਝਾੜ ਘਟਣਾ।'], cause: ['Thielaviopsis paradoxa ਫੰਗਸ।', 'ਜ਼ਖ਼ਮ ਤੋਂ ਦਾਖ਼ਲ।'], remedy: ['ਪ੍ਰਭਾਵਿਤ ਹਿੱਸਾ ਛੀਲੋ।', 'ਕੋਲ ਟਾਰ ਜਾਂ ਬੋਰਡੋ ਪੇਸਟ।'], prevention: ['ਤਣੇ ਨੂੰ ਸੱਟ ਤੋਂ ਬਚਾਓ।', 'ਜ਼ਖ਼ਮ ਤੇ ਬੋਰਡੋ।', 'ਚੰਗਾ ਡਰੇਨੇਜ।'], fertilizers: ['NPK 14:14:14 @ 2 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।', 'MOP @ 1.5 ਕਿਗ੍ਰਾ/ਦਰੱਖ਼ਤ।'] },
    ur: { label: 'تنے سے خون بہنا', status: 'متاثرہ', symptoms: ['تنے پر گہرے بھورے-کالے رساؤ۔', 'دراڑوں سے سرخی مائل بھورا مائع۔', 'پیداوار میں کمی۔'], cause: ['Thielaviopsis paradoxa فنگس۔', 'زخم سے داخلہ۔'], remedy: ['متاثرہ حصہ چھیل لیں۔', 'کول ٹار یا بورڈو پیسٹ۔'], prevention: ['تنے کو چوٹ سے بچائیں۔', 'زخم پر بورڈو۔', 'اچھی نکاسی۔'], fertilizers: ['NPK 14:14:14 @ 2 کلوگرام/درخت۔', 'MOP @ 1.5 کلوگرام/درخت۔'] }
  }
}

export function getDiseaseInfo(diseaseKey, lang, fallback = null) {
  const key = String(diseaseKey || '')
  const code = String(lang || 'en').toLowerCase()

  const byDisease = DISEASE_INFO[key]
  if (!byDisease) {
    return fallback
  }

  return byDisease[code] || byDisease.en || fallback
}
