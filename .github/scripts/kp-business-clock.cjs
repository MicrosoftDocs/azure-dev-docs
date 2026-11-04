const {createHash} = require('node:crypto');

const PREFIX = '<!-- kp-business-clock:v1\n';
const BOT = 'github-actions[bot]';
const HOUR = 3600000;
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

function fingerprint(pr, managedLabels) {
  return createHash('sha256').update(JSON.stringify({
    title: pr.title, body: pr.body, head: pr.head.sha, base: pr.base.ref,
    draft: pr.draft, milestone: pr.milestone?.number,
    assignees: pr.assignees.map(item => item.login).sort(),
    reviewers: pr.requested_reviewers.map(item => item.login).sort(),
    teams: pr.requested_teams.map(item => item.id).sort(),
    labels: pr.labels.map(item => item.name).filter(name => !managedLabels.includes(name)).sort()
  })).digest('hex');
}

function readClock(comment) {
  const clock = JSON.parse(comment.body.slice(PREFIX.length).split('\n-->')[0]);
  if (!Number.isFinite(Date.parse(clock.activityAt)) ||
      !Number.isFinite(Date.parse(clock.observedAt)) ||
      !/^[a-f0-9]{64}$/.test(clock.fingerprint)) throw new Error('Invalid persisted KP clock');
  if (clock.commentIds !== undefined) validateCommentIdentities(clock.commentIds);
  if (clock.feedbackFingerprint !== undefined &&
      (typeof clock.feedbackFingerprint !== 'string' ||
       !/^[a-f0-9]{64}$/.test(clock.feedbackFingerprint))) throw new Error('Invalid persisted KP feedback revisions');
  if (clock.reminderFloor !== undefined && clock.reminderFloor !== null &&
      (!Number.isSafeInteger(clock.reminderFloor) || clock.reminderFloor < 0)) {
    throw new Error('Invalid persisted KP reminder boundary');
  }
  if (clock.confirmedActivityAt !== undefined && clock.confirmedActivityAt !== null &&
      (typeof clock.confirmedActivityAt !== 'string' ||
       !Number.isFinite(Date.parse(clock.confirmedActivityAt)))) {
    throw new Error('Invalid persisted KP confirmed activity');
  }
  if (clock.markerReset !== undefined) {
    const reset = clock.markerReset;
    if (!reset || !['createdAt,id', 'confirmed,createdAt,id'].includes(Object.keys(reset).sort().join(',')) ||
        (reset.confirmed !== undefined && reset.confirmed !== true) ||
        !Number.isSafeInteger(reset.id) || reset.id <= 0 ||
        typeof reset.createdAt !== 'string' ||
        !Number.isFinite(Date.parse(reset.createdAt))) throw new Error('Invalid persisted KP marker reset');
  }
  return clock;
}

