const test = require('node:test');
const assert = require('node:assert/strict');
const {isDue, reconcile, readClock, canPost: postingGate, PREFIX} = require('../scripts/kp-business-clock.cjs');

async function canPost(args) {
  if (typeof args.now === 'number' && args.github.advanceTo) {
    args.github.advanceTo(args.now);
    return postingGate({...args, now: args.github.time});
  }
  return postingGate(args);
}

test('72 elapsed Redmond weekday hours, not office hours or calendar-date counting', () => {
  const due = (start, end) => isDue(start, Date.parse(end), 3);
  // Friday noon PDT -> Wednesday noon PDT; the entire weekend is excluded.
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-26T19:00:00Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T18:59:59Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T19:00:00Z'), true);
  // UTC Saturday is still Friday evening in Redmond.
  assert.equal(due('2026-10-24T06:00:00Z', '2026-10-29T06:00:00Z'), true);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T06:59:59Z'), false);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T07:00:00Z'), true);
  // DST changes on the excluded Sunday: local deadline remains Wednesday noon.
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T18:59:59Z'), false);
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T19:00:00Z'), true);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T19:59:59Z'), false);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T20:00:00Z'), true);
  assert.equal(due('2026-10-28T19:00:00Z', '2026-10-27T19:00:00Z'), false);
  assert.throws(() => due('invalid', '2026-10-28T19:00:00Z'), /Invalid/);
  assert.throws(() => isDue('2026-10-23T19:00:00Z', Date.now(), -1), /Invalid/);
});

function fixture() {
  Object.assign(process.env, {
    EVENT_LABEL: 'kp-conference-event', REMINDER_DUE_LABEL: 'kp-reminder-due',
    AUTHOR_REMINDER_LABEL: 'kp-author-stalepr', EXEMPT_LABEL: 'keep-open',
    AUTHOR_REMINDER_MESSAGE: 'Existing author reminder', INACTIVITY_DAYS: '3',
    ROLLOUT_BRANCH_PREFIX: 'release-ignite26-'
  });
  let now = Date.parse('2026-10-26T19:00:00Z');
  const comments = [], events = [], reviews = [], writes = [];
  const pr = {number: 42, user: {login: 'pr-author'}, state: 'open', draft: false, title: 'Title', body: 'Body',
    head: {sha: 'abc'}, base: {ref: 'release-ignite26-test'},
    created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z', labels: [{name: 'kp-conference-event'}],
    assignees: [], requested_reviewers: [], requested_teams: []};
  let issueCount, reviewCount;
  Object.defineProperties(pr, {
    comments: {enumerable: true, get: () => issueCount ?? comments.length, set: value => {issueCount = value;}},
    review_comments: {enumerable: true, get: () => reviewCount ?? reviews.length, set: value => {reviewCount = value;}}
  });
  const stamp = () => new Date(now += 1000).toISOString();
  function label(name, add) {
    pr.labels = pr.labels.filter(item => item.name !== name);
    if (add) pr.labels.push({name});
    pr.updated_at = stamp();
    events.push({event: add ? 'labeled' : 'unlabeled', label: {name},
      actor: {login: 'github-actions[bot]'}, created_at: pr.updated_at});
    writes.push([add ? 'add' : 'remove', name]);
  }
  const get = async () => ({data: structuredClone(pr)});
  const endpoints = {
    list: () => {}, get,
    listComments: () => {}, listEventsForTimeline: () => {}, listReviewComments: () => {},
    getLabel: async () => ({data: {name: 'kp-reminder-due'}}),
    createComment: async ({body}) => {
      const comment = {id: comments.length + 1, body, user: {login: 'github-actions[bot]'},
        created_at: stamp()};
      comment.updated_at = comment.created_at;
      comments.push(comment); pr.updated_at = comment.updated_at;
      writes.push(['comment', body]);
      return {data: structuredClone(comment)};
    },
    updateComment: async ({comment_id, body}) => {
      const comment = comments.find(item => item.id === comment_id);
      comment.body = body; comment.updated_at = stamp(); pr.updated_at = comment.updated_at;
      writes.push(['update', body]);
      return {data: structuredClone(comment)};
    },
    addLabels: async ({labels}) => {for (const name of labels) label(name, true);},
    removeLabel: async ({name}) => label(name, false)
  };
  const paginate = async endpoint => structuredClone(
    endpoint === endpoints.listComments ? comments : endpoint === endpoints.listReviewComments ? reviews : events);
  paginate.iterator = async function* () {yield {data: [structuredClone(pr)]};};
  const github = {time: () => now, advanceTo: value => {now = Math.max(now, value);},
    graphql: async (query, params) => {
    assert.ok(query.includes('lastEditedAt'));
    assert.equal(params.owner, 'test');
    assert.equal(params.repo, 'repo');
    assert.equal(params.number, 42);
    return {repository: {pullRequest: {lastEditedAt: pr.lastEditedAt ?? null,
      reviews: {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}}}}};
  }, rest: {pulls: {list: endpoints.list, get, listReviewComments: endpoints.listReviewComments},
    issues: endpoints}, paginate};
  const run = () => reconcile({github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, now: () => now});
  return {pr, comments, events, reviews, writes, github, run, label,
    time: () => now,
    setTime: value => {now = Date.parse(value);},
    humanComment: () => {
      pr.updated_at = stamp();
      comments.push({id: comments.length + 1, body: 'Author activity',
        user: {login: 'author'}, created_at: pr.updated_at, updated_at: pr.updated_at});
    }};
}

test('initial clock creation needs one comment write and no identical follow-up PATCH', async () => {
  const f = fixture();
  await f.run();
  assert.equal(f.writes.filter(([kind]) => kind === 'comment').length, 1);
  assert.equal(f.writes.filter(([kind]) => kind === 'update').length, 0);
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
});

