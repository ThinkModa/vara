import type { RoadmapPhase } from '../../types/roadmap';

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    number: 1,
    title: 'Foundations',
    description: 'The basics worth confirming before deeper testing.',
    steps: [
      {
        id: 'trying-duration',
        phase: 1,
        title: 'Have you been trying for 12 months (or 6 months if 35+)?',
        status: 'not_started',
        helpText:
          'This is the standard threshold doctors use to define infertility and recommend evaluation.',
        ageFlag: {
          minAge: 35,
          message: 'At 35+, most doctors recommend seeing a specialist after 6 months, not 12.',
        },
      },
      {
        id: 'fertile-window',
        phase: 1,
        title: 'Are you having intercourse during your fertile window?',
        status: 'not_started',
        dontKnowAction: {
          label: 'Tools to find your fertile window',
          deepLink: '/tools/fertile-window',
        },
      },
      {
        id: 'ovulating',
        phase: 1,
        title: 'Are you ovulating every month?',
        status: 'not_started',
        dontKnowAction: {
          label: 'Try OPKs, BBT charting, or a progesterone test',
          deepLink: '/tools/ovulation-tracking',
        },
      },
      {
        id: 'prenatal-vitamin',
        phase: 1,
        title: 'Are you taking a prenatal vitamin with folic acid?',
        status: 'not_started',
      },
      {
        id: 'healthy-weight',
        phase: 1,
        title: 'Is your weight/BMI in a range that supports fertility?',
        status: 'not_started',
        dontKnowAction: {
          label: 'Learn more',
          deepLink: '/learn/weight-and-fertility',
        },
      },
      {
        id: 'lifestyle-factors',
        phase: 1,
        title: 'Have you addressed smoking, vaping, or heavy drinking?',
        status: 'not_started',
        dontKnowAction: {
          label: 'Resources to cut back',
          deepLink: '/learn/lifestyle-factors',
        },
      },
    ],
  },
  {
    number: 2,
    title: 'Diagnostic workup',
    description: 'Tests that identify what, if anything, is making conception harder.',
    steps: [
      {
        id: 'semen-analysis',
        phase: 2,
        title: "Is your partner's sperm healthy?",
        status: 'not_started',
        dontKnowAction: {
          label: 'Start here — semen analysis basics',
          deepLink: '/learn/semen-analysis',
        },
      },
      {
        id: 'hormone-panel',
        phase: 2,
        title: 'Have you had a hormone panel? (AMH, FSH, TSH, prolactin)',
        status: 'not_started',
        dontKnowAction: {
          label: 'What these tests mean',
          deepLink: '/learn/hormone-panel',
        },
      },
      {
        id: 'tubal-check',
        phase: 2,
        title: 'Are your fallopian tubes open?',
        status: 'not_started',
        helpText: 'An HSG (hysterosalpingogram) is the standard test to check tubal patency.',
        dontKnowAction: {
          label: 'About the HSG test',
          deepLink: '/learn/hsg',
        },
        dependsOn: ['trying-duration'],
      },
      {
        id: 'uterine-check',
        phase: 2,
        title: 'Has your uterus been checked for fibroids or polyps?',
        status: 'not_started',
        dontKnowAction: {
          label: 'About ultrasound & sonohysterogram',
          deepLink: '/learn/uterine-evaluation',
        },
      },
      {
        id: 'underlying-conditions',
        phase: 2,
        title: 'Have PCOS or endometriosis been ruled in or out?',
        status: 'not_started',
        dontKnowAction: {
          label: 'Signs to discuss with your doctor',
          deepLink: '/learn/pcos-endo',
        },
      },
    ],
  },
  {
    number: 3,
    title: 'First-line treatment',
    description: 'Lower-intervention options usually tried first.',
    steps: [
      {
        id: 'timed-intercourse',
        phase: 3,
        title: 'Have you tried timed intercourse with ovulation tracking?',
        status: 'not_started',
        dependsOn: ['ovulating'],
      },
      {
        id: 'ovulation-induction',
        phase: 3,
        title: 'Have you tried ovulation-inducing medication (Clomid/Letrozole)?',
        status: 'not_started',
        dontKnowAction: {
          label: 'How these medications work',
          deepLink: '/learn/ovulation-induction',
        },
      },
      {
        id: 'male-factor-treatment',
        phase: 3,
        title: 'Has a male-factor issue been addressed, if one was found?',
        status: 'not_started',
        skipIf: [{ stepId: 'semen-analysis', status: 'not_applicable' }],
      },
    ],
  },
  {
    number: 4,
    title: 'Escalation',
    description: "Next steps if first-line treatment hasn't worked.",
    steps: [
      {
        id: 'iui',
        phase: 4,
        title: 'Have you tried IUI (intrauterine insemination)?',
        status: 'not_started',
        dontKnowAction: {
          label: 'What IUI involves',
          deepLink: '/learn/iui',
        },
      },
      {
        id: 'iui-plus-meds',
        phase: 4,
        title: 'Have you tried IUI combined with ovulation induction?',
        status: 'not_started',
        dependsOn: ['iui'],
      },
      {
        id: 'surgical-correction',
        phase: 4,
        title: 'Has any anatomical issue been surgically corrected?',
        status: 'not_started',
        skipIf: [{ stepId: 'uterine-check', status: 'not_applicable' }],
      },
    ],
  },
  {
    number: 5,
    title: 'Advanced treatment',
    description: 'Higher-intervention options.',
    steps: [
      {
        id: 'ivf',
        phase: 5,
        title: 'IVF',
        status: 'not_started',
        dontKnowAction: {
          label: 'What to expect from IVF',
          deepLink: '/learn/ivf',
        },
      },
      {
        id: 'icsi',
        phase: 5,
        title: 'ICSI (for severe male factor)',
        status: 'not_started',
        skipIf: [{ stepId: 'semen-analysis', status: 'not_applicable' }],
      },
      {
        id: 'donor-surrogacy',
        phase: 5,
        title: 'Donor eggs/sperm or surrogacy',
        status: 'not_started',
        dontKnowAction: {
          label: 'Learn about your options',
          deepLink: '/learn/donor-surrogacy',
        },
      },
    ],
  },
];

