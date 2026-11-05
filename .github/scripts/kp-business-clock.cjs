const {createHash} = require('node:crypto');

const PREFIX = '<!-- kp-business-clock:v1\n';
const BOT = 'github-actions[bot]';
const HOUR = 3600000;
const OVERLAP = 5 * 60000;
const FEEDBACK = Symbol('complete feedback snapshot');
class UncertainActivity extends Error {}
const ACTIVITY_EVENTS = new Set([
  'commented', 'reviewed', 'renamed', 'assigned', 'unassigned', 'labeled', 'unlabeled',
  'milestoned', 'demilestoned', 'review_requested', 'review_request_removed', 'review_dismissed',
  'ready_for_review', 'convert_to_draft', 'base_ref_changed', 'head_ref_force_pushed',
  'head_ref_deleted', 'head_ref_restored', 'closed', 'reopened', 'merged', 'referenced',
  'cross-referenced', 'connected', 'disconnected', 'locked', 'unlocked', 'added_to_project',
  'moved_columns_in_project', 'removed_from_project', 'auto_merge_enabled', 'auto_merge_disabled',
  'auto_squash_enabled', 'auto_rebase_enabled', 'pinned', 'unpinned', 'edited'
]);
const DEFAULT_MESSAGE = '### Knowledge Partnership - Author action needed\n\n<br>\n\n' +
  'Thanks for your work on this pull request. Comments may need your attention, or your branch may need to be synced with its target branch. Please check the latest comments and validation results and update the PR as needed. If anything is unclear, let us know in the PR, and we will help identify the best next step.\n\n' +
  '**Need help?** Visit [Knowledge Partnership support](https://aka.ms/kp-support).';
const weekday = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', weekday: 'short'
});

function isDue(activityAt, now, days) {
  let remaining = days * 24 * HOUR;
  let cursor = Date.parse(activityAt);
  if (!Number.isFinite(cursor) || !Number.isFinite(now) ||
      !Number.isInteger(days) || days < 0) throw new Error('Invalid business clock settings');
  // Los Angeles weekday boundaries and DST transitions fall on UTC hour boundaries.
  while (cursor < now && remaining > 0) {
    const next = Math.min(now, (Math.floor(cursor / HOUR) + 1) * HOUR);
    if (!['Sat', 'Sun'].includes(weekday.format(cursor))) remaining -= next - cursor;
    cursor = next;
  }
  return remaining <= 0;
}

function fingerprint(pr, managedLabels, eventLabel) {
  return createHash('sha256').update(JSON.stringify({
    title: pr.title, body: pr.body, head: pr.head.sha, base: pr.base.ref,
    draft: pr.draft, milestone: pr.milestone?.number,
    assignees: pr.assignees.map(item => item.login).sort(),
    reviewers: pr.requested_reviewers.map(item => item.login).sort(),
    teams: pr.requested_teams.map(item => item.id).sort(),
    labels: pr.labels.map(item => item.name)
      .filter(name => name !== eventLabel && !managedLabels.includes(name)).sort()
  })).digest('hex');
}

function readClock(comment) {
  const clock = JSON.parse(comment.body.slice(PREFIX.length).split('\n-->')[0]);
  if (!Number.isFinite(Date.parse(clock.activityAt)) ||
      !Number.isFinite(Date.parse(clock.observedAt)) ||
      !/^[a-f0-9]{64}$/.test(clock.fingerprint)) throw new Error('Invalid persisted KP clock');
  if (clock.commentIds !== undefined) validateCommentIdentities(clock.commentIds);
  if (clock.lastReviewedAt !== undefined && !Number.isFinite(Date.parse(clock.lastReviewedAt))) {
    throw new Error('Invalid persisted KP review checkpoint');
  }
  return clock;
}

function clockBody(clock) {
  let visible = 'Created by PR Monitor bot for Ignite 2026 from the Knowledge Partnership team.';
  {
    const date = new Date(clock.activityAt);
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      timeZoneName: 'short'
    }).formatToParts(date).map(part => [part.type, part.value]));
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', timeZoneName: 'longOffset'
    }).formatToParts(date).find(part => part.type === 'timeZoneName').value.replace('GMT', 'UTC');
    visible += `\n3 day clock started on ${parts.year}-${parts.month}-${parts.day} ` +
      `${parts.hour}:${parts.minute}:${parts.second} ${parts.timeZoneName} (${offset})`;
  }
  return PREFIX + JSON.stringify(clock) + '\n-->\n' + visible;
}

