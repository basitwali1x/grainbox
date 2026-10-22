import { CallRecording, CampaignSummary, LiveAgent } from '../types';

export const MOCK_RECORDINGS: CallRecording[] = [
  {
    id: 'REC-20261021-98214',
    leadId: '1049281',
    timestamp: '2026-10-21 09:22:14 UTC',
    agent: 'Sarah Jenkins',
    agentId: '1004',
    campaign: 'SOLAR_OUT_Q4',
    phone: '+1 (555) 382-9011',
    duration: '04:32',
    durationSec: 272,
    status: 'SALE - Verified',
    disposition: 'SALE',
    callerName: 'Robert Vance Jr.',
    notes: 'Customer agreed to 12.4kW residential solar installation. Credit pre-qualified.',
    qaScore: 98
  },
  {
    id: 'REC-20261021-98215',
    leadId: '1049282',
    timestamp: '2026-10-21 09:14:02 UTC',
    agent: 'Marcus Vance',
    agentId: '1012',
    campaign: 'INBOUND_CARE',
    phone: '+1 (555) 749-2184',
    duration: '02:18',
    durationSec: 138,
    status: 'CALL BACK SCHEDULED',
    disposition: 'CALLBK',
    callerName: 'Evelyn Parker',
    notes: 'Inquiry regarding VoIP trunk failover settings. Scheduled follow-up with tier 2.',
    qaScore: 92
  },
  {
    id: 'REC-20261021-98216',
    leadId: '1049283',
    timestamp: '2026-10-21 08:58:45 UTC',
    agent: 'Elena Rostova',
    agentId: '1008',
    campaign: 'HEALTH_MED_A',
    phone: '+1 (555) 902-3312',
    duration: '07:11',
    durationSec: 431,
    status: 'SALE - Verified',
    disposition: 'SALE',
    callerName: 'Gregory House',
    notes: 'Comprehensive medicare advantage plan enrolment approved. Disclosures read in full.',
    qaScore: 100
  },
  {
    id: 'REC-20261021-98217',
    leadId: '1049284',
    timestamp: '2026-10-21 08:42:19 UTC',
    agent: 'David Kim',
    agentId: '1019',
    campaign: 'B2B_LEADS_US',
    phone: '+1 (555) 412-8876',
    duration: '01:45',
    durationSec: 105,
    status: 'NOT INTERESTED',
    disposition: 'NI',
    callerName: 'Arthur Dent',
    notes: 'Currently locked in 3-year contract with existing carrier. Follow up in 6 months.',
    qaScore: 88
  },
  {
    id: 'REC-20261021-98218',
    leadId: '1049285',
    timestamp: '2026-10-21 08:29:10 UTC',
    agent: 'Chloe Bennett',
    agentId: '1002',
    campaign: 'INBOUND_CARE',
    phone: '+1 (555) 670-1123',
    duration: '03:52',
    durationSec: 232,
    status: 'RESOLVED',
    disposition: 'RES',
    callerName: 'Patricia Morales',
    notes: 'Reset SIP credential on remote softphone. Audio verified bidirectional.',
    qaScore: 95
  },
  {
    id: 'REC-20261021-98219',
    leadId: '1049286',
    timestamp: '2026-10-21 08:11:04 UTC',
    agent: 'Liam Gallagher',
    agentId: '1025',
    campaign: 'SOLAR_OUT_Q4',
    phone: '+1 (555) 891-4432',
    duration: '05:14',
    durationSec: 314,
    status: 'SALE - Verified',
    disposition: 'SALE',
    callerName: 'Derrick Walsh',
    notes: 'Commercial rooftop assessment booked for Thursday 2 PM.',
    qaScore: 96
  }
];

export const MOCK_CAMPAIGNS: CampaignSummary[] = [
  {
    id: 'SOLAR_OUT_Q4',
    name: 'Residential Solar Outbound Q4',
    dialMethod: 'RATIO (Adaptive 2.8x)',
    dialLevel: 2.8,
    activeAgents: 14,
    callsInQueue: 3,
    callsPlacedToday: 4210,
    answersToday: 1840,
    salesToday: 48
  },
  {
    id: 'INBOUND_CARE',
    name: 'Global Nexus Client Support Queue',
    dialMethod: 'INBOUND_MANUAL',
    dialLevel: 1.0,
    activeAgents: 8,
    callsInQueue: 1,
    callsPlacedToday: 0,
    answersToday: 342,
    salesToday: 19
  },
  {
    id: 'HEALTH_MED_A',
    name: 'Healthcare Enrollment Advantage',
    dialMethod: 'RATIO (Adaptive 3.2x)',
    dialLevel: 3.2,
    activeAgents: 19,
    callsInQueue: 5,
    callsPlacedToday: 6890,
    answersToday: 2940,
    salesToday: 82
  },
  {
    id: 'B2B_LEADS_US',
    name: 'North America Enterprise B2B',
    dialMethod: 'PREDICTIVE_AVG',
    dialLevel: 2.2,
    activeAgents: 6,
    callsInQueue: 0,
    callsPlacedToday: 1950,
    answersToday: 610,
    salesToday: 12
  }
];

export const MOCK_LIVE_AGENTS: LiveAgent[] = [
  {
    id: '1004',
    name: 'Sarah Jenkins',
    extension: 'SIP/cc1004',
    campaign: 'SOLAR_OUT_Q4',
    status: 'INCALL',
    callDuration: '03:12',
    callsToday: 94,
    salesToday: 5
  },
  {
    id: '1008',
    name: 'Elena Rostova',
    extension: 'SIP/cc1008',
    campaign: 'HEALTH_MED_A',
    status: 'INCALL',
    callDuration: '01:45',
    callsToday: 112,
    salesToday: 8
  },
  {
    id: '1012',
    name: 'Marcus Vance',
    extension: 'SIP/cc1012',
    campaign: 'INBOUND_CARE',
    status: 'READY',
    callDuration: '00:00',
    callsToday: 48,
    salesToday: 3
  },
  {
    id: '1019',
    name: 'David Kim',
    extension: 'SIP/cc1019',
    campaign: 'B2B_LEADS_US',
    status: 'DISPO',
    callDuration: '00:24',
    callsToday: 65,
    salesToday: 2
  },
  {
    id: '1002',
    name: 'Chloe Bennett',
    extension: 'SIP/cc1002',
    campaign: 'INBOUND_CARE',
    status: 'PAUSED',
    callDuration: '00:00',
    callsToday: 51,
    salesToday: 4
  }
];
