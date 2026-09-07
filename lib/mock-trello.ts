import {
  TrelloBoard,
  TrelloList,
  TrelloCard,
  DeveloperGlanceSummary,
  BuildMilestone,
} from '@/types/trello';

export const MOCK_BOARDS: TrelloBoard[] = [
  {
    id: 'board-core-api',
    name: 'Core API & Platform Engine',
    desc: 'High-throughput microservices, authentication gateway, database queries, and upcoming backend builds.',
    closed: false,
    url: 'https://trello.com/b/mock1/core-api',
    shortUrl: 'https://trello.com/b/mock1',
    prefs: {
      backgroundColor: '#1e293b',
      backgroundBrightness: 'dark',
      backgroundTopColor: '#0f172a',
      backgroundBottomColor: '#1e293b',
    },
    listsCount: 6,
    cardsCount: 19,
    openBugsCount: 4,
    inProgressCount: 5,
    upcomingBuildsCount: 2,
    dateLastActivity: '2026-09-05T11:42:00.000Z',
    category: 'platform',
    pinned: true,
  },
  {
    id: 'board-web-ui',
    name: 'Web App & UI Design System',
    desc: 'Next.js client interface, responsive layout components, accessibility standards, and customer portal.',
    closed: false,
    url: 'https://trello.com/b/mock2/web-ui',
    shortUrl: 'https://trello.com/b/mock2',
    prefs: {
      backgroundColor: '#0f766e',
      backgroundBrightness: 'dark',
      backgroundTopColor: '#115e59',
      backgroundBottomColor: '#0f766e',
    },
    listsCount: 5,
    cardsCount: 16,
    openBugsCount: 3,
    inProgressCount: 4,
    upcomingBuildsCount: 1,
    dateLastActivity: '2026-09-05T09:15:00.000Z',
    category: 'frontend',
    pinned: true,
  },
  {
    id: 'board-mobile-client',
    name: 'Mobile App (iOS & Android)',
    desc: 'Cross-platform mobile application, offline sync engine, push notifications, and release builds.',
    closed: false,
    url: 'https://trello.com/b/mock3/mobile-client',
    shortUrl: 'https://trello.com/b/mock3',
    prefs: {
      backgroundColor: '#4338ca',
      backgroundBrightness: 'dark',
      backgroundTopColor: '#3730a3',
      backgroundBottomColor: '#4338ca',
    },
    listsCount: 5,
    cardsCount: 14,
    openBugsCount: 2,
    inProgressCount: 3,
    upcomingBuildsCount: 1,
    dateLastActivity: '2026-09-04T18:20:00.000Z',
    category: 'mobile',
    pinned: false,
  },
  {
    id: 'board-devops-infra',
    name: 'DevOps & Cloud Infrastructure',
    desc: 'Kubernetes cluster maintenance, telemetry observability, CI/CD pipeline automation, and security audits.',
    closed: false,
    url: 'https://trello.com/b/mock4/devops',
    shortUrl: 'https://trello.com/b/mock4',
    prefs: {
      backgroundColor: '#334155',
      backgroundBrightness: 'dark',
      backgroundTopColor: '#1e293b',
      backgroundBottomColor: '#334155',
    },
    listsCount: 4,
    cardsCount: 11,
    openBugsCount: 1,
    inProgressCount: 2,
    upcomingBuildsCount: 1,
    dateLastActivity: '2026-09-03T15:00:00.000Z',
    category: 'infra',
    pinned: false,
  },
];

