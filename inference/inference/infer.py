import io
import os
import sys
from functools import lru_cache

import torch
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import models, transforms

app = FastAPI(title="Coconut Leaf Disease Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== DEVICE =====
def _resolve_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    mps_backend = getattr(torch.backends, "mps", None)
    if mps_backend is not None and mps_backend.is_available():
        return torch.device("mps")
    return torch.device("cpu")


device = _resolve_device()
print(f"[inference] device = {device}")

# ===== CLASSES (6 — MUST MATCH TRAINING) =====
class_names = [
    "Caterpillars",
    "CCI_Leaflets",
    "Healthy_Leaves",
    "WCLWD_DryingofLeaflets",
    "WCLWD_Flaccidity",
    "WCLWD_Yellowing"
]

REPORTS_EN = {
    "Healthy_Leaves": {
        "status": "Healthy",
        "cause": [
            "No visible disease symptoms detected in the provided leaf image.",
            "Minor natural color variation can occur due to age, lighting, or variety.",
        ],
        "symptoms": [
            "Uniform green color and normal leaflet texture.",
            "No distinct yellowing, drying, flaccidity, or pest feeding marks.",
        ],
        "remedies": [
            "Maintain regular irrigation schedule and avoid waterlogging.",
            "Apply balanced nutrition (NPK + micronutrients) based on soil test.",
            "Continue routine field scouting once per week.",
        ],
        "prevention": [
            "Keep the crown clean and remove old/dry fronds periodically.",
            "Use clean planting material and follow recommended spacing.",
            "Monitor for early pest activity (caterpillars/mites) and act early.",
        ],
        "fertilizers": [
            "Apply NPK 14:14:14 @ 1.5 kg per palm twice a year (June-July and November-December).",
            "Supplement with organic manure (FYM/compost) @ 25-50 kg per palm annually.",
            "Micronutrient spray: Mix Borax (0.2%), Zinc sulfate (0.5%), Magnesium sulfate (1%) - spray every 3-4 months.",
            "For coastal areas, consider salt-tolerant varieties and additional potassium (25-50% more).",
        ],
    },
    "Caterpillars": {
        "status": "Diseased",
        "cause": [
            "Caterpillar infestation feeding on leaf tissue.",
            "Higher risk during warm/humid periods and in dense canopies.",
        ],
        "symptoms": [
            "Irregular holes or chewed edges on leaflets.",
            "Skeletonization (leaf tissue eaten leaving veins).",
            "Presence of larvae, frass (droppings), or webbing.",
        ],
        "remedies": [
            "Physically remove and destroy visible larvae (small infestations).",
            "Encourage biological control (natural predators/parasitoids).",
            "If severe, use an approved biopesticide (e.g., Bt-based) or recommended insecticide as per local agriculture guidelines.",
        ],
        "prevention": [
            "Regular monitoring, especially on young palms and new flush leaves.",
            "Avoid excessive nitrogen which can attract pests.",
            "Maintain field sanitation and reduce alternate host plants.",
        ],
        "fertilizers": [
            "Use Bacillus thuringiensis (Bt) spray @ 1-2 g/liter water, apply every 7-10 days until infestation clears.",
            "Apply Neem oil solution @ 3-5 ml/liter water as organic pest control and foliar spray.",
            "Reduce nitrogen fertilizer temporarily; use balanced NPK 10:10:20 instead of high-N formulas.",
            "Support plant recovery with potassium-rich fertilizer (Muriate of Potash @ 0.5 kg/palm) after pest control.",
        ],
    },
    "CCI_Leaflets": {
        "status": "Diseased",
        "cause": [
            "Leaflet injury/stress category captured in the dataset (commonly associated with nutrient stress, minor infections, or environmental stress).",
            "Could be influenced by moisture stress, micronutrient deficiency, or early-stage infection patterns.",
        ],
        "symptoms": [
            "Patchy discoloration on leaflets.",
            "Mild spots or uneven chlorosis without clear WCLWD pattern.",
            "Localized damage that may not uniformly spread across the leaf.",
        ],
        "remedies": [
            "Improve field nutrition: apply balanced NPK and consider magnesium/boron if deficiency is suspected.",
            "Remove heavily damaged leaflets to reduce secondary infection sources.",
            "If spotting increases, consult local experts for targeted fungicide/insecticide recommendation.",
        ],
        "prevention": [
            "Maintain irrigation consistency and avoid drought stress.",
            "Conduct periodic soil and leaf nutrient analysis.",
            "Use clean tools and avoid mechanical damage during farm operations.",
        ],
        "fertilizers": [
            "Apply Magnesium sulfate (Epsom salt) @ 200-300 g per palm as soil application or foliar spray (2%).",
            "Borax @ 50-100 g per palm mixed with sand for even soil distribution (apply once a year).",
            "Zinc sulfate @ 0.5% foliar spray (400-500 g in 100 liters water for 100 palms).",
            "Balanced NPK 15:15:15 @ 1.5 kg per palm to correct overall nutrient balance.",
            "Organic option: Apply neem cake @ 5 kg per palm to improve soil health and micronutrient availability.",
        ],
    },
    "WCLWD_Yellowing": {
        "status": "Diseased",
        "cause": [
            "Yellowing symptom consistent with WCLWD category in dataset.",
            "May be associated with nutrient imbalance, root stress, or disease progression.",
        ],
        "symptoms": [
            "Yellowing of leaflets (chlorosis), often starting at tips or margins.",
            "Reduced vigor and pale appearance compared to healthy leaves.",
        ],
        "remedies": [
            "Check irrigation and drainage; correct water stress.",
            "Apply recommended fertilizer schedule; include micronutrients if needed.",
            "If widespread and progressive, seek expert diagnosis to confirm WCLWD and follow regional management protocol.",
        ],
        "prevention": [
            "Maintain balanced fertilization and organic matter in soil.",
            "Avoid prolonged flooding or drought.",
            "Early identification and removal of severely affected fronds can reduce stress load on the palm.",
        ],
        "fertilizers": [
            "Iron sulfate (Ferrous sulfate) @ 50-100 g per palm as soil application to correct chlorosis.",
            "Chelated iron spray @ 0.5% concentration as foliar application for quick greening effect.",
            "Apply NPK 12:12:17 @ 2 kg per palm with emphasis on potassium for stress tolerance.",
            "Magnesium sulfate @ 250 g per palm if Mg deficiency suspected (common in sandy soils).",
            "Organic compost @ 30-40 kg per palm to improve soil structure and nutrient retention.",
        ],
    },
    "WCLWD_Flaccidity": {
        "status": "Diseased",
        "cause": [
            "Flaccidity symptom consistent with WCLWD category in dataset.",
            "Often linked to water stress, vascular/physiological disruption, or advanced disease stress.",
        ],
        "symptoms": [
            "Leaflets appear limp, drooping, and lose firmness.",
            "Overall reduction in leaf turgor.",
        ],
        "remedies": [
            "Ensure adequate irrigation and correct any root-zone issues (compaction, poor drainage).",
            "Apply balanced nutrition to support recovery.",
            "If symptoms persist or spread, consult local agriculture department for WCLWD confirmation and management guidance.",
        ],
        "prevention": [
            "Maintain proper soil moisture and mulching to stabilize root-zone temperature.",
            "Avoid damaging roots during inter-cultivation.",
            "Regular scouting for early warning signs.",
        ],
        "fertilizers": [
            "Potassium-rich fertilizer: Muriate of Potash (MOP) @ 1-1.5 kg per palm to improve water regulation.",
            "Apply NPK 10:10:25 @ 2 kg per palm emphasizing potassium (K) for turgor maintenance.",
            "Calcium nitrate @ 200-300 g per palm to strengthen cell walls and improve water uptake.",
            "Root drench with seaweed extract or humic acid @ 50-100 ml per palm to stimulate root recovery.",
            "Adequate mulching with coconut husk/coir pith to conserve soil moisture.",
        ],
    },
    "WCLWD_DryingofLeaflets": {
        "status": "Diseased",
        "cause": [
            "Drying symptom consistent with WCLWD category in dataset.",
            "Can be intensified by drought, salt stress, or disease-related decline.",
        ],
        "symptoms": [
            "Leaflet tips/edges dry out and turn brown.",
            "Brittle texture and progressive drying from tip to base.",
        ],
        "remedies": [
            "Improve irrigation scheduling; avoid moisture stress.",
            "Apply potash-rich fertilization if recommended by local guidelines.",
            "Remove severely dried fronds and maintain sanitation.",
        ],
        "prevention": [
            "Mulching and organic matter addition to conserve moisture.",
            "Avoid saline irrigation water and ensure good drainage.",
            "Monitor early drying symptoms and act before progression.",
        ],
        "fertilizers": [
            "Sulphate of Potash (SOP) @ 1.5-2 kg per palm (preferred over MOP in saline conditions).",
            "Apply NPK 8:8:16 @ 2 kg per palm with double potassium ratio for drought tolerance.",
            "Gypsum @ 500 g per palm if soil salinity is an issue (helps leach excess salts).",
            "Foliar spray of potassium nitrate @ 1% (10 g/liter) for quick recovery.",
            "Organic mulch (coconut husk, straw) @ 50-75 kg around the palm basin to reduce evaporation.",
        ],
    },
}


REPORTS_I18N = {
    "en": REPORTS_EN,
    "hi": {
        "Healthy_Leaves": {
            "status": "स्वस्थ",
            "cause": [
                "दी गई पत्ती की तस्वीर में स्पष्ट रोग लक्षण नहीं दिखे।",
                "पत्ती की उम्र/रोशनी/प्रजाति के कारण हल्का रंग-परिवर्तन स्वाभाविक हो सकता है।",
            ],
            "symptoms": [
                "समान हरा रंग और सामान्य बनावट।",
                "पीला पड़ना/सूखना/ढीलापन/कीट-खुरचन जैसे स्पष्ट संकेत नहीं।",
            ],
            "remedies": [
                "नियमित सिंचाई रखें और जलभराव से बचें।",
                "मिट्टी परीक्षण के अनुसार संतुलित खाद (NPK + सूक्ष्म पोषक) दें।",
                "साप्ताहिक निरीक्षण जारी रखें।",
            ],
            "prevention": [
                "पुरानी/सूखी पत्तियाँ समय-समय पर हटाएँ।",
                "स्वच्छ रोपण सामग्री और उचित दूरी अपनाएँ।",
                "कीट गतिविधि की शुरुआती निगरानी करें और समय पर नियंत्रण करें।",
            ],
            "fertilizers": [
                "NPK 14:14:14 @ 1.5 किग्रा प्रति पेड़ वर्ष में दो बार (जून-जुलाई और नवंबर-दिसंबर) लगाएं।",
                "गोबर की खाद/कम्पोस्ट @ 25-50 किग्रा प्रति पेड़ सालाना मिलाएं।",
                "सूक्ष्म पोषक स्प्रे: बोरेक्स (0.2%), जिंक सल्फेट (0.5%), मैग्नीशियम सल्फेट (1%) मिश्रण - हर 3-4 महीने स्प्रे करें।",
                "तटीय क्षेत्रों के लिए अतिरिक्त पोटैशियम (25-50% अधिक) दें।",
            ],
        },
        "Caterpillars": {
            "status": "रोग/कीट प्रभावित",
            "cause": [
                "सूंडी/इल्ली द्वारा पत्ती के ऊतक को खाना।",
                "गरम-नम मौसम और घनी छाया में जोखिम बढ़ता है।",
            ],
            "symptoms": [
                "पत्तियों में अनियमित छेद या कटी किनारियाँ।",
                "स्केलेटनाइज़ेशन (नसें बचकर ऊतक खा जाना)।",
                "इल्ली, मल (frass) या जाला दिखाई देना।",
            ],
            "remedies": [
                "कम संक्रमण में दिखाई देने वाली इल्ली को हटाकर नष्ट करें।",
                "जैविक नियंत्रण (प्राकृतिक शत्रु/परजीवी) को बढ़ावा दें।",
                "अधिक संक्रमण में स्थानीय कृषि सलाह अनुसार Bt-आधारित जैव-कीटनाशी या अनुशंसित कीटनाशी का उपयोग करें।",
            ],
            "prevention": [
                "नियमित निगरानी, खासकर नई/कोमल पत्तियों पर।",
                "अधिक नाइट्रोजन से बचें (कीट आकर्षित हो सकते हैं)।",
                "खेत की सफाई रखें और वैकल्पिक पोषक पौधों को कम करें।",
            ],
            "fertilizers": [
                "Bacillus thuringiensis (Bt) स्प्रे @ 1-2 ग्राम/लीटर पानी, संक्रमण खत्म होने तक हर 7-10 दिन लगाएं।",
                "नीम तेल घोल @ 3-5 मिली/लीटर पानी कीट नियंत्रण और पत्ते स्प्रे के लिए।",
                "नाइट्रोजन खाद अस्थायी रूप से कम करें; NPK 10:10:20 का उपयोग करें।",
                "कीट नियंत्रण के बाद पोटैशियम युक्त खाद (म्यूरेट ऑफ पोटाश @ 0.5 किग्रा/पेड़) दें।",
            ],
        },
        "CCI_Leaflets": {
            "status": "प्रभावित",
            "cause": [
                "डेटासेट में यह श्रेणी अक्सर तनाव/हल्के संक्रमण/पोषक असंतुलन से जुड़ी होती है।",
                "नमी तनाव, सूक्ष्म पोषक कमी या शुरुआती संक्रमण पैटर्न का प्रभाव हो सकता है।",
            ],
            "symptoms": [
                "पत्ती के भागों में धब्बेदार रंग-परिवर्तन।",
                "हल्के धब्बे या असमान पीलापन।",
                "क्षति स्थानीय हो सकती है और पूरे पत्ते में समान नहीं फैलती।",
            ],
            "remedies": [
                "संतुलित पोषण दें; संदेह होने पर मैग्नीशियम/बोरॉन पर ध्यान दें।",
                "बहुत क्षतिग्रस्त भाग हटाएँ ताकि द्वितीयक संक्रमण कम हो।",
                "लक्षण बढ़ें तो लक्षित उपचार के लिए विशेषज्ञ से सलाह लें।",
            ],
            "prevention": [
                "सिंचाई नियमित रखें और सूखे तनाव से बचें।",
                "समय-समय पर मिट्टी/पत्ती पोषक परीक्षण करें।",
                "कृषि कार्यों के दौरान यांत्रिक चोट से बचें।",
            ],
            "fertilizers": [
                "मैग्नीशियम सल्फेट @ 200-300 ग्राम प्रति पेड़ मिट्टी में या 2% पत्ते स्प्रे।",
                "बोरेक्स @ 50-100 ग्राम प्रति पेड़ रेत के साथ मिलाकर (साल में एक बार)।",
                "जिंक सल्फेट @ 0.5% पत्ते स्प्रे (100 पेड़ों के लिए 100 लीटर पानी में 400-500 ग्राम)।",
                "संतुलित NPK 15:15:15 @ 1.5 किग्रा प्रति पेड़।",
                "नीम की खली @ 5 किग्रा प्रति पेड़ मिट्टी की सेहत सुधारने के लिए।",
            ],
        },
        "WCLWD_Yellowing": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पीलापन।",
                "पोषक असंतुलन, जड़ तनाव या रोग प्रगति से जुड़ा हो सकता है।",
            ],
            "symptoms": [
                "पत्तियों का पीला पड़ना (क्लोरोसिस), अक्सर किनारों/सिरे से।",
                "पौधे की ताकत कम और रंग फीका।",
            ],
            "remedies": [
                "सिंचाई/निकास जाँचें; जल तनाव सुधारें।",
                "अनुशंसित खाद कार्यक्रम अपनाएँ; जरूरत पर सूक्ष्म पोषक दें।",
                "यदि तेजी से बढ़े तो पुष्टि के लिए स्थानीय विशेषज्ञ से सलाह लें।",
            ],
            "prevention": [
                "संतुलित पोषण और जैविक पदार्थ बनाए रखें।",
                "लंबे समय तक जलभराव या सूखा न होने दें।",
                "बहुत प्रभावित पत्तियाँ हटाकर पौधे का तनाव कम करें।",
            ],
            "fertilizers": [
                "आयरन सल्फेट @ 50-100 ग्राम प्रति पेड़ पीलापन ठीक करने के लिए।",
                "चेलेटेड आयरन स्प्रे @ 0.5% पत्ते पर छिड़काव जल्दी हरियाली के लिए।",
                "NPK 12:12:17 @ 2 किग्रा प्रति पेड़ पोटैशियम जोर के साथ।",
                "मैग्नीशियम सल्फेट @ 250 ग्राम प्रति पेड़ यदि Mg की कमी हो।",
                "जैविक खाद @ 30-40 किग्रा प्रति पेड़।",
            ],
        },
        "WCLWD_Flaccidity": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पत्तियों का ढीलापन।",
                "जल तनाव या शारीरिक/वस्कुलर बाधा से जुड़ा हो सकता है।",
            ],
            "symptoms": [
                "पत्तियाँ ढीली/लटकती हुई दिखती हैं।",
                "turgor (कड़कपन) कम हो जाता है।",
            ],
            "remedies": [
                "पर्याप्त सिंचाई सुनिश्चित करें; जड़ क्षेत्र की समस्या सुधारें।",
                "संतुलित पोषण दें।",
                "लक्षण बने रहें तो विशेषज्ञ से पुष्टि/सलाह लें।",
            ],
            "prevention": [
                "मिट्टी की नमी स्थिर रखें; मल्चिंग करें।",
                "जड़ों को नुकसान से बचाएँ।",
                "नियमित निरीक्षण करें।",
            ],
            "fertilizers": [
                "म्यूरेट ऑफ पोटाश (MOP) @ 1-1.5 किग्रा प्रति पेड़ जल नियंत्रण के लिए।",
                "NPK 10:10:25 @ 2 किग्रा प्रति पेड़ पोटैशियम पर जोर।",
                "कैल्शियम नाइट्रेट @ 200-300 ग्राम प्रति पेड़।",
                "समुद्री शैवाल/ह्यूमिक अम्ल @ 50-100 ml प्रति पेड़ जड़ ड्रेंच।",
                "नारियल की भूसी से मल्चिंग।",
            ],
        },
        "WCLWD_DryingofLeaflets": {
            "status": "रोग प्रभावित",
            "cause": [
                "डेटासेट की WCLWD श्रेणी के अनुरूप पत्तियों का सूखना।",
                "सूखा, लवणता या रोग तनाव से बढ़ सकता है।",
            ],
            "symptoms": [
                "पत्ती के किनारे/सिरे भूरे होकर सूखना।",
                "भंगुर बनावट और धीरे-धीरे सूखना।",
            ],
            "remedies": [
                "सिंचाई सुधारें और नमी तनाव से बचें।",
                "स्थानीय सिफारिश अनुसार पोटाश युक्त खाद पर विचार करें।",
                "बहुत सूखी पत्तियाँ हटाकर सफाई रखें।",
            ],
            "prevention": [
                "मल्चिंग/जैविक पदार्थ से नमी संरक्षण।",
                "खारे पानी से बचें और अच्छी निकासी।",
                "शुरुआती लक्षणों पर जल्दी कार्रवाई करें।",
            ],
            "fertilizers": [
                "सल्फेट ऑफ पोटाश (SOP) @ 1.5-2 किग्रा प्रति पेड़ (नमकीन मिट्टी में MOP से बेहतर)।",
                "NPK 8:8:16 @ 2 किग्रा प्रति पेड़ दोगुनी पोटैशियम के साथ।",
                "जिप्सम @ 500 ग्राम प्रति पेड़ यदि नमक तनाव हो।",
                "पोटैशियम नाइट्रेट @ 1% स्प्रे (10 ग्राम/लीटर) जल्दी रिकवरी के लिए।",
                "जैविक मल्च (नारियल भूसी, पुआल) @ 50-75 किग्रा।",
            ],
        },
    },
    "ta": {
        "Healthy_Leaves": {
            "status": "ஆரோக்கியம்",
            "cause": [
                "கொடுக்கப்பட்ட படத்தில் நோய் அறிகுறிகள் தெளிவாக தெரியவில்லை.",
                "இலை வயது/ஒளி/வகை காரணமாக லேசான நிற மாற்றம் இயல்பானது.",
            ],
            "symptoms": [
                "ஒரே மாதிரியான பச்சை நிறம் மற்றும் இயல்பான இலை அமைப்பு.",
                "மஞ்சளாகுதல்/உலர்வு/தளர்வு/கீடுகள் கடித்த தடயங்கள் இல்லை.",
            ],
            "remedies": [
                "முறையான பாசனம்; நீர் தேக்கம் தவிர்க்கவும்.",
                "மண் பரிசோதனைப்படி சமநிலை உரம் (NPK + சிறு சத்துக்கள்).",
                "வாராந்திர கண்காணிப்பு தொடரவும்.",
            ],
            "prevention": [
                "பழைய/உலர்ந்த இலைகளை நீக்கவும்.",
                "சுத்தமான நாற்று மற்றும் பரிந்துரைக்கப்பட்ட இடைவெளி.",
                "கீடுகள் ஆரம்ப நிலையிலேயே கண்டறிந்து கட்டுப்படுத்தவும்.",
            ],
        },
        "Caterpillars": {
            "status": "பாதிப்பு",
            "cause": [
                "இலை திசுக்களை இலைப்புழுக்கள் (caterpillars) தின்னுதல்.",
                "வெப்பம்/ஈரப்பதம் மற்றும் அடர்ந்த இலைகள் உள்ள இடங்களில் அதிக வாய்ப்பு.",
            ],
            "symptoms": [
                "இலைகளில் ஒழுங்கற்ற துளைகள் அல்லது கடித்த விளிம்புகள்.",
                "இலை திசு கரைய, நரம்புகள் மட்டும் மிச்சமாகுதல்.",
                "இலைப்புழு/மலம்/வலைப்பின்னல் காணப்படுதல்.",
            ],
            "remedies": [
                "குறைந்த தாக்கத்தில் புழுக்களை கையால் அகற்றி அழிக்கவும்.",
                "இயற்கை எதிரிகள்/பராசிட்கள் மூலம் உயிரியல் கட்டுப்பாட்டை ஊக்குவிக்கவும்.",
                "அதிகமாக இருந்தால் உள்ளூர் வழிகாட்டுதல்படி Bt அடிப்படையிலான உயிர்க்கீடொல்லி அல்லது பரிந்துரைக்கப்பட்ட மருந்து பயன்படுத்தவும்.",
            ],
            "prevention": [
                "புதிய இலைகளில் அடிக்கடி கண்காணிப்பு.",
                "அதிக நைட்ரஜன் உரம் தவிர்க்கவும்.",
                "தோட்ட சுத்தம் மற்றும் மாற்று புரவலன் செடிகளை குறைக்கவும்.",
            ],
        },
        "CCI_Leaflets": {
            "status": "பாதிப்பு",
            "cause": [
                "இந்த வகை பெரும்பாலும் சத்து குறைவு/சூழல் அழுத்தம்/தொடக்க நிலை பாதிப்புகளுடன் தொடர்புடையதாக இருக்கும்.",
                "நீர்ப்பாசன அழுத்தம் அல்லது சிறுசத்துக் குறைவு காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகளில் தழும்பான நிறமாற்றம்.",
                "மிதமான புள்ளிகள் அல்லது ஒற்றுமையற்ற மஞ்சள்மை.",
                "உள்ளூர் சேதம், முழு இலையிலும் சமமாக இல்லாமை.",
            ],
            "remedies": [
                "சமநிலை உரமிடல்; தேவையெனில் மெக்னீசியம்/போரான் போன்ற சிறுசத்துக்கள்.",
                "கடுமையாக பாதிக்கப்பட்ட பகுதிகளை அகற்றவும்.",
                "அறிகுறிகள் அதிகரித்தால் நிபுணர் ஆலோசனை பெறவும்.",
            ],
            "prevention": [
                "ஒழுங்கான பாசனம்; வறட்சியை தவிர்க்கவும்.",
                "மண்/இலை சத்து பரிசோதனை செய்யவும்.",
                "விவசாய பணிகளில் இயந்திர சேதம் தவிர்க்கவும்.",
            ],
        },
        "WCLWD_Yellowing": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த மஞ்சள்மையைக் காட்டுகிறது.",
                "சத்து சமநிலை இல்லாமை அல்லது வேரழுத்தம் காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகள் மஞ்சளாகுதல்.",
                "செடியின் வளர்ச்சி குறைவு, வெளிர் தோற்றம்.",
            ],
            "remedies": [
                "நீர் நிலை/வடிகால் சரிபார்த்து சரி செய்யவும்.",
                "பரிந்துரைக்கப்பட்ட உர அட்டவணையை பின்பற்றவும்.",
                "தொடர்ந்தால் நிபுணர் மூலம் உறுதி செய்து நடவடிக்கை எடுக்கவும்.",
            ],
            "prevention": [
                "சமநிலை உரமிடல் மற்றும் கரிமப் பொருள்.",
                "நீர் தேக்கம்/வறட்சி தவிர்க்கவும்.",
                "கடுமையாக பாதித்த இலைகளை அகற்றி அழுத்தத்தை குறைக்கவும்.",
            ],
        },
        "WCLWD_Flaccidity": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த தளர்வுத் தன்மை.",
                "நீரழுத்தம் அல்லது உடலியல் பாதிப்பு காரணமாக இருக்கலாம்.",
            ],
            "symptoms": [
                "இலைத் துண்டுகள் தளர்ந்து தொங்குதல்.",
                "திடத்தன்மை குறைவு.",
            ],
            "remedies": [
                "பாசனம் சரி செய்யவும்; வேர்பகுதி பிரச்சினைகள் சரி செய்யவும்.",
                "சமநிலை ஊட்டச்சத்து வழங்கவும்.",
                "தொடர்ந்தால் உள்ளூர் நிபுணர் ஆலோசனை பெறவும்.",
            ],
            "prevention": [
                "முல்ச்சிங் மூலம் மண் ஈரப்பதம் நிலைநிறுத்தவும்.",
                "வேர்களுக்கு சேதம் தவிர்க்கவும்.",
                "அடிக்கடி கண்காணிப்பு.",
            ],
        },
        "WCLWD_DryingofLeaflets": {
            "status": "பாதிப்பு",
            "cause": [
                "WCLWD வகையை ஒத்த உலர்வு.",
                "வறட்சி/உப்பு அழுத்தம் அல்லது பாதிப்பு காரணமாக அதிகரிக்கலாம்.",
            ],
            "symptoms": [
                "இலை ஓரங்கள்/முனைகள் பழுப்பு நிறமாகி உலர்தல்.",
                "முறிவான அமைப்பு மற்றும் படிப்படி உலர்வு.",
            ],
            "remedies": [
                "பாசன அட்டவணையை மேம்படுத்தவும்.",
                "உள்ளூர் பரிந்துரைப்படி பொட்டாஷ் அதிகமான உரம்.",
                "கடுமையாக உலர்ந்த இலைகளை அகற்றி சுத்தம்.",
            ],
            "prevention": [
                "முல்ச்சிங்/கரிமப் பொருள் மூலம் ஈரப்பதம் பாதுகாப்பு.",
                "உப்பு நீர் தவிர்க்கவும், நல்ல வடிகால்.",
                "ஆரம்ப அறிகுறிகளிலேயே நடவடிக்கை.",
            ],
        },
    },
    "te": REPORTS_EN,
    "kn": REPORTS_EN,
    "ml": REPORTS_EN,
}