test('posting rejects an empty message before API reads or writes', async () => {
  const f = fixture();
  process.env.AUTHOR_REMINDER_MESSAGE = '';
  f.github.rest.pulls.get = async () => {throw new Error('Unexpected API read');};
  await assert.rejects(canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.github.time}), /Invalid KP business clock settings/);
  assert.deepEqual(f.writes, []);
});

test('mentioned and historical bot reminders retain bookkeeping without deliberate reposting', async () => {
  for (const mentioned of [false, true]) {
    const f = fixture();
    await f.run();
    const activityAt = readClock(f.comments[0]).activityAt;
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const body = (mentioned ? '@pr-author\n\n' : '') + process.env.AUTHOR_REMINDER_MESSAGE;
    await f.github.rest.issues.createComment({body});
    f.label('kp-author-stalepr', true);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), false);
    const identities = readClock(f.comments[0]).commentIds;
    assert.deepEqual(identities.issue, []);
    f.comments.splice(f.comments.findIndex(comment => comment.body === body), 1);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
  }
});

test('a human copy of the mentioned reminder remains genuine feedback activity', async () => {
  const f = fixture();
  await f.run();
  const observed = '2026-10-28T19:01:00Z';
  f.setTime(observed);
  f.pr.updated_at = observed;
  f.comments.push({id: 900, user: {login: 'pr-author'},
    body: `@pr-author\n\n${process.env.AUTHOR_REMINDER_MESSAGE}`,
    created_at: observed, updated_at: observed});
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, observed);
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
});

test('only the configured KP membership label enrolls reconciliation and posting', async () => {
  const legacy = fixture();
  legacy.pr.labels = [{name: 'conference-event'}];
  await legacy.run();
  assert.deepEqual(legacy.writes, []);
  await assert.rejects(canPost({github: legacy.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), /Expected one KP clock/);

  const current = fixture();
  await current.run();
  assert.ok(current.comments.some(comment => comment.body.startsWith(PREFIX)));
  current.setTime('2026-10-28T19:01:00Z');
  await current.run();
  assert.ok(current.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.equal(await canPost({github: current.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), true);
  current.pr.labels = [{name: 'conference-event'}, {name: 'kp-reminder-due'}];
  assert.equal(await canPost({github: current.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), false);
});

test('initialization, due bookkeeping, stock reminder, activity cleanup and reset', async () => {
  const f = fixture();
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), true);
  // Represent stock stale's comment-then-marker writes, not a custom commenter.
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  const count = f.writes.length;
  await f.run();
  assert.ok(f.writes.slice(count).every(([kind]) => kind === 'update'),
    'a successful review may persist only its separate checkpoint');
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  f.setTime('2026-10-29T20:00:00Z');
  f.humanComment();
  const activityAt = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-author-stalepr'), true);
  // The marker itself keeps the PR in stock stale's any-of label filter.
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  const resetWrites = f.writes.length;
  await f.run();
  assert.ok(f.writes.slice(resetWrites).every(([kind]) => kind === 'update'));
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
});

test('server-timed body/push/label changes reset; drafts/exemptions and absent membership never become due', async () => {
  for (const change of [
    f => {f.pr.body = 'Edited'; f.pr.lastEditedAt = '2026-10-27T21:00:00Z';},
    f => {
      f.pr.head.sha = 'def';
      f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human'},
        created_at: '2026-10-27T21:00:00Z'});
    },
    f => {
      f.pr.labels.push({name: 'human-label'});
      f.events.push({event: 'labeled', actor: {login: 'human'}, label: {name: 'human-label'},
        created_at: '2026-10-27T21:00:00Z'});
    }
  ]) {
    const f = fixture();
    await f.run();
    change(f); f.pr.updated_at = '2026-10-27T21:00:00Z';
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T21:00:00Z');
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
  for (const change of [
    f => {f.pr.draft = true;},
    f => {f.pr.labels.push({name: 'keep-open'});},
    f => {f.pr.labels = [];}
  ]) {
    const f = fixture(); change(f);
    f.setTime('2026-11-10T20:00:00Z');
    await f.run();
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
});

test('untrusted clocks ignored, invalid bot state and API failures fail explicitly', async () => {
  const f = fixture();
  f.comments.push({id: 99, body: PREFIX + '{}\n-->', user: {login: 'author'},
    created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
  await f.run();
  assert.equal(f.comments.length, 2);
  f.comments[1].body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  const g = fixture();
  g.github.rest.issues.getLabel = async () => {throw new Error('Missing required label');};
  await assert.rejects(g.run(), /Missing required label/);
  assert.equal(g.writes.length, 0);
  const h = fixture();
  await h.run();
  h.comments.push({...h.comments[0], id: 100, body: PREFIX + '{}\n-->'});
  await assert.rejects(h.run(), /Invalid persisted/);
});

test('recover activity before later bot writes, including edited old comments', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.setTime('2026-10-29T19:00:00Z');
  f.humanComment();
  const human = f.comments.at(-1);
  f.label('kp-author-stalepr', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  f.setTime('2026-10-30T19:00:00Z');
  human.updated_at = '2026-10-30T19:00:00Z';
  f.pr.updated_at = human.updated_at;
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
});

test('an existing marker without due is not disturbed to force a reminder', async () => {
  const f = fixture();
  f.pr.labels.push({name: 'kp-author-stalepr'});
  f.setTime('2026-11-10T20:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.writes.some(([kind]) => kind === 'add' || kind === 'remove'), false);
});

test('clock writes cannot hide racing author activity', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T18:00:00Z';
      f.pr.lastEditedAt = f.pr.updated_at;
      f.setTime('2026-10-27T19:00:00Z');
    }
    const original = f.github.rest.issues[method];
    let humanAt;
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      humanAt = f.pr.updated_at;
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(comment => comment.body.startsWith(PREFIX));
    assert.equal(readClock(clock).activityAt, humanAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting rereads activity and prevents stale eligibility from sending', async () => {
  for (const change of ['none', 'comment', 'push', 'body', 'draft', 'keep-open', 'retarget', 'during-read']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    if (change === 'comment') f.humanComment();
    if (change === 'push') f.pr.head.sha = 'new-commit';
    if (change === 'body') f.pr.body = 'New body';
    if (change === 'draft') f.pr.draft = true;
    if (change === 'keep-open') f.label('keep-open', true);
    if (change === 'retarget') f.pr.base.ref = 'main';
    if (change === 'during-read') {
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) f.humanComment();
        return get(args);
      };
    }
    const allowed = await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    });
    assert.equal(allowed, change === 'none', change);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
      ['none', 'during-read', 'push', 'body', 'draft', 'retarget'].includes(change), change);
  }
});