function clockBody(clock, createdAt) {
  let visible = 'Created by PR Monitor bot for Ignite 2026 from the Knowledge Partnership team.';
  if (createdAt !== undefined) {
    if (typeof createdAt !== 'string' || !Number.isFinite(Date.parse(createdAt))) {
      throw new Error('Missing or invalid KP clock creation time');
    }
    const date = new Date(createdAt);
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

async function observeActivity(github, repo, pr, comment, comments, settings, now = Date.now) {
  const hash = fingerprint(pr, settings.managedLabels);
  const clock = comment ? readClock(comment) : {
    activityAt: pr.updated_at, fingerprint: hash
  };
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
    summaries.push({updated_at: record.lastEditedAt});
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
      summaries.push({updated_at: review.submittedAt}, {updated_at: review.lastEditedAt});
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
  const commentIds = commentIdentities(comments, reviews, settings);
  if (typeof now !== 'function' && !Number.isFinite(now)) throw new Error('Invalid comment observation time');
  let latest = clock.activityAt;
  let confirmed = clock.confirmedActivityAt ?? null;
  const confirm = time => {
    if (typeof time !== 'string' || !Number.isFinite(Date.parse(time))) {
      throw new Error('Invalid KP activity evidence');
    }
    if (confirmed === null || Date.parse(time) > Date.parse(confirmed)) confirmed = time;
  };
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
        JSON.stringify(commentIdentities(confirmedComments, confirmedReviews, settings))) {
      throw new Error(`KP feedback changed while confirming deletion on #${pr.number}; retry with fresh reads`);
    }
    const completedAt = typeof now === 'function' ? now() : now;
    if (!Number.isFinite(completedAt)) throw new Error('Invalid comment observation time');
    const observed = new Date(completedAt).toISOString();
    if (completedAt > Date.parse(latest)) latest = observed;
    confirm(observed);
    comments = confirmedComments;
    reviews = confirmedReviews;
  }
  let bookkeeping = false;
  for (const event of [...events, ...comments, ...reviews, ...summaries]) {
    if (event.event === 'committed') continue;
    const time = event.updated_at || event.created_at || event.submitted_at;
    if (!time) continue;
    const actor = event.actor?.login || event.user?.login;
    const ownLabel = ['labeled', 'unlabeled'].includes(event.event) &&
      [settings.event, ...settings.managedLabels].includes(event.label?.name);
    const ownComment = event.body?.startsWith(PREFIX) || event.body === settings.message;
    if (actor === BOT && (ownLabel || ownComment)) bookkeeping = true;
    else {
      confirm(time);
      if (Date.parse(time) > Date.parse(latest)) latest = time;
    }
  }
  // Fingerprints detect PR edits absent from timeline; bot timestamp skew is not activity.
  if (hash !== clock.fingerprint || (!comment && !bookkeeping)) {
    if (Date.parse(pr.updated_at) > Date.parse(latest)) latest = pr.updated_at;
  }
  if (hash !== clock.fingerprint) confirm(pr.updated_at);
  const feedbackChanged = clock.commentIds &&
    JSON.stringify(clock.commentIds) !== JSON.stringify(commentIds);
  const feedback = feedbackFingerprint(comments, reviews, settings);
  const edited = clock.feedbackFingerprint !== undefined && clock.feedbackFingerprint !== feedback;
  const changed = Boolean(comment) && (feedbackChanged || edited || hash !== clock.fingerprint);
  const reminders = reminderComments(comments, settings);
  const floor = reminders.reduce((last, item) => Math.max(last, item.id), 0);
  let reminderFloor = clock.reminderFloor;
  if (changed || (comment && confirmed &&
      Date.parse(confirmed) > Date.parse(clock.confirmedActivityAt ?? clock.activityAt))) {
    reminderFloor = floor;
  } else if (reminderFloor === undefined) {
    if (!reminders.length) reminderFloor = 0;
    else if (comment && reminders.some(item => item.id > comment.id &&
        Date.parse(item.created_at) > Date.parse(clock.activityAt))) reminderFloor = 0;
    else if (confirmed && reminders.every(item =>
        Date.parse(confirmed) > Date.parse(item.created_at))) reminderFloor = floor;
    else reminderFloor = null;
  }
  const result = {activityAt: latest, confirmedActivityAt: confirmed,
    fingerprint: hash, feedbackFingerprint: feedback, commentIds, reminderFloor};
  if (clock.markerReset) result.markerReset = clock.markerReset;
  return {clock: result, events, changed};
}

async function activity(...args) {
  return (await observeActivity(...args)).clock;
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
      (item.body?.startsWith(PREFIX) || item.body === settings.message))).map(item => item.id)
      .sort((left, right) => left - right);
  }
  validateCommentIdentities(result);
  return result;
}

function feedbackFingerprint(comments, reviews, settings) {
  const evidence = [comments, reviews].map(entries => entries.filter(item =>
    !(item.user?.login === BOT && (item.body?.startsWith(PREFIX) || item.body === settings.message)))
    .sort((left, right) => left.id - right.id)
    .map(item => [item.id, item.body ?? null, item.created_at ?? null, item.updated_at ?? null]));
  return createHash('sha256').update(JSON.stringify(evidence)).digest('hex');
}

function sameActivity(left, right) {
  return left.activityAt === right.activityAt &&
    left.confirmedActivityAt === right.confirmedActivityAt &&
    left.fingerprint === right.fingerprint &&
    left.feedbackFingerprint === right.feedbackFingerprint &&
    left.reminderFloor === right.reminderFloor &&
    JSON.stringify(left.commentIds) === JSON.stringify(right.commentIds);
}

function reminderComments(comments, settings) {
  const reminders = comments.filter(item => item.user?.login === BOT && item.body === settings.message);
  for (const item of reminders) {
    if (!Number.isSafeInteger(item.id) || item.id <= 0 || typeof item.created_at !== 'string' ||
        !Number.isFinite(Date.parse(item.created_at))) throw new Error('Invalid KP reminder delivery evidence');
  }
  return reminders;
}

function deliveredReminder(clock, comments, settings) {
  if (clock.reminderFloor === null) {
    throw new Error('Unknown KP reminder cycle: clock/delivery baseline missing; genuine activity or maintainer investigation required');
  }
  return reminderComments(comments, settings).filter(item => item.id > clock.reminderFloor &&
    Date.parse(item.created_at) >= Date.parse(clock.activityAt)).sort((a, b) => b.id - a.id)[0];
}

