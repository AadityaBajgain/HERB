
export function deriveSpecialtySearch(conditions = []) {
  if (!conditions?.length) {
    return {
      keyword: "hospital",
      placeType: "hospital",
      title: "Nearby hospitals & urgent care centers",
      highlight: "General emergency and acute care",
    };
  }

  const joined = conditions.map((c) => c.name.toLowerCase()).join(" ");

  // 🦵 Musculoskeletal / Sports injuries
  if (
    joined.includes("tendonitis") ||
    joined.includes("tendinitis") ||
    joined.includes("sprain") ||
    joined.includes("strain") ||
    joined.includes("fracture") ||
    joined.includes("ligament") ||
    joined.includes("joint") ||
    joined.includes("back pain") ||
    joined.includes("muscle")
  ) {
    return {
      keyword: "orthopedic clinic physical therapy",
      placeType: "physiotherapist",
      title: "Nearby orthopedic & physiotherapy centers",
      highlight: "For injuries, joint pain, and musculoskeletal issues",
    };
  }

  // 💨 Respiratory / ENT / Cold & cough
  if (
    joined.includes("asthma") ||
    joined.includes("bronchitis") ||
    joined.includes("cough") ||
    joined.includes("sore throat") ||
    joined.includes("sinus") ||
    joined.includes("cold") ||
    joined.includes("flu")
  ) {
    return {
      keyword: "pulmonologist ENT clinic",
      placeType: "doctor",
      title: "Nearby ENT & respiratory specialists",
      highlight: "Ear, nose, throat, and breathing problems",
    };
  }

  // 💓 Cardiac issues
  if (
    joined.includes("chest pain") ||
    joined.includes("heart") ||
    joined.includes("hypertension") ||
    joined.includes("blood pressure")
  ) {
    return {
      keyword: "cardiologist",
      placeType: "doctor",
      title: "Nearby cardiology clinics",
      highlight: "Heart and blood pressure specialists",
    };
  }

  // 💧 Kidney & urinary
  if (
    joined.includes("urinary") ||
    joined.includes("kidney") ||
    joined.includes("bladder") ||
    joined.includes("uti")
  ) {
    return {
      keyword: "urologist nephrologist",
      placeType: "doctor",
      title: "Nearby urology & kidney specialists",
      highlight: "For urinary or kidney-related conditions",
    };
  }

  // 🍽️ Digestive & abdominal
  if (
    joined.includes("stomach") ||
    joined.includes("digestive") ||
    joined.includes("diarrhea") ||
    joined.includes("vomit") ||
    joined.includes("constipation") ||
    joined.includes("acid") ||
    joined.includes("ulcer") ||
    joined.includes("liver")
  ) {
    return {
      keyword: "gastroenterologist",
      placeType: "doctor",
      title: "Nearby gastroenterology clinics",
      highlight: "For stomach, digestion, or liver problems",
    };
  }

  // 🧠 Neurological
  if (
    joined.includes("migraine") ||
    joined.includes("headache") ||
    joined.includes("neuropathy") ||
    joined.includes("seizure") ||
    joined.includes("numbness") ||
    joined.includes("paralysis") ||
    joined.includes("tremor")
  ) {
    return {
      keyword: "neurologist",
      placeType: "doctor",
      title: "Nearby neurology centers",
      highlight: "For migraines, nerve, or brain-related conditions",
    };
  }

  // 🩸 Diabetes / endocrine
  if (
    joined.includes("diabetes") ||
    joined.includes("thyroid") ||
    joined.includes("hormone") ||
    joined.includes("endocrine")
  ) {
    return {
      keyword: "endocrinologist diabetes clinic",
      placeType: "doctor",
      title: "Nearby endocrinology & diabetes clinics",
      highlight: "For thyroid and metabolic health",
    };
  }

  // 🦷 Dental
  if (joined.includes("tooth") || joined.includes("gum") || joined.includes("dental")) {
    return {
      keyword: "dentist dental clinic",
      placeType: "dentist",
      title: "Nearby dental clinics",
      highlight: "Oral and dental care",
    };
  }

  // 👁️ Eye / vision
  if (
    joined.includes("eye") ||
    joined.includes("vision") ||
    joined.includes("cataract") ||
    joined.includes("red eye")
  ) {
    return {
      keyword: "ophthalmologist optometrist eye clinic",
      placeType: "doctor",
      title: "Nearby eye care centers",
      highlight: "Eye specialists and vision clinics",
    };
  }

  // 🧴 Skin / dermatology
  if (
    joined.includes("rash") ||
    joined.includes("acne") ||
    joined.includes("eczema") ||
    joined.includes("psoriasis") ||
    joined.includes("itch") ||
    joined.includes("dermatitis") ||
    joined.includes("skin")
  ) {
    return {
      keyword: "dermatologist skin clinic",
      placeType: "doctor",
      title: "Nearby dermatology clinics",
      highlight: "Skin, hair, and allergy specialists",
    };
  }

  // 🦵 Arthritis / gout / chronic joint pain
  if (joined.includes("arthritis") || joined.includes("gout") || joined.includes("osteoarthritis")) {
    return {
      keyword: "rheumatologist",
      placeType: "doctor",
      title: "Nearby arthritis & rheumatology clinics",
      highlight: "For gout and chronic joint pain",
    };
  }

  // 🤒 Infection / fever
  if (joined.includes("infection") || joined.includes("fever")) {
    return {
      keyword: "urgent care clinic",
      placeType: "hospital",
      title: "Nearby urgent care centers",
      highlight: "For general infections and fevers",
    };
  }

  // 🧠 Mental health
  if (
    joined.includes("anxiety") ||
    joined.includes("depression") ||
    joined.includes("stress") ||
    joined.includes("panic") ||
    joined.includes("mental")
  ) {
    return {
      keyword: "psychologist psychiatrist mental health clinic",
      placeType: "doctor",
      title: "Nearby mental health support centers",
      highlight: "Counseling, therapy, and psychiatry",
    };
  }

  // 🩹 Wound care / trauma
  if (joined.includes("wound") || joined.includes("cut") || joined.includes("burn")) {
    return {
      keyword: "urgent care wound clinic",
      placeType: "hospital",
      title: "Nearby urgent care or wound treatment centers",
      highlight: "Immediate treatment for minor injuries",
    };
  }

  // 🧍 Reproductive / gynecology
  if (
    joined.includes("pregnancy") ||
    joined.includes("menstrual") ||
    joined.includes("fertility") ||
    joined.includes("period") ||
    joined.includes("gynecology")
  ) {
    return {
      keyword: "gynecologist obstetrician women health clinic",
      placeType: "doctor",
      title: "Nearby women’s health & OB-GYN clinics",
      highlight: "Reproductive and maternal care",
    };
  }

  // 🧒 Pediatrics / child
  if (joined.includes("child") || joined.includes("pediatric") || joined.includes("infant")) {
    return {
      keyword: "pediatric clinic",
      placeType: "doctor",
      title: "Nearby pediatric care centers",
      highlight: "For child and infant healthcare",
    };
  }

  // 👂 Ear / hearing
  if (joined.includes("ear") || joined.includes("hearing") || joined.includes("tinnitus")) {
    return {
      keyword: "ENT clinic audiologist",
      placeType: "doctor",
      title: "Nearby ENT & audiology centers",
      highlight: "Ear, hearing, and sinus specialists",
    };
  }

  // 🧍‍♂️ Male health / prostate
  if (joined.includes("prostate") || joined.includes("erectile") || joined.includes("male")) {
    return {
      keyword: "urologist men health clinic",
      placeType: "doctor",
      title: "Nearby urology & men's health clinics",
      highlight: "Prostate and men's health specialists",
    };
  }

  // 👶 Pregnancy care
  if (joined.includes("prenatal") || joined.includes("obstetric")) {
    return {
      keyword: "obstetrician gynecologist",
      placeType: "doctor",
      title: "Nearby prenatal & obstetrics clinics",
      highlight: "Pregnancy and maternal care",
    };
  }

  // 🦠 Immunology / allergies
  if (joined.includes("allergy") || joined.includes("asthma") || joined.includes("immune")) {
    return {
      keyword: "allergy specialist immunologist",
      placeType: "doctor",
      title: "Nearby allergy & immunology clinics",
      highlight: "Allergy and immune system treatment",
    };
  }

  // 💉 Infection or unknown condition fallback
  return {
    keyword: "hospital clinic",
    placeType: "hospital",
    title: "Nearby hospitals & medical clinics",
    highlight: "General and specialized healthcare",
  };
}