test('posting rejects activity racing clock creation and update in that same pass', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T19:00:00Z';
      f.pr.lastEditedAt = f.pr.updated_at;
    }
    f.setTime('2026-10-30T20:01:00Z');
    const original = f.github.rest.issues[method];
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T20:02:00Z')
    }), false);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting fails explicitly on missing/duplicate clocks and API errors', async () => {
  for (const problem of ['missing', 'duplicate', 'api']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    if (problem === 'missing') f.comments.length = 0;
    if (problem === 'duplicate') f.comments.push(structuredClone(f.comments[0]));
    if (problem === 'api') f.github.rest.pulls.get = async () => {throw Error('Read failed');};
    await assert.rejects(canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    }), problem === 'api' ? /Read failed/ : problem === 'duplicate' ? /Invalid KP clock comment identity/ : /Expected one KP clock/);
  }
});

test('posting detects same-second issue and review comment count changes', async () => {
  for (const field of ['comments', 'review_comments']) {
    for (const delta of [0, 1, -1]) {
      const f = fixture();
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      f.pr.comments = f.comments.length;
      f.pr.review_comments = f.reviews.length;
      const timestamp = f.pr.updated_at;
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) {
          f.pr[field] += delta;
          assert.equal(f.pr.updated_at, timestamp, 'the race must not rely on a new timestamp');
        }
        return get(args);
      };
      const allowed = await canPost({
        github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
      });
      assert.equal(allowed, delta === 0, field + ':' + delta);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
        'unstable snapshots must leave bookkeeping for the next reconciliation');
    }
  }
});

test('review replies and edited inline feedback survive later bookkeeping', async () => {
  for (const edited of [false, true]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const feedbackAt = '2026-10-28T19:01:00Z';
    f.reviews.push({id: 100, body: 'Review feedback', user: {login: 'reviewer'},
      created_at: edited ? '2026-10-23T19:00:00Z' : feedbackAt, updated_at: feedbackAt});
    f.label('kp-reminder-due', true);
    const seen = [];
    const paginate = f.github.paginate;
    const read = async (endpoint, args) => {
      if (endpoint === f.github.rest.pulls.listReviewComments) seen.push(args);
      return paginate(endpoint, args);
    };
    read.iterator = paginate.iterator;
    f.github.paginate = read;
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, feedbackAt);
    assert.ok(seen.length >= 2);
    assert.ok(seen.every(args => args.per_page === 100 && args.pull_number === 42));
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('enrollment preserves idle time before writing the event label', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  await initialize(args);
  f.label('kp-conference-event', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  const count = f.comments.length;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.length, count);
  const g = fixture();
  g.github.rest.issues.createComment = async () => {throw Error('Clock write denied');};
  await assert.rejects(initialize({...args, github: g.github, pr: structuredClone(g.pr), now: g.time}), /Clock write denied/);
  assert.equal(g.writes.length, 0);
});

test('bot timestamp skew does not reset activity; review read failures remain errors', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  f.label('kp-author-stalepr', true);
  f.pr.updated_at = '2026-10-28T19:01:03Z';
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  const paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Review access denied');
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await assert.rejects(f.run(), /Review access denied/);
});

test('untrusted commit dates never override a server-timed force-push event', async () => {
  for (const date of ['2099-01-01T00:00:00Z', '2000-01-01T00:00:00Z']) {
    const f = fixture();
    await f.run();
    f.pr.head.sha = 'pushed-head';
    f.pr.updated_at = '2026-10-27T19:00:00Z';
    f.events.push({event: 'committed', committer: {date}, author: {date},
      created_at: date});
    f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human'},
      created_at: f.pr.updated_at});
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    f.setTime('2026-10-30T19:00:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T19:02:00Z')}), true);
  }
});

test('overlapping enrollment and backfill share the oldest trusted clock without deleting comments', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  const paginate = f.github.paginate;
  let release, reads = 0;
  const barrier = new Promise(resolve => {release = resolve;});
  const read = async (endpoint, params) => {
    if (endpoint !== f.github.rest.issues.listComments) return paginate(endpoint, params);
    const snapshot = await paginate(endpoint, params);
    if (++reads === 2) release();
    await barrier;
    return snapshot;
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await Promise.all([initialize(args), initialize(args)]);
  assert.equal(f.comments.length, 2, 'both initializers must observe an empty snapshot');
  const oldest = f.comments[0], duplicate = f.comments[1];
  const duplicateBody = duplicate.body;
  f.comments.reverse();
  f.github.paginate = paginate;
  f.label('kp-conference-event', true);
  await f.run();
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.equal(readClock(oldest).activityAt, '2026-10-23T19:00:00Z');
  assert.equal(await canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), true);
  f.humanComment();
  const latest = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(oldest).activityAt, latest);
  assert.equal(duplicate.body, duplicateBody);
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.filter(comment => comment.body.startsWith(PREFIX)).length, 2);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  duplicate.body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  await assert.rejects(initialize(args), /Invalid persisted/);
  await assert.rejects(canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), /Invalid persisted/);
});