async function restoreDelivery({github, context, core, pr, comments, clock, settings, days, now}) {
  const checkedAt = typeof now === 'function' ? now() : now;
  const delivered = deliveredReminder(clock, comments, settings);
  if (!delivered) return false;
  const {data: definition} = await github.rest.issues.getLabel({...context.repo, name: settings.marker});
  if (definition?.name !== settings.marker) throw new Error('Missing KP delivery marker definition');
  const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: pr.number});
  const freshComments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: pr.number, per_page: 100
  });
  const current = await activity(github, context.repo, latest,
    selectClock(freshComments, core, pr.number), freshComments, settings, now);
  const freshDelivery = deliveredReminder(current, freshComments, settings);
  const has = name => latest.labels.some(item => item.name === name);
  if (latest.state !== 'open' || latest.draft || !has(settings.event) || has(settings.exempt) ||
      !isDue(current.activityAt, checkedAt, days) || !sameActivity(current, clock) ||
      freshDelivery?.id !== delivered.id || freshDelivery.created_at !== delivered.created_at) {
    core.info(`Deferred KP delivery recovery on #${pr.number}: activity, scope or delivery changed.`);
    return true;
  }
  if (!has(settings.marker)) {
    await github.rest.issues.addLabels({...context.repo, issue_number: pr.number, labels: [settings.marker]});
    const {data: verified} = await github.rest.pulls.get({...context.repo, pull_number: pr.number});
    if (!verified.labels.some(item => item.name === settings.marker)) {
      throw new Error(`KP delivery marker not confirmed on #${pr.number}`);
    }
  }
  core.info(`Recovered KP delivery marker on #${pr.number} from reminder comment ${delivered.id}; no repost.`);
  return true;
}

async function initialize({github, context, core, pr, eventLabel, managedLabels}) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: pr.number, per_page: 100
  });
  const existing = selectClock(comments, core, pr.number);
  if (existing) {
    await saveClock(github, context.repo, core, pr, existing, readClock(existing));
    return;
  }
  if (!Number.isFinite(Date.parse(pr.updated_at)) ||
      !eventLabel || managedLabels.some(label => !label)) throw new Error('Invalid enrollment clock settings');
  const enrolled = {...pr, labels: [...pr.labels, {name: eventLabel}]};
  const clock = {activityAt: pr.updated_at, confirmedActivityAt: null,
    fingerprint: fingerprint(enrolled, managedLabels),
    observedAt: pr.updated_at};
  await saveClock(github, context.repo, core, pr, undefined, clock);
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
  const unchanged = previous && sameActivity(previous, clock) &&
    JSON.stringify(previous.markerReset) === JSON.stringify(clock.markerReset);
  const state = unchanged ? previous : {...clock, observedAt: pr.updated_at};
  if (comment && (typeof comment.created_at !== 'string' ||
      !Number.isFinite(Date.parse(comment.created_at)))) {
    throw new Error('Missing or invalid KP clock creation time');
  }
  const body = clockBody(state, comment?.created_at);
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
    return (await github.rest.issues.updateComment({
      ...repo, comment_id: created.id, body: clockBody(state, created.created_at)
    })).data;
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

function markerEvent(events, name) {
  const additions = events.filter(event => event.event === 'labeled' && event.label?.name === name);
  for (const event of additions) {
    if (!Number.isSafeInteger(event.id) || event.id <= 0 ||
        typeof event.created_at !== 'string' ||
        !Number.isFinite(Date.parse(event.created_at))) throw new Error('Invalid KP marker event');
  }
  additions.sort((left, right) =>
    Date.parse(right.created_at) - Date.parse(left.created_at) || right.id - left.id);
  const event = additions[0];
  return event && {id: event.id, createdAt: event.created_at};
}

