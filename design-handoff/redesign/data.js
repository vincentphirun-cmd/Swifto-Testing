/* Swifto redesign — shared mock data + imagery (window.DATA) */
(function () {
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80${h ? `&h=${h}` : ''}`;

  window.DATA = {
    photos: {
      hero: img('1522202176988-66273c2fd55f', 1200),       // friendly young people / students
      heroSecond: img('1529156069898-49953e39b3ac', 900),  // group of students
      poster: img('1600880292203-757bb62b4baf', 900),      // person helping / handshake
      community: img('1521737711867-e3b97375f902', 1100),  // people working together
      avatar1: img('1494790108377-be9c29b29330', 200, 200),
      avatar2: img('1500648767791-00dcc994a43e', 200, 200),
      avatar3: img('1438761681033-6461ffad8d80', 200, 200),
      avatar4: img('1507003211169-0a1dd7228f2d', 200, 200),
    },
    jobs: [
      { id: 1, name: 'Lawn mowing', cat: 'Yard work', detail: 'Backyard, about 50 sqm', area: 'Ponsonby', when: 'Sat 14 Jun · morning', dur: '2 hrs', pay: 45, urgent: false, photo: img('1592420114436-2f6f1c3e6f0a', 600) },
      { id: 2, name: 'Help moving boxes', cat: 'Moving', detail: '2-bedroom flat, ground floor', area: 'Newmarket', when: 'Sun 15 Jun · afternoon', dur: '4 hrs', pay: 120, urgent: true, photo: img('1530124566582-a618bc2615dc', 600) },
      { id: 3, name: 'Weekly vacuuming', cat: 'Cleaning', detail: 'One-bedroom apartment', area: 'Grey Lynn', when: 'Flexible', dur: '1 hr', pay: 30, urgent: false, photo: img('1581578731548-c64695cc6952', 600) },
      { id: 4, name: 'Dog sitting', cat: 'Pet care', detail: 'Two friendly labradors', area: 'Parnell', when: 'Sat–Sun', dur: 'Weekend', pay: 80, urgent: false, photo: img('1450778869180-41d0601e046e', 600) },
      { id: 5, name: 'Flat-pack assembly', cat: 'Assembly', detail: 'Wardrobe + desk', area: 'Mt Eden', when: 'Fri 13 Jun · evening', dur: '3 hrs', pay: 95, urgent: false, photo: img('1581992652564-44c42f5ad3ad', 600) },
      { id: 6, name: 'Grocery run & unpack', cat: 'Delivery', detail: 'Weekly shop for two', area: 'Kingsland', when: 'Thu 12 Jun', dur: '1.5 hrs', pay: 35, urgent: false, photo: img('1542838132-92c53300491e', 600) },
    ],
    cats: ['All', 'Moving', 'Cleaning', 'Yard work', 'Pet care', 'Assembly', 'Delivery'],
  };
})();