export const MOCK_LISTS: Record<string, TrelloList[]> = {
  'board-core-api': [
    { id: 'list-bugs', name: 'Critical Bugs & Hotfixes', idBoard: 'board-core-api', pos: 1, category: 'bugs' },
    { id: 'list-next', name: 'Next Up (Sprint 18)', idBoard: 'board-core-api', pos: 2, category: 'backlog' },
    { id: 'list-progress', name: 'In Progress (Dev)', idBoard: 'board-core-api', pos: 3, category: 'in_progress' },
    { id: 'list-review', name: 'Code Review & QA', idBoard: 'board-core-api', pos: 4, category: 'review' },
    { id: 'list-builds', name: 'Upcoming Build v3.2.0-rc1', idBoard: 'board-core-api', pos: 5, category: 'builds' },
    { id: 'list-done', name: 'Deployed to Production', idBoard: 'board-core-api', pos: 6, category: 'done' },
  ],
  'board-web-ui': [
    { id: 'list-web-bugs', name: 'Bugs & Visual Defects', idBoard: 'board-web-ui', pos: 1, category: 'bugs' },
    { id: 'list-web-next', name: 'Next to Implement', idBoard: 'board-web-ui', pos: 2, category: 'backlog' },
    { id: 'list-web-progress', name: 'Currently Building', idBoard: 'board-web-ui', pos: 2, category: 'in_progress' },
    { id: 'list-web-review', name: 'Design Review & Testing', idBoard: 'board-web-ui', pos: 4, category: 'review' },
    { id: 'list-web-done', name: 'Shipped in v2.4', idBoard: 'board-web-ui', pos: 5, category: 'done' },
  ],
  'board-mobile-client': [
    { id: 'list-mob-bugs', name: 'Mobile Crashes & Issues', idBoard: 'board-mobile-client', pos: 1, category: 'bugs' },
    { id: 'list-mob-next', name: 'Next Features', idBoard: 'board-mobile-client', pos: 2, category: 'backlog' },
    { id: 'list-mob-progress', name: 'Developing', idBoard: 'board-mobile-client', pos: 3, category: 'in_progress' },
    { id: 'list-mob-qa', name: 'TestFlight / Beta QA', idBoard: 'board-mobile-client', pos: 4, category: 'review' },
    { id: 'list-mob-done', name: 'App Store Approved', idBoard: 'board-mobile-client', pos: 5, category: 'done' },
  ],
  'board-devops-infra': [
    { id: 'list-devops-incidents', name: 'Active Incidents', idBoard: 'board-devops-infra', pos: 1, category: 'bugs' },
    { id: 'list-devops-queue', name: 'Planned Maintenance', idBoard: 'board-devops-infra', pos: 2, category: 'backlog' },
    { id: 'list-devops-wip', name: 'Executing Now', idBoard: 'board-devops-infra', pos: 3, category: 'in_progress' },
    { id: 'list-devops-done', name: 'Completed & Verified', idBoard: 'board-devops-infra', pos: 4, category: 'done' },
  ],
};