async function removeLabel(github, repo, core, number, name) {
  try {
    await github.rest.issues.removeLabel({...repo, issue_number: number, name});
  } catch (error) {
    if (error.status !== 404) throw error;
    await github.rest.issues.getLabel({...repo, name});
    const {data: latest} = await github.rest.pulls.get({...repo, pull_number: number});
    if (latest.labels.some(label => label.name === name)) throw error;
    core.info(`KP label ${name} was already removed from #${number}.`);
  }
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
      const {data: pr} = await github.rest.pulls.get({
        ...context.repo, pull_number: candidate.number
      });
      if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) continue;
      const comments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: pr.number, per_page: 100
      });
      let comment = selectClock(comments, core, pr.number);
      const observation = await observeActivity(github, context.repo, pr, comment, comments, settings, now);
      const clock = observation.clock;
      const has = label => pr.labels.some(item => item.name === label);
      const marker = has(settings.marker) && markerEvent(observation.events, settings.marker);
      if (has(settings.marker) && !marker) throw new Error(`Missing KP marker event on #${pr.number}`);
      if (marker && (observation.changed ||
          (clock.confirmedActivityAt && Date.parse(clock.confirmedActivityAt) > Date.parse(marker.createdAt)) ||
          (clock.markerReset?.confirmed === true && clock.markerReset.id === marker.id &&
           clock.markerReset.createdAt === marker.createdAt))) {
        // Persist the generation-bound intent before removals so partial failures can retry.
        if (observation.changed || (clock.confirmedActivityAt &&
            Date.parse(clock.confirmedActivityAt) > Date.parse(marker.createdAt))) {
          clock.reminderFloor = reminderComments(comments, settings).reduce((last, item) =>
            Math.max(last, item.id), 0);
        }
        clock.markerReset = {...marker, confirmed: true};
        await saveClock(github, context.repo, core, pr, comment, clock);
        const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: pr.number});
        const currentComments = await github.paginate(github.rest.issues.listComments, {
          ...context.repo, issue_number: pr.number, per_page: 100
        });
        const current = await observeActivity(github, context.repo, latest,
          selectClock(currentComments, core, pr.number), currentComments, settings, now);
        const currentMarker = markerEvent(current.events, settings.marker);
        if (latest.state !== 'open' || !latest.labels.some(label => label.name === settings.event) ||
            !latest.labels.some(label => label.name === settings.marker) ||
            currentMarker?.id !== marker.id || currentMarker.createdAt !== marker.createdAt ||
            !sameActivity(current.clock, clock)) {
          core.info(`Deferred KP marker reset on #${pr.number}: activity, scope or marker generation changed.`);
          continue;
        }
        if (latest.labels.some(label => label.name === settings.due)) {
          await removeLabel(github, context.repo, core, pr.number, settings.due);
        }
        const {data: beforeRemoval} = await github.rest.pulls.get({...context.repo, pull_number: pr.number});
        const events = await github.paginate(github.rest.issues.listEventsForTimeline, {
          ...context.repo, issue_number: pr.number, per_page: 100
        });
        const beforeMarker = markerEvent(events, settings.marker);
        if (beforeRemoval.state !== 'open' ||
            !beforeRemoval.labels.some(label => label.name === settings.event) ||
            beforeMarker?.id !== marker.id || beforeMarker.createdAt !== marker.createdAt ||
            fingerprint(beforeRemoval, settings.managedLabels) !== clock.fingerprint) {
          core.info(`Deferred KP marker removal on #${pr.number}: scope, activity or generation changed.`);
          continue;
        }
        await removeLabel(github, context.repo, core, pr.number, settings.marker);
        core.info(`Re-armed KP reminder cycle on #${pr.number}; historical reminder comments retained.`);
        continue;
      }
      delete clock.markerReset;
      comment = await saveClock(github, context.repo, core, pr, comment, clock);
      // Stock stale still posts reminders; only genuine activity can re-arm a marker.
      const due = pr.base.ref.startsWith(settings.branchPrefix) &&
        !pr.draft && !has(settings.exempt) && isDue(clock.activityAt, checkedAt, days) &&
        (has(settings.due) || !has(settings.marker));
      if (due && !has(settings.marker) && await restoreDelivery({
        github, context, core, pr, comments, clock, settings, days, now
      })) continue;
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
  const clock = await activity(github, context.repo, pr, comment, comments, settings, now);
  const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: number});
  const has = label => latest.labels.some(item => item.name === label);
  const stable = latest.updated_at === pr.updated_at &&
    latest.comments === pr.comments && latest.review_comments === pr.review_comments &&
    fingerprint(latest, settings.managedLabels) === fingerprint(pr, settings.managedLabels);
  if (!stable) {
    core.info(`Skipped reminder for #${number} because activity changed during validation; no bookkeeping written.`);
    return false;
  }
  const freshComments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const current = await activity(github, context.repo, latest,
    selectClock(freshComments, core, number), freshComments, settings, now);
  if (!sameActivity(current, clock)) {
    core.info(`Skipped reminder for #${number}: feedback/activity changed during validation; no bookkeeping written.`);
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
    let validated = {pr: latest, comments: freshComments, clock: current};
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
      const finalClock = await activity(github, context.repo, finalPR, selected, finalComments, settings, now);
      const finalHas = label => finalPR.labels.some(item => item.name === label);
      if (finalPR.state !== 'open' || finalPR.draft || !finalHas(settings.event) ||
          !finalHas(settings.due) || finalHas(settings.marker) || finalHas(settings.exempt) ||
          !finalPR.base.ref.startsWith(settings.branchPrefix) ||
          finalPR.comments !== latest.comments || finalPR.review_comments !== latest.review_comments ||
          !sameActivity(finalClock, clock)) {
        core.info(`Skipped reminder for #${number}: activity or eligibility changed during bookkeeping.`);
        return false;
      }
      validated = {pr: finalPR, comments: finalComments, clock: finalClock};
    }
    if (await restoreDelivery({github, context, core, ...validated, settings, days, now})) return false;
  }
  return due;
}

module.exports = {isDue, fingerprint, readClock, activity, reconcile, canPost, initialize, PREFIX};
