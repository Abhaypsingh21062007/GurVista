import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { extractProductFromTranscript, hasUsefulExtraction } from '../../utils/vaaniExtractor';
import './VaaniRecorder.css';

/**
 * VaaniRecorder — Voice recording UI for GurVista Vaani.
 *
 * Props:
 *   onTranscriptReady(transcript: string, extracted: object) — called when
 *     the user clicks "Extract & Fill Form". Parent switches to manual form.
 */
export default function VaaniRecorder({ onTranscriptReady }) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState('idle'); // idle | recording | done | error
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [supported, setSupported] = useState(true);
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    setTranscript('');
    setInterimText('');
    setErrorMsg('');
    setMode('recording');

    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let finalTranscript = '';

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t + ' ';
        } else {
          interim += t;
        }
      }
      setTranscript(finalTranscript.trim());
      setInterimText(interim);
    };

    rec.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setErrorMsg(
          lang === 'hi'
            ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में माइक्रोफ़ोन को अनुमति दें।'
            : 'Microphone access was denied. Please allow microphone access in your browser settings.'
        );
      } else if (event.error === 'no-speech') {
        setErrorMsg(
          lang === 'hi'
            ? 'कोई आवाज़ नहीं सुनाई दी। कृपया फिर से बोलें।'
            : 'No speech detected. Please try again.'
        );
      } else {
        setErrorMsg(
          lang === 'hi'
            ? `वाणी पहचान में त्रुटि: ${event.error}। कृपया पुनः प्रयास करें।`
            : `Speech recognition error: ${event.error}. Please try again.`
        );
      }
      setMode('error');
    };

    rec.onend = () => {
      setInterimText('');
      if (mode === 'recording') {
        setMode('done');
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन शुरू नहीं हो सका।' : 'Could not start microphone.');
      setMode('error');
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setInterimText('');
    setMode('done');
  }

  function retry() {
    setTranscript('');
    setInterimText('');
    setErrorMsg('');
    setMode('idle');
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
  }

  function handleExtract() {
    const finalText = transcript.trim();
    if (!finalText) {
      setErrorMsg(
        lang === 'hi'
          ? 'कोई बात नहीं सुनाई दी। कृपया पहले बोलें या नीचे टाइप करें।'
          : 'No speech detected. Please record your voice or type below.'
      );
      return;
    }
    setProcessing(true);
    // Small delay so user sees loading state
    setTimeout(() => {
      const extracted = extractProductFromTranscript(finalText);
      setProcessing(false);
      onTranscriptReady(finalText, extracted);
    }, 400);
  }

  const hi = lang === 'hi';

  return (
    <div className="vaani-wrap">
      {/* Header */}
      <div className="vaani-header">
        <h2 className="vaani-heading">GurVista Vaani &nbsp;<span className="vaani-heading-devanagari">वाणी</span></h2>
        <p className="vaani-subheading">
          {hi ? 'आवाज़ से अपना उत्पाद सूचीबद्ध करें।' : 'List your products using your voice.'}
        </p>
        <p className="vaani-hindi-label">बोलकर अपना उत्पाद जोड़ें।</p>
      </div>

      {/* Not supported fallback */}
      {!supported && (
        <div className="vaani-unsupported">
          <p>
            {hi
              ? 'आपका ब्राउज़र वाणी पहचान का समर्थन नहीं करता। कृपया Chrome का उपयोग करें या नीचे मैन्युअल रूप से टाइप करें।'
              : 'Your browser does not support voice recognition. Please use Chrome, or type your product details below.'}
          </p>
        </div>
      )}

      {/* Example sentence */}
      <div className="vaani-example">
        <span className="vaani-example-label">
          {hi ? 'उदाहरण — इस तरह बोलें:' : 'Example — say something like:'}
        </span>
        <p className="vaani-example-text">
          "मेरे पास 50 क्विंटल चाकू गुड़ है। इसका भाव 4200 रुपये प्रति क्विंटल है और मेरा कारखाना मुज़फ्फरनगर में है।"
        </p>
      </div>

      {/* Mic control row */}
      {supported && (
        <div className="vaani-controls">
          {mode === 'idle' && (
            <button
              type="button"
              className="vaani-mic-btn"
              onClick={startRecording}
              aria-label={hi ? 'रिकॉर्डिंग शुरू करें' : 'Start Recording'}
            >
              <MicIcon />
              <span>{hi ? 'रिकॉर्डिंग शुरू करें' : 'Start Recording'}</span>
            </button>
          )}

          {mode === 'recording' && (
            <div className="vaani-recording-row">
              <span className="vaani-pulse" aria-hidden="true" />
              <span className="vaani-recording-label">
                {hi ? 'रिकॉर्डिंग हो रही है…' : 'Recording…'}
              </span>
              <button
                type="button"
                className="vaani-mic-btn vaani-mic-btn--recording"
                onClick={stopRecording}
                aria-label={hi ? 'रिकॉर्डिंग रोकें' : 'Stop Recording'}
              >
                <StopIcon />
                <span>{hi ? 'रिकॉर्डिंग रोकें' : 'Stop Recording'}</span>
              </button>
            </div>
          )}

          {(mode === 'done' || mode === 'error') && (
            <button
              type="button"
              className="vaani-retry-btn"
              onClick={retry}
              aria-label={hi ? 'फिर से रिकॉर्ड करें' : 'Retry Recording'}
            >
              {hi ? '↺ फिर से रिकॉर्ड करें' : '↺ Retry Recording'}
            </button>
          )}
        </div>
      )}

      {/* Live interim text */}
      {interimText && (
        <div className="vaani-interim" aria-live="polite" aria-label={hi ? 'लाइव ट्रांसक्रिप्ट' : 'Live transcript'}>
          <span className="vaani-interim-dot" aria-hidden="true" />
          <span className="vaani-interim-text">{interimText}</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <p className="vaani-error" role="alert">{errorMsg}</p>
      )}

      {/* Final transcript / editable textarea */}
      <div className="vaani-transcript-wrap">
        <label className="auth-label vaani-transcript-label" htmlFor="vaani-transcript">
          {hi ? 'आपकी बात (संपादित करें):' : 'Your speech transcript (you can edit):'}
        </label>
        <textarea
          id="vaani-transcript"
          className="auth-input auth-textarea vaani-transcript"
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            hi
              ? 'आपकी आवाज़ यहाँ दिखेगी। आप यहाँ सीधे भी टाइप कर सकते हैं।'
              : 'Your speech will appear here. You can also type directly.'
          }
        />
      </div>

      {/* Extract button */}
      <div className="vaani-extract-row">
        <button
          type="button"
          className="btn btn--primary vaani-extract-btn"
          onClick={handleExtract}
          disabled={processing || (!transcript.trim() && mode !== 'done')}
        >
          {processing
            ? (hi ? 'जानकारी निकाली जा रही है…' : 'Extracting information…')
            : (hi ? 'जानकारी निकालें और फ़ॉर्म भरें' : 'Extract & Fill Form')}
        </button>

        <span className="vaani-demo-label">
          {hi ? 'डेमो — नियम-आधारित निष्कर्षण' : 'Demo — rule-based extraction'}
        </span>
      </div>
    </div>
  );
}

/* ── Inline SVG icons (no extra deps) ──────────────────── */
function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-6 10a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.93V21h2v2H9v-2h2v-2.07A8 8 0 0 1 4 11h2z"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1"/>
    </svg>
  );
}