async function activity(github, repo, pr, comment, comments, settings, now = Date.now) {
  const startedAt = typeof now === 'function' ? now() : now;
  if (!Number.isFinite(startedAt)) throw new Error('Invalid KP review start');
  const hash = fingerprint(pr, settings.managedLabels, settings.event);
  const clock = comment ? readClock(comment) : {
    activityAt: pr.updated_at, fingerprint: hash
  };
  if (clock.lastReviewedAt && Date.parse(clock.lastReviewedAt) > startedAt) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: review checkpoint is in the future`);
  }
  const since = clock.lastReviewedAt ? Date.parse(clock.lastReviewedAt) - OVERLAP : -Infinity;
  if (!Number.isFinite(Date.parse(clock.activityAt))) throw new Error('Missing PR update time');
  const summaries = [];
  let after = null;
  const cursors = new Set();
  do {
    const edited = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!,$after:String) {
      repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
        lastEditedAt reviews(first:100,after:$after) {
          nodes { submittedAt lastEditedAt } pageInfo { hasNextPage endCursor }
        }
      } }
    }`, {...repo, number: pr.number, after});
    const record = edited.repository?.pullRequest;
    if (!record || (record.lastEditedAt !== null && !Number.isFinite(Date.parse(record.lastEditedAt)))) {
      throw new Error(`Missing or invalid server PR edit time on #${pr.number}`);
    }
    if (record.lastEditedAt !== null) summaries.push({updated_at: record.lastEditedAt});
    const connection = record.reviews;
    if (!Array.isArray(connection?.nodes) || typeof connection.pageInfo?.hasNextPage !== 'boolean') {
      throw new Error(`Missing review-summary activity on #${pr.number}`);
    }
    for (const review of connection.nodes) {
      if (review.submittedAt === null) continue;
      if (!Number.isFinite(Date.parse(review.submittedAt)) ||
          (review.lastEditedAt !== null && !Number.isFinite(Date.parse(review.lastEditedAt)))) {
        throw new Error(`Invalid review-summary time on #${pr.number}`);
      }
      summaries.push({updated_at: review.submittedAt});
      if (review.lastEditedAt !== null) summaries.push({updated_at: review.lastEditedAt});
    }
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
    if (typeof after !== 'string' || !after || cursors.has(after)) {
      throw new Error(`Invalid review-summary pagination on #${pr.number}`);
    }
    cursors.add(after);
  } while (true);
  const events = await github.paginate(github.rest.issues.listEventsForTimeline, {
    ...repo, issue_number: pr.number, per_page: 100
  });
  let reviews = await github.paginate(github.rest.pulls.listReviewComments, {
    ...repo, pull_number: pr.number, per_page: 100
  });
  if (!Number.isSafeInteger(pr.comments) || !Number.isSafeInteger(pr.review_comments) ||
      pr.comments !== comments.length || pr.review_comments !== reviews.length) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback counts disagree with complete reads`);
  }
  const commentIds = commentIdentities(comments, reviews, settings);
  let latest = clock.activityAt;
  if (clock.commentIds && ['issue', 'review'].some(kind => {
    const current = new Set(commentIds[kind]);
    return clock.commentIds[kind].some(id => !current.has(id));
  })) {
    const confirmedComments = await github.paginate(github.rest.issues.listComments, {
      ...repo, issue_number: pr.number, per_page: 100
    });
    const confirmedReviews = await github.paginate(github.rest.pulls.listReviewComments, {
      ...repo, pull_number: pr.number, per_page: 100
    });
    if (JSON.stringify(commentIds) !==
        JSON.stringify(commentIdentities(confirmedComments, confirmedReviews, settings)) ||
        confirmedComments.length !== pr.comments || confirmedReviews.length !== pr.review_comments) {
      throw new Error(`KP feedback changed while confirming deletion on #${pr.number}; retry with fresh reads`);
    }
    const completedAt = typeof now === 'function' ? now() : now;
    if (!Number.isFinite(completedAt)) throw new Error('Invalid comment observation time');
    if (completedAt > Date.parse(latest)) latest = new Date(completedAt).toISOString();
    comments = confirmedComments;
    reviews = confirmedReviews;
  }
  let bookkeepingAt = -Infinity;
  let membershipWrite = false;
  let metadataObscured = false;
  for (const event of [...events, ...comments, ...reviews, ...summaries]) {
    if (event.event === 'committed') continue;
    if (['mentioned', 'subscribed'].includes(event.event)) {
      if (Date.parse(event.created_at) > Date.parse(clock.observedAt || clock.activityAt)) metadataObscured = true;
      continue;
    }
    if (event.event && !ACTIVITY_EVENTS.has(event.event)) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: unsupported timeline event ${event.event}`);
    }
    const time = event.updated_at || event.created_at || event.submitted_at;
    if (!time) throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback time is missing`);
    const actor = event.actor?.login || event.user?.login;
    const ownLabel = ['labeled', 'unlabeled'].includes(event.event) &&
      [settings.event, ...settings.managedLabels].includes(event.label?.name);
    const ownComment = event.body?.startsWith(PREFIX) || isReminder(event.body, settings);
    const timestamp = Date.parse(time);
    if (actor === BOT && (ownLabel || ownComment)) {
      if (!Number.isFinite(timestamp)) throw new Error('Invalid KP bookkeeping time');
      bookkeepingAt = Math.max(bookkeepingAt, timestamp);
      if (timestamp > Date.parse(clock.observedAt || clock.activityAt)) metadataObscured = true;
      if (ownLabel && event.label.name === settings.event) membershipWrite = true;
    } else {
      if (!Number.isFinite(timestamp) || timestamp > startedAt) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid or future feedback time`);
      }
      if (timestamp >= since && timestamp > Date.parse(latest)) latest = time;
    }
  }
  // Recognize legacy hashes only when the current metadata can reproduce them.
  const legacy = fingerprint(pr, settings.managedLabels) === clock.fingerprint ||
    (membershipWrite && fingerprint({...pr, labels: pr.labels.some(label => label.name === settings.event)
      ? pr.labels.filter(label => label.name !== settings.event)
      : [...pr.labels, {name: settings.event}]}, settings.managedLabels) === clock.fingerprint);
  if (hash !== clock.fingerprint && !legacy) {
    const updatedAt = Date.parse(pr.updated_at);
    if (!Number.isFinite(updatedAt) || updatedAt > startedAt ||
        (updatedAt > Date.parse(latest) && (metadataObscured || bookkeepingAt >= updatedAt))) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: metadata changed but its time is obscured by KP bookkeeping`);
    }
    if (updatedAt > Date.parse(latest)) latest = pr.updated_at;
  }
  return {activityAt: latest, fingerprint: hash, commentIds,
    lastReviewedAt: new Date(startedAt).toISOString(),
    [FEEDBACK]: JSON.stringify([feedback(comments, settings), feedback(reviews, settings), summaries])};
}

