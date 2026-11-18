import React, { useRef, useState } from 'react';

export default function PaneDivider({
  label, paneId, value, min, max, step, defaultValue, unit, onChange, orientation = 'vertical', children,
}) {
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);
  const horizontal = orientation === 'horizontal';

  function resize(next) {
    onChange(Math.max(min, Math.min(max, Math.round(next))));
  }

  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0) return;
    const handle = event.currentTarget;
    drag.current = {
      startPosition: horizontal ? event.clientY : event.clientX,
      startValue: value,
      unitsPerPixel: horizontal ? -1 : unit === '%' ? 100 / handle.closest('.portfolio-workspace').clientWidth : 1,
    };
    handle.focus({ preventScroll: true });
    handle.setPointerCapture(event.pointerId);
    setDragging(true);
    event.preventDefault();
  }

  function moveDivider(event) {
    if (!drag.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const { startPosition, startValue, unitsPerPixel } = drag.current;
    const position = horizontal ? event.clientY : event.clientX;
    resize(startValue + (position - startPosition) * unitsPerPixel);
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  function handleKeyDown(event) {
    const positions = {
      [horizontal ? 'ArrowDown' : 'ArrowLeft']: value - step,
      [horizontal ? 'ArrowUp' : 'ArrowRight']: value + step,
      Home: min,
      End: max,
    };
    if (!Object.hasOwn(positions, event.key)) return;
    event.preventDefault();
    resize(positions[event.key]);
  }

  return (
    <div
      className={horizontal ? 'terminal-resize-handle' : 'portfolio-divider'}
      role="separator"
      tabIndex={0}
      aria-orientation={orientation}
      aria-label={label}
      aria-controls={paneId}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value}${unit}`}
      data-dragging={dragging || undefined}
      title={`${label}. Drag to resize or double-click to reset.`}
      onPointerDown={startDrag}
      onPointerMove={moveDivider}
      onLostPointerCapture={endDrag}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => resize(defaultValue)}
    >
      {children}
    </div>
  );
}