# Maps new-dataset class names → report keys (keeps backward compat)
_CLASS_ALIAS: dict[str, str] = {
    "CCI_Caterpillars": "Caterpillars",
}


def get_report(disease: str, lang: str) -> dict:
    # Resolve alias (e.g. CCI_Caterpillars → Caterpillars)
    disease = _CLASS_ALIAS.get(disease, disease)
    key = (lang or "en").strip().lower()
    templates = REPORTS_I18N.get(key) or REPORTS_I18N.get("en")
    report = templates.get(disease) if isinstance(templates, dict) else None
    if report is None:
        report = REPORTS_EN.get(disease)
    if report is None:
        return {
            "status": "Unknown",
            "cause": ["No report template available for this label."],
            "symptoms": [],
            "remedies": [],
            "prevention": [],
        }
    return report

@lru_cache(maxsize=1)
def _get_model_and_classes():
    model = models.mobilenet_v3_large(weights=None)
    model.classifier[3] = torch.nn.Linear(
        model.classifier[3].in_features,
        6,
    )

    _script_dir = os.path.dirname(os.path.abspath(__file__))
    _repo_root = os.path.abspath(os.path.join(_script_dir, "..", ".."))
    model_path = os.path.join(_repo_root, "mobilenet_best.pth")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model weights not found at: {model_path}")

    ckpt = torch.load(model_path, map_location=device)
    classes = list(class_names)
    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        model.load_state_dict(ckpt["state_dict"])
        if isinstance(ckpt.get("classes"), list) and ckpt["classes"]:
            classes = ckpt["classes"]
    else:
        model.load_state_dict(ckpt)

    model.to(device)
    model.eval()
    return model, classes

# ===== TRANSFORMS =====
tfm = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

def predict_pil_image(img: Image.Image, lang: str = "en") -> dict:
    model, classes = _get_model_and_classes()
    x = tfm(img.convert("RGB")).unsqueeze(0).to(device)

    with torch.no_grad():
        out = model(x)
        prob = torch.softmax(out, 1)
        conf, pred = torch.max(prob, 1)

    raw_disease = classes[pred.item()]
    # Normalise alias for display (CCI_Caterpillars → Caterpillars)
    display_disease = _CLASS_ALIAS.get(raw_disease, raw_disease)
    return {
        "disease": display_disease,
        "confidence": float(conf.item()),
        "report": get_report(raw_disease, lang),
        "lang": (lang or "en").strip().lower(),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "device": str(device),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...), lang: str = Form("en")):
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")
    return predict_pil_image(img, lang=lang)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python infer.py <path_to_image>")

    img_path = sys.argv[1]
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image not found: {img_path}")

    img = Image.open(img_path).convert("RGB")
    result = predict_pil_image(img)
    print("Disease:", result["disease"])
    print("Confidence:", round(result["confidence"] * 100, 2), "%")
