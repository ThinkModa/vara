export const currentUser = {
  name: 'Hannah',
  age: 30,
  email: 'sarah@example.com',
  timeTrying: '24 months',
  diagnosis: 'Unexplained Infertility',
  treatmentStage: 'IVF – Cycle 1',
  partner: 'Maximilian',
  clinic: 'Ohio Reproductive Medicine',
  doctor: 'Dr. Rossi',
};

export const cycleData = {
  currentDay: 8,
  totalDays: 28,
  phase: 'Follicular',
  nextAppointment: 'April 15, 2026',
  medications: [
    { name: 'Letrozole 5mg', time: '8:00 PM', taken: true },
    { name: 'Follistim 150 IU', time: '9:00 PM', taken: false },
    { name: 'Prenatal Vitamin', time: '8:00 AM', taken: true },
  ],
  follicles: {
    left: [12, 14, 10],
    right: [16, 13, 11, 9],
    leadFollicle: 16,
  },
  hormones: {
    estradiol: { value: 285, unit: 'pg/mL', status: 'normal' as 'normal' | 'high' | 'low' },
    lh: { value: 8.2, unit: 'mIU/mL', status: 'normal' as 'normal' | 'high' | 'low' },
    fsh: { value: 7.1, unit: 'mIU/mL', status: 'normal' as 'normal' | 'high' | 'low' },
    progesterone: { value: 0.8, unit: 'ng/mL', status: 'normal' as 'normal' | 'high' | 'low' },
  },
  symptoms: ['Mild bloating', 'Light cramping', 'Fatigue'],
};

export const dashboardInsights = [
  {
    id: '1',
    icon: 'sparkles',
    title: 'Looking Good So Far',
    body: 'Your follicles are responding well to stimulation. Your lead follicle is 16mm — typically, doctors look for 18-20mm before trigger.',
    color: 'purple' as const,
  },
  {
    id: '2',
    icon: 'heart',
    title: 'Self-Care',
    body: 'Stimulation can cause bloating and fatigue. Stay hydrated, prioritize balanced meals with lean protein, veggies, and healthy fats, and consider gentle movement. You\'re doing amazing.',
    color: 'pink' as const,
  },
  {
    id: '3',
    icon: 'clipboard',
    title: 'Before Your Next Visit',
    body: 'Ask about your lining thickness and whether dosage adjustments are needed based on today\'s follicle growth.',
    color: 'blue' as const,
  },
  {
    id: '4',
    icon: 'flask',
    title: 'Nutrition Insight',
    body: 'Aim for 3–4 colorful meals daily. Include Omega-3 foods, folate-rich greens, and fermented probiotics for gut support during treatment.',
    color: 'green' as const,
  },
];

export const labResults = [
  {
    id: '1',
    name: 'AMH (Anti-Müllerian Hormone)',
    value: 2.4,
    unit: 'ng/mL',
    normalRange: '1.0 – 3.5',
    status: 'normal' as const,
    date: 'March 10, 2026',
    explanation: 'Your AMH level suggests a good ovarian reserve for your age. This is a positive indicator for IVF response.',
  },
  {
    id: '2',
    name: 'TSH (Thyroid Stimulating Hormone)',
    value: 2.8,
    unit: 'mIU/L',
    normalRange: '0.5 – 4.5',
    status: 'normal' as const,
    date: 'March 10, 2026',
    explanation: 'Your thyroid function is within normal range. Some reproductive endocrinologists prefer TSH under 2.5 — worth discussing with your doctor.',
  },
  {
    id: '3',
    name: 'Estradiol (E2)',
    value: 285,
    unit: 'pg/mL',
    normalRange: '200 – 400 (stimulation)',
    status: 'normal' as const,
    date: 'March 22, 2026',
    explanation: 'Your estradiol is rising appropriately during stimulation, indicating your follicles are producing estrogen as expected.',
  },
  {
    id: '4',
    name: 'Prolactin',
    value: 28.5,
    unit: 'ng/mL',
    normalRange: '2.0 – 25.0',
    status: 'high' as const,
    date: 'March 10, 2026',
    explanation: 'Your prolactin is slightly elevated. High prolactin can interfere with ovulation. Your doctor may recommend retesting or medication.',
  },
  {
    id: '5',
    name: 'Vitamin D',
    value: 22,
    unit: 'ng/mL',
    normalRange: '30 – 100',
    status: 'low' as const,
    date: 'March 10, 2026',
    explanation: 'Your Vitamin D is below optimal. Studies suggest adequate Vitamin D may improve fertility outcomes. Consider supplementation.',
  },
];

export const doctorQuestions = [
  'Based on my follicle sizes today, when do you expect to trigger?',
  'Should we adjust my Follistim dose given my estradiol levels?',
  'What does my lining thickness look like for transfer?',
  'Are there any lifestyle changes I should make during stimulation?',
  'What are the next steps if this cycle doesn\'t result in enough mature follicles?',
];

export const educationTopics = [
  {
    id: '1',
    title: 'Understanding Your IVF Timeline',
    category: 'IVF Basics',
    readTime: '5 min',
    icon: 'calendar',
  },
  {
    id: '2',
    title: 'What Your Hormone Levels Mean',
    category: 'Lab Results',
    readTime: '4 min',
    icon: 'flask',
  },
  {
    id: '3',
    title: 'Follicle Growth: What to Expect',
    category: 'Cycle Tracking',
    readTime: '3 min',
    icon: 'trending-up',
  },
  {
    id: '4',
    title: 'Managing the Emotional Side',
    category: 'Wellness',
    readTime: '6 min',
    icon: 'heart',
  },
];
