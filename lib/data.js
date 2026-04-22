export const airports = [
  { code: 'DAC', label: 'Dhaka (DAC)' },
  { code: 'DXB', label: 'Dubai (DXB)' },
  { code: 'LHR', label: 'London (LHR)' },
  { code: 'SIN', label: 'Singapore (SIN)' },
  { code: 'KUL', label: 'Kuala Lumpur (KUL)' },
  { code: 'BKK', label: 'Bangkok (BKK)' },
  { code: 'IST', label: 'Istanbul (IST)' },
  { code: 'JED', label: 'Jeddah (JED)' }
]

export const flights = [
  { id: 'F1001', airline: 'Emirates', flightNumber: 'EK 585', from: 'DAC', to: 'DXB', fromCity: 'Dhaka', toCity: 'Dubai', departure: '2026-05-18T08:25:00', arrival: '2026-05-18T12:10:00', durationMinutes: 345, stops: 0, price: 420, cabin: 'Economy', refundable: false, baggage: '30kg checked + 7kg cabin', badge: 'Best Value' },
  { id: 'F1002', airline: 'Flydubai', flightNumber: 'FZ 502', from: 'DAC', to: 'DXB', fromCity: 'Dhaka', toCity: 'Dubai', departure: '2026-05-18T13:40:00', arrival: '2026-05-18T18:25:00', durationMinutes: 345, stops: 0, price: 375, cabin: 'Economy', refundable: false, baggage: '20kg checked + 7kg cabin', badge: 'Lowest Fare' },
  { id: 'F1003', airline: 'Qatar Airways', flightNumber: 'QR 639', from: 'DAC', to: 'DXB', fromCity: 'Dhaka', toCity: 'Dubai', departure: '2026-05-18T03:15:00', arrival: '2026-05-18T08:50:00', durationMinutes: 515, stops: 1, price: 398, cabin: 'Economy', refundable: true, baggage: '25kg checked + 7kg cabin' },
  { id: 'F1004', airline: 'Biman Bangladesh', flightNumber: 'BG 347', from: 'DAC', to: 'JED', fromCity: 'Dhaka', toCity: 'Jeddah', departure: '2026-05-18T10:30:00', arrival: '2026-05-18T16:20:00', durationMinutes: 470, stops: 0, price: 510, cabin: 'Economy', refundable: true, baggage: '30kg checked + 7kg cabin' },
  { id: 'F1005', airline: 'Saudia', flightNumber: 'SV 805', from: 'DAC', to: 'JED', fromCity: 'Dhaka', toCity: 'Jeddah', departure: '2026-05-18T18:00:00', arrival: '2026-05-18T23:45:00', durationMinutes: 465, stops: 0, price: 545, cabin: 'Economy', refundable: false, baggage: '23kg checked + 7kg cabin' },
  { id: 'F1006', airline: 'Singapore Airlines', flightNumber: 'SQ 447', from: 'DAC', to: 'SIN', fromCity: 'Dhaka', toCity: 'Singapore', departure: '2026-05-18T23:55:00', arrival: '2026-05-19T06:10:00', durationMinutes: 255, stops: 0, price: 460, cabin: 'Economy', refundable: true, baggage: '30kg checked + 7kg cabin', badge: 'Fastest' },
  { id: 'F1007', airline: 'Malaysia Airlines', flightNumber: 'MH 197', from: 'DAC', to: 'KUL', fromCity: 'Dhaka', toCity: 'Kuala Lumpur', departure: '2026-05-18T02:30:00', arrival: '2026-05-18T08:55:00', durationMinutes: 265, stops: 0, price: 330, cabin: 'Economy', refundable: false, baggage: '25kg checked + 7kg cabin' },
  { id: 'F1008', airline: 'Thai Airways', flightNumber: 'TG 340', from: 'DAC', to: 'BKK', fromCity: 'Dhaka', toCity: 'Bangkok', departure: '2026-05-18T09:20:00', arrival: '2026-05-18T13:05:00', durationMinutes: 165, stops: 0, price: 285, cabin: 'Economy', refundable: false, baggage: '20kg checked + 7kg cabin' },
  { id: 'F1009', airline: 'Turkish Airlines', flightNumber: 'TK 713', from: 'DAC', to: 'IST', fromCity: 'Dhaka', toCity: 'Istanbul', departure: '2026-05-18T06:45:00', arrival: '2026-05-18T14:35:00', durationMinutes: 470, stops: 0, price: 620, cabin: 'Economy', refundable: true, baggage: '30kg checked + 8kg cabin' },
  { id: 'F1010', airline: 'British Airways', flightNumber: 'BA 148', from: 'DAC', to: 'LHR', fromCity: 'Dhaka', toCity: 'London', departure: '2026-05-18T07:50:00', arrival: '2026-05-18T16:50:00', durationMinutes: 720, stops: 1, price: 860, cabin: 'Economy', refundable: true, baggage: '23kg checked + 7kg cabin' },
  { id: 'F1011', airline: 'Qatar Airways', flightNumber: 'QR 641', from: 'DAC', to: 'LHR', fromCity: 'Dhaka', toCity: 'London', departure: '2026-05-18T04:05:00', arrival: '2026-05-18T14:15:00', durationMinutes: 790, stops: 1, price: 790, cabin: 'Economy', refundable: true, baggage: '25kg checked + 7kg cabin', badge: 'Recommended' },
  { id: 'F1012', airline: 'Emirates', flightNumber: 'EK 583', from: 'DAC', to: 'LHR', fromCity: 'Dhaka', toCity: 'London', departure: '2026-05-18T11:10:00', arrival: '2026-05-18T21:45:00', durationMinutes: 815, stops: 1, price: 845, cabin: 'Business', refundable: true, baggage: '40kg checked + 2 cabin bags' },
  { id: 'F1013', airline: 'Biman Bangladesh', flightNumber: 'BG 601', from: 'DAC', to: 'DXB', fromCity: 'Dhaka', toCity: 'Dubai', departure: '2026-05-18T21:15:00', arrival: '2026-05-19T01:25:00', durationMinutes: 370, stops: 0, price: 405, cabin: 'Economy', refundable: true, baggage: '30kg checked + 7kg cabin' },
  { id: 'F1014', airline: 'Air Arabia', flightNumber: 'G9 517', from: 'DAC', to: 'DXB', fromCity: 'Dhaka', toCity: 'Dubai', departure: '2026-05-18T05:35:00', arrival: '2026-05-18T11:55:00', durationMinutes: 380, stops: 1, price: 320, cabin: 'Economy', refundable: false, baggage: '20kg checked + 7kg cabin' },
  { id: 'F1015', airline: 'US-Bangla Airlines', flightNumber: 'BS 211', from: 'DAC', to: 'SIN', fromCity: 'Dhaka', toCity: 'Singapore', departure: '2026-05-18T16:45:00', arrival: '2026-05-18T23:40:00', durationMinutes: 295, stops: 0, price: 380, cabin: 'Economy', refundable: false, baggage: '20kg checked + 7kg cabin' }
]

