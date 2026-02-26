// Map category names to MaterialIcons icon names
export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    // Dentistry
    'dentist': 'healing',
    'dental': 'healing',
    'dentistry': 'healing',
    
    // Cardiology
    'cardiology': 'favorite',
    'cardiologist': 'favorite',
    'heart': 'favorite',
    
    // Orthopedics
    'orthopedic': 'accessibility',
    'orthopedics': 'accessibility',
    'bones': 'accessibility',
    
    // Dermatology
    'dermatology': 'spa',
    'dermatologist': 'spa',
    'skin': 'spa',
    
    // Neurology
    'neurology': 'psychology',
    'neurologist': 'psychology',
    'brain': 'psychology',
    
    // Ophthalmology
    'ophthalmology': 'visibility',
    'ophthalmologist': 'visibility',
    'eye': 'visibility',
    'eyes': 'visibility',
    
    // ENT
    'ent': 'hearing',
    'ear': 'hearing',
    'nose': 'hearing',
    'throat': 'hearing',
    
    // General Practice
    'general': 'local-hospital',
    'gp': 'local-hospital',
    'medicine': 'local-hospital',
    
    // Pediatrics
    'pediatrics': 'child-care',
    'pediatrician': 'child-care',
    'children': 'child-care',
    
    // Gynecology
    'gynecology': 'wc',
    'gynecologist': 'wc',
    'obstetrics': 'wc',
    
    // Psychiatry
    'psychiatry': 'psychology',
    'psychiatrist': 'psychology',
    'mental': 'psychology',
    
    // Surgery
    'surgery': 'medical-services',
    'surgeon': 'medical-services',
    'surgical': 'medical-services',
    
    // Physical Therapy
    'physical-therapy': 'accessibility',
    'physiotherapy': 'accessibility',
    'therapy': 'accessibility',
    
    // Oncology
    'oncology': 'science',
    'oncologist': 'science',
    'cancer': 'science',
    
    // Urology
    'urology': 'water',
    'urologist': 'water',
  };

  const lowerCategoryName = categoryName.toLowerCase().trim();
  
  // Check for exact match
  if (iconMap[lowerCategoryName]) {
    return iconMap[lowerCategoryName];
  }
  
  // Check for partial matches
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerCategoryName.includes(key) || key.includes(lowerCategoryName)) {
      return icon;
    }
  }
  
  // Default icon
  return 'local-hospital';
};
