export interface TrelloLabel {
  id: string;
  idBoard?: string;
  name: string;
  color: string;
}

export interface TrelloChecklistItem {
  id: string;
  name: string;
  state: 'complete' | 'incomplete';
}

export interface TrelloChecklist {
  id: string;
  name: string;
  checkItems: TrelloChecklistItem[];
}

export interface TrelloMember {
  id: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  initials?: string;
}

export interface TrelloCard {
  id: string;
  idShort?: number;
  idBoard: string;
  idList: string;
  name: string;
  desc: string;
  due?: string | null;
  dueComplete?: boolean;
  labels: TrelloLabel[];
  checklists?: TrelloChecklist[];
  members?: TrelloMember[];
  url?: string;
  pos?: number;
  dateLastActivity?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  cardType?: 'bug' | 'feature' | 'build' | 'task' | 'tech_debt';
  buildVersion?: string;
  storyPoints?: number;
}

export interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
  closed?: boolean;
  pos?: number;
  category?: 'backlog' | 'in_progress' | 'bugs' | 'review' | 'done' | 'builds';
}

export interface TrelloBoardPrefs {
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundBrightness?: 'dark' | 'light';
  backgroundTopColor?: string;
  backgroundBottomColor?: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  url: string;
  shortUrl?: string;
  prefs?: TrelloBoardPrefs;
  listsCount?: number;
  cardsCount?: number;
  openBugsCount?: number;
  inProgressCount?: number;
  upcomingBuildsCount?: number;
  dateLastActivity?: string;
  category?: 'platform' | 'frontend' | 'mobile' | 'infra' | 'general';
  pinned?: boolean;
}

export interface BuildMilestone {
  version: string;
  title: string;
  releaseDate: string;
  status: 'imminent' | 'in_progress' | 'planned';
  readinessPercent: number;
  cardsCount: number;
  bugsCount: number;
  cards: TrelloCard[];
}

export interface DeveloperGlanceSummary {
  urgentBugs: TrelloCard[];
  inProgressFeatures: TrelloCard[];
  upcomingBuilds: BuildMilestone[];
  dueTodayOrOverdue: TrelloCard[];
  needsReview: TrelloCard[];
  stats: {
    totalCards: number;
    bugsCount: number;
    inProgressCount: number;
    reviewCount: number;
    completedCount: number;
    overdueCount: number;
  };
}

export interface BoardDetailsResponse {
  board: TrelloBoard;
  lists: TrelloList[];
  cards: TrelloCard[];
  summary: DeveloperGlanceSummary;
  isLiveTrello: boolean;
}

export interface BoardsListResponse {
  boards: TrelloBoard[];
  isLiveTrello: boolean;
  message?: string;
}
