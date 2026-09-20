/**
 * Helper to get URL query params or fall back to default romantic values
 */
export function getInitialDedication() {
  if (typeof window === 'undefined') {
    return {
      to: 'Mi Niña Hermosa',
      from: 'Alguien que te adora',
      message: 'En este 21 de septiembre, quería recordarte lo especial que eres. Que nunca te falten motivos para sonreír, ni flores amarillas en tu vida. Eres la luz y la primavera más bonita de mis días.',
      date: '21 de Septiembre'
    };
  }

  const params = new URLSearchParams(window.location.search);
  const saved = localStorage.getItem('primavera_dedication');
  const savedData = saved ? JSON.parse(saved) : {};

  return {
    to: params.get('to') || params.get('para') || savedData.to || 'Mi Niña Hermosa',
    from: params.get('from') || params.get('de') || savedData.from || 'Alguien que te adora',
    message: params.get('msg') || params.get('mensaje') || savedData.message || 'En este 21 de septiembre, quería recordarte lo especial que eres. Que nunca te falten motivos para sonreír, ni flores amarillas en tu vida. Eres la luz y la primavera más bonita de mis días.',
    date: params.get('date') || params.get('fecha') || savedData.date || '21 de Septiembre'
  };
}

export function saveDedicationToStorage(data) {
  try {
    localStorage.setItem('primavera_dedication', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save dedication:', e);
  }
}

export function buildShareUrl(data) {
  const origin = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  if (data.to) params.set('to', data.to);
  if (data.from) params.set('from', data.from);
  if (data.message) params.set('msg', data.message);
  return `${origin}?${params.toString()}`;
}
