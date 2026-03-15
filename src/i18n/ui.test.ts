import test from 'node:test';
import assert from 'node:assert';
import { ui, useTranslations, defaultLang } from './ui.ts';

test('i18n ui helper', () => {
  const tIt = useTranslations('it');
  const tEn = useTranslations('en');

  // Test existing labels
  assert.strictEqual(tIt('nav.home'), 'Home');
  assert.strictEqual(tEn('nav.home'), 'Home');
  assert.strictEqual(tEn('nav.storia'), 'About');

  // Test fallback to default language if key missing in EN
  // (Using a key that only exists in IT - but currently all keys exist in both)
  
  // Test missing label (should fail if I check for 'nav.contacts')
  // @ts-ignore
  assert.strictEqual(tIt('nav.contacts'), 'Contatti');
});