test('restored PR descriptions retain server edit activity through later bot writes', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const original = f.pr.body;
  f.pr.body = 'Temporary description edit';
  f.pr.body = original;
  f.pr.lastEditedAt = '2026-10-28T19:01:30Z';
  f.pr.updated_at = f.pr.lastEditedAt;
  f.setTime('2026-10-28T19:02:00Z');
  f.label('kp-author-stalepr', true);
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, f.pr.lastEditedAt);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  f.github.graphql = async () => {throw Error('Edit activity access denied');};
  await assert.rejects(f.run(), /Edit activity access denied/);
  f.github.graphql = async () => ({repository: {pullRequest: null}});
  await assert.rejects(f.run(), /Missing or invalid server PR edit time/);
});

test('existing enrollment without a clock conservatively retains latest PR activity', async () => {
  const f = fixture();
  f.events.push({event: 'labeled', label: {name: 'kp-conference-event'},
    actor: {login: 'github-actions[bot]'}, created_at: '2026-10-24T19:00:00Z'});
  f.pr.updated_at = '2026-10-28T18:00:00Z';
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-28T18:00:00Z');
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
});

test('edited submitted review summaries reset inactivity across all GraphQL pages', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const editedAt = '2026-10-28T19:01:30Z';
  const after = [];
  f.github.graphql = async (query, params) => {
    after.push(params.after);
    return {repository: {pullRequest: {lastEditedAt: null, reviews: {
      nodes: params.after ? [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: editedAt}]
        : [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: null}],
      pageInfo: {hasNextPage: !params.after, endCursor: params.after ? null : 'review-page-2'}
    }}}};
  };
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, editedAt);
  assert.ok(after.includes(null) && after.includes('review-page-2'));
  const writes = f.writes.length;
  for (const problem of ['denied', 'missing', 'repeat', 'timestamp']) {
    f.github.graphql = async () => {
      if (problem === 'denied') throw Error('Review summary read denied');
      return {repository: {pullRequest: {lastEditedAt: null, reviews: problem === 'missing' ? null : {
        nodes: problem === 'timestamp' ? [{submittedAt: 'invalid', lastEditedAt: null}] : [],
        pageInfo: {hasNextPage: true, endCursor: 'repeated'}
      }}}};
    };
    await assert.rejects(f.run(), /Review summary read denied|Missing review-summary|Invalid review-summary/);
    assert.equal(f.writes.length, writes);
  }
});

test('posting persists observed push and body activity before removing its due label', async () => {
  for (const change of ['push', 'body']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    await f.run();
    if (change === 'push') f.pr.head.sha = 'new-push';
    else f.pr.body = 'New description';
    const activityAt = '2026-10-28T19:01:30Z';
    f.pr.updated_at = activityAt;
    if (change === 'push') f.events.push({event: 'head_ref_force_pushed',
      actor: {login: 'human'}, created_at: activityAt});
    else f.pr.lastEditedAt = activityAt;
    f.setTime('2026-10-28T19:02:00Z');
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt, 'bot removals must not restart inactivity');
  }
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  await f.run();
  f.pr.head.sha = 'new-push';
  f.pr.updated_at = '2026-10-28T19:01:30Z';
  f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human'}, created_at: f.pr.updated_at});
  f.github.rest.issues.updateComment = async () => {throw Error('Clock persistence denied');};
  await assert.rejects(canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), /Clock persistence denied/);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('deleted issue and inline comments reset from observation even with equal replacement counts', async () => {
  for (const kind of ['issue', 'review']) {
    for (const posting of [false, true]) {
      const f = fixture();
      const entries = kind === 'issue' ? f.comments : f.reviews;
      entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
      entries.splice(entries.findIndex(item => item.id === 500), 1);
      entries.push({id: 501, body: 'Replacement feedback', user: {login: 'reviewer'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      const observedAt = '2026-10-28T19:02:00.000Z';
      f.setTime(observedAt);
      if (posting) {
        assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: Date.parse(observedAt)}), false);
      } else await f.run();
      const clock = f.comments.find(item => item.body.startsWith(PREFIX));
      assert.equal(readClock(clock).activityAt, observedAt);
      assert.deepEqual(readClock(clock).commentIds[kind], [501]);
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-10-29T19:02:00Z');
      await f.run();
      assert.equal(readClock(clock).activityAt, observedAt, 'unchanged snapshots and bookkeeping do not reset again');
      f.setTime('2026-11-02T20:01:59Z');
      await f.run();
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-11-02T20:02:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    }
  }
});

test('comment identity baselines migrate without resetting and reject incomplete or malformed state', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0], legacy = readClock(clock);
  delete legacy.commentIds;
  clock.body = PREFIX + JSON.stringify(legacy) + '\n-->';
  const feedback = Array.from({length: 205}, (_, index) => ({id: 500 + index,
    body: 'Feedback', user: {login: 'reviewer'}, updated_at: '2026-10-23T19:00:00Z'}));
  f.comments.push(...feedback);
  const seen = [], paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    seen.push([endpoint, args.per_page]);
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await f.run();
  assert.equal(readClock(clock).activityAt, legacy.activityAt);
  assert.equal(readClock(clock).commentIds.issue.length, 205);
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.issues.listComments && size === 100));
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.pulls.listReviewComments && size === 100));
  const activityAt = readClock(clock).activityAt;
  f.comments.reverse();
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  await f.run();
  const writes = f.writes.length;
  f.comments.splice(f.comments.findIndex(item => item.body === process.env.AUTHOR_REMINDER_MESSAGE), 1);
  await f.run();
  assert.equal(readClock(clock).activityAt, activityAt);
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'),
    'stock reminder deletion may advance the scan checkpoint, never inactivity');
  const afterCheckpoint = f.writes.length;
  const valid = clock.body;
  for (const commentIds of [null, {}, {issue: [2, 1], review: []},
    {issue: [1, 1], review: []}, {issue: ['1'], review: []},
    {issue: [Number.MAX_SAFE_INTEGER + 1], review: []}]) {
    clock.body = PREFIX + JSON.stringify({...readClock({body: valid}), commentIds}) + '\n-->';
    await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
    assert.equal(f.writes.length, afterCheckpoint);
  }
  clock.body = valid;
  feedback[0].id = 0;
  await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
  assert.equal(f.writes.length, afterCheckpoint);
  feedback[0].id = 500;
  f.github.paginate = Object.assign(async endpoint => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Comment snapshot read denied');
    return paginate(endpoint);
  }, {iterator: paginate.iterator});
  await assert.rejects(f.run(), /Comment snapshot read denied/);
  assert.equal(f.writes.length, afterCheckpoint);
});

