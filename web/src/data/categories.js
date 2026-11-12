// One entry per product category. Each becomes a static landing page at
// /products/<slug> with unique copy, FAQs (FAQPage schema) and related guides.
export const categories = [
  {
    slug: "armoured-cable",
    name: "Armoured Cable",
    h1: "Armoured Cable Manufacturer & Supplier in Delhi",
    metaTitle: "Armoured Cable Manufacturer & Supplier in Delhi",
    metaDescription:
      "ISI-certified aluminium & copper armoured cable, 2, 3.5 & 4 core, 1.5–300 sq mm, direct from our Delhi factory. Bulk rates. Call +91 9810011248.",
    image: "angel-armoured-4-core-copper",
    intro: [
      "Angel Cables manufactures steel wire armoured (SWA) power cables at our factory in Lawrence Road Industrial Area, Delhi. Our armoured range covers 2 core, 3.5 core and 4 core cables with aluminium or copper conductors in sizes from 1.5 sq mm to 300 sq mm, rated for 1.1 kV and built to IS 1554.",
      "Armoured cable is the right choice wherever a cable runs underground, outdoors, along cable trays in factories, or anywhere it can be crushed, cut or chewed by rodents. The galvanised steel wire layer takes the mechanical load, so the insulated cores inside keep working safely for decades.",
      "Contractors, builders, electrical consultants and industrial buyers across India order armoured cable from us by the drum at factory-direct prices, with GST invoices and quick dispatch.",
    ],
    uses: [
      "Underground power feeders to buildings, pumps and street lighting",
      "Main LT distribution from transformer or DG set to panels",
      "Factory and warehouse power on cable trays",
      "Solar plant and outdoor equipment connections",
    ],
    faqs: [
      {
        q: "What is the difference between aluminium and copper armoured cable?",
        a: "Copper conducts better, so a copper armoured cable carries more current than an aluminium cable of the same size and is more compact. Aluminium armoured cable is lighter and significantly cheaper, which is why it is widely used for large-size feeders. For the same load, aluminium needs roughly one size larger conductor than copper.",
      },
      {
        q: "When should I choose 3.5 core instead of 4 core armoured cable?",
        a: "3.5 core cable has three full-size phase conductors and a reduced neutral. It is the standard for balanced three-phase four-wire LT distribution in larger sizes (typically 25 sq mm and above). Choose 4 core with a full-size neutral where loads are unbalanced or have high harmonic content.",
      },
      {
        q: "Can armoured cable be buried directly underground?",
        a: "Yes. Steel wire armoured cable is designed for direct burial. Lay it at a depth of about 0.75 m in normal soil on a sand bed, cover it with protective tiles or bricks, and use proper glands where it enters panels.",
      },
      {
        q: "Do you supply armoured cable in cut lengths or only full drums?",
        a: "We supply both full drums and cut lengths for most sizes. Bulk drum orders get the best rate — call or WhatsApp us with the size, core count and length you need for a quote.",
      },
    ],
    relatedBlogs: ["armoured-cable-guide-india", "copper-vs-aluminium-wire-india"],
  },
  {
    slug: "house-wire",
    name: "Electric House Wire",
    h1: "FR & FRLS House Wire Manufacturer in Delhi",
    metaTitle: "FR & FRLS House Wire Manufacturer in Delhi",
    metaDescription:
      "ISI-marked FR & FRLS copper house wire, 1–6 sq mm, single core and multi-strand, from a Delhi manufacturer. Bulk rates for builders and electricians.",
    image: "angel-house-wire-blue",
    intro: [
      "Angel Cables makes PVC-insulated copper house wire for residential, commercial and institutional buildings. Every coil uses pure electrolytic copper and is ISI-marked to IS 694, in FR (flame retardant) and FRLS (flame retardant, low smoke) grades.",
      "We supply both single-core and multi-strand flexible house wire in 0.5 sq mm to 6 sq mm. Multi-strand wire is easier to pull through conduit and bends without kinking, which is why most electricians in Delhi now prefer it for concealed wiring.",
      "FRLS wire is required in hospitals, malls, offices, schools and other buildings where people gather, because it gives off much less smoke if there is a fire. For homes, FR wire is the common standard.",
    ],
    uses: [
      "1.0–1.5 sq mm: lighting and fan circuits",
      "2.5 sq mm: 15A power sockets, geysers and 1–1.5 ton air conditioners",
      "4 sq mm: 2 ton ACs, kitchen appliances and sub-main runs",
      "6 sq mm: main feed from meter to distribution board",
    ],
    faqs: [
      {
        q: "Which wire size do I need for an AC?",
        a: "A 1 to 1.5 ton split AC is normally wired with 2.5 sq mm copper wire on a dedicated circuit. For a 2 ton AC or a long run from the distribution board, use 4 sq mm. Our guide on AC wiring has a full sizing table.",
      },
      {
        q: "What is the difference between FR and FRLS wire?",
        a: "Both are flame retardant. FRLS insulation additionally produces far less smoke and toxic gas when it burns, which keeps escape routes visible. FRLS is mandatory in many commercial and public buildings; FR is standard for homes.",
      },
      {
        q: "Is your house wire ISI marked?",
        a: "Yes. All Angel Cables house wire carries the ISI mark and is made with pure copper conductors to IS 694.",
      },
      {
        q: "What coil lengths do you sell?",
        a: "House wire is supplied in standard 90 metre coils. Contractors and dealers can order in bulk at factory rates.",
      },
    ],
    relatedBlogs: [
      "which-wire-for-air-conditioner-india",
      "fr-vs-frls-house-wire-india-guide",
      "common-house-wiring-mistakes-india",
      "copper-vs-aluminium-wire-india",
    ],
  },
  {
    slug: "flexible-cable",
    name: "Flexible Cable",
    h1: "Flexible Copper Cable Supplier in Delhi",
    metaTitle: "Flexible & Control Cable Supplier in Delhi",
    metaDescription:
      "Multi-core flexible copper cable, two-core appliance cable and shielded control cable for panels, CNC machines and PLCs. Delhi supplier, bulk pricing.",
    image: "angel-flexible-2-core",
    intro: [
      "Our flexible cables use finely stranded copper conductors so they bend repeatedly without cracking. The range covers two-core cables for appliances and extension leads, multi-core control cables (2 to 24 cores) for panels and machines, and shielded control cables for signal-sensitive equipment.",
      "Shielded flexible cable has a copper braid screen that blocks electrical noise from motors and variable frequency drives, keeping PLC, sensor and CNC signals clean. It is the cable panel builders and automation engineers across India specify for control wiring.",
    ],
    uses: [
      "Control panel and MCC wiring",
      "CNC machines, PLCs and VFD control circuits",
      "Appliance leads and extension cords",
      "Moving machine parts that flex in service",
    ],
    faqs: [
      {
        q: "When do I need a shielded control cable?",
        a: "Use shielded cable when control or signal wires run near motors, VFDs or power cables. The braid screen, earthed at one end, stops interference from corrupting PLC and sensor signals.",
      },
      {
        q: "How many cores are available in multi-core flexible cable?",
        a: "We supply multi-core control cables from 2 cores up to 24 cores. Tell us your core count and conductor size for a quote.",
      },
      {
        q: "Can flexible cable be used for fixed house wiring?",
        a: "For fixed wiring in conduit, use ISI-marked FR or FRLS house wire. Flexible sheathed cables are meant for appliances, equipment and control wiring.",
      },
    ],
    relatedBlogs: ["common-house-wiring-mistakes-india"],
  },
  {
    slug: "cctv-cable",
    name: "CCTV Cables",
    h1: "CCTV Cable Supplier in Delhi — RG-6 & Combo Cables",
    metaTitle: "CCTV Cable in Delhi — RG-6 & Combo Cables",
    metaDescription:
      "RG-6 coaxial (CCS & pure copper) and 1+3, 1+4, 1+6 CCTV combo cable for HD and analog cameras. Bulk rolls for security installers across India.",
    image: "angel-cctv-combo-cable",
    intro: [
      "Angel Cables supplies CCTV cable for security installers, builders and system integrators across India. Our range includes RG-6 75-ohm coaxial cable in CCS (copper clad steel) and pure copper, plus combo cables that carry video and power in one jacket.",
      "1+3, 1+4 and 1+6 combo cables pair an RG-59 coaxial core with 3, 4 or 6 power cores, so each camera needs only one cable run. The extra cores carry PTZ control, audio or alarm signals in larger systems.",
      "Choose pure copper RG-6 for long runs and HD cameras where signal quality matters most; CCS RG-6 is the economical choice for typical runs up to about 300 metres.",
    ],
    uses: [
      "AHD, HD-CVI, HD-TVI and analog CCTV systems",
      "PTZ dome cameras with RS-485 control",
      "Societies, shops, offices and warehouses",
      "Satellite TV and antenna feeds (RG-6)",
    ],
    faqs: [
      {
        q: "What is the difference between CCS and copper RG-6 cable?",
        a: "CCS (copper clad steel) has a steel core with a copper coating; it is cheaper and fine for most runs. Pure copper RG-6 has lower resistance, so it performs better over long distances and with HD cameras.",
      },
      {
        q: "Which combo cable do I need — 1+3, 1+4 or 1+6?",
        a: "1+3 covers video plus power for a fixed camera. 1+4 adds a pair for PTZ control. 1+6 gives spare cores for audio, alarms or access control in larger integrated systems.",
      },
      {
        q: "How far can I run RG-6 for CCTV?",
        a: "With good quality RG-6, HD analog cameras typically work well up to around 300 metres. For longer distances, use pure copper cable or a network (IP) camera system with CAT6.",
      },
    ],
    relatedBlogs: [],
  },
  {
    slug: "submersible-cable",
    name: "Submersible Cable",
    h1: "Submersible Pump Cable Manufacturer in Delhi",
    metaTitle: "Submersible Pump Cable Manufacturer in Delhi",
    metaDescription:
      "ISI-marked flat submersible cable for single and three-phase borewell pumps: 1.5, 2.5, 4 and 6 sq mm. Factory-direct from Delhi for dealers and farmers.",
    image: "angel-submersible-flat-3-core",
    intro: [
      "Submersible cable powers pumps that sit deep inside borewells and water tanks, so it must stay fully waterproof for years under pressure. Angel Cables makes flat submersible cables with pure copper conductors and special water-resistant PVC insulation, ISI-marked to IS 694.",
      "We supply single-phase cable in 1.5 and 2.5 sq mm for domestic pumps up to about 2 HP, and three-phase cable in 4 and 6 sq mm for agricultural and commercial pumps up to 15 HP. Choosing the right size depends on pump power and borewell depth — undersized cable overheats and burns pump windings.",
    ],
    uses: [
      "Domestic borewell pumps (single phase)",
      "Agricultural and irrigation pumps (three phase)",
      "Deep wells beyond 200 feet",
      "Commercial water supply and building pumps",
    ],
    faqs: [
      {
        q: "Which submersible cable size do I need for my pump?",
        a: "As a guide: 1.5 sq mm for 0.5–1 HP, 2.5 sq mm for 1–2 HP single-phase pumps, 4 sq mm for 3–7.5 HP and 6 sq mm for 7.5–15 HP three-phase pumps. Increase the size for very deep borewells. Our borewell guide explains the voltage-drop calculation.",
      },
      {
        q: "Can I use ordinary wire inside a borewell?",
        a: "No. Ordinary PVC wire absorbs water over time and will fail, damaging the pump. Always use proper submersible cable rated for continuous immersion.",
      },
      {
        q: "Do you sell submersible cable to dealers?",
        a: "Yes. Pump and hardware dealers across India buy submersible cable from us in bulk. Apply through our dealer page or call us for rates.",
      },
    ],
    relatedBlogs: ["submersible-cable-borewell-india"],
  },
  {
    slug: "copper-wire",
    name: "Copper Wire",
    h1: "Bare, Tinned & Earthing Copper Wire Supplier in Delhi",
    metaTitle: "Copper Wire & Earthing Wire Supplier in Delhi",
    metaDescription:
      "99.9% pure bare copper wire, tinned copper wire and EC-grade copper earthing wire from 0.5 to 50 sq mm. Supplier to panel builders and electricians in Delhi.",
    image: "angel-bare-copper-wire",
    intro: [
      "We supply high-conductivity electrolytic copper wire for earthing, panel wiring and manufacturing. The range includes bare copper wire, tinned copper wire for humid and marine conditions, and EC-grade copper earthing wire for grounding installations to IS 3043.",
      "Good earthing is the most important safety feature in any electrical installation. A low-resistance copper earth path makes MCBs and RCCBs trip quickly during a fault, protecting people and appliances.",
    ],
    uses: [
      "Earthing pits and equipment grounding",
      "Panel and switchboard bus connections",
      "Transformer and motor rewinding workshops",
      "Marine and humid environments (tinned)",
    ],
    faqs: [
      {
        q: "Why use tinned copper wire instead of bare copper?",
        a: "The tin coating protects copper from oxidation and corrosion, and makes the wire easier to solder. It is preferred in humid, coastal and marine installations.",
      },
      {
        q: "What size copper wire should I use for earthing a house?",
        a: "Household earthing commonly uses 2.5 sq mm to 4 sq mm copper earth conductors for circuits, with heavier conductors to the earth electrode. Follow IS 3043 and your electrician's design for the exact sizes.",
      },
    ],
    relatedBlogs: ["copper-vs-aluminium-wire-india", "common-house-wiring-mistakes-india"],
  },
  {
    slug: "cat6-lan-cable",
    name: "CAT6 & LAN Cables",
    h1: "CAT6 LAN Cable Supplier in Delhi",
    metaTitle: "CAT6 LAN Cable Supplier in Delhi — 305m Box",
    metaDescription:
      "CAT6 UTP LAN cable in 305 m and 90 m boxes, outdoor armoured CAT6 and CAT5e cable for offices, CCTV and networking. Bulk supply across India.",
    image: "angel-cat6-cable",
    intro: [
      "Angel Cables supplies structured networking cable for offices, schools, hospitals, housing societies and IP CCTV projects. Our CAT6 UTP cable uses 23 AWG solid copper conductors with 250 MHz bandwidth for reliable Gigabit Ethernet.",
      "CAT6 is available in full 305 metre pull boxes for large installations and 90 metre boxes for homes and small offices. For runs between buildings or underground, our outdoor armoured CAT6 has steel wire armour and a UV-resistant jacket. CAT5e remains a budget option for 100 Mbps networks, IP phones and access control.",
    ],
    uses: [
      "Office and commercial structured cabling",
      "IP CCTV camera networks and NVRs",
      "Building-to-building and campus links (armoured)",
      "Home Wi-Fi access points and smart TVs",
    ],
    faqs: [
      {
        q: "Should I choose CAT6 or CAT5e?",
        a: "CAT6 supports higher bandwidth (250 MHz) and is the better choice for new installations and Gigabit networks. CAT5e is cheaper and adequate for 100 Mbps links, IP phones and basic CCTV.",
      },
      {
        q: "What is the maximum length of a CAT6 cable run?",
        a: "Ethernet runs are limited to 100 metres per segment, including patch cords. For longer distances, add a switch or use fibre.",
      },
      {
        q: "Can CAT6 be laid outdoors or underground?",
        a: "Use our outdoor armoured CAT6 for outdoor and underground runs. Standard indoor UTP cable is not UV or moisture resistant.",
      },
    ],
    relatedBlogs: [],
  },
  {
    slug: "telephone-cable",
    name: "Telephone & Communication Cable",
    h1: "Telephone & Communication Cable Supplier in Delhi",
    metaTitle: "Telephone & EPABX Cable Supplier in Delhi",
    metaDescription:
      "TCBC telephone wire, 2 pair, 4 pair and 10/20 pair telephone cables for EPABX, intercom and building riser wiring. Supplier in Delhi with bulk pricing.",
    image: "angel-telephone-cable",
    intro: [
      "Telephone and intercom systems still run the front desks, offices and housing societies of Delhi. Angel Cables supplies twisted pair telephone cable for every part of these systems, from TCBC extension wire to 10 and 20 pair riser cables.",
      "Twisted pairs cancel interference between lines, so calls stay clear even when many extensions share one cable. Colour-coded pairs make termination at the MDF, IDF and EPABX quick and error-free.",
    ],
    uses: [
      "EPABX extension wiring in offices and hotels",
      "Intercom and door-phone systems in societies",
      "Building riser cables from MDF to floor boxes",
      "Alarm and low-voltage signalling circuits",
    ],
    faqs: [
      {
        q: "How many pairs do I need for an EPABX extension?",
        a: "One pair per telephone line. Use 2 pair cable for a single extension with a spare, 4 pair for up to four lines, and 10 or 20 pair cable for riser runs that feed many extensions.",
      },
      {
        q: "What is TCBC wire?",
        a: "TCBC wire is twisted pair telephone cable with tinned copper conductors, commonly used for internal telephone and EPABX extension wiring in India.",
      },
    ],
    relatedBlogs: [],
  },
];

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryByName(name) {
  return categories.find((c) => c.name === name);
}
