import { ORDER_STAGES, formatTimestamp } from '../../utils/demoOrdersStorage';
import { useLanguage } from '../../context/useLanguage';
import { localizeStage } from '../../i18n/translations';
import './OrderTracker.css';

/**
 * OrderTracker — 5-stage simulated order progress interface:
 * Order Placed -> Quality Check -> Payment Confirmed -> Dispatched -> Delivered
 */
export default function OrderTracker({ order, onAdvanceStage }) {
  const { lang, t } = useLanguage();
  const currentIdx = Math.min(
    Math.max(order.stageIndex ?? 0, 0),
    ORDER_STAGES.length - 1
  );
  const isDelivered = currentIdx >= ORDER_STAGES.length - 1;
  const history = Array.isArray(order.stageHistory) ? order.stageHistory : [];

  return (
    <div className="tracker" aria-label={`${t('tracker.orderPrefix')} ${order.id}`}>
      <div className="tracker__head">
        <div>
          <span className="tracker__sim-pill">{t('tracker.simPill')}</span>
          <h3 className="tracker__title">
            {t('tracker.orderPrefix')} <span>{order.id}</span>
          </h3>
        </div>
        {onAdvanceStage && (
          <button
            type="button"
            className={`btn btn--sm ${isDelivered ? 'btn--ghost-green' : 'btn--primary'}`}
            onClick={() => onAdvanceStage(order.id)}
            disabled={isDelivered}
          >
            {isDelivered
              ? t('tracker.deliveryComplete')
              : `${t('tracker.nextStagePrefix')} (${localizeStage(ORDER_STAGES[currentIdx + 1], lang)})`}
          </button>
        )}
      </div>

      <ol className="tracker__steps">
        {ORDER_STAGES.map((stageName, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const stageLog = history.find((h) => h.stage === stageName);

          const stateClass = isCompleted
            ? 'tracker__step--done'
            : isCurrent
              ? 'tracker__step--active'
              : 'tracker__step--pending';

          return (
            <li key={stageName} className={`tracker__step ${stateClass}`}>
              <div className="tracker__marker" aria-hidden="true">
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="tracker__step-body">
                <span className="tracker__step-label">{localizeStage(stageName, lang)}</span>
                <span className="tracker__step-time">
                  {stageLog
                    ? formatTimestamp(stageLog.timestamp)
                    : isCurrent
                      ? t('tracker.currentStage')
                      : t('tracker.pending')}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="tracker__note">{t('tracker.note')}</p>
    </div>
  );
}