test('visible clock uses operative activityAt in Redmond, preserving creation provenance across DST', async () => {
  for (const [createdAt, display] of [
    ['2026-10-31T13:24:23Z', '2026-10-31 06:24:23 PDT (UTC-07:00)'],
    ['2026-11-01T08:30:00Z', '2026-11-01 01:30:00 PDT (UTC-07:00)'],
    ['2026-11-01T09:30:00Z', '2026-11-01 01:30:00 PST (UTC-08:00)'],
    ['2026-03-08T09:59:59Z', '2026-03-08 01:59:59 PST (UTC-08:00)'],
    ['2026-03-08T10:00:00Z', '2026-03-08 03:00:00 PDT (UTC-07:00)']
  ]) {
    const f = fixture();
    f.pr.updated_at = createdAt;
    f.setTime(new Date(Date.parse(createdAt) - 1000).toISOString());
    f.setTime(createdAt);
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const visible = 'Created by PR Monitor bot for Ignite 2026 from the Knowledge Partnership team.\n' +
      '3 day clock started on ' + display;
    assert.ok(clock.body.endsWith(visible));
    assert.equal(clock.created_at, new Date(Date.parse(createdAt) + 1000).toISOString());
    assert.equal(f.writes.filter(([kind]) => kind === 'comment').length, 1);
    assert.equal(f.writes.filter(([kind]) => kind === 'update').length, 0);
    const start = clock.created_at;
    const initialActivity = readClock(clock).activityAt;
    f.setTime('2027-01-05T20:00:00Z');
    f.humanComment();
    const feedbackAt = f.comments.at(-1).created_at;
    await f.run();
    assert.equal(clock.created_at, start);
    assert.ok(!clock.body.endsWith(visible));
    assert.match(clock.body, /3 day clock started on 2027-01-05 12:00:01 PST \(UTC-08:00\)$/);
    assert.equal(readClock(clock).activityAt, feedbackAt);
    assert.equal(initialActivity, createdAt, 'display must not reset pre-enrollment activity');
    const writes = f.writes.length;
    await f.run();
    assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
    assert.equal(readClock(clock).activityAt, feedbackAt, 'checkpoint does not move inactivity');
  }
});

test('legacy wording upgrades the same clock once and preserves its full hidden state', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const enrollment of [false, true]) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0];
    const state = readClock(clock);
    state.legacyExtra = 'preserve';
    clock.body = PREFIX + JSON.stringify(state) +
      '\n-->\nBusiness-day reminder clock (managed by the documentation bot).';
    const id = clock.id, createdAt = clock.created_at;
    f.setTime('2026-11-10T20:00:00Z');
    const run = enrollment ? () => initialize({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
      pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
      managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time
    }) : f.run;
    const updates = f.writes.filter(([kind]) => kind === 'update').length;
    await run();
    assert.equal(clock.id, id);
    assert.equal(clock.created_at, createdAt);
    assert.deepEqual({...readClock(clock), lastReviewedAt: state.lastReviewedAt, observedAt: state.observedAt}, state);
    assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
    assert.equal(f.writes.filter(([kind]) => kind === 'update').length, updates + 1);
    const writes = f.writes.length;
    await run();
    assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
    assert.equal(f.comments.length, 1);
  }
});

test('a failed wording update recovers the existing clock rather than replacing it', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  await initialize(args);
  const persisted = readClock(f.comments[0]);
  f.comments[0].body = PREFIX + JSON.stringify(persisted) + '\n-->\nLegacy wording';
  args.pr = structuredClone(f.pr);
  const update = f.github.rest.issues.updateComment;
  f.github.rest.issues.updateComment = async () => {throw Error('Wording update failed');};
  await assert.rejects(initialize(args), /Wording update failed/);
  assert.equal(f.comments.length, 1);
  const clock = f.comments[0], state = readClock(clock);
  f.github.rest.issues.updateComment = update;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments[0], clock);
  assert.equal(f.comments.length, 1);
  assert.deepEqual({...readClock(clock), lastReviewedAt: state.lastReviewedAt, observedAt: state.observedAt}, state);
  assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
  const writes = f.writes.length;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
  const beforeInvalid = f.writes.length;
  delete clock.created_at;
  await assert.rejects(initialize({...args, pr: structuredClone(f.pr)}), /clock creation time/);
  assert.equal(f.writes.length, beforeInvalid, 'invalid server metadata must not invent a start time');
});

test('a temporarily omitted feedback identity is not persisted as deletion', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const before = clock.body, writes = f.writes.length;
    const paginate = f.github.paginate;
    const endpoint = kind === 'issue' ? f.github.rest.issues.listComments : f.github.rest.pulls.listReviewComments;
    let reads = 0;
    f.github.paginate = Object.assign(async (method, args) => {
      assert.equal(args.per_page, 100);
      const snapshot = await paginate(method, args);
      return method === endpoint && ++reads === 1 ? snapshot.filter(item => item.id !== 500) : snapshot;
    }, {iterator: paginate.iterator});
    await f.run();
    assert.equal(readClock(clock).activityAt, readClock({body: before}).activityAt);
    assert.equal(f.writes.length, writes);
    f.github.paginate = paginate;
    await f.run();
    assert.equal(readClock(clock).activityAt, readClock({body: before}).activityAt);
  }
});

