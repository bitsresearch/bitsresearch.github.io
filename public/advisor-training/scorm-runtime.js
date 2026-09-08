
(function () {
  'use strict';

  const STORE_KEY = 'BITS_SCORM12_STATE_v1';
  const DEFAULTS = {
    'cmi.core.student_id': 'local-advisor',
    'cmi.core.student_name': 'BITS Community Advisor',
    'cmi.core.lesson_location': '',
    'cmi.core.credit': 'no-credit',
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.entry': 'ab-initio',
    'cmi.core.score.raw': '',
    'cmi.core.score.min': '',
    'cmi.core.score.max': '',
    'cmi.core.total_time': '0000:00:00.00',
    'cmi.core.lesson_mode': 'normal',
    'cmi.suspend_data': '',
    'cmi.launch_data': '',
    'cmi.comments': '',
    'cmi.comments_from_lms': ''
  };

  let initialized = false;
  let lastError = '0';
  let sessionStart = Date.now();
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      return Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (_) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      localStorage.setItem('BITS_SCORM12_LAST_SAVED_v1', new Date().toISOString());
      return true;
    } catch (_) {
      return false;
    }
  }

  function normalizeElement(el) {
    return String(el || '');
  }

  function LMSInitialize() {
    initialized = true;
    sessionStart = Date.now();
    lastError = '0';
    state['cmi.core.entry'] = state['cmi.suspend_data'] ? 'resume' : 'ab-initio';
    persist();
    return 'true';
  }

  function LMSFinish() {
    if (!initialized) { lastError = '301'; return 'false'; }
    persist();
    initialized = false;
    lastError = '0';
    return 'true';
  }

  function LMSGetValue(element) {
    element = normalizeElement(element);
    if (!initialized) { lastError = '301'; return ''; }

    if (element === 'cmi.core._children') {
      lastError = '0';
      return 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time';
    }
    if (element === 'cmi.core.score._children') {
      lastError = '0';
      return 'raw,min,max';
    }
    if (element === 'cmi.student_data._children') {
      lastError = '0';
      return 'mastery_score,max_time_allowed,time_limit_action';
    }
    if (element === 'cmi.student_preference._children') {
      lastError = '0';
      return 'audio,language,speed,text';
    }

    lastError = '0';
    return Object.prototype.hasOwnProperty.call(state, element) ? String(state[element] ?? '') : '';
  }

  function LMSSetValue(element, value) {
    element = normalizeElement(element);
    if (!initialized) { lastError = '301'; return 'false'; }
    value = String(value ?? '');

    state[element] = value;
    lastError = '0';

    // Persist immediately for the fields Rise commonly uses for resume/progress.
    if (
      element === 'cmi.suspend_data' ||
      element === 'cmi.core.lesson_location' ||
      element === 'cmi.core.lesson_status' ||
      element === 'cmi.core.exit' ||
      element === 'cmi.core.score.raw' ||
      element.indexOf('cmi.interactions.') === 0 ||
      element.indexOf('cmi.objectives.') === 0
    ) {
      persist();
    }
    return 'true';
  }

  function LMSCommit() {
    if (!initialized) { lastError = '301'; return 'false'; }
    lastError = persist() ? '0' : '101';
    return lastError === '0' ? 'true' : 'false';
  }

  function LMSGetLastError() { return lastError; }

  function LMSGetErrorString(code) {
    const map = {
      '0': 'No error',
      '101': 'General exception',
      '201': 'Invalid argument error',
      '202': 'Element cannot have children',
      '203': 'Element not an array',
      '301': 'Not initialized',
      '401': 'Not implemented error',
      '402': 'Invalid set value',
      '403': 'Element is read only',
      '404': 'Element is write only',
      '405': 'Incorrect data type'
    };
    return map[String(code)] || 'Unknown error';
  }

  function LMSGetDiagnostic(code) {
    return LMSGetErrorString(code || lastError);
  }

  // SCORM 1.2 API object expected by Rise.
  window.API = {
    LMSInitialize,
    LMSFinish,
    LMSGetValue,
    LMSSetValue,
    LMSCommit,
    LMSGetLastError,
    LMSGetErrorString,
    LMSGetDiagnostic
  };

  // Save aggressively so progress is retained even if the browser/tab is closed.
  window.addEventListener('pagehide', persist);
  window.addEventListener('beforeunload', persist);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') persist();
  });
  setInterval(function () { if (initialized) persist(); }, 5000);

  // Helpers for the access page.
  window.BITS_SCORM = {
    getState: function () { return Object.assign({}, state); },
    hasProgress: function () {
      return Boolean(
        state['cmi.suspend_data'] ||
        state['cmi.core.lesson_location'] ||
        (state['cmi.core.lesson_status'] && state['cmi.core.lesson_status'] !== 'not attempted')
      );
    },
    reset: function () {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem('BITS_SCORM12_LAST_SAVED_v1');
      state = Object.assign({}, DEFAULTS);
    },
    lastSaved: function () {
      return localStorage.getItem('BITS_SCORM12_LAST_SAVED_v1') || '';
    }
  };
})();