export const MOCK_CARDS: Record<string, TrelloCard[]> = {
  'board-core-api': [
    {
      id: 'card-bug-auth',
      idBoard: 'board-core-api',
      idList: 'list-bugs',
      name: 'AUTH-401: Token refresh race condition causing random session logout',
      desc: 'Users experience intermittent 401 Unauthorized responses when making parallel requests while the JWT access token is expiring. \n\n**Steps to reproduce:**\n1. Log in to dashboard with active session.\n2. Trigger concurrent API calls at minute 59 of token lifetime.\n3. Observe race condition in refreshToken mutation returning `HTTP 401 INVALID_SIGNATURE`.\n\n**Proposed Fix:** Add mutex/single-flight lock in token rotation interceptor.',
      due: '2026-09-06T18:00:00.000Z',
      dueComplete: false,
      severity: 'critical',
      cardType: 'bug',
      buildVersion: 'v3.2.0-rc1',
      storyPoints: 5,
      labels: [
        { id: 'lbl-p0', name: 'P0 - Critical', color: 'red' },
        { id: 'lbl-sec', name: 'Security & Auth', color: 'purple' },
      ],
      members: [
        { id: 'mem-alex', fullName: 'Alex Rivera', username: 'arivera', initials: 'AR' },
        { id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' },
      ],
      checklists: [
        {
          id: 'chk-1',
          name: 'Resolution Steps',
          checkItems: [
            { id: 'ci-1', name: 'Reproduce with mock timer in Jest unit test', state: 'complete' },
            { id: 'ci-2', name: 'Implement Redis atomic token rotation locking', state: 'incomplete' },
            { id: 'ci-3', name: 'Verify backwards compatibility with mobile client v1.7', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T11:20:00.000Z',
    },
    {
      id: 'card-bug-pool',
      idBoard: 'board-core-api',
      idList: 'list-bugs',
      name: 'DB-CONN: Postgres connection pool starvation under spike load',
      desc: 'During high spike traffic (>1200 req/s), connection pool reaches max capacity (50) and idle timeout does not release zombie connections fast enough.\n\nError: `Knex: Timeout acquiring a connection. The pool is probably full.`\n\nNeed to adjust idleTimeoutMillis to 10s and increase maxPool to 80.',
      due: '2026-09-05T22:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'bug',
      buildVersion: 'v3.2.0-rc1',
      storyPoints: 3,
      labels: [
        { id: 'lbl-p1', name: 'P1 - High', color: 'orange' },
        { id: 'lbl-perf', name: 'Database', color: 'blue' },
      ],
      members: [{ id: 'mem-sarah', fullName: 'Sarah Chen', username: 'schen', initials: 'SC' }],
      checklists: [
        {
          id: 'chk-pool',
          name: 'Verification Tasks',
          checkItems: [
            { id: 'cp-1', name: 'Audit unclosed transactions in payment webhook', state: 'complete' },
            { id: 'cp-2', name: 'Benchmark pool exhaustion with k6 load test', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T10:05:00.000Z',
    },
    {
      id: 'card-bug-rate',
      idBoard: 'board-core-api',
      idList: 'list-bugs',
      name: 'API-RATE: Rate limiter header returning wrong Retry-After seconds',
      desc: 'Header returns milliseconds instead of seconds, causing external API consumers to sleep for 30,000 seconds instead of 30 seconds.',
      due: '2026-09-07T12:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'bug',
      storyPoints: 2,
      labels: [
        { id: 'lbl-p2', name: 'P2 - Medium', color: 'yellow' },
        { id: 'lbl-api', name: 'API Gateway', color: 'sky' },
      ],
      members: [{ id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' }],
      dateLastActivity: '2026-09-04T16:30:00.000Z',
    },
    {
      id: 'card-bug-null',
      idBoard: 'board-core-api',
      idList: 'list-bugs',
      name: 'SER-500: Unhandled null pointer in JSON serializing user preferences',
      desc: 'When a new user has null theme preference, serializeUser throws TypeError: Cannot read property "mode" of null.',
      due: '2026-09-04T10:00:00.000Z', // Overdue
      dueComplete: false,
      severity: 'medium',
      cardType: 'bug',
      storyPoints: 1,
      labels: [
        { id: 'lbl-p2', name: 'P2 - Medium', color: 'yellow' },
        { id: 'lbl-bug', name: 'Bug Fix', color: 'red' },
      ],
      members: [{ id: 'mem-marcus', fullName: 'Marcus Vance', username: 'mvance', initials: 'MV' }],
      dateLastActivity: '2026-09-04T14:15:00.000Z',
    },
    {
      id: 'card-feat-webhook',
      idBoard: 'board-core-api',
      idList: 'list-progress',
      name: 'FEAT-920: Outgoing Webhook Event Delivery Engine with Retry Queue',
      desc: 'Implement webhook dispatcher with exponential backoff (1m, 5m, 15m, 1h, 6h) and signature verification header `X-Signature-256`.\n\nTarget build: v3.2.0-rc1',
      due: '2026-09-08T17:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'feature',
      buildVersion: 'v3.2.0-rc1',
      storyPoints: 8,
      labels: [
        { id: 'lbl-feat', name: 'Feature', color: 'green' },
        { id: 'lbl-v32', name: 'Build v3.2', color: 'blue' },
      ],
      members: [{ id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' }],
      checklists: [
        {
          id: 'chk-wh',
          name: 'Milestone Checklist',
          checkItems: [
            { id: 'wh-1', name: 'PostgreSQL schema for webhook_events table', state: 'complete' },
            { id: 'wh-2', name: 'HMAC SHA-256 signature generator', state: 'complete' },
            { id: 'wh-3', name: 'BullMQ worker queue integration', state: 'complete' },
            { id: 'wh-4', name: 'Dead letter queue & user notification alert', state: 'incomplete' },
            { id: 'wh-5', name: 'Integration tests with wiremock webhook receiver', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T11:45:00.000Z',
    },
    {
      id: 'card-feat-filter',
      idBoard: 'board-core-api',
      idList: 'list-progress',
      name: 'FEAT-924: Compound Filter & Search Query Optimizer for Projects API',
      desc: 'Enable developers to filter by tags, status, assignee, and date range in a single indexed query.',
      due: '2026-09-09T18:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'feature',
      buildVersion: 'v3.2.0-rc1',
      storyPoints: 5,
      labels: [
        { id: 'lbl-feat', name: 'Feature', color: 'green' },
        { id: 'lbl-perf', name: 'Performance', color: 'blue' },
      ],
      members: [{ id: 'mem-alex', fullName: 'Alex Rivera', username: 'arivera', initials: 'AR' }],
      checklists: [
        {
          id: 'chk-flt',
          name: 'Implementation',
          checkItems: [
            { id: 'fl-1', name: 'Composite B-tree indices on (org_id, status, created_at)', state: 'complete' },
            { id: 'fl-2', name: 'Query sanitization & SQL injection safety review', state: 'complete' },
            { id: 'fl-3', name: 'Cursor-based pagination response envelope', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T09:30:00.000Z',
    },
    {
      id: 'card-feat-export',
      idBoard: 'board-core-api',
      idList: 'list-next',
      name: 'NEXT: Asynchronous CSV/JSON Project Archive Export Service',
      desc: 'Allow exporting board card history and attachments as zipped JSON/CSV with presigned S3 download URL.',
      due: '2026-09-12T17:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'task',
      storyPoints: 5,
      labels: [{ id: 'lbl-backlog', name: 'Sprint 18', color: 'sky' }],
      members: [{ id: 'mem-sarah', fullName: 'Sarah Chen', username: 'schen', initials: 'SC' }],
      dateLastActivity: '2026-09-04T12:00:00.000Z',
    },
    {
      id: 'card-build-v32',
      idBoard: 'board-core-api',
      idList: 'list-builds',
      name: 'RELEASE BUILD: Core Engine v3.2.0-rc1 (Staging Cut)',
      desc: 'Target cut for staging environment. Includes new webhook engine, auth patch, and database connection pool fixes.\n\nCode freeze: September 7th, 2026.\nTarget deployment: September 9th, 2026.',
      due: '2026-09-09T15:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'build',
      buildVersion: 'v3.2.0-rc1',
      labels: [
        { id: 'lbl-build', name: 'Upcoming Build', color: 'blue' },
        { id: 'lbl-stg', name: 'Staging Release', color: 'purple' },
      ],
      members: [
        { id: 'mem-alex', fullName: 'Alex Rivera', username: 'arivera', initials: 'AR' },
        { id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' },
      ],
      checklists: [
        {
          id: 'chk-bld',
          name: 'Release Readiness Criteria',
          checkItems: [
            { id: 'rb-1', name: 'P0 AUTH-401 race condition resolved & verified', state: 'incomplete' },
            { id: 'rb-2', name: 'Database pool settings updated in Helm values.yaml', state: 'complete' },
            { id: 'rb-3', name: 'Migration rollback script verified on staging DB', state: 'complete' },
            { id: 'rb-4', name: 'Load test suite passes with 0 error rate at 1,500 req/s', state: 'incomplete' },
            { id: 'rb-5', name: 'Swagger / OpenAPI specification updated', state: 'complete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T11:42:00.000Z',
    },
    {
      id: 'card-rev-graphql',
      idBoard: 'board-core-api',
      idList: 'list-review',
      name: 'PR #418: GraphQL Batching DataLoader for Card Members',
      desc: 'Eliminates N+1 query pattern when fetching members across 100+ cards simultaneously. Pending review from senior engineer.',
      due: '2026-09-06T12:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'tech_debt',
      storyPoints: 3,
      labels: [
        { id: 'lbl-qa', name: 'Ready for Review', color: 'yellow' },
        { id: 'lbl-perf', name: 'Performance', color: 'blue' },
      ],
      members: [{ id: 'mem-marcus', fullName: 'Marcus Vance', username: 'mvance', initials: 'MV' }],
      dateLastActivity: '2026-09-05T08:10:00.000Z',
    },
    {
      id: 'card-done-otel',
      idBoard: 'board-core-api',
      idList: 'list-done',
      name: 'OpenTelemetry Distributed Tracing across Microservice Calls',
      desc: 'Merged and running in prod. Traces propagating `traceparent` headers properly.',
      due: '2026-09-02T18:00:00.000Z',
      dueComplete: true,
      cardType: 'task',
      labels: [{ id: 'lbl-done', name: 'Done', color: 'green' }],
      dateLastActivity: '2026-09-02T18:30:00.000Z',
    },
  ],
  'board-web-ui': [
    {
      id: 'card-web-bug1',
      idBoard: 'board-web-ui',
      idList: 'list-web-bugs',
      name: 'UI-BUG: Sidebar collapsed state clipping nested dropdown menu',
      desc: 'When sidebar is in collapsed icon mode (64px width), the project options menu has overflow-hidden applied, cutting off the bottom action buttons.',
      due: '2026-09-06T14:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'bug',
      buildVersion: 'v2.4.0',
      storyPoints: 2,
      labels: [
        { id: 'lbl-p1', name: 'P1 - High', color: 'orange' },
        { id: 'lbl-css', name: 'CSS / Layout', color: 'pink' },
      ],
      members: [{ id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' }],
      checklists: [
        {
          id: 'chk-w1',
          name: 'Fix Checklist',
          checkItems: [
            { id: 'w1-1', name: 'Port dropdown menu to Radix UI Portal / fixed positioning', state: 'complete' },
            { id: 'w1-2', name: 'Test with high zoom (150%) and mobile breakpoint', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T09:10:00.000Z',
    },
    {
      id: 'card-web-bug2',
      idBoard: 'board-web-ui',
      idList: 'list-web-bugs',
      name: 'PERF-BUG: Table re-rendering all 500 rows on single card drag',
      desc: 'Missing React.memo or fine-grained selector causes the whole kanban lane to lag during drag events.',
      due: '2026-09-07T16:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'bug',
      buildVersion: 'v2.4.0',
      storyPoints: 3,
      labels: [
        { id: 'lbl-p2', name: 'P2 - Medium', color: 'yellow' },
        { id: 'lbl-perf', name: 'Performance', color: 'blue' },
      ],
      members: [{ id: 'mem-sarah', fullName: 'Sarah Chen', username: 'schen', initials: 'SC' }],
      dateLastActivity: '2026-09-04T15:20:00.000Z',
    },
    {
      id: 'card-web-dark',
      idBoard: 'board-web-ui',
      idList: 'list-web-progress',
      name: 'FEAT-310: Dark Mode Palette Optimization & WCAG AA Contrast Pass',
      desc: 'Refining secondary text color (#94a3b8) against slate-900 background to exceed 4.5:1 ratio for accessibility compliance.',
      due: '2026-09-08T18:00:00.000Z',
      dueComplete: false,
      severity: 'medium',
      cardType: 'feature',
      buildVersion: 'v2.4.0',
      storyPoints: 3,
      labels: [
        { id: 'lbl-feat', name: 'Feature', color: 'green' },
        { id: 'lbl-a11y', name: 'Accessibility', color: 'purple' },
      ],
      members: [{ id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' }],
      checklists: [
        {
          id: 'chk-a11y',
          name: 'Contrast Checklist',
          checkItems: [
            { id: 'a-1', name: 'Verify badges and tag pills with axe DevTools', state: 'complete' },
            { id: 'a-2', name: 'Update disabled button state contrast', state: 'complete' },
            { id: 'a-3', name: 'Test focus outlines in keyboard navigation', state: 'incomplete' },
          ],
        },
      ],
      dateLastActivity: '2026-09-05T09:15:00.000Z',
    },
    {
      id: 'card-web-build',
      idBoard: 'board-web-ui',
      idList: 'list-web-progress',
      name: 'UPCOMING BUILD: Web App Release v2.4.0',
      desc: 'Frontend quarterly release packaging dark mode, virtualized board lists, and bug fixes.',
      due: '2026-09-11T12:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'build',
      buildVersion: 'v2.4.0',
      labels: [{ id: 'lbl-bld2', name: 'Release Candidate', color: 'blue' }],
      members: [{ id: 'mem-alex', fullName: 'Alex Rivera', username: 'arivera', initials: 'AR' }],
      dateLastActivity: '2026-09-05T08:00:00.000Z',
    },
  ],
  'board-mobile-client': [
    {
      id: 'card-mob-bug1',
      idBoard: 'board-mobile-client',
      idList: 'list-mob-bugs',
      name: 'IOS-CRASH: App crashes on launch for iOS 18 devices with FaceID disabled',
      desc: 'Fatal exception in BiometricManager.swift when evaluatePolicy returns biometryNotEnrolled.',
      due: '2026-09-05T19:00:00.000Z',
      dueComplete: false,
      severity: 'critical',
      cardType: 'bug',
      buildVersion: 'v1.8.0-rc2',
      storyPoints: 5,
      labels: [
        { id: 'lbl-p0', name: 'P0 - Blocker', color: 'red' },
        { id: 'lbl-ios', name: 'iOS 18', color: 'sky' },
      ],
      members: [{ id: 'mem-dev', fullName: 'You (Developer)', username: 'developer', initials: 'ME' }],
      dateLastActivity: '2026-09-05T07:45:00.000Z',
    },
    {
      id: 'card-mob-offline',
      idBoard: 'board-mobile-client',
      idList: 'list-mob-progress',
      name: 'FEAT-MOB: SQLite Offline Sync Queue with Conflict Resolution',
      desc: 'Allows users on spotty airplane/train Wi-Fi to edit cards and have them replay cleanly upon reconnect.',
      due: '2026-09-10T18:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'feature',
      buildVersion: 'v1.8.0-rc2',
      storyPoints: 8,
      labels: [{ id: 'lbl-feat', name: 'Feature', color: 'green' }],
      members: [{ id: 'mem-marcus', fullName: 'Marcus Vance', username: 'mvance', initials: 'MV' }],
      dateLastActivity: '2026-09-04T18:20:00.000Z',
    },
  ],
  'board-devops-infra': [
    {
      id: 'card-infra-k8s',
      idBoard: 'board-devops-infra',
      idList: 'list-devops-wip',
      name: 'INFRA-112: GKE Cluster Upgrade to Kubernetes 1.31 with Ingress Controller',
      desc: 'Rolling node pool upgrade with pod disruption budgets configured to ensure zero downtime.',
      due: '2026-09-08T04:00:00.000Z',
      dueComplete: false,
      severity: 'high',
      cardType: 'task',
      labels: [{ id: 'lbl-infra', name: 'Maintenance', color: 'purple' }],
      members: [{ id: 'mem-sarah', fullName: 'Sarah Chen', username: 'schen', initials: 'SC' }],
      dateLastActivity: '2026-09-03T15:00:00.000Z',
    },
  ],
};

export function computeDeveloperGlance(
  board: TrelloBoard,
  lists: TrelloList[],
  cards: TrelloCard[]
): DeveloperGlanceSummary {
  const now = new Date('2026-09-05T12:00:00.000Z');

  // Classify bugs: cardType === 'bug' or label contains 'bug'/'fix'/'p0'/'p1'/'critical' or list has 'bug'
  const isBugCard = (c: TrelloCard) => {
    if (c.cardType === 'bug') return true;
    const lowerName = c.name.toLowerCase();
    const hasBugLabel = c.labels.some((l) =>
      /bug|defect|hotfix|p0|p1|critical/i.test(l.name)
    );
    const inBugList = lists.find((l) => l.id === c.idList)?.category === 'bugs';
    return (
      hasBugLabel ||
      inBugList ||
      lowerName.startsWith('bug') ||
      lowerName.includes('[bug]') ||
      lowerName.includes('crash') ||
      lowerName.includes('error')
    );
  };

  const isBuildCard = (c: TrelloCard) => {
    if (c.cardType === 'build') return true;
    const lowerName = c.name.toLowerCase();
    return (
      /build|release|rc|version|v\d+\.\d+/i.test(lowerName) ||
      c.labels.some((l) => /build|release|milestone/i.test(l.name))
    );
  };

  const isInProgress = (c: TrelloCard) => {
    const list = lists.find((l) => l.id === c.idList);
    return list?.category === 'in_progress' || /progress|doing|building|wip/i.test(list?.name || '');
  };

  const isReview = (c: TrelloCard) => {
    const list = lists.find((l) => l.id === c.idList);
    return list?.category === 'review' || /review|qa|testing|audit/i.test(list?.name || '');
  };

  const isDone = (c: TrelloCard) => {
    const list = lists.find((l) => l.id === c.idList);
    return c.dueComplete || list?.category === 'done' || /done|closed|shipped/i.test(list?.name || '');
  };

  // Urgent bugs: not done, sorted by severity (critical > high > medium) and due date
  const urgentBugs = cards
    .filter((c) => isBugCard(c) && !isDone(c))
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      const aSev = order[a.severity || 'medium'];
      const bSev = order[b.severity || 'medium'];
      if (aSev !== bSev) return aSev - bSev;
      if (a.due && b.due) return new Date(a.due).getTime() - new Date(b.due).getTime();
      return 0;
    });

  // In-progress features
  const inProgressFeatures = cards.filter((c) => isInProgress(c) && !isDone(c));

  // Needs review
  const needsReview = cards.filter((c) => isReview(c) && !isDone(c));

  // Due today or overdue
  const dueTodayOrOverdue = cards.filter((c) => {
    if (!c.due || isDone(c)) return false;
    const dueDate = new Date(c.due);
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 36; // Overdue or within next 36 hours
  });

  // Group build milestones
  const buildCards = cards.filter((c) => isBuildCard(c));
  const upcomingBuilds: BuildMilestone[] = [];

  // Extract versions from card tags or names
  const detectedVersions = new Set<string>();
  cards.forEach((c) => {
    if (c.buildVersion) detectedVersions.add(c.buildVersion);
    const match = c.name.match(/v\d+\.\d+(\.\d+)?(-[a-z0-9.]+)?/i);
    if (match) detectedVersions.add(match[0]);
  });

  if (detectedVersions.size === 0) {
    detectedVersions.add('v1.0.0');
  }

  detectedVersions.forEach((version) => {
    const matchingCards = cards.filter(
      (c) => c.buildVersion === version || c.name.includes(version)
    );
    const completedCount = matchingCards.filter(isDone).length;
    const readiness =
      matchingCards.length > 0
        ? Math.round((completedCount / matchingCards.length) * 100)
        : 50;

    const buildCard = matchingCards.find(isBuildCard);
    const releaseDate = buildCard?.due || '2026-09-15T00:00:00.000Z';

    upcomingBuilds.push({
      version,
      title: buildCard?.name || `Build Milestone ${version}`,
      releaseDate,
      status: readiness > 75 ? 'imminent' : readiness > 30 ? 'in_progress' : 'planned',
      readinessPercent: readiness,
      cardsCount: matchingCards.length,
      bugsCount: matchingCards.filter(isBugCard).length,
      cards: matchingCards,
    });
  });

  return {
    urgentBugs,
    inProgressFeatures,
    upcomingBuilds,
    dueTodayOrOverdue,
    needsReview,
    stats: {
      totalCards: cards.length,
      bugsCount: urgentBugs.length,
      inProgressCount: inProgressFeatures.length,
      reviewCount: needsReview.length,
      completedCount: cards.filter(isDone).length,
      overdueCount: dueTodayOrOverdue.length,
    },
  };
}