test('confirmed deletion uses read completion, with the exact fractional weekday deadline across DST', async () => {
  for (const kind of ['issue', 'review']) for (const posting of [false, true]) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    f.setTime('2026-10-28T19:02:00Z');
    const paginate = f.github.paginate;
    let issueReads = 0, reviewReads = 0;
    f.github.paginate = Object.assign(async (method, args) => {
      if (method === f.github.rest.issues.listComments && ++issueReads === 1) {
        f.setTime('2026-10-28T19:02:10.250Z');
        entries.splice(entries.findIndex(item => item.id === 500), 1);
      }
      if (method === f.github.rest.pulls.listReviewComments && ++reviewReads === 2) {
        f.setTime('2026-10-28T19:02:12.750Z');
      }
      return paginate(method, args);
    }, {iterator: paginate.iterator});
    if (posting) {
      assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.time}), false);
    } else await f.run();
    assert.equal(readClock(f.comments.find(item => item.body.startsWith(PREFIX))).activityAt,
      '2026-10-23T19:00:00Z', 'count mismatch must wait for a fresh consistent PR snapshot');
    if (posting) {
      assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.time}), false);
    } else await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    assert.equal(readClock(clock).activityAt, '2026-10-28T19:02:12.750Z');
    assert.ok(issueReads >= 3);
    assert.ok(reviewReads >= 3);
    f.github.paginate = paginate;
    f.setTime('2026-11-02T20:02:12.749Z');
    await f.run();
    assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
    f.setTime('2026-11-02T20:02:12.750Z');
    await f.run();
    assert.ok(f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  }
});

test('after-bookkeeping guard ignores its own wording edit and permits the normal stock reminder', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments[0], activityAt = readClock(clock).activityAt;
  clock.body = PREFIX + JSON.stringify(readClock(clock)) + '\n-->\nLegacy wording';
  const gate = () => canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')});
  assert.equal(await gate(), true);
  assert.equal(readClock(clock).activityAt, activityAt);
  const writes = f.writes.length;
  assert.equal(await gate(), true);
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  assert.equal(await gate(), false);
  await f.run();
  assert.ok(f.pr.labels.some(item => item.name === 'kp-author-stalepr'));
  assert.ok(!f.writes.slice(writes).some(([kind, name]) =>
    kind === 'remove' && name === 'kp-author-stalepr'), 'helper must not deliberately re-arm stock markers');
});

test('after-bookkeeping first-reminder guard rejects new feedback and scope changes', async () => {
  for (const change of ['comment', 'review', 'push', 'body', 'draft', 'keep-open', 'retarget', 'closed', 'clock']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments[0];
    clock.body = PREFIX + JSON.stringify(readClock(clock)) +
      '\n-->\nBusiness-day reminder clock (managed by the documentation bot).';
    const update = f.github.rest.issues.updateComment;
    let activityAt;
    f.github.rest.issues.updateComment = async args => {
      if (change === 'comment') {f.humanComment(); activityAt = f.pr.updated_at;}
      if (change === 'review') {
        activityAt = '2026-10-28T19:02:30Z';
        f.reviews.push({id: 500, body: 'New review', user: {login: 'reviewer'},
          created_at: activityAt, updated_at: activityAt});
      }
      if (change === 'push') f.pr.head.sha = 'after-bookkeeping-push';
      if (change === 'body') f.pr.body = 'After-bookkeeping body';
      if (change === 'draft') f.pr.draft = true;
      if (change === 'keep-open') f.label('keep-open', true);
      if (change === 'retarget') f.pr.base.ref = 'main';
      if (change === 'closed') f.pr.state = 'closed';
      f.github.rest.issues.updateComment = update;
      const response = await update(args);
      if (change === 'clock') clock.body = PREFIX + JSON.stringify({
        ...readClock(clock), activityAt: '2026-10-28T19:02:30Z'
      }) + '\n-->';
      return response;
    };
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false, change);
    assert.equal(f.comments.filter(item => item.body.startsWith(PREFIX)).length, 1);
    assert.equal(f.comments.filter(item => item.body === process.env.AUTHOR_REMINDER_MESSAGE).length, 0);
    if (activityAt) {
      await f.run();
      assert.equal(readClock(clock).activityAt, activityAt);
    }
  }
});

test('same-second issue edits during bookkeeping are compared without adding persisted revision fields', async () => {
  const f = fixture();
  f.comments.push({id: 500, body: 'Original feedback', user: {login: 'reviewer'},
    created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments.find(item => item.body.startsWith(PREFIX));
  clock.body = PREFIX + JSON.stringify(readClock(clock)) + '\n-->\nLegacy wording';
  const update = f.github.rest.issues.updateComment;
  f.github.rest.issues.updateComment = async args => {
    f.comments.find(item => item.id === 500).body = 'Edited feedback';
    return update(args);
  };
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), false);
  assert.deepEqual(Object.keys(readClock(clock)).sort(),
    ['activityAt', 'commentIds', 'fingerprint', 'lastReviewedAt', 'observedAt']);
});

test('rollout labels cannot authorize an off-prefix target and missing prefix fails explicitly', async () => {
  const f = fixture();
  f.pr.base.ref = 'main';
  f.setTime('2026-11-10T20:00:00Z');
  await f.run();
  assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  f.label('kp-reminder-due', true);
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-11-10T20:01:00Z')}), false);
  assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  delete process.env.ROLLOUT_BRANCH_PREFIX;
  const writes = f.writes.length;
  await assert.rejects(f.run(), /Invalid KP business clock settings/);
  assert.equal(f.writes.length, writes);
});

