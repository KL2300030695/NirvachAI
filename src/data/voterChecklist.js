export const voterChecklist = [
  {
    id: 'eligibility',
    title: 'Check Eligibility',
    icon: '✅',
    description: 'Verify you meet the basic requirements to vote',
    items: [
      { id: 'age', text: 'I am 18 years of age or above (as on January 1 of the current year)', required: true },
      { id: 'citizen', text: 'I am a citizen of India', required: true },
      { id: 'resident', text: 'I am a resident of the constituency where I wish to vote', required: true },
      { id: 'not-disqualified', text: 'I am not disqualified under any law (e.g., unsound mind, corrupt practices)', required: true },
    ],
  },
  {
    id: 'registration',
    title: 'Register as a Voter',
    icon: '📝',
    description: 'Get your name on the electoral roll',
    items: [
      { id: 'check-roll', text: 'Check if my name is already on the electoral roll at voters.eci.gov.in', required: true },
      { id: 'form6', text: 'Fill Form 6 online or at the local ERO office for new registration', required: true },
      { id: 'photo', text: 'Upload/submit a recent passport-size photograph', required: true },
      { id: 'age-proof', text: 'Submit age proof (birth certificate, school certificate, etc.)', required: true },
      { id: 'address-proof', text: 'Submit address proof (Aadhaar, utility bill, passport, etc.)', required: true },
      { id: 'track', text: 'Track application status using the reference number', required: false },
    ],
  },
  {
    id: 'voter-id',
    title: 'Get Voter ID (EPIC)',
    icon: '🪪',
    description: 'Obtain your Electors Photo Identity Card',
    items: [
      { id: 'receive-epic', text: 'Receive EPIC card after registration is approved', required: true },
      { id: 'download-epic', text: 'Download e-EPIC from voters.eci.gov.in (digital version)', required: false },
      { id: 'verify-details', text: 'Verify all details on the EPIC are correct', required: true },
      { id: 'correction', text: 'Apply for corrections using Form 8 if any details are wrong', required: false },
    ],
  },
  {
    id: 'polling-prep',
    title: 'Prepare for Polling Day',
    icon: '🗓️',
    description: 'Get ready before you head to the polling booth',
    items: [
      { id: 'know-date', text: 'Know the polling date for my constituency', required: true },
      { id: 'find-booth', text: 'Find my polling booth location (use Voter Helpline App or voters.eci.gov.in)', required: true },
      { id: 'carry-id', text: 'Keep Voter ID or any of the 12 approved photo IDs ready', required: true },
      { id: 'research', text: 'Research candidates and their backgrounds (ECI Candidate Affidavits)', required: false },
      { id: 'helpline', text: 'Save ECI helpline number: 1950', required: false },
    ],
  },
  {
    id: 'voting-day',
    title: 'On Voting Day',
    icon: '🗳️',
    description: 'Steps to follow when you go to vote',
    items: [
      { id: 'reach-booth', text: 'Reach the polling booth during voting hours (typically 7 AM - 6 PM)', required: true },
      { id: 'queue', text: 'Stand in queue and wait for your turn', required: true },
      { id: 'show-id', text: 'Show your voter ID to the polling officer', required: true },
      { id: 'ink', text: 'Get indelible ink applied on your left index finger', required: true },
      { id: 'cast-vote', text: 'Press the button on the EVM next to your chosen candidate', required: true },
      { id: 'verify-vvpat', text: 'Verify your vote on the VVPAT slip (visible for 7 seconds)', required: true },
      { id: 'exit', text: 'Exit the polling booth after casting your vote', required: true },
    ],
  },
];

export const importantLinks = [
  { title: 'ECI Official Website', url: 'https://eci.gov.in', description: 'Election Commission of India' },
  { title: 'Voter Registration', url: 'https://voters.eci.gov.in', description: 'Register, check status, download e-EPIC' },
  { title: 'SVEEP Portal', url: 'https://ecisveep.nic.in', description: 'Voter education and awareness' },
  { title: 'Voter Helpline App', url: 'https://play.google.com/store/apps/details?id=com.eci.citizen', description: 'Official ECI mobile app' },
  { title: 'Know Your Candidate', url: 'https://affidavit.eci.gov.in', description: 'View candidate affidavits and backgrounds' },
];
