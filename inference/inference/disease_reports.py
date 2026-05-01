"""
Structured disease report data for all 11 coconut disease classes.
Multilingual: en, hi, mr, ta, te, kn, ml, bn, gu, pa, ur
"""

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
    # ─── NEW DISEASE CLASSES (5) ──────────────────────────────────────────────
    "Bud Root Dropping": {
        "status": "Diseased",
        "cause": [
            "Caused by the fungus Phytophthora palmivora or similar soil-borne pathogens.",
            "Excess moisture, poor drainage, and warm conditions favor pathogen spread.",
        ],
        "symptoms": [
            "Premature dropping of immature nuts.",
            "Darkening and rotting of the root system near the bud region.",
            "Yellowing of lower fronds progressing upward.",
            "Foul smell from the affected base region.",
        ],
        "remedies": [
            "Remove and destroy severely affected palms to prevent spread.",
            "Apply Metalaxyl or Fosetyl-Al based fungicide as soil drench around the base.",
            "Improve drainage around affected palms immediately.",
            "Apply Trichoderma viride as bio-control agent @ 50 g/palm in the soil.",
        ],
        "prevention": [
            "Ensure proper drainage in the plantation.",
            "Avoid injuries to roots during cultivation.",
            "Apply prophylactic Bordeaux mixture (1%) to the base during monsoon.",
            "Use disease-free planting material from certified nurseries.",
        ],
        "fertilizers": [
            "Apply NPK 12:12:17 @ 2 kg per palm with emphasis on potassium for disease resistance.",
            "Neem cake @ 5 kg per palm to suppress soil-borne pathogens.",
            "Trichoderma-enriched compost @ 10-15 kg per palm as soil amendment.",
            "Calcium ammonium nitrate @ 200 g per palm to improve root health.",
            "Organic mulch around the basin to maintain stable soil moisture.",
        ],
    },
    "Bud Rot": {
        "status": "Diseased",
        "cause": [
            "Primarily caused by Phytophthora palmivora fungus attacking the growing point (bud).",
            "Spread during heavy rainfall and high humidity conditions.",
        ],
        "symptoms": [
            "Yellowing and wilting of the spindle (youngest unopened) leaf.",
            "Spindle leaf turns brown and can be easily pulled out.",
            "Rotting with foul smell in the crown/bud region.",
            "Complete death of the palm if untreated.",
        ],
        "remedies": [
            "Remove all rotten tissue from the crown and clean thoroughly.",
            "Apply Bordeaux paste (10%) on the cleaned wound surface.",
            "Pour Metalaxyl-Mancozeb solution (0.1%) into the crown after cleaning.",
            "Protect the cleaned bud from rain by placing a polythene cover.",
        ],
        "prevention": [
            "Ensure good air circulation by maintaining proper spacing.",
            "Regular inspection of crown during rainy season.",
            "Prophylactic application of Bordeaux mixture (1%) before monsoon.",
            "Avoid crown injuries during harvesting.",
        ],
        "fertilizers": [
            "Potassium-rich fertilizer (MOP) @ 1.5 kg per palm to boost plant immunity.",
            "NPK 14:14:14 @ 2 kg per palm for balanced nutrition during recovery.",
            "Copper-based foliar spray (Bordeaux mixture 1%) every 45 days during monsoon.",
            "Neem cake @ 5 kg per palm as soil amendment to improve disease resistance.",
            "Organic compost @ 25-30 kg per palm to enhance soil microbial activity.",
        ],
    },
    "Gray Leaf Spot": {
        "status": "Diseased",
        "cause": [
            "Caused by the fungus Pestalotiopsis palmarum (Pestalotia).",
            "Favorable conditions include high humidity, overcrowding, and poor nutrition.",
        ],
        "symptoms": [
            "Small, gray to brown oval or irregular spots on leaflets.",
            "Spots may have a darker border with gray center.",
            "Severe cases lead to premature leaf drying and defoliation.",
            "Usually starts on older lower leaves.",
        ],
        "remedies": [
            "Remove and burn severely infected leaves.",
            "Spray Mancozeb (0.25%) or Carbendazim (0.1%) at 15-day intervals.",
            "Improve air circulation by pruning overcrowded fronds.",
            "Apply copper oxychloride (0.3%) as foliar spray during humid months.",
        ],
        "prevention": [
            "Maintain adequate spacing between palms.",
            "Avoid overhead irrigation that keeps foliage wet.",
            "Provide balanced nutrition to reduce susceptibility.",
            "Regular removal of old/dead fronds to reduce inoculum.",
        ],
        "fertilizers": [
            "Apply balanced NPK 15:15:15 @ 2 kg per palm to strengthen leaf health.",
            "Potassium sulfate @ 500 g per palm to improve leaf resistance.",
            "Zinc sulfate @ 0.5% foliar spray to correct micronutrient deficiency.",
            "Neem oil spray @ 3 ml/liter as both fungicide and nutrient supplement.",
            "Organic compost @ 25-30 kg per palm to improve overall vigor.",
        ],
    },
    "Leaf Rot": {
        "status": "Diseased",
        "cause": [
            "Caused by a complex of fungi including Colletotrichum gloeosporioides and Exserohilum rostratum.",
            "Often associated with mite damage that provides entry points for fungal infection.",
        ],
        "symptoms": [
            "Brown to dark brown lesions on leaflets, often starting from tips.",
            "Rotting and disintegration of affected leaf tissue.",
            "Affected leaflets may curl, dry, and break off.",
            "In severe cases, entire fronds become brown and hang down.",
        ],
        "remedies": [
            "Remove and destroy severely affected fronds.",
            "Spray Hexaconazole (0.05%) or Mancozeb (0.25%) on affected leaves.",
            "Control mite population first if mite damage is present (Dicofol 0.05% or wettable sulfur).",
            "Apply Pseudomonas fluorescens spray @ 20 g/liter as bio-control measure.",
        ],
        "prevention": [
            "Control eriophyid mites promptly (primary predisposing factor).",
            "Maintain good field sanitation by removing fallen debris.",
            "Ensure balanced nutrition to enhance natural resistance.",
            "Avoid water stress which weakens the palm.",
        ],
        "fertilizers": [
            "Apply NPK 12:12:17 @ 2 kg per palm with potassium emphasis for recovery.",
            "Magnesium sulfate @ 300 g per palm to improve leaf health.",
            "Borax @ 100 g per palm for better tissue integrity.",
            "Neem cake @ 5 kg per palm to suppress secondary infections.",
            "Foliar spray of micronutrients (Zn + B + Mg) mix every 3 months.",
        ],
    },
    "Stem Bleeding": {
        "status": "Diseased",
        "cause": [
            "Caused by the fungus Thielaviopsis paradoxa (Ceratocystis paradoxa).",
            "Entry through wounds on the stem from mechanical damage or insect boring.",
        ],
        "symptoms": [
            "Dark brown to black exudation (bleeding) on the stem surface.",
            "Longitudinal cracks on the trunk from which reddish-brown fluid oozes.",
            "Drying and decay of tissues beneath the bleeding patches.",
            "Reduced yield and gradual decline of the palm.",
        ],
        "remedies": [
            "Chisel out the affected tissue on the stem until healthy (white) tissue is exposed.",
            "Apply warm coal tar or Bordeaux paste (10%) on the chiseled wound.",
            "Apply Tridemorph (Calixin 0.1%) or Hexaconazole (0.05%) by swabbing on affected areas.",
            "Root feed with Tridemorph (5 ml in 100 ml water) during early stages.",
        ],
        "prevention": [
            "Avoid mechanical injuries to the stem during harvesting and climbing.",
            "Apply Bordeaux paste on any accidental wounds immediately.",
            "Maintain good drainage around the palm base.",
            "Use climbing aids that minimize stem damage.",
        ],
        "fertilizers": [
            "NPK 14:14:14 @ 2 kg per palm to maintain overall health.",
            "Potassium-rich fertilizer (MOP) @ 1.5 kg per palm for stress tolerance.",
            "Neem cake @ 5 kg per palm as soil amendment.",
            "Organic compost @ 30-40 kg per palm to improve soil microbial health.",
            "Copper sulfate @ 50 g per palm in soil to inhibit fungal pathogens.",
        ],
    },
}
