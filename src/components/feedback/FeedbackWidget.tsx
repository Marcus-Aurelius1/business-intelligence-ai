'use client';

import { useState } from 'react';
import { useFeedback, FeedbackVerdict } from '@/lib/feedback/store';

interface FeedbackWidgetProps {
  targetId: string;
  targetLabel: string;
  scenario: string;
}

function timeAgo(epoch: number): string {
  const secs = Math.max(0, Math.floor((Date.now() - epoch) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function FeedbackWidget({ targetId, targetLabel, scenario }: FeedbackWidgetProps) {
  const { items, stats, submit, clearAll } = useFeedback();
  const [verdict, setVerdict] = useState<FeedbackVerdict | null>(null);
  const [comment, setComment] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!verdict) return;
    submit({ targetId, targetLabel, verdict, comment, scenario });
    setVerdict(null);
    setComment('');
    setJustSubmitted(true);
  };

  // Most recent entries for this target first, then a couple of others for context.
  const recent = items.slice(0, 4);

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Feedback</h3>
          <p className="text-sm text-slate-500 mt-0.5">Was this recommendation helpful?</p>
        </div>
        {stats.total > 0 && (
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stats.helpful} helpful
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {stats.notHelpful} not
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Verdict buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setVerdict('helpful'); setJustSubmitted(false); }}
            className={`btn flex-1 ${verdict === 'helpful' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.6.6 0 01.6-.6 2.4 2.4 0 012.4 2.4c0 1.06-.231 2.064-.646 2.965-.24.523.130 1.135.707 1.135h2.755c1.06 0 2.012.665 2.257 1.697.114.48.114.98 0 1.46l-1.32 5.5A2.4 2.4 0 0118.6 21H4.8a1.2 1.2 0 01-1.2-1.2v-6.6a1.2 1.2 0 011.2-1.2h1.833z" />
            </svg>
            Helpful
          </button>
          <button
            type="button"
            onClick={() => { setVerdict('not_helpful'); setJustSubmitted(false); }}
            className={`btn flex-1 ${verdict === 'not_helpful' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m-.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-1.06 0-1.94.813-2.03 1.868a48.61 48.61 0 000 8.264c.09 1.055.97 1.868 2.03 1.868h1.803c.884 0 1.712.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 .552.448 1 1 1a2.4 2.4 0 002.4-2.4V15" />
            </svg>
            Not Helpful
          </button>
        </div>

        {/* Optional comment + submit — appears once a verdict is picked */}
        {verdict && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Correction / comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder={verdict === 'not_helpful' ? 'What was wrong or missing?' : 'Anything to add?'}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 resize-none"
            />
            <div className="flex items-center justify-end gap-2 mt-3">
              <button type="button" className="btn btn-ghost" onClick={() => { setVerdict(null); setComment(''); }}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Submit Feedback
              </button>
            </div>
          </div>
        )}

        {justSubmitted && !verdict && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Feedback recorded locally. Thank you — it&apos;s captured in the history below.
          </div>
        )}

        {/* Local feedback history */}
        {items.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Feedback History ({stats.total})
              </p>
              <button type="button" onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 underline">
                Clear
              </button>
            </div>
            <ul className="space-y-2">
              {recent.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5 bg-slate-50 rounded-lg px-3 py-2">
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 text-white ${
                      item.verdict === 'helpful' ? 'bg-emerald-600' : 'bg-slate-500'
                    }`}
                  >
                    {item.verdict === 'helpful' ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-700 truncate">{item.targetLabel}</span>
                      <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(item.createdAt)}</span>
                    </div>
                    {item.comment && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">“{item.comment}”</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