test('enrollment, plain reminder, notification events and next review preserve the operative baseline', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
  f.label('kp-conference-event', true);
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments[0], anchor = readClock(clock).activityAt;
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.time()}), true);
  const body = process.env.AUTHOR_REMINDER_MESSAGE;
  assert.equal(body, process.env.AUTHOR_REMINDER_MESSAGE);
  await f.github.rest.issues.createComment({body});
  f.label('kp-author-stalepr', true);
  f.events.push(
    {event: 'mentioned', actor: {login: 'pr-author'}, created_at: f.pr.updated_at},
    {event: 'subscribed', actor: {login: 'manual-subscriber'}, created_at: f.pr.updated_at});
  f.setTime('2026-10-28T20:01:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, anchor);
  assert.equal(readClock(clock).lastReviewedAt, '2026-10-28T20:01:00.000Z');
  assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  f.setTime('2026-10-29T20:01:00Z');
  f.humanComment();
  const response = f.comments.at(-1).updated_at;
  await f.run();
  assert.equal(readClock(clock).activityAt, response);
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('shared GitHub bot identity does not exempt unrelated feedback or label changes', async () => {
  for (const kind of ['comment', 'label', 'human-reminder-copy']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-27T20:00:00Z');
    const at = new Date(f.time()).toISOString();
    f.pr.updated_at = at;
    if (kind === 'label') {
      f.pr.labels.push({name: 'validation-failed'});
      f.events.push({event: 'labeled', actor: {login: 'github-actions[bot]'},
        label: {name: 'validation-failed'}, created_at: at});
    } else {
      f.comments.push({id: 900, user: {login: kind === 'comment' ? 'github-actions[bot]' : 'author'},
        body: kind === 'comment' ? 'Another workflow failed validation' : process.env.AUTHOR_REMINDER_MESSAGE,
        created_at: at, updated_at: at});
    }
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, at, kind);
  }
});

test('legacy membership hashes normalize only reproducible current metadata, without backdating', async () => {
  const {fingerprint} = require('../scripts/kp-business-clock.cjs');
  for (const originalMember of [false, true]) {
    const f = fixture();
    await f.run();
    const comment = f.comments[0], legacy = readClock(comment);
    const oldPR = {...f.pr, labels: originalMember ? f.pr.labels : []};
    legacy.fingerprint = fingerprint(oldPR, ['kp-reminder-due', 'kp-author-stalepr']);
    delete legacy.lastReviewedAt;
    comment.body = PREFIX + JSON.stringify(legacy) + '\n-->';
    f.setTime('2026-10-27T20:00:00Z');
    if (!originalMember) f.label('kp-conference-event', true);
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(comment).activityAt, legacy.activityAt);
    assert.equal(readClock(comment).fingerprint,
      fingerprint(f.pr, ['kp-reminder-due', 'kp-author-stalepr'], 'kp-conference-event'));
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  }
});

test('uncertain metadata or unknown events skip without checkpoint writes or reminder authorization', async () => {
  for (const kind of ['metadata', 'unknown-event']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments[0], before = clock.body, count = f.writes.length;
    if (kind === 'metadata') f.pr.head.sha = 'push-time-obscured-by-clock-write';
    else f.events.push({event: 'unrecognized-server-event', created_at: f.pr.updated_at});
    const logs = [];
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info: message => logs.push(message)}, number: 42, now: f.time}), false);
    assert.ok(logs.some(message => /Uncertain KP activity.*skipped/.test(message)));
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, count);
  }
});

test('review checkpoints store start, not completion, and overlapping old edits do not rearm twice', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0];
  const start = '2026-10-27T20:00:00.000Z';
  f.setTime(start);
  const graphql = f.github.graphql;
  let delayed = false;
  f.github.graphql = async (...args) => {
    if (!delayed) {
      delayed = true;
      f.setTime('2026-10-27T20:02:00Z');
    }
    return graphql(...args);
  };
  await f.run();
  assert.equal(readClock(clock).lastReviewedAt, start);
  const editedAt = '2026-10-27T19:56:00Z';
  f.comments.push({id: 500, body: 'Old comment edited within overlap', user: {login: 'reviewer'},
    created_at: '2026-10-20T19:00:00Z', updated_at: editedAt});
  f.pr.updated_at = editedAt;
  f.setTime('2026-10-27T20:03:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, editedAt);
  f.setTime('2026-10-27T20:04:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, editedAt, 'same overlapping edit must not reset from observation');
});

test('failed or concurrent reviews leave the checkpoint for retry and retain full feedback identities', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body;
  f.setTime('2026-10-27T20:00:00Z');
  const graphql = f.github.graphql;
  let reads = 0;
  f.github.graphql = async (...args) => {
    if (++reads === 2) throw Error('Second review unavailable');
    return graphql(...args);
  };
  await assert.rejects(f.run(), /Second review unavailable/);
  assert.equal(clock.body, before);
  f.github.graphql = graphql;
  f.comments.push({id: 500, body: 'An old comment edited since the last successful scan',
    user: {login: 'reviewer'}, created_at: '2026-10-20T19:00:00Z', updated_at: '2026-10-27T19:59:00Z'});
  await f.run();
  assert.equal(readClock(clock).activityAt, '2026-10-27T19:59:00Z');
  assert.deepEqual(readClock(clock).commentIds.issue, [500]);
});

test('first enrollment seeds issue and inline identities so first-scan deletions are observed once', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['issue', 'review']) {
    const f = fixture(), entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, user: {login: 'reviewer'}, body: 'Before enrollment',
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
      managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    assert.deepEqual(readClock(clock).commentIds[kind], [500]);
    entries.splice(entries.findIndex(item => item.id === 500), 1);
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const observed = readClock(clock).activityAt;
    assert.equal(observed, '2026-10-28T19:01:00.000Z');
    await f.run();
    assert.equal(readClock(clock).activityAt, observed);
    assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  }
});

test('same-second issue and inline edits on an otherwise unchanged clock gate are not lost', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture(), entries = kind === 'issue' ? f.comments : f.reviews;
    const comment = {id: 500, user: {login: 'reviewer'}, body: 'Original',
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'};
    entries.push(comment);
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const before = clock.body, get = f.github.rest.pulls.get;
    let reads = 0;
    f.github.rest.pulls.get = async args => {
      if (++reads === 2) {
        comment.body = 'Edited within same server second';
        comment.updated_at = new Date(f.time()).toISOString();
      }
      return get(args);
    };
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
    assert.equal(clock.body, before, 'failed review must not acknowledge the racing edit');
    await f.run();
    assert.equal(readClock(clock).activityAt, comment.updated_at);
  }
});

