import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  checkedFilename,
  cleanSiteSettings,
  fillMissing,
  mapContentDocument,
  normalizeAPIBase,
} from '../scripts/content-bundle.mjs';

test('export source is restricted to a loopback CMS API', () => {
  assert.equal(normalizeAPIBase('http://localhost:3101/api').href, 'http://localhost:3101/api/');
  assert.throws(() => normalizeAPIBase('https://cms.sigmacore.id/api'), /loopback/);
  assert.throws(() => normalizeAPIBase('http://user:secret@localhost:3101/api'), /without credentials/);
});

test('media filenames cannot escape the bundle directory', () => {
  assert.equal(checkedFilename('logo.png'), 'logo.png');
  assert.throws(() => checkedFilename('../logo.png'), /Unsafe/);
  assert.throws(() => checkedFilename('folder/logo.png'), /Unsafe/);
});

test('partner import remaps media and removes source row ids', () => {
  const data = mapContentDocument('partners', {
    id: 9,
    name: 'Example',
    logo: 4,
    order: 1,
    published: true,
    _status: 'published',
  }, { media: new Map([['4', 40]]), partners: new Map(), solutions: new Map() });
  assert.deepEqual(data, {
    name: 'Example',
    logo: 40,
    website: null,
    order: 1,
    published: true,
    _status: 'published',
  });
});

test('solution relationships and nested rows are remapped safely', () => {
  const data = mapContentDocument('solutions', {
    title: 'Solution', slug: 'solution', summary: 'Summary', category: 'platform',
    heroImage: null, iconKey: 'infrastructure', order: 2, published: true,
    _status: 'published', features: [{ id: 'row', label: 'Feature' }],
    benefits: [], useCases: [], relatedPartners: [3],
  }, {
    media: new Map(),
    partners: new Map([['3', 30]]),
    solutions: new Map(),
  });
  assert.equal(data.relatedPartners[0], 30);
  assert.deepEqual(data.features, [{ label: 'Feature' }]);
  assert.ok(!('id' in data));
});

test('site settings exclude Payload metadata and keep editorial groups', () => {
  const clean = cleanSiteSettings({
    id: 1,
    hero: { eyebrow: 'A', headline: 'B', highlight: 'C', description: 'D' },
    contact: { email: 'a@example.com', phone: '1', address: 'A' },
    companyFacts: [{ id: 'row', value: '6', label: 'Solutions' }],
    seo: { title: 'T', description: 'D' },
    about: { eyebrow: 'A', headline: 'B', highlight: 'C', description: 'D' },
    workflow: { eyebrow: 'A', title: 'B', description: 'C', steps: [{ id: 'row', step: '01', title: 'Assess', text: 'Text' }] },
    strengths: { eyebrow: 'A', title: 'B', description: 'C', items: [{ id: 'row', title: 'Secure', text: 'Text' }] },
    _status: 'published',
    updatedAt: 'ignored',
  });
  assert.ok(!('id' in clean));
  assert.deepEqual(clean.companyFacts, [{ value: '6', label: 'Solutions' }]);
  assert.equal(clean.workflow.steps[0].step, '01');
});

test('fillMissing preserves production values while filling empty fields', () => {
  assert.deepEqual(
    fillMissing({ contact: { email: 'production@example.com', phone: '' } }, { contact: { email: 'testing@example.com', phone: '123' } }),
    { contact: { email: 'production@example.com', phone: '123' } },
  );
});
