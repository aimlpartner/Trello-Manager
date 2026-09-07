import { TrelloCard, TrelloList } from '@/types/trello';

export type FeatureModule = 'automation' | 'auth' | 'studio' | 'guides' | 'core';
export type FeaturePriority = 'urgent' | 'high' | 'medium' | 'low';
export type FeatureStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface EnrichedFeature extends TrelloCard {
  identifier: string;
  module: FeatureModule;
  moduleLabel: string;
  moduleColor: string;
  priority: FeaturePriority;
  status: FeatureStatus;
  cleanName: string;
  videoUrl?: string;
}

export function formatCardTitle(rawName: string): { cleanName: string; videoUrl?: string } {
  const trimmed = rawName.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('loom.com')) {
      return {
        cleanName: 'Loom Video Walkthrough & Feature Demo',
        videoUrl: trimmed,
      };
    }
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      return {
        cleanName: 'Video Overview & Architecture Demo',
        videoUrl: trimmed,
      };
    }
    return {
      cleanName: `External Resource: ${trimmed.split('/').pop()?.split('?')[0] || 'Link'}`,
    };
  }
  return { cleanName: trimmed };
}

export function detectModule(cardName: string, desc: string): { module: FeatureModule; label: string; color: string } {
  const text = `${cardName} ${desc}`.toLowerCase();

  if (
    text.includes('post') ||
    text.includes('instagram') ||
    text.includes('tiktok') ||
    text.includes('facebook') ||
    text.includes('twitter') ||
    text.includes('social') ||
    text.includes('trigger') ||
    text.includes('automation') ||
    text.includes('daily') ||
    text.includes('weekly')
  ) {
    return {
      module: 'automation',
      label: 'Automation & Social',
      color: 'blue',
    };
  }

  if (
    text.includes('login') ||
    text.includes('auth') ||
    text.includes('google') ||
    text.includes('apple') ||
    text.includes('session') ||
    text.includes('role') ||
    text.includes('profile') ||
    text.includes('security')
  ) {
    return {
      module: 'auth',
      label: 'Auth & Security',
      color: 'emerald',
    };
  }

  if (
    text.includes('editor') ||
    text.includes('visual') ||
    text.includes('design') ||
    text.includes('canvas') ||
    text.includes('template') ||
    text.includes('share')
  ) {
    return {
      module: 'studio',
      label: 'Content Studio',
      color: 'purple',
    };
  }

  if (
    text.includes('guide') ||
    text.includes('tour') ||
    text.includes('loom') ||
    text.includes('mobile') ||
    text.includes('basics') ||
    text.includes('slack') ||
    text.includes('teams') ||
    text.includes('email')
  ) {
    return {
      module: 'guides',
      label: 'Onboarding & Ops',
      color: 'amber',
    };
  }

  return {
    module: 'core',
    label: 'Core Infrastructure',
    color: 'slate',
  };
}

export function detectStatus(card: TrelloCard, lists: TrelloList[]): FeatureStatus {
  if (card.dueComplete) return 'done';
  const list = lists.find((l) => l.id === card.idList);
  if (!list) return 'in_progress';
  const name = list.name.toLowerCase();
  if (name.includes('done') || name.includes('complete') || name.includes('shipped')) {
    return 'done';
  }
  if (name.includes('review') || name.includes('qa') || name.includes('testing')) {
    return 'review';
  }
  if (name.includes('progress') || name.includes('inprogress') || name.includes('wip') || name.includes('active')) {
    return 'in_progress';
  }
  return 'backlog';
}

export function detectPriority(card: TrelloCard): FeaturePriority {
  // Check explicit labels first
  if (card.labels && card.labels.length > 0) {
    const labelTexts = card.labels.map((l) => l.name.toLowerCase());
    if (labelTexts.some((l) => l.includes('urgent') || l.includes('critical') || l.includes('p0'))) {
      return 'urgent';
    }
    if (labelTexts.some((l) => l.includes('high') || l.includes('p1'))) {
      return 'high';
    }
    if (labelTexts.some((l) => l.includes('medium') || l.includes('p2'))) {
      return 'medium';
    }
    if (labelTexts.some((l) => l.includes('low') || l.includes('normal') || l.includes('p3'))) {
      return 'low';
    }
  }

  const text = `${card.name} ${card.desc}`.toLowerCase();
  if (text.includes('urgent') || text.includes('critical') || text.includes('security') || text.includes('login')) {
    return 'urgent';
  }
  if (text.includes('automated') || text.includes('posting') || text.includes('editor') || text.includes('role')) {
    return 'high';
  }
  if (text.includes('profile') || text.includes('toggle') || text.includes('session')) {
    return 'medium';
  }
  return 'low';
}

export function enrichCard(card: TrelloCard, lists: TrelloList[], index?: number): EnrichedFeature {
  const mod = detectModule(card.name, card.desc);
  const titleInfo = formatCardTitle(card.name);
  const numId =
    card.idShort !== undefined
      ? card.idShort
      : index !== undefined
      ? index + 1
      : (Math.abs(card.id.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0)) % 90) + 10;
  const identifier = `BTP-${numId}`;

  return {
    ...card,
    identifier,
    cleanName: titleInfo.cleanName,
    videoUrl: titleInfo.videoUrl,
    module: mod.module,
    moduleLabel: mod.label,
    moduleColor: mod.color,
    status: detectStatus(card, lists),
    priority: detectPriority(card),
  };
}