export const DEEP_LINK_CONTENT: Record<string, { title: string; body: string }> = {
  '/tools/fertile-window': {
    title: 'Finding Your Fertile Window',
    body:
      'Track cervical mucus changes, use ovulation predictor kits (OPKs), or try a fertility app that combines cycle length with LH surge data. Intercourse every 1–2 days during the fertile window maximizes chances.',
  },
  '/tools/ovulation-tracking': {
    title: 'Ovulation Tracking Tools',
    body:
      'OPKs detect your LH surge 24–36 hours before ovulation. BBT charting confirms ovulation after the fact via a sustained temperature rise. A mid-luteal progesterone test (day 21 of a 28-day cycle) is the most reliable clinical confirmation.',
  },
  '/learn/weight-and-fertility': {
    title: 'Weight & Fertility',
    body:
      'Both underweight and overweight BMI can affect ovulation and hormone balance. Even a 5–10% weight change can restore regular cycles in some cases. Your doctor can help set a realistic, fertility-supportive target.',
  },
  '/learn/lifestyle-factors': {
    title: 'Lifestyle & Fertility',
    body:
      'Smoking accelerates egg loss and lowers IVF success rates. Heavy alcohol use affects both egg and sperm quality. Cutting back or quitting — even before conception — can improve outcomes within months.',
  },
  '/learn/semen-analysis': {
    title: 'Semen Analysis Basics',
    body:
      'A semen analysis evaluates count, motility, and morphology. It\'s one of the first tests recommended because male-factor issues account for roughly 40% of infertility cases. Results typically return within a week.',
  },
  '/learn/hormone-panel': {
    title: 'Hormone Panel Explained',
    body:
      'AMH reflects ovarian reserve. FSH (day 2–3) indicates how hard your ovaries are working. TSH screens thyroid function — even mild hypothyroidism can affect ovulation. Prolactin, if elevated, can suppress ovulation entirely.',
  },
  '/learn/hsg': {
    title: 'About the HSG Test',
    body:
      'A hysterosalpingogram uses dye and X-ray to check whether your fallopian tubes are open. It\'s usually done between days 5–12 of your cycle. Some women feel mild cramping; taking ibuprofen beforehand helps.',
  },
  '/learn/uterine-evaluation': {
    title: 'Uterine Evaluation',
    body:
      'A transvaginal ultrasound can detect fibroids, polyps, or structural issues. A sonohysterogram (saline infusion) gives a clearer view of the uterine cavity and is often recommended before IUI or IVF.',
  },
  '/learn/pcos-endo': {
    title: 'PCOS & Endometriosis',
    body:
      'PCOS often presents with irregular cycles, elevated androgens, or polycystic ovaries on ultrasound. Endometriosis may cause painful periods, pain with intercourse, or no obvious symptoms. Both are treatable — early diagnosis helps.',
  },
  '/learn/ovulation-induction': {
    title: 'Ovulation Induction',
    body:
      'Clomid and Letrozole are oral medications that stimulate follicle development. They\'re typically tried for 3–6 cycles before escalating. Monitoring ultrasounds and hormone checks help your doctor adjust dosing.',
  },
  '/learn/iui': {
    title: 'What IUI Involves',
    body:
      'Intrauterine insemination places washed, concentrated sperm directly into the uterus around ovulation. It\'s less invasive and costly than IVF. Success rates vary by age and diagnosis — typically 10–20% per cycle.',
  },
  '/learn/ivf': {
    title: 'What to Expect from IVF',
    body:
      'IVF involves ovarian stimulation, egg retrieval, fertilization in the lab, and embryo transfer. A typical cycle takes 4–6 weeks. Your clinic will create a protocol based on your age, AMH, and prior response.',
  },
  '/learn/donor-surrogacy': {
    title: 'Donor & Surrogacy Options',
    body:
      'Donor eggs, donor sperm, or gestational surrogacy may be recommended based on diagnosis, age, or prior failed cycles. Each path has legal, emotional, and financial considerations your clinic can walk you through.',
  },
};

export const ROADMAP_DISCLAIMER =
  'This roadmap is general guidance — work with your doctor to personalize your path.';

export function createInitialPhases(): RoadmapPhase[] {
  return ROADMAP_PHASES.map((phase) => ({
    ...phase,
    steps: phase.steps.map((step) => ({ ...step, status: 'not_started' as const })),
  }));
}