function feedback(entries, settings) {
  return entries.filter(item => !(item.user?.login === BOT &&
    (item.body?.startsWith(PREFIX) || isReminder(item.body, settings))))
    .map(item => [item.id, item.body, item.created_at, item.updated_at])
    .sort((left, right) => left[0] - right[0]);
}

async function review(github, repo, core, pr, comment, comments, settings, now,
  startedAt = typeof now === 'function' ? now() : now) {
  try {
    return await readReview(github, repo, core, pr, comment, comments, settings, now, startedAt);
  } catch (error) {
    if (!(error instanceof UncertainActivity)) throw error;
    core.info(`${error.message}; skipped without advancing the clock/checkpoint or authorizing a reminder.`);
    return null;
  }
}

async function readReview(github, repo, core, pr, comment, comments, settings, now, startedAt) {
  const clock = await activity(github, repo, pr, comment, comments, settings, now);
  const {data: latest} = await github.rest.pulls.get({...repo, pull_number: pr.number});
  const finalComments = await github.paginate(github.rest.issues.listComments, {
    ...repo, issue_number: pr.number, per_page: 100
  });
  const selected = selectClock(finalComments, core, pr.number);
  if (selected?.id !== comment?.id || selected?.body !== comment?.body ||
      latest.state !== pr.state || latest.updated_at !== pr.updated_at ||
      latest.comments !== pr.comments || latest.review_comments !== pr.review_comments ||
      fingerprint(latest, settings.managedLabels, settings.event) !==
        fingerprint(pr, settings.managedLabels, settings.event) ||
      JSON.stringify(latest.labels.map(label => label.name).sort()) !==
        JSON.stringify(pr.labels.map(label => label.name).sort())) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: PR or clock changed during review`);
  }
  const seed = {...clock, observedAt: pr.updated_at,
    lastReviewedAt: comment && readClock(comment).lastReviewedAt};
  const confirmed = await activity(github, repo, latest,
    {...comment, body: clockBody(seed)}, finalComments, settings, now);
  if (confirmed.activityAt !== clock.activityAt || confirmed[FEEDBACK] !== clock[FEEDBACK] ||
      JSON.stringify(confirmed.commentIds) !== JSON.stringify(clock.commentIds)) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback changed during review`);
  }
  return {...clock, lastReviewedAt: new Date(startedAt).toISOString()};
}