test('enrollment recognizes the exact shipped reminder when sender-only environment is absent', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const fs = require('node:fs'), path = require('node:path');
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows', 'reusable-kp-reminder.yml'), 'utf8');
  const message = workflow.split('      AUTHOR_REMINDER_MESSAGE: |-\n')[1].split('\n\n    steps:')[0]
    .split('\n').map(line => line.startsWith('        ') ? line.slice(8) : line).join('\n');
  const f = fixture();
  f.comments.push({id: 500, user: {login: 'github-actions[bot]'}, body: '@old-author\n\n' + message,
    created_at: '2026-10-24T19:00:00Z', updated_at: '2026-10-24T19:00:00Z'});
  delete process.env.AUTHOR_REMINDER_MESSAGE;
  await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
  const clock = f.comments.find(item => item.body.startsWith(PREFIX));
  assert.equal(readClock(clock).activityAt, '2026-10-23T19:00:00Z');
  assert.deepEqual(readClock(clock).commentIds.issue, []);
});

test('marker cleanup uses genuine activity, not checkpoint writes or manual subscription notifications', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  const since = f.pr.updated_at;
  f.events.push({event: 'subscribed', actor: {login: 'manual-subscriber'}, created_at: since});
  f.setTime('2026-10-28T20:01:00Z');
  await f.run();
  const check = () => hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, since, now: f.time});
  assert.ok(Date.parse(f.pr.updated_at) - Date.parse(since) > 15000);
  assert.equal(await check(), false);
  f.humanComment();
  assert.equal(await check(), true);
  await f.run();
  assert.equal(await check(), true, 'persisting genuine activity must not suppress existing marker cleanup');
});

test('uncertain or missing marker boundary never authorizes cleanup or advances a review checkpoint', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body, count = f.writes.length, logs = [];
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info: message => logs.push(message)}, number: 42, now: f.time};
  assert.equal(await hasActivitySince(args), null);
  f.pr.head.sha = 'time-obscured-by-clock-write';
  assert.equal(await hasActivitySince({...args, since: '2026-10-23T19:00:00Z'}), null);
  assert.equal(clock.body, before);
  assert.equal(f.writes.length, count);
  assert.ok(logs.some(message => /Uncertain KP/.test(message)));
});

test('KP cleanup timestamp skew and excluded notifications cannot supply a metadata reset time', async () => {
  for (const notification of [false, true]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
    f.label('kp-author-stalepr', true);
    await f.run();
    const clock = f.comments[0], before = clock.body, count = f.writes.length;
    f.pr.labels.push({name: 'keep-open'});
    f.events.push({event: 'labeled', label: {name: 'keep-open'}, actor: {login: 'human'},
      created_at: '2026-10-29T18:00:00Z'});
    f.setTime('2026-10-29T19:00:00Z');
    f.label('kp-author-stalepr', false);
    f.pr.updated_at = notification ? '2026-10-29T19:00:04Z' : '2026-10-29T19:00:03Z';
    if (notification) f.events.push({event: 'subscribed', actor: {login: 'manual-subscriber'},
      created_at: f.pr.updated_at});
    f.setTime('2026-10-29T19:00:05Z');
    const afterExternalWrites = f.writes.length;
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, afterExternalWrites);
    assert.ok(afterExternalWrites > count);
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
  }
});

test('contradictory complete feedback counts cannot fabricate a deletion or authorize a reminder', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Still exists', user: {login: 'human'},
      created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
    await f.run();
    const clock = f.comments.find(comment => comment.body.startsWith(PREFIX));
    const before = clock.body, writes = f.writes.length;
    const paginate = f.github.paginate;
    const endpoint = kind === 'issue' ? f.github.rest.issues.listComments : f.github.rest.pulls.listReviewComments;
    f.github.paginate = Object.assign(async (api, args) =>
      (await paginate(api, args)).filter(comment => api !== endpoint || comment.id !== 500),
    {iterator: paginate.iterator});
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    assert.ok(entries.some(comment => comment.id === 500));
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
  }
});

test('a supported meaningful event without its server time leaves the clock and checkpoint untouched', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const before = f.comments[0].body, writes = f.writes.length;
  f.events.push({event: 'labeled', actor: {login: 'human'}, label: {name: 'kp-conference-event'}});
  f.setTime('2026-10-28T20:00:00Z');
  await f.run();
  assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.time}), false);
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
});

test('selected clock timestamp skew cannot time a metadata change, even on repeated reads', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body, writes = f.writes.length;
  f.pr.title = 'Renamed during the previous clock write';
  f.events.push({event: 'renamed', actor: {login: 'human'}, created_at: '2026-10-26T19:00:00Z'});
  f.pr.updated_at = '2026-10-26T19:00:03Z';
  f.setTime('2026-10-28T19:01:00Z');
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time};
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-25T19:00:00Z'}), null);
  }
});

test('an untimed changed head stays uncertain until reliable later activity resolves it', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.pr.head.sha = 'ordinary-push-without-trustworthy-push-time';
  f.pr.updated_at = '2026-10-28T19:01:30Z';
  f.setTime('2026-10-28T19:02:00Z');
  const clock = f.comments[0], before = clock.body, writes = f.writes.length, logs = [];
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info: message => logs.push(message)}, number: 42, now: f.time};
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:00:00Z'}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
  assert.ok(logs.some(message => /metadata changed but its time is obscured/.test(message)));
  f.humanComment();
  const genuineAt = f.comments.at(-1).updated_at;
  await f.run();
  assert.equal(readClock(clock).activityAt, genuineAt);
  assert.notEqual(clock.body, before);
});
