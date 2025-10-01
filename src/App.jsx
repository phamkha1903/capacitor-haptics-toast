import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';
import './App.css';

const isNative = typeof Capacitor !== 'undefined' && Capacitor.getPlatform && Capacitor.getPlatform() !== 'web';

export default function App() {
  const [name, setName] = useState('');
  const [log, setLog] = useState([]);

  const pushLog = (t) => setLog(l => [t, ...l].slice(0, 30));

  const tryImpact = async (style) => {
    pushLog(`Impact: ${style}`);
    try {
      await Haptics.impact({ style });
    } catch (err) {
      console.warn('Haptics.impact failed, fallback vibrate', err);
      if (navigator.vibrate) navigator.vibrate(60);
    }
  };

  const trySelection = async () => {
    pushLog('Selection');
    try {
      // Some Capacitor versions provide selectionStart/Changed/End.
      if (Haptics.selectionStart && Haptics.selectionEnd) {
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
      } else if (Haptics.selection) {
        await Haptics.selection();
      } else {
        // fallback to vibrate if no selection api
        throw new Error('selection api not available');
      }
    } catch (err) {
      console.warn('Selection fallback', err);
      if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    }
  };

  const tryNotification = async (type) => {
    pushLog(`Notification: ${type}`);
    try {
      await Haptics.notification({ type });
    } catch (err) {
      console.warn('Haptics.notification fallback', err);
      if (navigator.vibrate) navigator.vibrate(120);
    }
  };

  const showToast = async (text) => {
    pushLog(`Toast: ${text}`);
    try {
      await Toast.show({ text, duration: 'short' });
    } catch (err) {
      console.warn('Toast.show fallback', err);
      alert(text);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await trySelection();
    await showToast(`Form submitted: ${name || 'Anonymous'}`);
    setName('');
  };

  return (
    <div className="app">
      <header>
        <h1>Haptics & Toast — UX Lab</h1>
        <p>Platform: {isNative ? 'native (Android/iOS)' : 'web (fallback)'}</p>
      </header>

      <section className="box">
        <h2>Impact</h2>
        <div className="row">
          <button onClick={() => tryImpact(ImpactStyle.Light)}>Impact — Light</button>
          <button onClick={() => tryImpact(ImpactStyle.Medium)}>Impact — Medium</button>
          <button onClick={() => tryImpact(ImpactStyle.Heavy)}>Impact — Heavy</button>
        </div>

        <h2>Selection & Notification</h2>
        <div className="row">
          <button onClick={trySelection}>Selection</button>
          <button onClick={() => tryNotification(NotificationType.Success)}>Notif — Success</button>
          <button onClick={() => tryNotification(NotificationType.Warning)}>Notif — Warning</button>
          <button onClick={() => tryNotification(NotificationType.Error)}>Notif — Error</button>
        </div>

        <h2>Form (submit → selection + toast)</h2>
        <form onSubmit={onSubmit} className="row form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-label="name"
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="box">
        <h3>Logs (recent)</h3>
        {log.length === 0 ? <p className="muted">Chưa có hành động</p> :
          <ul className="log">{log.map((l,i)=> <li key={i}>{l}</li>)}</ul>}
      </section>

      <footer>
        <small>Ghi chú: Trên web plugin dùng fallback (navigator.vibrate / alert). Test haptics tốt nhất trên thiết bị Android thật.</small>
      </footer>
    </div>
  );
}