function validateCommentIdentities(value) {
  if (!value || typeof value !== 'object' ||
      Object.keys(value).sort().join(',') !== 'issue,review' ||
      !['issue', 'review'].every(kind => Array.isArray(value[kind]) &&
        value[kind].every((id, index, ids) => Number.isSafeInteger(id) && id > 0 &&
          (index === 0 || id > ids[index - 1])))) {
    throw new Error('Invalid persisted KP comment identities');
  }
}

function commentIdentities(comments, reviews, settings) {
  const result = {};
  for (const [kind, entries] of [['issue', comments], ['review', reviews]]) {
    if (!Array.isArray(entries)) throw new Error('Missing paginated KP comments');
    result[kind] = entries.filter(item => !(item.user?.login === BOT &&
      (item.body?.startsWith(PREFIX) || isReminder(item.body, settings)))).map(item => item.id)
      .sort((left, right) => left - right);
  }
  validateCommentIdentities(result);
  return result;
}

async function initialize({github, context, core, pr, eventLabel, managedLabels, now = Date.now}) {
  const startedAt = typeof now === 'function' ? now() : now;
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: pr.number, per_page: 100
  });
  const existing = selectClock(comments, core, pr.number);
  if (!Number.isFinite(Date.parse(pr.updated_at)) ||
      !eventLabel || managedLabels.some(label => !label)) throw new Error('Invalid enrollment clock settings');
  const settings = {event: eventLabel, managedLabels,
    message: process.env.AUTHOR_REMINDER_MESSAGE || DEFAULT_MESSAGE};
  const clock = await review(github, context.repo, core, pr, existing, comments, settings, now, startedAt);
  if (!clock) throw new Error(`Skipped KP enrollment on #${pr.number}: activity review is uncertain`);
  await saveClock(github, context.repo, core, pr, existing, {...clock, observedAt: pr.updated_at});
  core.info(`Preserved pre-enrollment activity for #${pr.number}.`);
}

function selectClock(comments, core, number) {
  const clocks = comments.filter(item =>
    item.user?.login === BOT && item.body?.startsWith(PREFIX));
  const ids = new Set();
  for (const comment of clocks) {
    readClock(comment);
    if (!Number.isSafeInteger(comment.id) || comment.id <= 0 || ids.has(comment.id)) {
      throw new Error(`Invalid KP clock comment identity on #${number}`);
    }
    ids.add(comment.id);
  }
  clocks.sort((left, right) => left.id - right.id);
  if (clocks.length > 1) {
    core.info(`Concurrent KP initialization on #${number}; using oldest clock comment ${clocks[0].id}.`);
  }
  return clocks[0];
}