export const seedBookings = [
  { reference: 'WLS-3TR9KP', createdAt: '2026-04-19T09:45:00', status: 'Confirmed', flightId: 'F1001', total: 445, extras: { baggage: true, seatSelection: false, flexibleTicket: false, prioritySupport: false }, traveler: { fullName: 'Mahin Chowdhury', email: 'mahin@example.com', phone: '+8801700000000', nationality: 'Bangladeshi', passportNumber: 'A01234567' }, paymentMethod: 'Card', companyName: 'Vertex Fashion Ltd.' },
  { reference: 'WLS-7BN2QF', createdAt: '2026-04-20T14:15:00', status: 'Pending Ticketing', flightId: 'F1011', total: 805, extras: { baggage: false, seatSelection: true, flexibleTicket: false, prioritySupport: true }, traveler: { fullName: 'Sara Ahmed', email: 'sara@example.com', phone: '+8801800000000', nationality: 'Bangladeshi', passportNumber: 'B76543210' }, paymentMethod: 'Bank Transfer', companyName: 'Northwind Holdings' }
]

export const supportQueue = [
  { id: 'REQ-101', type: 'Date change', reference: 'WLS-7BN2QF', priority: 'High' },
  { id: 'REQ-102', type: 'Invoice request', reference: 'WLS-3TR9KP', priority: 'Medium' },
  { id: 'REQ-103', type: 'Baggage add-on', reference: 'WLS-3TR9KP', priority: 'Low' }
]
