export type AppRoute = 'home' | 'login-agent' | 'login-admin' | 'recordings' | 'agent-station' | 'admin-dashboard' | 'lead-injector';

export interface LeadRecord {
  id?: string;
  phone: string;
  first_name: string;
  last_name: string;
  city: string;
  status?: 'pending' | 'success' | 'failed' | 'duplicate';
  message?: string;
  injectedAt?: string;
  leadId?: string;
}

export interface DynamicIpLog {
  timestamp: string;
  previousIp: string;
  newIp: string;
  message: string;
  type: 'info' | 'shift' | 'warning';
}

export interface LeadInjectionConfig {
  viciHost: string;
  apiUser: string;
  apiPass: string;
  campaignId: string;
  listId: number;
  phoneCode: string;
  duplicateCheck: string;
  rateLimitBatch: number;
  rateLimitDelayMs: number;
  ipCheckInterval: number;
}


export interface CallRecording {
  id: string;
  leadId: string;
  timestamp: string;
  agent: string;
  agentId: string;
  campaign: string;
  phone: string;
  duration: string;
  durationSec: number;
  status: string;
  disposition: string;
  callerName: string;
  notes: string;
  qaScore?: number;
}

export interface LiveAgent {
  id: string;
  name: string;
  extension: string;
  campaign: string;
  status: 'INCALL' | 'READY' | 'PAUSED' | 'DISPO';
  callDuration: string;
  callsToday: number;
  salesToday: number;
}

export interface CampaignSummary {
  id: string;
  name: string;
  dialMethod: string;
  dialLevel: number;
  activeAgents: number;
  callsInQueue: number;
  callsPlacedToday: number;
  answersToday: number;
  salesToday: number;
}