async function saveClock(github, repo, core, pr, comment, clock) {
  const previous = comment && readClock(comment);
  const unchanged = previous && previous.activityAt === clock.activityAt &&
    previous.fingerprint === clock.fingerprint &&
    previous.lastReviewedAt === clock.lastReviewedAt &&
    JSON.stringify(previous.commentIds) === JSON.stringify(clock.commentIds);
  const state = unchanged ? previous : {...previous, ...clock, observedAt: pr.updated_at};
  if (comment && (typeof comment.created_at !== 'string' ||
      !Number.isFinite(Date.parse(comment.created_at)))) {
    throw new Error('Missing or invalid KP clock creation time');
  }
  const body = clockBody(state);
  if (unchanged && comment.body === body) return comment;
  const response = comment
    ? await github.rest.issues.updateComment({...repo, comment_id: comment.id, body})
    : await github.rest.issues.createComment({...repo, issue_number: pr.number, body});
  core.info(`Recorded business-day activity clock for #${pr.number}.`);
  if (!comment) {
    const created = response.data;
    if (!Number.isSafeInteger(created?.id) || created.id <= 0 ||
        typeof created.created_at !== 'string' || !Number.isFinite(Date.parse(created.created_at))) {
      throw new Error('Missing or invalid created KP clock identity/time');
    }
    return created;
  }
  return response.data;
}

function configuration() {
  const settings = {
    event: process.env.EVENT_LABEL,
    due: process.env.REMINDER_DUE_LABEL,
    marker: process.env.AUTHOR_REMINDER_LABEL,
    exempt: process.env.EXEMPT_LABEL,
    message: process.env.AUTHOR_REMINDER_MESSAGE,
    branchPrefix: process.env.ROLLOUT_BRANCH_PREFIX
  };
  settings.managedLabels = [settings.due, settings.marker];
  const days = Number(process.env.INACTIVITY_DAYS);
  if (!Object.values(settings).every(value => value?.length) ||
      !Number.isInteger(days) || days < 0) {
    throw new Error('Invalid KP business clock settings');
  }
  return {settings, days};
}

async function reconcile({github, context, core, now = Date.now}) {
  const {settings, days} = configuration();
  const checkedAt = typeof now === 'function' ? now() : now;
  // Label definitions remain manually managed. Fail before changing any PR.
  await github.rest.issues.getLabel({...context.repo, name: settings.due});
  for await (const page of github.paginate.iterator(github.rest.pulls.list, {
    ...context.repo, state: 'open', per_page: 100
  })) {
    for (const candidate of page.data) {
      if (!candidate.labels.some(label => label.name === settings.event)) continue;
      const startedAt = typeof now === 'function' ? now() : now;
      const {data: pr} = await github.rest.pulls.get({
        ...context.repo, pull_number: candidate.number
      });
      if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) continue;
      const comments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: pr.number, per_page: 100
      });
      let comment = selectClock(comments, core, pr.number);
      let clock = await review(github, context.repo, core, pr, comment, comments, settings, now, startedAt);
      if (!clock) continue;
      comment = await saveClock(github, context.repo, core, pr, comment, clock);
      const has = label => pr.labels.some(item => item.name === label);
      // Never touch a marker here. Stock stale owns posting and cleanup.
      const due = pr.base.ref.startsWith(settings.branchPrefix) &&
        !pr.draft && !has(settings.exempt) && isDue(clock.activityAt, checkedAt, days) &&
        (has(settings.due) || !has(settings.marker));
      if (due && !has(settings.due)) {
        await github.rest.issues.addLabels({
          ...context.repo, issue_number: pr.number, labels: [settings.due]
        });
      } else if (!due && has(settings.due)) {
        await github.rest.issues.removeLabel({
          ...context.repo, issue_number: pr.number, name: settings.due
        });
      }
    }
  }
}


async function canPost({github, context, core, number, now = Date.now}) {
  const {settings, days} = configuration();
  const checkedAt = typeof now === 'function' ? now() : now;
  const {data: pr} = await github.rest.pulls.get({...context.repo, pull_number: number});
  if (pr.state !== 'open') {
    core.info(`Skipping reminder for closed PR #${number}.`);
    return false;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const comment = selectClock(comments, core, number);
  if (!comment) throw new Error(`Expected one KP clock before posting on #${number}`);
  const clock = await review(github, context.repo, core, pr, comment, comments, settings, now, checkedAt);
  if (!clock) return false;
  const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: number});
  const has = label => latest.labels.some(item => item.name === label);
  const stable = latest.updated_at === pr.updated_at &&
    latest.comments === pr.comments && latest.review_comments === pr.review_comments &&
    fingerprint(latest, settings.managedLabels, settings.event) ===
      fingerprint(pr, settings.managedLabels, settings.event);
  if (!stable) {
    core.info(`Skipped reminder for #${number} because activity changed during validation; no bookkeeping written.`);
    return false;
  }
  const due = latest.state === 'open' && !latest.draft &&
    latest.base.ref.startsWith(settings.branchPrefix) &&
    has(settings.event) && has(settings.due) && !has(settings.marker) &&
    !has(settings.exempt) && isDue(clock.activityAt, checkedAt, days);
  if (!due) {
    if (latest.state === 'open' && has(settings.due)) {
      await saveClock(github, context.repo, core, pr, comment, clock);
      await github.rest.issues.removeLabel({
        ...context.repo, issue_number: number, name: settings.due
      });
    }
    core.info(`Skipped reminder for #${number} after fresh activity/eligibility checks.`);
  }
  if (due) {
    const saved = await saveClock(github, context.repo, core, pr, comment, clock);
    if (saved !== comment) {
      const {data: finalPR} = await github.rest.pulls.get({...context.repo, pull_number: number});
      const finalComments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: number, per_page: 100
      });
      const selected = selectClock(finalComments, core, number);
      if (!selected || selected.id !== saved.id || selected.body !== saved.body) {
        core.info(`Skipped reminder for #${number}: clock changed during bookkeeping.`);
        return false;
      }
      const current = await review(github, context.repo, core, finalPR, selected, finalComments, settings, now);
      if (!current) return false;
      const finalHas = label => finalPR.labels.some(item => item.name === label);
      if (finalPR.state !== 'open' || finalPR.draft || !finalHas(settings.event) ||
          !finalHas(settings.due) || finalHas(settings.marker) || finalHas(settings.exempt) ||
          !finalPR.base.ref.startsWith(settings.branchPrefix) ||
          finalPR.comments !== latest.comments || finalPR.review_comments !== latest.review_comments ||
          current.activityAt !== clock.activityAt || current.fingerprint !== clock.fingerprint ||
          current[FEEDBACK] !== clock[FEEDBACK] ||
          JSON.stringify(current.commentIds) !== JSON.stringify(clock.commentIds) ||
          JSON.stringify(feedback(finalComments, settings)) !== JSON.stringify(feedback(comments, settings))) {
        core.info(`Skipped reminder for #${number}: activity or eligibility changed during bookkeeping.`);
        return false;
      }
    }
  }
  return due;
}

function isReminder(body, settings) {
  if (body === settings.message) return true;
  const mention = typeof body === 'string' && body.match(/^@([A-Za-z0-9][A-Za-z0-9_-]*(?:\[bot\])?)\n\n/);
  return Boolean(mention && body.slice(mention[0].length) === settings.message);
}

async function hasActivitySince({github, context, core, number, since, now = Date.now}) {
  const startedAt = typeof now === 'function' ? now() : now;
  if (!Number.isFinite(Date.parse(since))) {
    core.info(`Uncertain KP marker time on #${number}; skipped marker cleanup.`);
    return null;
  }
  const {settings} = configuration();
  const {data: pr} = await github.rest.pulls.get({...context.repo, pull_number: number});
  if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) {
    core.info(`Skipping KP marker cleanup outside current open membership on #${number}.`);
    return null;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const comment = selectClock(comments, core, number);
  if (!comment) throw new Error(`Expected one KP clock before marker cleanup on #${number}`);
  const clock = await review(github, context.repo, core, pr, comment, comments, settings, now, startedAt);
  return clock ? Date.parse(clock.activityAt) >= Date.parse(since) : null;
}

module.exports = {isDue, fingerprint, readClock, activity, reconcile, canPost, initialize,
  hasActivitySince, PREFIX};
